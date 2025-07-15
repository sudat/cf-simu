/**
 * 金額計算関連のユーティリティ関数
 */

/**
 * 複利計算を行う
 * @param principal 元本
 * @param rate 年率（%）
 * @param years 年数
 * @returns 複利計算後の金額（四捨五入）
 */
export const calculateCompoundGrowth = (principal: number, rate: number, years: number): number => {
  if (rate === 0) return principal;
  return Math.round(principal * Math.pow(1 + rate / 100, years));
};

/**
 * 年次推移を計算する（複利 + 固定増減の組み合わせ）
 * @param baseAmount 基準金額
 * @param changeRate 増減率（%）
 * @param changeAmount 年間固定増減額
 * @param years 計算する年数
 * @returns 各年の金額配列
 */
export const calculateYearlyProgression = (
  baseAmount: number,
  changeRate?: number,
  changeAmount?: number,
  years: number = 5
): number[] => {
  const results: number[] = [baseAmount];
  let currentAmount = baseAmount;

  for (let i = 1; i < years; i++) {
    if (changeRate !== undefined && changeRate !== 0) {
      // 複利計算
      currentAmount = Math.round(currentAmount * (1 + changeRate / 100));
    }
    
    if (changeAmount !== undefined && changeAmount !== 0) {
      // 固定増減額を追加
      currentAmount += changeAmount;
    }
    
    results.push(currentAmount);
  }

  return results;
};

/**
 * 単純な年次増減計算（複利なし）
 * @param baseAmount 基準金額
 * @param yearlyChange 年間増減額
 * @param years 計算する年数
 * @returns 各年の金額配列
 */
export const calculateSimpleProgression = (
  baseAmount: number,
  yearlyChange: number,
  years: number = 5
): number[] => {
  const results: number[] = [];
  
  for (let i = 0; i < years; i++) {
    results.push(baseAmount + (yearlyChange * i));
  }
  
  return results;
};