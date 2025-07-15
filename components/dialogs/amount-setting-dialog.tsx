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

// 金額設定データの型定義
export interface AmountSettingFormData {
  startYear: number; // 年度(開始)
  endYear?: number; // 年度(終了) - 空欄可
  changeAmount?: number; // 増減金額 - 空欄可
  changeRate?: number; // 増減率(%) - 空欄可、整数のみ
  frequency: "yearly" | "monthly"; // 年額/月額
}

// バリデーションエラーの型定義
interface ValidationErrors {
  startYear?: string;
  endYear?: string;
  changeAmount?: string;
  changeRate?: string;
  general?: string;
}

interface AmountSettingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName?: string;
  planName?: string;
  initialData?: AmountSettingFormData;
  onSave?: (data: AmountSettingFormData) => void;
}

export function AmountSettingDialog({
  open,
  onOpenChange,
  itemName = "項目",
  planName = "デフォルトプラン",
  initialData,
  onSave,
}: AmountSettingDialogProps) {
  // フォーム状態
  const [formData, setFormData] = useState<AmountSettingFormData>({
    startYear: new Date().getFullYear(),
    endYear: undefined,
    changeAmount: undefined,
    changeRate: undefined,
    frequency: "yearly",
  });

  // バリデーションエラー状態
  const [errors, setErrors] = useState<ValidationErrors>({});

  // 初期データの設定
  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData(initialData);
      } else {
        // リセット
        setFormData({
          startYear: new Date().getFullYear(),
          endYear: undefined,
          changeAmount: undefined,
          changeRate: undefined,
          frequency: "yearly",
        });
      }
      setErrors({});
    }
  }, [open, initialData]);

  // 数値フォーマット関数
  const formatNumber = (value: number): string => {
    return value.toLocaleString('ja-JP');
  };

  // 複利計算関数
  const calculateCompoundGrowth = (principal: number, rate: number, years: number): number => {
    if (rate === 0) return principal;
    return Math.round(principal * Math.pow(1 + rate / 100, years));
  };

  // リアルタイムバリデーション
  const validateForm = (data: AmountSettingFormData): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    // 年度(開始)のバリデーション
    if (!data.startYear) {
      newErrors.startYear = "年度(開始)は必須です";
    } else if (isNaN(data.startYear)) {
      newErrors.startYear = "有効な年度を入力してください";
    } else if (data.startYear < 1900 || data.startYear > 2100) {
      newErrors.startYear = "年度は1900～2100年の範囲で入力してください";
    } else if (!Number.isInteger(data.startYear)) {
      newErrors.startYear = "年度は整数で入力してください";
    }

    // 年度(終了)のバリデーション
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

    // 増減率のバリデーション（整数のみ）
    if (data.changeRate !== undefined) {
      if (isNaN(data.changeRate)) {
        newErrors.changeRate = "有効な増減率を入力してください";
      } else if (!Number.isInteger(data.changeRate)) {
        newErrors.changeRate = "増減率は整数で入力してください";
      } else if (data.changeRate < -100) {
        newErrors.changeRate = "増減率は-100%以上で入力してください（-100%で0になります）";
      } else if (data.changeRate > 1000) {
        newErrors.changeRate = "増減率は1000%以下で入力してください";
      }
    }

    // 増減金額と増減率の同時指定チェック
    if (data.changeAmount !== undefined && data.changeRate !== undefined) {
      newErrors.general = "増減金額と増減率は同時に指定できません。どちらか一方を選択してください。";
    }

    // 現実的でない設定の警告
    if (data.changeRate !== undefined && Math.abs(data.changeRate) > 50) {
      if (!newErrors.changeRate) {
        newErrors.changeRate = `増減率${data.changeRate}%は極端な値です。本当にこの値で設定しますか？`;
      }
    }

    return newErrors;
  };

  // フォームデータ更新時のバリデーション
  useEffect(() => {
    const newErrors = validateForm(formData);
    setErrors(newErrors);
  }, [formData]);

  // 数値入力のフォーマット処理
  const handleNumberInput = (value: string, field: 'startYear' | 'endYear' | 'changeAmount' | 'changeRate') => {
    if (value === '') {
      return field === 'startYear' ? new Date().getFullYear() : undefined;
    }
    
    const numValue = parseInt(value);
    
    // NaNの場合はundefined（ただしstartYearは現在年を返す）
    if (isNaN(numValue)) {
      return field === 'startYear' ? new Date().getFullYear() : undefined;
    }
    
    return numValue;
  };

  // フォーム値の更新
  const updateFormData = (field: keyof AmountSettingFormData, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 最終検証処理
  const performFinalValidation = (data: AmountSettingFormData): { isValid: boolean; errors: ValidationErrors } => {
    const errors = validateForm(data);
    
    // 追加の最終検証項目
    if (!errors.startYear && !data.startYear) {
      errors.startYear = "年度(開始)は必須項目です";
    }
    
    // 現実的でない組み合わせの検証
    if (data.endYear && data.changeRate && Math.abs(data.changeRate) > 20) {
      const years = data.endYear - data.startYear;
      if (years > 20) {
        if (!errors.changeRate) {
          errors.general = `長期間(${years}年)で高い増減率(${data.changeRate}%)の設定は現実的ではない可能性があります。`;
        }
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  // 保存処理
  const handleSave = () => {
    const validation = performFinalValidation(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // データ正規化
    const normalizedData: AmountSettingFormData = {
      ...formData,
      // undefinedの場合は明示的にundefinedを設定
      endYear: formData.endYear || undefined,
      changeAmount: formData.changeAmount || undefined,
      changeRate: formData.changeRate || undefined,
    };

    onSave?.(normalizedData);
    onOpenChange(false);
  };

  // キャンセル処理
  const handleCancel = () => {
    onOpenChange(false);
  };

  // キーボード操作
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && Object.keys(errors).length === 0) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  // 計算例の生成
  const getCalculationExample = () => {
    const { startYear, endYear, changeAmount, changeRate, frequency } = formData;

    if (!startYear || isNaN(startYear)) {
      return (
        <div className="text-gray-500 text-center py-4">
          年度(開始)を正しく入力してください
        </div>
      );
    }

    // バリデーションエラーがある場合は計算例を表示しない
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      return (
        <div className="text-gray-500 text-center py-4">
          入力内容にエラーがあります
        </div>
      );
    }

    const frequencyText = frequency === "monthly" ? "月額" : "年額";
    const endText = endYear ? `${endYear + 1}/3/31` : "永続";
    const baseAmount = 1000000; // 計算例用の基準金額

    // 年額/月額の換算を考慮
    const displayAmount = frequency === "monthly" ? Math.round(baseAmount / 12) : baseAmount;
    
    const year1Amount = displayAmount;
    let year2Amount = displayAmount;
    let year3Amount = displayAmount;
    let year5Amount = displayAmount;

    // 計算方法の説明
    let calculationMethod = "";

    if (changeAmount !== undefined) {
      // 増減金額による計算（単純増減）
      year2Amount = displayAmount + changeAmount;
      year3Amount = displayAmount + (changeAmount * 2);
      year5Amount = displayAmount + (changeAmount * 4);
      
      calculationMethod = `毎年${changeAmount >= 0 ? '+' : ''}${formatNumber(changeAmount)}円の増減`;
    } else if (changeRate !== undefined) {
      // 増減率による計算（複利計算）
      year2Amount = calculateCompoundGrowth(displayAmount, changeRate, 1);
      year3Amount = calculateCompoundGrowth(displayAmount, changeRate, 2);
      year5Amount = calculateCompoundGrowth(displayAmount, changeRate, 4);
      
      calculationMethod = `年率${changeRate}%の複利計算`;
    } else {
      calculationMethod = "変動なし（固定額）";
    }

    // 年額表示用の金額計算
    const getYearlyAmount = (amount: number) => {
      return frequency === "monthly" ? amount * 12 : amount;
    };

    return (
      <div>
        <div className="font-medium mb-2 text-gray-700">
          計算例（基準金額: {formatNumber(displayAmount)}円{frequency === "monthly" ? "/月" : "/年"}）
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="bg-blue-50 p-2 rounded text-blue-800">
            📅 期間: {startYear}/4/1～{endText}<br/>
            💰 設定: {frequencyText}ベース<br/>
            📊 計算方法: {calculationMethod}
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600">初年度({startYear}):</div>
            <div className="font-medium">
              {formatNumber(displayAmount)}円
              {frequency === "monthly" && (
                <span className="text-xs text-gray-500">
                  /月 (年額: {formatNumber(getYearlyAmount(year1Amount))}円)
                </span>
              )}
            </div>
            
            {(changeAmount !== undefined || changeRate !== undefined) && (
              <>
                <div className="text-gray-600">2年目({startYear + 1}):</div>
                <div className="font-medium">
                  {formatNumber(year2Amount)}円
                  {frequency === "monthly" && (
                    <span className="text-xs text-gray-500">
                      /月 (年額: {formatNumber(getYearlyAmount(year2Amount))}円)
                    </span>
                  )}
                  {changeAmount !== undefined && (
                    <span className="text-xs text-blue-600 ml-1">
                      ({changeAmount >= 0 ? '+' : ''}{formatNumber(changeAmount)}円)
                    </span>
                  )}
                  {changeRate !== undefined && (
                    <span className="text-xs text-blue-600 ml-1">
                      ({changeRate >= 0 ? '+' : ''}{changeRate}%)
                    </span>
                  )}
                </div>
                
                <div className="text-gray-600">3年目({startYear + 2}):</div>
                <div className="font-medium">
                  {formatNumber(year3Amount)}円
                  {frequency === "monthly" && (
                    <span className="text-xs text-gray-500">
                      /月 (年額: {formatNumber(getYearlyAmount(year3Amount))}円)
                    </span>
                  )}
                </div>
                
                <div className="text-gray-600">5年目({startYear + 4}):</div>
                <div className="font-medium">
                  {formatNumber(year5Amount)}円
                  {frequency === "monthly" && (
                    <span className="text-xs text-gray-500">
                      /月 (年額: {formatNumber(getYearlyAmount(year5Amount))}円)
                    </span>
                  )}
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

  // フォームが有効かどうかの判定
  const isFormValid = Object.keys(errors).length === 0 && formData.startYear;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{itemName} - 金額設定</DialogTitle>
          <DialogDescription>
            {planName}の金額変動パターンを設定します
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4" onKeyDown={handleKeyDown}>
          {/* 年度設定 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startYear" className="text-sm font-medium">
                年度(開始) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startYear"
                type="number"
                value={formData.startYear}
                onChange={(e) => 
                  updateFormData('startYear', handleNumberInput(e.target.value, 'startYear'))
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
              <Label htmlFor="endYear" className="text-sm font-medium">
                年度(終了)
                <span className="text-xs text-gray-500 ml-1">※空欄可</span>
              </Label>
              <Input
                id="endYear"
                type="number"
                value={formData.endYear || ""}
                onChange={(e) => 
                  updateFormData('endYear', handleNumberInput(e.target.value, 'endYear'))
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

          {/* 増減設定 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="changeAmount" className="text-sm font-medium">
                増減金額
                <span className="text-xs text-gray-500 ml-1">※空欄可</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">¥</span>
                <Input
                  id="changeAmount"
                  type="number"
                  className={`pl-8 ${errors.changeAmount ? "border-red-500" : ""}`}
                  value={formData.changeAmount || ""}
                  onChange={(e) => 
                    updateFormData('changeAmount', handleNumberInput(e.target.value, 'changeAmount'))
                  }
                  placeholder="例: 100000 (年10万円増)"
                  min="-999999999"
                  max="999999999"
                />
              </div>
              {errors.changeAmount && (
                <p className="text-xs text-red-600">{errors.changeAmount}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="changeRate" className="text-sm font-medium">
                増減率
                <span className="text-xs text-gray-500 ml-1">※空欄可、整数のみ</span>
              </Label>
              <div className="relative">
                <Input
                  id="changeRate"
                  type="number"
                  step="1"
                  className={`pr-8 ${errors.changeRate ? "border-red-500" : ""}`}
                  value={formData.changeRate || ""}
                  onChange={(e) => 
                    updateFormData('changeRate', handleNumberInput(e.target.value, 'changeRate'))
                  }
                  placeholder="例: 3 (年3%増の場合)"
                  min="-100"
                  max="1000"
                />
                <span className="absolute right-3 top-3 text-gray-500">%</span>
              </div>
              {errors.changeRate && (
                <p className="text-xs text-red-600">{errors.changeRate}</p>
              )}
            </div>
          </div>

          {/* 年額/月額選択 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">設定単位</Label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="frequency"
                  value="yearly"
                  checked={formData.frequency === "yearly"}
                  onChange={(e) => updateFormData('frequency', e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">年額</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="frequency"
                  value="monthly"
                  checked={formData.frequency === "monthly"}
                  onChange={(e) => updateFormData('frequency', e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">月額</span>
              </label>
            </div>
          </div>

          {/* 入力ヘルプと注意事項 */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="text-sm text-blue-800">
              <div className="font-medium mb-1">📝 入力のヒント</div>
              <ul className="space-y-1 text-xs">
                <li>• 増減金額: 毎年同じ金額が増減します（例: 昇給、支出の削減）</li>
                <li>• 増減率: 複利で計算されます（例: 投資の年利、インフレ）</li>
                <li>• 終了年度: 空欄の場合は永続的に継続します</li>
                <li>• 月額設定: 年間で12倍した金額で計算されます</li>
              </ul>
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
                {getCalculationExample()}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            キャンセル
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}