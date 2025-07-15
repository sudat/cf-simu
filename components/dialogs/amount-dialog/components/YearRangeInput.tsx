/**
 * 年度範囲入力コンポーネント
 */

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FieldError, getErrorClassName } from "./ErrorMessage";

interface YearRangeInputProps {
  /** 開始年度 */
  startYear: number;
  /** 終了年度（任意） */
  endYear?: number;
  /** 開始年度変更時のコールバック */
  onStartYearChange: (year: number) => void;
  /** 終了年度変更時のコールバック */
  onEndYearChange: (year?: number) => void;
  /** 開始年度のエラーメッセージ */
  startYearError?: string;
  /** 終了年度のエラーメッセージ */
  endYearError?: string;
  /** 開始年度のラベル */
  startYearLabel?: string;
  /** 終了年度のラベル */
  endYearLabel?: string;
  /** 開始年度のプレースホルダー */
  startYearPlaceholder?: string;
  /** 終了年度のプレースホルダー */
  endYearPlaceholder?: string;
  /** 開始年度が必須かどうか */
  startYearRequired?: boolean;
  /** 終了年度の説明テキスト */
  endYearHelpText?: string;
  /** 最小年度 */
  minYear?: number;
  /** 最大年度 */
  maxYear?: number;
}

/**
 * 年度範囲入力コンポーネント
 * 開始年度と終了年度の入力を管理し、適切なバリデーションを提供
 */
export const YearRangeInput: React.FC<YearRangeInputProps> = ({
  startYear,
  endYear,
  onStartYearChange,
  onEndYearChange,
  startYearError,
  endYearError,
  startYearLabel = "開始年度",
  endYearLabel = "終了年度",
  startYearPlaceholder = "例: 2024",
  endYearPlaceholder = "例: 2030",
  startYearRequired = true,
  endYearHelpText = "空欄の場合は永続的に継続します",
  minYear = 1900,
  maxYear = 2100,
}) => {
  const handleStartYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      onStartYearChange(new Date().getFullYear());
      return;
    }

    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      onStartYearChange(new Date().getFullYear());
    } else {
      onStartYearChange(numValue);
    }
  };

  const handleEndYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      onEndYearChange(undefined);
      return;
    }

    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      onEndYearChange(undefined);
    } else {
      onEndYearChange(numValue);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* 開始年度 */}
      <div className="space-y-2">
        <Label htmlFor="startYear" className="text-sm font-medium">
          {startYearLabel}
          {startYearRequired && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Input
          id="startYear"
          type="number"
          value={startYear}
          onChange={handleStartYearChange}
          className={getErrorClassName(!!startYearError)}
          placeholder={startYearPlaceholder}
          min={minYear}
          max={maxYear}
        />
        <FieldError error={startYearError} />
      </div>

      {/* 終了年度 */}
      <div className="space-y-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Label
                htmlFor="endYear"
                className="text-sm font-medium cursor-help"
              >
                {endYearLabel}
              </Label>
            </TooltipTrigger>
            <TooltipContent>
              <p>{endYearHelpText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Input
          id="endYear"
          type="number"
          value={endYear || ""}
          onChange={handleEndYearChange}
          className={getErrorClassName(!!endYearError)}
          placeholder={endYearPlaceholder}
          min={minYear}
          max={maxYear}
        />
        <FieldError error={endYearError} />
      </div>
    </div>
  );
};

interface SimpleYearInputProps {
  /** 年度の値 */
  value: number;
  /** 値変更時のコールバック */
  onChange: (year: number) => void;
  /** ラベルテキスト */
  label: string;
  /** プレースホルダーテキスト */
  placeholder?: string;
  /** エラーメッセージ */
  error?: string;
  /** 入力フィールドのID */
  id?: string;
  /** 最小年度 */
  minYear?: number;
  /** 最大年度 */
  maxYear?: number;
}

/**
 * シンプルな年度入力コンポーネント
 * 単一の年度入力に使用
 */
export const SimpleYearInput: React.FC<SimpleYearInputProps> = ({
  value,
  onChange,
  label,
  placeholder = "例: 2024",
  error,
  id,
  minYear = 1900,
  maxYear = 2100,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      onChange(new Date().getFullYear());
      return;
    }

    const numValue = parseInt(inputValue);
    if (isNaN(numValue)) {
      onChange(new Date().getFullYear());
    } else {
      onChange(numValue);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        value={value}
        onChange={handleChange}
        className={getErrorClassName(!!error)}
        placeholder={placeholder}
        min={minYear}
        max={maxYear}
      />
      <FieldError error={error} />
    </div>
  );
};
