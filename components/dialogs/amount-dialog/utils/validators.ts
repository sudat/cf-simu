/**
 * バリデーション関連のユーティリティ関数
 */

import { AmountSettingFormData, ValidationErrors } from "@/lib/types";

/**
 * 統合フォームのバリデーションを行う
 * @param data 統合フォームデータ
 * @returns バリデーションエラーオブジェクト
 */
export const validateUnifiedForm = (data: AmountSettingFormData): ValidationErrors => {
  const newErrors: ValidationErrors = {};

  // 開始年度のバリデーション
  if (!data.startYear) {
    newErrors.startYear = "開始は必須です";
  } else if (isNaN(data.startYear)) {
    newErrors.startYear = "有効な年度を入力してください";
  } else if (data.startYear < 1900 || data.startYear > 2100) {
    newErrors.startYear = "年度は1900～2100年の範囲で入力してください";
  } else if (!Number.isInteger(data.startYear)) {
    newErrors.startYear = "年度は整数で入力してください";
  }

  // 終了年度のバリデーション
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

  return newErrors;
};

/**
 * 年度範囲のバリデーションを行う
 * @param startYear 開始年度
 * @param endYear 終了年度（任意）
 * @returns エラーメッセージまたはnull
 */
export const validateYearRange = (startYear: number, endYear?: number): string | null => {
  if (startYear < 1900 || startYear > 2100) {
    return "開始年度は1900～2100年の範囲で入力してください";
  }

  if (endYear !== undefined) {
    if (endYear < 1900 || endYear > 2100) {
      return "終了年度は1900～2100年の範囲で入力してください";
    }
    if (endYear <= startYear) {
      return "終了年度は開始年度より後にしてください";
    }
    if ((endYear - startYear) > 100) {
      return "期間は100年以内にしてください";
    }
  }

  return null;
};

/**
 * 金額のバリデーションを行う
 * @param amount 金額
 * @param required 必須かどうか
 * @returns エラーメッセージまたはnull
 */
export const validateAmount = (amount: number | undefined, required: boolean = false): string | null => {
  if (required && (amount === undefined || amount === null)) {
    return "金額は必須です";
  }

  if (amount !== undefined && amount !== null) {
    if (isNaN(amount)) {
      return "有効な金額を入力してください";
    }
    if (amount < 0) {
      return "金額は0以上で入力してください";
    }
    if (!Number.isInteger(amount)) {
      return "金額は整数で入力してください";
    }
    if (amount > 999999999) {
      return "金額は9億円以内で入力してください";
    }
  }

  return null;
};

/**
 * 増減率のバリデーションを行う
 * @param rate 増減率（%）
 * @returns エラーメッセージまたはnull
 */
export const validateRate = (rate: number | undefined): string | null => {
  if (rate !== undefined) {
    if (isNaN(rate)) {
      return "有効な増減率を入力してください";
    }
    if (!Number.isInteger(rate)) {
      return "増減率は整数で入力してください";
    }
    if (rate < -100) {
      return "増減率は-100%以上で入力してください";
    }
    if (rate > 1000) {
      return "増減率は1000%以下で入力してください";
    }
  }

  return null;
};