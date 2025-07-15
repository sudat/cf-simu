/**
 * 数値フォーマット関連のユーティリティ関数
 */

/**
 * 数値を日本語ロケールの3桁区切り形式でフォーマットする
 * @param value フォーマットする数値
 * @returns 3桁区切りでフォーマットされた文字列
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString('ja-JP');
};

/**
 * 数値入力フィールドの表示値を取得する
 * フォーカス時は生の値、非フォーカス時は3桁区切りで表示
 * @param value 表示する数値（undefined可）
 * @param fieldName フィールド名
 * @param focusedField 現在フォーカスされているフィールド名
 * @returns 表示用の文字列
 */
export const getDisplayValue = (
  value: number | undefined, 
  fieldName: string,
  focusedField: string | null
): string => {
  if (value === undefined || value === null) return "";
  
  if (focusedField === fieldName) {
    // フォーカス時は生の値を表示
    return value.toString();
  } else {
    // 非フォーカス時は3桁区切りで表示
    return formatNumber(value);
  }
};