// サンプルデータ型定義
export interface FinancialData {
  [year: number]: number;
}

export interface SampleData {
  income: {
    [key: string]: FinancialData;
  };
  expense: {
    [key: string]: FinancialData;
  };
  assets: {
    [key: string]: FinancialData;
  };
  debts: {
    [key: string]: FinancialData;
  };
}

// サンプルデータを動的に生成する関数
export function generateSampleData(
  startYear: number,
  years: number
): SampleData {
  const data: SampleData = {
    income: {
      給与: {},
      ボーナス: {},
      年金: {},
      副業インセンティブ: {},
    },
    expense: {
      住宅ローン: {},
      生活費: {},
      学費: {},
      医療費: {},
      "習い事・塾": {},
    },
    assets: {
      預金: {},
      投資信託: {},
      確定拠出年金: {},
    },
    debts: {
      住宅ローン残債: {},
      自動車ローン: {},
      カード分割払い: {},
    },
  };

  for (let i = 0; i < years; i++) {
    const year = startYear + i;

    // 収入（年率約3%増加）
    data.income["給与"][year] = Math.round(480 * Math.pow(1.03, i));
    data.income["ボーナス"][year] = Math.round(120 * Math.pow(1.03, i));
    data.income["年金"][year] = year >= 2044 ? 180 : 0; // 65歳から開始想定
    data.income["副業インセンティブ"][year] = Math.round(50 * Math.pow(1.1, i));

    // 支出（年率約2.5%増加）
    data.expense["住宅ローン"][year] = year <= 2044 ? 120 : 0; // 20年で完済想定
    data.expense["生活費"][year] = Math.round(240 * Math.pow(1.025, i));
    data.expense["学費"][year] =
      year <= 2034 ? Math.round(60 * Math.pow(1.03, i)) : 0;
    data.expense["医療費"][year] = Math.round(24 * Math.pow(1.04, i));
    data.expense["習い事・塾"][year] =
      year <= 2032 ? Math.round(30 * Math.pow(1.05, i)) : 0;

    // 資産（複利計算）
    data.assets["預金"][year] = Math.round(1000 * Math.pow(1.15, i));
    data.assets["投資信託"][year] = Math.round(500 * Math.pow(1.15, i));
    data.assets["確定拠出年金"][year] = Math.round(300 * Math.pow(1.15, i));

    // 負債（減少）
    data.debts["住宅ローン残債"][year] = Math.max(0, 3000 - 120 * i);
    data.debts["自動車ローン"][year] = Math.max(0, 200 - 80 * i);
    data.debts["カード分割払い"][year] = Math.max(0, 50 - 25 * i);
  }

  return data;
}

// デフォルトのサンプルデータ（50年分）
export const defaultSampleData = generateSampleData(2024, 50);
