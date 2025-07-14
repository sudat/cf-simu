# データモデル設計書

## 概要

このアプリケーションは、サーバーサイドのデータベースを持たず、ブラウザのローカルストレージ (`localStorage`) を使用してデータを永続化することを想定しています。そのため、データモデルは正規化されたリレーショナルモデルではなく、単一のJSONオブジェクトとして構成されます。

## データ構造 (Zustandストア)

アプリケーションの状態は、Zustandのような状態管理ライブラリで一元管理されます。以下はそのストアの型定義です。

```typescript
// lib/types/index.ts

// フロー項目（収入・支出）の設定
export interface FlowItemDetail {
  startYear: number;      // 開始年度
  endYear?: number;     // 終了年度 (任意)
  amount: number;         // 金額
  frequency: 'monthly' | 'yearly'; // 頻度
  growthRate: number;     // 年率増減 (%)
}

// ストック項目（資産・負債）の設定
export interface StockItemDetail {
  baseYear: number;       // 基準年度
  baseAmount: number;     // 基準額
  rate: number;           // 年率増減 (%)
  yearlyChange: number;   // 年額増減（積立/取崩）
}

// 各項目の設定（プランごと）
export interface ItemSetting {
  // key: プラン名 (e.g., 'デフォルトプラン')
  [planName: string]: FlowItemDetail | StockItemDetail;
}

// カテゴリごとの項目
export interface CategoryItems {
  // key: 項目名 (e.g., '給与')
  [itemName: string]: {
    type: 'flow' | 'stock';
    settings: ItemSetting;
  };
}

// アプリケーション全体のプラン構成
export interface PlanState {
  plans: {
    // key: 項目名 (e.g., '給与')
    [itemName: string]: {
      availablePlans: string[]; // ['デフォルトプラン', '積極投資プラン']
      activePlan: string;     // 'デフォルトプラン'
    };
  };
  incomes: CategoryItems;   // 収入項目
  expenses: CategoryItems;  // 支出項目
  assets: CategoryItems;    // 資産項目
  debts: CategoryItems;     // 負債項目
}

// シミュレーション結果のデータポイント
export interface SimulationDataPoint {
  year: number;
  income: number;
  expense: number;
  netIncome: number;
  assets: number;
  debts: number;
  netAssets: number;
}

// シミュレーション結果のストア
export interface SimulationState {
  results: SimulationDataPoint[];
  period: number; // 5, 10, 20, 30, 50年
}
```

## モデル解説

### `PlanState` (プランと項目のデータ)

- **`plans`**: 各項目（例: `給与`）ごとに、どのようなプラン（シナリオ）が存在し、現在どれがアクティブか、を管理します。
  - `availablePlans`: その項目で利用可能なプラン名の配列です。（例: `['基本給', '昇進後']`）
  - `activePlan`: 現在のシミュレーションで採用されているプラン名です。

- **`incomes`, `expenses`, `assets`, `debts`**: 4つの主要カテゴリです。それぞれが `CategoryItems` 型を持ちます。

- **`CategoryItems`**: `給与`や`住宅ローン`といった具体的な項目名をキーとして持ちます。
  - `type`: その項目が「フロー」（毎年の収支）か「ストック」（ある時点での残高）かを定義します。
  - `settings`: その項目の具体的な設定を、プラン名をキーとして保持します。これにより、「給与」項目の「基本給」プランの場合の金額、「昇進後」プランの場合の金額、といった多角的な設定が可能になります。

### `SimulationState` (シミュレーション結果)

- **`results`**: 計算エンジン (`lib/simulation/engine.ts`) によって生成された、年ごとのシミュレーション結果の配列です。
- **`period`**: 現在UIで選択されている表示期間（年数）を保持します。

## データ永続化

- `PlanState` の内容は、変更があるたびに `localStorage.setItem('cf-simu-data', JSON.stringify(state))` のようにして保存されます。
- アプリケーション起動時には `localStorage.getItem('cf-simu-data')` からデータを読み込み、Zustandストアの初期状態として復元します。
