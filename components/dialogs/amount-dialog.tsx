"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  FlowItemDetail,
  StockItemDetail,
  ItemType,
  AmountSettingData,
  AmountSettingFormData,
  ValidationErrors,
} from "@/lib/types";
import { usePlanStore } from "@/lib/store/plan-store";

interface AmountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId?: string;
  itemName?: string;
  itemType?: ItemType;
  planName?: string;
  initialData?: FlowItemDetail | StockItemDetail;
  onSave?: (data: AmountSettingData) => void;
  // 新しい統合型のサポート
  useUnifiedForm?: boolean; // 統合フォームを使用するかのフラグ
  onSaveUnified?: (data: AmountSettingFormData) => void; // 統合型での保存コールバック
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
  useUnifiedForm = false,
  onSaveUnified,
}: AmountDialogProps) {
  // フロー項目の状態
  const [flowData, setFlowData] = useState<FlowItemDetail>({
    startYear: 2024,
    endYear: undefined,
    amount: 0,
    frequency: "monthly" as const,
    growthRate: 0,
    yearlyChange: undefined,
  });

  // ストック項目の状態
  const [stockData, setStockData] = useState<StockItemDetail>({
    baseYear: 2024,
    baseAmount: 0,
    rate: 0,
    yearlyChange: 0,
  });

  // 統合フォーム用の状態
  const [unifiedData, setUnifiedData] = useState<AmountSettingFormData>({
    startYear: new Date().getFullYear(),
    endYear: undefined,
    baseAmount: 0,
    changeAmount: undefined,
    changeRate: undefined,
    frequency: "yearly",
  });



  // バリデーションエラー状態
  const [errors, setErrors] = useState<ValidationErrors>({});

  // フォーカス状態管理（どのフィールドがフォーカスされているか）
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // 数値フォーマット関数
  const formatNumber = (value: number): string => {
    return value.toLocaleString('ja-JP');
  };

  // 数値入力フィールドの表示値を取得（フォーカス時は生の値、非フォーカス時は3桁区切り）
  const getDisplayValue = (value: number | undefined, fieldName: string): string => {
    if (value === undefined || value === null) return "";
    if (focusedField === fieldName) {
      // フォーカス時は生の値を表示
      return value.toString();
    } else {
      // 非フォーカス時は3桁区切りで表示
      return formatNumber(value);
    }
  };

  // 複利計算関数
  const calculateCompoundGrowth = (principal: number, rate: number, years: number): number => {
    if (rate === 0) return principal;
    return Math.round(principal * Math.pow(1 + rate / 100, years));
  };

  // 統合フォームから既存型への変換
  const convertUnifiedToLegacy = useCallback((data: AmountSettingFormData): FlowItemDetail | StockItemDetail => {
    if (itemType === "flow") {
      return {
        startYear: data.startYear,
        endYear: data.endYear,
        amount: data.baseAmount || 0,
        frequency: data.frequency,
        growthRate: data.changeRate || 0,
        yearlyChange: data.changeAmount || undefined,
      } as FlowItemDetail;
    } else {
      return {
        baseYear: data.startYear,
        baseAmount: data.baseAmount || 0,
        rate: data.changeRate || 0,
        yearlyChange: data.changeAmount || 0,
      } as StockItemDetail;
    }
  }, [itemType]);

  // 既存型から統合フォームへの変換
  const convertLegacyToUnified = useCallback((data: FlowItemDetail | StockItemDetail): AmountSettingFormData => {
    if (itemType === "flow") {
      const flowData = data as FlowItemDetail;
      return {
        startYear: flowData.startYear,
        endYear: flowData.endYear,
        baseAmount: flowData.amount || 0,
        changeAmount: flowData.yearlyChange,
        changeRate: flowData.growthRate || undefined,
        frequency: flowData.frequency,
      };
    } else {
      const stockData = data as StockItemDetail;
      return {
        startYear: stockData.baseYear,
        endYear: undefined,
        baseAmount: stockData.baseAmount || 0,
        changeAmount: stockData.yearlyChange || undefined,
        changeRate: stockData.rate || undefined,
        frequency: "yearly",
      };
    }
  }, [itemType]);

  // バリデーション関数
  const validateUnifiedForm = (data: AmountSettingFormData): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    // 開始のバリデーション
    if (!data.startYear) {
      newErrors.startYear = "開始は必須です";
    } else if (isNaN(data.startYear)) {
      newErrors.startYear = "有効な年度を入力してください";
    } else if (data.startYear < 1900 || data.startYear > 2100) {
      newErrors.startYear = "年度は1900～2100年の範囲で入力してください";
    } else if (!Number.isInteger(data.startYear)) {
      newErrors.startYear = "年度は整数で入力してください";
    }

    // 終了のバリデーション
    if (data.endYear !== undefined) {
      if (isNaN(data.endYear)) {
        newErrors.endYear = "有効な年度を入力してください";
      } else if (data.endYear < 1900 || data.endYear > 2100) {
        newErrors.endYear = "年度は1900～2100年の範囲で入力してください";
      } else if (!Number.isInteger(data.endYear)) {
        newErrors.endYear = "年度は整数で入力してください";
      } else if (data.endYear <= data.startYear) {
        newErrors.endYear = "終了年度は開始年度より後にしてください";
      } else if ((data.endYear - data.startYear) > 100) {
        newErrors.endYear = "期間は100年以内にしてください";
      }
    }

    // ベース金額のバリデーション
    if (data.baseAmount === undefined || data.baseAmount === null) {
      newErrors.baseAmount = "ベース金額は必須です";
    } else if (isNaN(data.baseAmount)) {
      newErrors.baseAmount = "有効な金額を入力してください";
    } else if (data.baseAmount < 0) {
      newErrors.baseAmount = "金額は0以上で入力してください";
    } else if (!Number.isInteger(data.baseAmount)) {
      newErrors.baseAmount = "金額は整数で入力してください";
    } else if (data.baseAmount > 999999999) {
      newErrors.baseAmount = "金額は9億円以内で入力してください";
    }

    // 増減金額のバリデーション
    if (data.changeAmount !== undefined) {
      if (isNaN(data.changeAmount)) {
        newErrors.changeAmount = "有効な金額を入力してください";
      } else if (!Number.isInteger(data.changeAmount)) {
        newErrors.changeAmount = "金額は整数で入力してください";
      } else if (Math.abs(data.changeAmount) > 999999999) {
        newErrors.changeAmount = "金額は9億円以内で入力してください";
      }
    }

    // 増減率のバリデーション
    if (data.changeRate !== undefined) {
      if (isNaN(data.changeRate)) {
        newErrors.changeRate = "有効な増減率を入力してください";
      } else if (!Number.isInteger(data.changeRate)) {
        newErrors.changeRate = "増減率は整数で入力してください";
      } else if (data.changeRate < -100) {
        newErrors.changeRate = "増減率は-100%以上で入力してください";
      } else if (data.changeRate > 1000) {
        newErrors.changeRate = "増減率は1000%以下で入力してください";
      }
    }

    // 増減金額と増減率の同時指定は許可（削除）

    return newErrors;
  };

  // 初期データの設定
  useEffect(() => {
    if (open) {
      // ストアから現在の設定を取得
      let storedSetting = null;
      if (itemId && planName) {
        const parts = itemId.split('-');
        if (parts.length >= 2) {
          const category = parts[0] as 'income' | 'expense' | 'asset' | 'debt';
          const itemName = parts.slice(1).join('-');
          const categoryKey = category === 'income' ? 'incomes' :
            category === 'expense' ? 'expenses' :
              category === 'asset' ? 'assets' : 'debts';

          const state = usePlanStore.getState();
          storedSetting = state[categoryKey]?.[itemName]?.settings?.[planName] || null;
        }
      }

      const dataToUse = initialData || storedSetting;

      if (useUnifiedForm) {
        // 統合フォームモード
        if (dataToUse) {
          setUnifiedData(convertLegacyToUnified(dataToUse));
        } else {
          setUnifiedData({
            startYear: new Date().getFullYear(),
            endYear: undefined,
            baseAmount: 0,
            changeAmount: undefined,
            changeRate: undefined,
            frequency: "yearly",
          });
        }
        setErrors({});
      } else {
        // 既存モード
        if (dataToUse) {
          if (itemType === "flow") {
            setFlowData(dataToUse as FlowItemDetail);
          } else {
            setStockData(dataToUse as StockItemDetail);
          }
        } else {
          // リセット
          setFlowData({
            startYear: 2024,
            endYear: undefined,
            amount: 0,
            frequency: "monthly" as const,
            growthRate: 0,
            yearlyChange: undefined,
          });
          setStockData({
            baseYear: 2024,
            baseAmount: 0,
            rate: 0,
            yearlyChange: 0,
          });
        }
      }
    }
  }, [open, initialData, itemType, useUnifiedForm, convertLegacyToUnified, itemId, planName]);

  // 統合フォームのバリデーション
  useEffect(() => {
    if (useUnifiedForm) {
      const newErrors = validateUnifiedForm(unifiedData);
      setErrors(newErrors);
    }
  }, [unifiedData, useUnifiedForm]);

  const handleSave = () => {
    if (useUnifiedForm) {
      // 統合フォームモード
      const validationErrors = validateUnifiedForm(unifiedData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      // データ正規化
      const normalizedData: AmountSettingFormData = {
        ...unifiedData,
        endYear: unifiedData.endYear || undefined,
        changeAmount: unifiedData.changeAmount || undefined,
        changeRate: unifiedData.changeRate || undefined,
      };

      if (onSaveUnified) {
        onSaveUnified(normalizedData);
      } else if (onSave && itemId) {
        // 統合フォームから既存型へ変換
        const legacySetting = convertUnifiedToLegacy(normalizedData);
        const data: AmountSettingData = {
          itemId,
          planName,
          setting: legacySetting,
        };
        onSave(data);
      }
    } else {
      // 既存モード
      if (!itemId) return;

      const setting = itemType === "flow" ? flowData : stockData;
      const data: AmountSettingData = {
        itemId,
        planName,
        setting,
      };

      onSave?.(data);
    }

    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  // 数値入力のフォーマット処理関数
  const handleNumberInput = (value: string, field: 'startYear' | 'endYear' | 'baseAmount' | 'changeAmount' | 'changeRate') => {
    if (value === '') {
      if (field === 'startYear') return new Date().getFullYear();
      if (field === 'baseAmount') return 0;
      return undefined;
    }

    const numValue = parseInt(value);

    if (isNaN(numValue)) {
      if (field === 'startYear') return new Date().getFullYear();
      if (field === 'baseAmount') return 0;
      return undefined;
    }

    return numValue;
  };

  // 統合フォームの更新関数
  const updateUnifiedData = (field: keyof AmountSettingFormData, value: string | number | undefined) => {
    setUnifiedData(prev => ({ ...prev, [field]: value }));
  };

  // キーボードショートカット
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && Object.keys(errors).length === 0) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  // 統合フォームの計算例
  const getUnifiedCalculationExample = () => {
    const { startYear, endYear, baseAmount, changeAmount, changeRate, frequency } = unifiedData;

    if (!startYear || isNaN(startYear)) {
      return (
        <div className="text-gray-500 text-center py-4">
          開始を正しく入力してください
        </div>
      );
    }

    if (!baseAmount || baseAmount === 0) {
      return (
        <div className="text-gray-500 text-center py-4">
          ベース金額を入力してください
        </div>
      );
    }

    // バリデーションエラーがある場合は計算例を表示しない
    const validationErrors = validateUnifiedForm(unifiedData);
    if (Object.keys(validationErrors).length > 0) {
      return (
        <div className="text-gray-500 text-center py-4">
          入力内容にエラーがあります
        </div>
      );
    }

    const frequencyText = frequency === "monthly" ? "月額" : "年額";
    const endText = endYear ? `${endYear + 1}/3/31` : "永続";

    // 年額ベースで計算（月額の場合は年額に換算）
    const yearlyBaseAmount = frequency === "monthly" ? baseAmount * 12 : baseAmount;

    // 増減金額も年額ベースに換算
    const yearlyChangeAmount = changeAmount !== undefined ?
      (frequency === "monthly" ? changeAmount * 12 : changeAmount) : undefined;

    // 年額ベースでの計算
    let year1Amount = yearlyBaseAmount;
    let year2Amount = yearlyBaseAmount;
    let year3Amount = yearlyBaseAmount;
    let year5Amount = yearlyBaseAmount;

    // 計算方法の説明
    let calculationMethod = "";

    if (yearlyChangeAmount !== undefined && changeRate !== undefined) {
      // 増減金額と増減率の両方が指定された場合（複利 + 固定増減）
      year2Amount = Math.round(year1Amount * (1 + changeRate / 100)) + yearlyChangeAmount;
      year3Amount = Math.round(year2Amount * (1 + changeRate / 100)) + yearlyChangeAmount;

      // 5年目の計算
      let currentAmount = year1Amount;
      for (let i = 1; i < 5; i++) {
        currentAmount = Math.round(currentAmount * (1 + changeRate / 100)) + yearlyChangeAmount;
      }
      year5Amount = currentAmount;

      const changeAmountText = frequency === "monthly" ?
        `毎年${yearlyChangeAmount >= 0 ? '+' : ''}${formatNumber(yearlyChangeAmount)}円` :
        `毎年${yearlyChangeAmount >= 0 ? '+' : ''}${formatNumber(yearlyChangeAmount)}円`;
      calculationMethod = `年率${changeRate}%の複利 + ${changeAmountText}の増減`;
    } else if (yearlyChangeAmount !== undefined) {
      // 増減金額のみ（単純増減）
      year2Amount = year1Amount + yearlyChangeAmount;
      year3Amount = year1Amount + (yearlyChangeAmount * 2);
      year5Amount = year1Amount + (yearlyChangeAmount * 4);

      const changeAmountText = `毎年${yearlyChangeAmount >= 0 ? '+' : ''}${formatNumber(yearlyChangeAmount)}円`;
      calculationMethod = `${changeAmountText}の増減`;
    } else if (changeRate !== undefined && changeRate !== 0) {
      // 増減率のみ（複利計算）
      year2Amount = Math.round(year1Amount * (1 + changeRate / 100));
      year3Amount = Math.round(year2Amount * (1 + changeRate / 100));
      year5Amount = calculateCompoundGrowth(year1Amount, changeRate, 4);

      calculationMethod = `年率${changeRate}%の複利計算`;
    } else {
      calculationMethod = "変動なし（固定額）";
    }

    // 表示用の金額（月額設定の場合は月額も表示）
    const getDisplayAmount = (yearlyAmount: number) => {
      if (frequency === "monthly") {
        const monthlyAmount = Math.round(yearlyAmount / 12);
        return `${formatNumber(yearlyAmount)}円 (${formatNumber(monthlyAmount)}円/月)`;
      } else {
        return `${formatNumber(yearlyAmount)}円`;
      }
    };

    return (
      <div>
        <div className="font-medium mb-2 text-gray-700">
          計算例（ベース金額: {formatNumber(baseAmount)}円{frequency === "monthly" ? "/月" : "/年"}）
        </div>

        <div className="space-y-2 text-sm">
          <div className="bg-blue-50 p-2 rounded text-blue-800">
            📅 期間: {startYear}/4/1～{endText}<br />
            💰 設定: {frequencyText}ベース<br />
            📈 計算方法: {calculationMethod}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600">{startYear}年度:</div>
            <div className="font-medium">
              {getDisplayAmount(year1Amount)}
            </div>

            {(changeAmount !== undefined || (changeRate !== undefined && changeRate !== 0)) && (
              <>
                <div className="text-gray-600">{startYear + 1}年度:</div>
                <div className="font-medium">
                  {getDisplayAmount(year2Amount)}
                  {changeRate !== undefined && changeRate !== 0 && (
                    <span className="text-xs text-blue-600 ml-1">
                      ({changeRate >= 0 ? '+' : ''}{changeRate}%)
                    </span>
                  )}
                </div>

                <div className="text-gray-600">{startYear + 2}年度:</div>
                <div className="font-medium">
                  {getDisplayAmount(year3Amount)}
                </div>

                <div className="text-gray-600">{startYear + 4}年度:</div>
                <div className="font-medium">
                  {getDisplayAmount(year5Amount)}
                </div>
              </>
            )}
          </div>

          {changeRate !== undefined && changeRate !== 0 && (
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
              💡 複利効果: {Math.abs(changeRate)}%の年率で
              {changeRate > 0 ? "資産が増加" : "資産が減少"}します。
              長期間では大きな差が生まれます。
            </div>
          )}
        </div>
      </div>
    );
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

    const year1 = base;
    const year2 = year1 * (1 + rateVal) + changeVal;
    const year3 = year2 * (1 + rateVal) + changeVal;

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

  // フォームが有効かどうかの判定
  const isFormValid = useUnifiedForm
    ? Object.keys(errors).length === 0 && unifiedData.startYear && unifiedData.baseAmount !== undefined
    : true; // 既存モードは既存のロジックで判定

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[75vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{itemName} - 金額設定</DialogTitle>
          <DialogDescription>
            {useUnifiedForm
              ? `${planName}の金額変動パターンを設定します`
              : `${planName}の設定を行います`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4" onKeyDown={useUnifiedForm ? handleKeyDown : undefined}>
          {useUnifiedForm ? (
            // 統合フォームモード
            <>
              {/* 年度設定 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startYear" className="text-sm font-medium">
                    開始 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="startYear"
                    type="number"
                    value={unifiedData.startYear}
                    onChange={(e) =>
                      updateUnifiedData('startYear', handleNumberInput(e.target.value, 'startYear'))
                    }
                    className={errors.startYear ? "border-red-500" : ""}
                    placeholder="例: 2024"
                    min="1900"
                    max="2100"
                  />
                  {errors.startYear && (
                    <p className="text-xs text-red-600">{errors.startYear}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label htmlFor="endYear" className="text-sm font-medium cursor-help">
                          終了
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>空欄の場合は永続的に継続します</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Input
                    id="endYear"
                    type="number"
                    value={unifiedData.endYear || ""}
                    onChange={(e) =>
                      updateUnifiedData('endYear', handleNumberInput(e.target.value, 'endYear'))
                    }
                    className={errors.endYear ? "border-red-500" : ""}
                    placeholder="例: 2030"
                    min="1900"
                    max="2100"
                  />
                  {errors.endYear && (
                    <p className="text-xs text-red-600">{errors.endYear}</p>
                  )}
                </div>
              </div>

              {/* ベース金額設定 */}
              <div className="space-y-2">
                <Label htmlFor="unified-baseAmount" className="text-sm font-medium">
                  ベース金額 <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                  <Input
                    id="unified-baseAmount"
                    type="text"
                    className={`pl-8 ${errors.baseAmount ? "border-red-500" : ""}`}
                    value={getDisplayValue(unifiedData.baseAmount, 'baseAmount')}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/,/g, '');
                      updateUnifiedData('baseAmount', handleNumberInput(rawValue, 'baseAmount'));
                    }}
                    onFocus={() => setFocusedField('baseAmount')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="例: 1000000 (100万円)"
                  />
                </div>
                {errors.baseAmount && (
                  <p className="text-xs text-red-600">{errors.baseAmount}</p>
                )}
              </div>

              {/* 年額/月額選択 */}
              <div className="space-y-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label className="text-sm font-medium cursor-help">設定単位</Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>月額設定: 年間で12倍した金額で計算されます</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <RadioGroup
                  value={unifiedData.frequency}
                  onValueChange={(value) => updateUnifiedData('frequency', value)}
                  className="flex gap-6"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="yearly" id="unified-yearly" />
                    <Label htmlFor="unified-yearly" className="text-sm cursor-pointer">年額</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="monthly" id="unified-monthly" />
                    <Label htmlFor="unified-monthly" className="text-sm cursor-pointer">月額</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* 増減設定 */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Label htmlFor="changeAmount" className="text-sm font-medium cursor-help">
                            増減金額
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                            <Input
                              id="changeAmount"
                              type="text"
                              className={`pl-8 ${errors.changeAmount ? "border-red-500" : ""}`}
                              value={getDisplayValue(unifiedData.changeAmount, 'changeAmount')}
                              onChange={(e) => {
                                const rawValue = e.target.value.replace(/,/g, '');
                                updateUnifiedData('changeAmount', handleNumberInput(rawValue, 'changeAmount'));
                              }}
                              onFocus={() => setFocusedField('changeAmount')}
                              onBlur={() => setFocusedField(null)}
                              placeholder="年10万円増の場合、100000"
                            />
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>毎年同じ金額が増減します（例: 昇給、支出の削減）</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {errors.changeAmount && (
                    <p className="text-xs text-red-600">{errors.changeAmount}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Label htmlFor="changeRate" className="text-sm font-medium cursor-help">
                            増減率
                          </Label>
                          <div className="relative">
                            <Input
                              id="changeRate"
                              type="number"
                              step="1"
                              className={`pr-8 ${errors.changeRate ? "border-red-500" : ""}`}
                              value={unifiedData.changeRate || ""}
                              onChange={(e) =>
                                updateUnifiedData('changeRate', handleNumberInput(e.target.value, 'changeRate'))
                              }
                              placeholder="年5%増の場合、5"
                              min="-100"
                              max="1000"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>複利で計算されます（例: 投資の年利、インフレ）<br />整数のみ入力可能</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {errors.changeRate && (
                    <p className="text-xs text-red-600">{errors.changeRate}</p>
                  )}
                </div>
              </div>

              {/* 全体エラーメッセージ */}
              {errors.general && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-start gap-2">
                    <span className="text-red-500 text-sm">⚠️</span>
                    <p className="text-sm text-red-800">{errors.general}</p>
                  </div>
                </div>
              )}

              {/* 計算例 */}
              <Card className="bg-gray-50">
                <CardContent className="p-3">
                  <div className="text-xs text-gray-600">
                    {getUnifiedCalculationExample()}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : itemType === "flow" ? (
            // フロー項目用フォーム（既存モード）
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
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                  <Input
                    id="amount"
                    type="text"
                    className="pl-8"
                    value={getDisplayValue(flowData.amount, 'amount')}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/,/g, '');
                      setFlowData({
                        ...flowData,
                        amount: parseInt(rawValue) || 0,
                      });
                    }}
                    onFocus={() => setFocusedField('amount')}
                    onBlur={() => setFocusedField(null)}
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
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
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
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                  <Input
                    id="baseAmount"
                    type="text"
                    className="pl-8"
                    value={getDisplayValue(stockData.baseAmount, 'stockBaseAmount')}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/,/g, '');
                      setStockData({
                        ...stockData,
                        baseAmount: parseInt(rawValue) || 0,
                      });
                    }}
                    onFocus={() => setFocusedField('stockBaseAmount')}
                    onBlur={() => setFocusedField(null)}
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
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
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
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                  <Input
                    id="yearlyChange"
                    type="text"
                    className="pl-8"
                    value={getDisplayValue(stockData.yearlyChange, 'yearlyChange')}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/,/g, '');
                      setStockData({
                        ...stockData,
                        yearlyChange: parseInt(rawValue) || 0,
                      });
                    }}
                    onFocus={() => setFocusedField('yearlyChange')}
                    onBlur={() => setFocusedField(null)}
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
          <Button onClick={handleSave} disabled={useUnifiedForm ? !isFormValid : false}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
