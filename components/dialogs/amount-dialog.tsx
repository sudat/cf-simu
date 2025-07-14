"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  FlowItemDetail,
  StockItemDetail,
  ItemType,
  AmountSettingData,
} from "@/lib/types";

interface AmountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId?: string;
  itemName?: string;
  itemType?: ItemType;
  planName?: string;
  initialData?: FlowItemDetail | StockItemDetail;
  onSave?: (data: AmountSettingData) => void;
}

export function AmountDialog({
  open,
  onOpenChange,
  itemId = "",
  itemName = "項目",
  itemType = "flow",
  planName = "デフォルトプラン",
  initialData,
  onSave,
}: AmountDialogProps) {
  // フロー項目の状態
  const [flowData, setFlowData] = useState<FlowItemDetail>({
    startYear: 2024,
    endYear: undefined,
    amount: 0,
    frequency: "monthly",
    growthRate: 0,
  });

  // ストック項目の状態
  const [stockData, setStockData] = useState<StockItemDetail>({
    baseYear: 2024,
    baseAmount: 0,
    rate: 0,
    yearlyChange: 0,
  });

  // 初期データの設定
  useEffect(() => {
    if (open && initialData) {
      if (itemType === "flow") {
        setFlowData(initialData as FlowItemDetail);
      } else {
        setStockData(initialData as StockItemDetail);
      }
    } else if (open) {
      // リセット
      setFlowData({
        startYear: 2024,
        endYear: undefined,
        amount: 0,
        frequency: "monthly",
        growthRate: 0,
      });
      setStockData({
        baseYear: 2024,
        baseAmount: 0,
        rate: 0,
        yearlyChange: 0,
      });
    }
  }, [open, initialData, itemType]);

  const handleSave = () => {
    if (!itemId) return;

    const setting = itemType === "flow" ? flowData : stockData;
    const data: AmountSettingData = {
      itemId,
      planName,
      setting,
    };

    onSave?.(data);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  // フロー項目の計算例
  const getFlowCalculationExample = () => {
    const { startYear, endYear, amount, frequency, growthRate } = flowData;

    if (!amount || !startYear) {
      return "金額と開始年度を入力してください";
    }

    const frequencyText = frequency === "monthly" ? "月額" : "年額";
    const endText = endYear ? `${endYear + 1}/3/31` : "永続";
    const rateVal = growthRate / 100;

    const year1Amount = amount;
    const year2Amount = Math.round(year1Amount * (1 + rateVal));
    const year3Amount = Math.round(year2Amount * (1 + rateVal));

    return (
      <div>
        <div className="font-medium mb-2">
          {startYear}/4/1～{endText}:
        </div>
        <div>
          初年度: {year1Amount.toLocaleString()}円 ({frequencyText})
        </div>
        {growthRate !== 0 && (
          <>
            <div>
              2年目: {year2Amount.toLocaleString()}円 (年率{growthRate}%増)
            </div>
            <div>3年目: {year3Amount.toLocaleString()}円</div>
          </>
        )}
      </div>
    );
  };

  // ストック項目の計算例
  const getStockCalculationExample = () => {
    const { baseYear, baseAmount, rate, yearlyChange } = stockData;

    if (!baseAmount || !baseYear) {
      return "基準金額と基準年度を入力してください";
    }

    const base = baseAmount / 10000; // 万円単位
    const rateVal = rate / 100;
    const changeVal = yearlyChange / 10000;

    let year1 = base;
    let year2 = year1 * (1 + rateVal) + changeVal;
    let year3 = year2 * (1 + rateVal) + changeVal;

    return (
      <div>
        <div className="font-medium mb-2">計算例:</div>
        <div>
          {baseYear}/4/1: {base.toFixed(0)}万円
        </div>
        <div>
          {baseYear + 1}/3/31: {year1.toFixed(0)}×{(1 + rateVal).toFixed(2)}
          {changeVal !== 0
            ? `${changeVal >= 0 ? "+" : ""}${changeVal.toFixed(0)}`
            : ""}{" "}
          = {year2.toFixed(0)}万円
        </div>
        <div>
          {baseYear + 2}/3/31: {year2.toFixed(0)}×{(1 + rateVal).toFixed(2)}
          {changeVal !== 0
            ? `${changeVal >= 0 ? "+" : ""}${changeVal.toFixed(0)}`
            : ""}{" "}
          = {year3.toFixed(0)}万円
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{itemName} - 金額設定</DialogTitle>
          <DialogDescription>{planName}の設定を行います</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {itemType === "flow" ? (
            // フロー項目用フォーム
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startYear">開始年度 (4/1～)</Label>
                  <Input
                    id="startYear"
                    type="number"
                    value={flowData.startYear}
                    onChange={(e) =>
                      setFlowData({
                        ...flowData,
                        startYear: parseInt(e.target.value) || 2024,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endYear">
                    終了年度 (～3/31)
                    <span className="text-xs text-gray-500 ml-1">
                      ※空欄で永続
                    </span>
                  </Label>
                  <Input
                    id="endYear"
                    type="number"
                    value={flowData.endYear || ""}
                    onChange={(e) =>
                      setFlowData({
                        ...flowData,
                        endYear: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="未入力で永続"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>支払い頻度</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="frequency"
                      value="monthly"
                      checked={flowData.frequency === "monthly"}
                      onChange={(e) =>
                        setFlowData({
                          ...flowData,
                          frequency: e.target.value as "monthly" | "yearly",
                        })
                      }
                    />
                    <span className="text-sm">月額</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="frequency"
                      value="yearly"
                      checked={flowData.frequency === "yearly"}
                      onChange={(e) =>
                        setFlowData({
                          ...flowData,
                          frequency: e.target.value as "monthly" | "yearly",
                        })
                      }
                    />
                    <span className="text-sm">年額</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">金額</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">¥</span>
                  <Input
                    id="amount"
                    type="number"
                    className="pl-8"
                    value={flowData.amount || ""}
                    onChange={(e) =>
                      setFlowData({
                        ...flowData,
                        amount: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="growthRate">
                  年率増減
                  <span className="text-xs text-gray-500 ml-1">
                    ※空欄で変動なし
                  </span>
                </Label>
                <div className="relative">
                  <Input
                    id="growthRate"
                    type="number"
                    step="0.1"
                    className="pr-8"
                    value={flowData.growthRate || ""}
                    onChange={(e) =>
                      setFlowData({
                        ...flowData,
                        growthRate: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="例: 3 (年3%増の場合)"
                  />
                  <span className="absolute right-3 top-3 text-gray-500">
                    %
                  </span>
                </div>
              </div>

              <Card className="bg-gray-50">
                <CardContent className="p-3">
                  <div className="text-xs text-gray-600">
                    {getFlowCalculationExample()}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            // ストック項目用フォーム
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="baseYear">基準年度</Label>
                <Input
                  id="baseYear"
                  type="number"
                  value={stockData.baseYear}
                  onChange={(e) =>
                    setStockData({
                      ...stockData,
                      baseYear: parseInt(e.target.value) || 2024,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="baseAmount">基準時点の金額</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">¥</span>
                  <Input
                    id="baseAmount"
                    type="number"
                    className="pl-8"
                    value={stockData.baseAmount || ""}
                    onChange={(e) =>
                      setStockData({
                        ...stockData,
                        baseAmount: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate">
                  年率増減
                  <span className="text-xs text-gray-500 ml-1">
                    ※空欄で変動なし
                  </span>
                </Label>
                <div className="relative">
                  <Input
                    id="rate"
                    type="number"
                    step="0.1"
                    className="pr-8"
                    value={stockData.rate || ""}
                    onChange={(e) =>
                      setStockData({
                        ...stockData,
                        rate: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="例: 10 (10%の場合)"
                  />
                  <span className="absolute right-3 top-3 text-gray-500">
                    %
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearlyChange">
                  年額増減
                  <span className="text-xs text-gray-500 ml-1">
                    ※空欄で変動なし
                  </span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">¥</span>
                  <Input
                    id="yearlyChange"
                    type="number"
                    className="pl-8"
                    value={stockData.yearlyChange || ""}
                    onChange={(e) =>
                      setStockData({
                        ...stockData,
                        yearlyChange: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="例: 1200000 (年120万積立)、-1200000 (年120万減少)"
                  />
                </div>
              </div>

              <Card className="bg-gray-50">
                <CardContent className="p-3">
                  <div className="text-xs text-gray-600">
                    {getStockCalculationExample()}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            キャンセル
          </Button>
          <Button onClick={handleSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
