// フロー項目（収入・支出）の設定
export interface FlowItemDetail {
  startYear: number; // 開始年度
  endYear?: number; // 終了年度 (任意)
  amount: number; // 金額
  frequency: "monthly" | "yearly"; // 頻度
  growthRate: number; // 年率増減 (%)
}

// ストック項目（資産・負債）の設定
export interface StockItemDetail {
  baseYear: number; // 基準年度
  baseAmount: number; // 基準額
  rate: number; // 年率増減 (%)
  yearlyChange: number; // 年額増減（積立/取崩）
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
    type: "flow" | "stock";
    settings: ItemSetting;
  };
}

// アプリケーション全体のプラン構成
export interface PlanState {
  plans: {
    // key: 項目名 (e.g., '給与')
    [itemName: string]: {
      availablePlans: string[]; // ['デフォルトプラン', '積極投資プラン']
      activePlan: string; // 'デフォルトプラン'
    };
  };
  incomes: CategoryItems; // 収入項目
  expenses: CategoryItems; // 支出項目
  assets: CategoryItems; // 資産項目
  debts: CategoryItems; // 負債項目
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

// ダイアログの状態管理用
export interface DialogState {
  isOpen: boolean;
  title?: string;
  data?: unknown;
}

// 階層ナビゲーション対応のダイアログ状態
export interface HierarchicalDialogState extends DialogState {
  parentDialogId?: string; // 親ダイアログのID
  level: number; // 階層レベル（0から開始）
}

// ダイアログ履歴の項目
export interface DialogHistoryItem {
  dialogId: string;
  title?: string;
  data?: unknown;
  timestamp: number;
}

// カテゴリタイプ
export type CategoryType = "income" | "expense" | "asset" | "debt";

// 項目タイプ
export type ItemType = "flow" | "stock";

// 項目頻度
export type ItemFrequency = "monthly" | "yearly";

// プラン管理のためのアイテム情報
export interface PlanItem {
  id: string;
  name: string;
  category: CategoryType;
  type: ItemType;
  activePlan: string;
  availablePlans: string[];
}

// 項目追加時の情報
export interface AddItemData {
  name: string;
  category: CategoryType;
  type: ItemType;
}

// プラン追加時の情報
export interface AddPlanData {
  itemId: string;
  planName: string;
}

// 金額設定時の情報
export interface AmountSettingData {
  itemId: string;
  planName: string;
  setting: FlowItemDetail | StockItemDetail;
}

// プラン定義
export interface PlanDefinition {
  id: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
}
