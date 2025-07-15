/**
 * エラーメッセージ表示コンポーネント
 */

import React from "react";

interface ErrorMessageProps {
  /** エラーメッセージ */
  message?: string;
  /** エラーメッセージのサイズ */
  size?: "sm" | "md";
  /** エラーメッセージのスタイル */
  variant?: "inline" | "block";
}

/**
 * インラインエラーメッセージコンポーネント
 * フィールドの下に表示される小さなエラーメッセージ
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  size = "sm",
  variant = "inline"
}) => {
  if (!message) return null;

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm"
  };

  if (variant === "inline") {
    return (
      <p className={`${sizeClasses[size]} text-red-600`}>
        {message}
      </p>
    );
  }

  // block variant - 全体エラー用
  return (
    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
      <div className="flex items-start gap-2">
        <span className="text-red-500 text-sm">⚠️</span>
        <p className={`${sizeClasses[size]} text-red-800`}>
          {message}
        </p>
      </div>
    </div>
  );
};

interface FieldErrorProps {
  /** エラーメッセージ */
  error?: string;
}

/**
 * フィールド用エラーメッセージコンポーネント
 * 入力フィールドの下に表示される標準的なエラーメッセージ
 */
export const FieldError: React.FC<FieldErrorProps> = ({ error }) => {
  return <ErrorMessage message={error} size="sm" variant="inline" />;
};

interface GeneralErrorProps {
  /** エラーメッセージ */
  error?: string;
}

/**
 * 全体エラーメッセージコンポーネント
 * フォーム全体のエラーを表示するブロック型エラーメッセージ
 */
export const GeneralError: React.FC<GeneralErrorProps> = ({ error }) => {
  return <ErrorMessage message={error} size="sm" variant="block" />;
};

/**
 * 入力フィールドのエラー状態に応じたクラス名を取得
 * @param hasError エラーがあるかどうか
 * @param baseClasses ベースとなるクラス名
 * @returns エラー状態を含むクラス名
 */
export const getErrorClassName = (hasError: boolean, baseClasses: string = ""): string => {
  const errorClass = hasError ? "border-red-500" : "";
  return `${baseClasses} ${errorClass}`.trim();
};