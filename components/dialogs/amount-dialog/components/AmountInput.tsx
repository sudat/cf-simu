/**
 * 金額入力コンポーネント
 */

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getDisplayValue } from "../utils/formatters";
import { FieldError, getErrorClassName } from "./ErrorMessage";

interface AmountInputProps {
  /** 入力値 */
  value: number | undefined;
  /** 値変更時のコールバック */
  onChange: (value: number | undefined) => void;
  /** ラベルテキスト */
  label?: string;
  /** プレースホルダーテキスト */
  placeholder?: string;
  /** 必須フィールドかどうか */
  required?: boolean;
  /** エラーメッセージ */
  error?: string;
  /** 入力フィールドのID */
  id?: string;
  /** 追加のクラス名 */
  className?: string;
  /** フィールド名（フォーカス管理用） */
  fieldName: string;
}

/**
 * 金額入力コンポーネント
 * 通貨記号表示、3桁区切り、フォーカス時の生値表示機能を含む
 */
export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  label,
  placeholder = "0",
  required = false,
  error,
  id,
  className = "",
  fieldName,
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");

    if (rawValue === "") {
      onChange(undefined);
      return;
    }

    const numValue = parseInt(rawValue);
    if (isNaN(numValue)) {
      onChange(undefined);
    } else {
      onChange(numValue);
    }
  };

  const handleFocus = () => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          ¥
        </span>
        <Input
          id={id}
          type="text"
          className={getErrorClassName(!!error, `pl-8 ${className}`)}
          value={getDisplayValue(value, fieldName, focusedField)}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
        />
      </div>

      <FieldError error={error} />
    </div>
  );
};

interface SimpleAmountInputProps {
  /** 入力値 */
  value: number | undefined;
  /** 値変更時のコールバック */
  onChange: (value: number | undefined) => void;
  /** プレースホルダーテキスト */
  placeholder?: string;
  /** エラーメッセージ */
  error?: string;
  /** 入力フィールドのID */
  id?: string;
  /** 追加のクラス名 */
  className?: string;
  /** フィールド名（フォーカス管理用） */
  fieldName: string;
}

/**
 * シンプルな金額入力コンポーネント（ラベルなし）
 * 既存のフォーム構造に組み込みやすい軽量版
 */
export const SimpleAmountInput: React.FC<SimpleAmountInputProps> = ({
  value,
  onChange,
  placeholder = "0",
  error,
  id,
  className = "",
  fieldName,
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");

    if (rawValue === "") {
      onChange(undefined);
      return;
    }

    const numValue = parseInt(rawValue);
    if (isNaN(numValue)) {
      onChange(undefined);
    } else {
      onChange(numValue);
    }
  };

  const handleFocus = () => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
        ¥
      </span>
      <Input
        id={id}
        type="text"
        className={getErrorClassName(!!error, `pl-8 ${className}`)}
        value={getDisplayValue(value, fieldName, focusedField)}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
    </div>
  );
};
