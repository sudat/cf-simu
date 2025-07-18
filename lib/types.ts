// フロー項目（収入・支出）の設定
export interface FlowItemDetail {
  startYear: number; // 開始年度
  endYear?: number; // 終了年度 (任意)
  amount: number; // 金額
  frequency: "monthly" | "yearly"; // 頻度
  growthRate: number; // 年率増減 (%)
  yearlyChange?: number; // 年額増減（固定額の増減）
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

// 金額設定時の情報（既存形式）
export interface AmountSettingData {
  itemId: string;
  planName: string;
  setting: FlowItemDetail | StockItemDetail;
}

// 統合金額設定フォームデータ（新形式）
export interface AmountSettingFormData {
  startYear: number; // 年度(開始)
  endYear?: number; // 年度(終了) - 空欄可
  baseAmount: number; // ベース金額 - 必須
  changeAmount?: number; // 増減金額 - 空欄可
  changeRate?: number; // 増減率(%) - 空欄可、整数のみ
  frequency: "yearly" | "monthly"; // 年額/月額
}

// バリデーションエラーの型定義
export interface ValidationErrors {
  startYear?: string;
  endYear?: string;
  baseAmount?: string;
  changeAmount?: string;
  changeRate?: string;
  general?: string;
}

// プラン定義（旧形式 - 後方互換性のため保持）
export interface PlanDefinition {
  id: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
}

// 新しいプラン定義（項目別管理）
export interface ItemPlanDefinition {
  id: string;
  name: string;
  isDefault: boolean;
  itemName: string; // 所属項目名
}

// 新しいプラン状態（項目別管理）
export interface NewPlanState {
  plans: {
    // key: 項目名 (e.g., '給与')
    [itemName: string]: {
      itemPlans: ItemPlanDefinition[]; // 項目別プラン定義
      activePlan: string; // アクティブプラン名
    };
  };
  incomes: CategoryItems; // 収入項目
  expenses: CategoryItems; // 支出項目
  assets: CategoryItems; // 資産項目
  debts: CategoryItems; // 負債項目
}

// 移行エラーの重要度レベル
export type MigrationErrorLevel = 'warning' | 'error' | 'fatal';

// 移行エラーの詳細情報
export interface MigrationErrorDetail {
  level: MigrationErrorLevel;
  code: string;
  message: string;
  userMessage: string;
  timestamp: number;
  context?: Record<string, unknown>;
  recoverable: boolean;
}

// データ移行のためのユーティリティ型
export interface MigrationResult {
  success: boolean;
  migratedData?: PlanState;
  errors?: string[];
  migrationErrors?: MigrationErrorDetail[];
}
