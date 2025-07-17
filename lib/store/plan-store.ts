import { create } from "zustand";
import { persist } from "zustand/middleware";
import { 
  PlanState, 
  AddItemData, 
  AmountSettingFormData, 
  FlowItemDetail, 
  StockItemDetail,
  ItemPlanDefinition
} from "../types";

// データ整合性チェック用の型定義
export interface ValidationError {
  type: 'missing_plan' | 'orphan_reference' | 'invalid_data' | 'duplicate_plan' | 'inconsistent_data' | 'migration_error';
  message: string;
  itemName?: string;
  planName?: string;
  category?: string;
  fixable: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export interface ConsistencyCheckResult {
  isConsistent: boolean;
  issues: ValidationError[];
  summary: {
    totalItems: number;
    totalPlans: number;
    orphanReferences: number;
    duplicatePlans: number;
    invalidData: number;
  };
}



// データ整合性チェック機能
// KISS原則: シンプルな検証ロジック
function validatePlanData(state: PlanState): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  // プラン参照の整合性チェック
  Object.entries(state.plans).forEach(([itemName, planConfig]) => {
    // アクティブプランが利用可能プランに含まれているかチェック
    if (!planConfig.availablePlans.includes(planConfig.activePlan)) {
      errors.push({
        type: 'orphan_reference',
        message: `項目"${itemName}"のアクティブプラン"${planConfig.activePlan}"が利用可能プランに含まれていません`,
        itemName,
        planName: planConfig.activePlan,
        fixable: true
      });
    }
    
    // 重複プラン名チェック
    const planNames = new Set();
    planConfig.availablePlans.forEach(planName => {
      if (planNames.has(planName)) {
        errors.push({
          type: 'duplicate_plan',
          message: `項目"${itemName}"に重複するプラン名"${planName}"があります`,
          itemName,
          planName,
          fixable: true
        });
      }
      planNames.add(planName);
    });
    
    // デフォルトプランの存在チェック
    if (!planConfig.availablePlans.includes('デフォルトプラン')) {
      warnings.push({
        type: 'missing_plan',
        message: `項目"${itemName}"にデフォルトプランがありません`,
        itemName,
        planName: 'デフォルトプラン',
        fixable: true
      });
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// データ一貫性チェック
function checkDataConsistency(state: PlanState): ConsistencyCheckResult {
  const issues: ValidationError[] = [];
  let orphanReferences = 0;
  const duplicatePlans = 0;
  let invalidData = 0;
  
  const allItemNames = new Set([
    ...Object.keys(state.incomes),
    ...Object.keys(state.expenses),
    ...Object.keys(state.assets),
    ...Object.keys(state.debts)
  ]);
  
  // plansに存在するが、実際の項目データが存在しない項目をチェック
  Object.keys(state.plans).forEach(itemName => {
    if (!allItemNames.has(itemName)) {
      issues.push({
        type: 'orphan_reference',
        message: `プラン定義に存在する項目"${itemName}"の実際のデータが見つかりません`,
        itemName,
        fixable: true
      });
      orphanReferences++;
    }
  });
  
  // 各カテゴリの項目データをチェック
  const categories: Array<{key: keyof PlanState, name: string}> = [
    {key: 'incomes', name: 'income'},
    {key: 'expenses', name: 'expense'},
    {key: 'assets', name: 'asset'},
    {key: 'debts', name: 'debt'}
  ];
  
  categories.forEach(({key, name}) => {
    Object.entries(state[key]).forEach(([itemName, itemData]) => {
      // プラン定義が存在しない項目をチェック
      if (!state.plans[itemName]) {
        issues.push({
          type: 'missing_plan',
          message: `項目"${itemName}"のプラン定義がありません`,
          itemName,
          category: name,
          fixable: true
        });
        invalidData++;
      } else {
        // 項目の設定データとプラン定義の一貫性をチェック
        const planConfig = state.plans[itemName];
        Object.keys(itemData.settings).forEach(planName => {
          if (!planConfig.availablePlans.includes(planName)) {
            issues.push({
              type: 'inconsistent_data',
              message: `項目"${itemName}"の設定に存在するプラン"${planName}"がプラン定義にありません`,
              itemName,
              planName,
              category: name,
              fixable: true
            });
            orphanReferences++;
          }
        });
      }
      
      // データ形式チェック
      if (!itemData.type || !['flow', 'stock'].includes(itemData.type)) {
        issues.push({
          type: 'invalid_data',
          message: `項目"${itemName}"のタイプが無効です`,
          itemName,
          category: name,
          fixable: false
        });
        invalidData++;
      }
    });
  });
  
  return {
    isConsistent: issues.length === 0,
    issues,
    summary: {
      totalItems: allItemNames.size,
      totalPlans: Object.keys(state.plans).length,
      orphanReferences,
      duplicatePlans,
      invalidData
    }
  };
}

// アクティブプラン参照の有効性チェック
function validatePlanReferences(state: PlanState): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  Object.entries(state.plans).forEach(([itemName, planConfig]) => {
    // アクティブプランの有効性チェック
    if (!planConfig.availablePlans.includes(planConfig.activePlan)) {
      errors.push({
        type: 'orphan_reference',
        message: `項目"${itemName}"のアクティブプラン"${planConfig.activePlan}"が無効です`,
        itemName,
        planName: planConfig.activePlan,
        fixable: true
      });
    }
    
    // 空のプラン配列チェック
    if (planConfig.availablePlans.length === 0) {
      errors.push({
        type: 'invalid_data',
        message: `項目"${itemName}"に利用可能なプランがありません`,
        itemName,
        fixable: true
      });
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// 初期データ（テスト用項目を含む）
const initialState: PlanState = {
  plans: {
    "給与": {
      availablePlans: ["デフォルトプラン"],
      activePlan: "デフォルトプラン",
    },
    "生活費": {
      availablePlans: ["デフォルトプラン"],
      activePlan: "デフォルトプラン",
    },
  },
  incomes: {
    "給与": {
      type: "flow",
      settings: {
        デフォルトプラン: {
          startYear: 2024,
          amount: 500000,
          frequency: "monthly",
          growthRate: 3,
          yearlyChange: undefined,
        },
      },
    },
  },
  expenses: {
    "生活費": {
      type: "flow",
      settings: {
        デフォルトプラン: {
          startYear: 2024,
          amount: 300000,
          frequency: "monthly",
          growthRate: 2,
          yearlyChange: undefined,
        },
      },
    },
  },
  assets: {},
  debts: {},
};

// グローバルプラン管理は削除済み - 項目別プラン管理に移行

export interface PlanStore extends PlanState {
  addItem: (data: AddItemData) => void;
  // 金額設定保存
  saveAmountSetting: (
    itemId: string,
    planName: string,
    data: AmountSettingFormData
  ) => { success: boolean; error?: string };
  // 項目別アクティブプラン設定
  setItemActivePlan: (itemName: string, planName: string) => { success: boolean; error?: string };

  // 新構造での項目別プラン管理
  getItemPlans: (itemName: string) => ItemPlanDefinition[];
  getItemActivePlan: (itemName: string) => ItemPlanDefinition;
  getAvailablePlans: (itemName: string) => ItemPlanDefinition[];
  planExists: (itemName: string, planName: string) => boolean;
  addItemPlan: (itemName: string, planName: string) => { success: boolean; error?: string };
  deleteItemPlan: (itemName: string, planId: string) => { success: boolean; error?: string };
  renameItemPlan: (itemName: string, planId: string, newName: string) => { success: boolean; error?: string };
  

  
  // データ整合性チェック機能
  validatePlanData: () => ValidationResult;
  checkDataConsistency: () => ConsistencyCheckResult;
  validatePlanReferences: () => ValidationResult;
  fixDataIntegrityIssues: (autoFix: boolean) => { success: boolean; fixedIssues: number; remainingIssues: ValidationError[] };
  
  // エラー状態管理
  lastError: string | null;
  clearError: () => void;
  // ...今後: removeItem, updateItem など
}

export const usePlanStore = create<PlanStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      lastError: null,

  addItem: (data) => {
    const { name, category, type } = data;
    // plans, incomes, expenses, assets, debts いずれかに追加
    set((state: PlanState) => {
      const key =
        category === "income"
          ? "incomes"
          : category === "expense"
            ? "expenses"
            : category === "asset"
              ? "assets"
              : "debts";
      
      // 既に同じ項目が存在する場合はスキップ
      if (state[key][name]) {
        return state;
      }
      
      return {
        ...state,
        [key]: {
          ...state[key],
          [name]: {
            type,
            settings: {
              デフォルトプラン:
                type === "flow"
                  ? {
                    startYear: 2024,
                    amount: 0,
                    frequency: "monthly",
                    growthRate: 0,
                    yearlyChange: undefined,
                  }
                  : {
                    baseYear: 2024,
                    baseAmount: 0,
                    rate: 0,
                    yearlyChange: 0,
                  },
            },
          },
        },
        plans: {
          ...state.plans,
          [name]: {
            availablePlans: ["デフォルトプラン"],
            activePlan: "デフォルトプラン",
          },
        },
      };
    });
  },

  // 金額設定保存
  saveAmountSetting: (
    itemId: string,
    planName: string,
    data: AmountSettingFormData
  ) => {
    try {
      // itemIdから categoryとitemName を抽出: "category-name" 形式
      const parts = itemId.split('-');
      if (parts.length < 2) {
        const error = "Invalid itemId format";
        set((state) => ({ ...state, lastError: error }));
        return { success: false, error };
      }

      const category = parts[0] as 'income' | 'expense' | 'asset' | 'debt';
      const itemName = parts.slice(1).join('-');

      // itemTypeを判定（カテゴリから推測）
      const itemType = (category === 'income' || category === 'expense') ? 'flow' : 'stock';

      // 統合フォームデータを従来型に変換
      let setting: FlowItemDetail | StockItemDetail;

      console.log('Saving amount setting:', {
        itemId,
        planName,
        category,
        itemName,
        itemType,
        originalData: data
      });

      if (itemType === 'flow') {
        setting = {
          startYear: data.startYear,
          endYear: data.endYear,
          amount: data.baseAmount || 0,
          frequency: data.frequency,
          growthRate: data.changeRate || 0,
          yearlyChange: data.changeAmount || undefined,
        } as FlowItemDetail;
      } else {
        setting = {
          baseYear: data.startYear,
          baseAmount: data.baseAmount || 0,
          rate: data.changeRate || 0,
          yearlyChange: data.changeAmount || 0,
        } as StockItemDetail;
      }

      console.log('Converted setting:', setting);

      // 状態を更新
      set((state) => {
        const categoryKey = category === 'income' ? 'incomes' :
          category === 'expense' ? 'expenses' :
            category === 'asset' ? 'assets' : 'debts';

        const categoryData = state[categoryKey];
        if (!categoryData[itemName]) {
          const error = `Item ${itemName} not found in ${category}`;
          return { ...state, lastError: error };
        }

        const newState = {
          ...state,
          [categoryKey]: {
            ...categoryData,
            [itemName]: {
              ...categoryData[itemName],
              settings: {
                ...categoryData[itemName].settings,
                [planName]: setting,
              },
            },
          },
          lastError: null,
        };

        console.log('Updated state:', {
          categoryKey,
          itemName,
          planName,
          savedSetting: newState[categoryKey][itemName].settings[planName],
          allPlansForItem: newState[categoryKey][itemName].settings,
          itemPlansState: newState.plans[itemName],
          設定保存成功: `プラン"${planName}"の設定を${itemName}項目に保存しました`
        });

        return newState;
      });

      return { success: true };
    } catch {
      const errorMessage = "金額設定の保存に失敗しました";
      set((state) => ({ ...state, lastError: errorMessage }));
      return { success: false, error: errorMessage };
    }
  },

  // 項目別アクティブプラン設定
  setItemActivePlan: (itemName: string, planName: string) => {
    try {
      const state = get();
      
      // 項目が存在するかチェック
      if (!state.plans[itemName]) {
        const error = "指定された項目が見つかりません";
        set((state) => ({ ...state, lastError: error }));
        return { success: false, error };
      }
      
      // プランが利用可能かチェック
      if (!state.plans[itemName].availablePlans.includes(planName)) {
        const error = "指定されたプランは利用できません";
        set((state) => ({ ...state, lastError: error }));
        return { success: false, error };
      }
      
      // アクティブプランを設定し、必要に応じてデフォルト設定を作成
      set((state) => {
        const newState = {
          ...state,
          plans: {
            ...state.plans,
            [itemName]: {
              ...state.plans[itemName],
              activePlan: planName,
            },
          },
          lastError: null,
        };

        // 該当項目がどのカテゴリに属するかを判定
        let categoryKey: 'incomes' | 'expenses' | 'assets' | 'debts' | null = null;
        if (state.incomes[itemName]) categoryKey = 'incomes';
        else if (state.expenses[itemName]) categoryKey = 'expenses';
        else if (state.assets[itemName]) categoryKey = 'assets';
        else if (state.debts[itemName]) categoryKey = 'debts';

        // カテゴリが見つかった場合のみ、設定が存在しなければデフォルト設定を作成
        if (categoryKey && !state[categoryKey][itemName].settings[planName]) {
          const itemType = state[categoryKey][itemName].type;
          let defaultSetting: FlowItemDetail | StockItemDetail;

          if (itemType === 'flow') {
            // デフォルトプランの設定をコピーして新しいプランのデフォルト設定を作成
            const defaultPlanSetting = state[categoryKey][itemName].settings['デフォルトプラン'];
            defaultSetting = defaultPlanSetting ? { ...defaultPlanSetting } : {
              startYear: 2024,
              amount: 0,
              frequency: "monthly",
              growthRate: 0,
              yearlyChange: undefined,
            };
          } else {
            // ストック項目の場合
            const defaultPlanSetting = state[categoryKey][itemName].settings['デフォルトプラン'];
            defaultSetting = defaultPlanSetting ? { ...defaultPlanSetting } : {
              baseYear: 2024,
              baseAmount: 0,
              rate: 0,
              yearlyChange: 0,
            };
          }

          newState[categoryKey] = {
            ...newState[categoryKey],
            [itemName]: {
              ...newState[categoryKey][itemName],
              settings: {
                ...newState[categoryKey][itemName].settings,
                [planName]: defaultSetting,
              },
            },
          };

          if (process.env.NODE_ENV === 'development') {
            console.log(`[setItemActivePlan] ${itemName}: プラン"${planName}"のデフォルト設定を作成しました`, defaultSetting);
          }
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`[setItemActivePlan] ${itemName}: アクティブプラン"${planName}"に設定しました`, {
            利用可能プラン: state.plans[itemName].availablePlans,
            新しいアクティブプラン: planName,
            設定存在: categoryKey ? !!newState[categoryKey][itemName].settings[planName] : false,
          });
        }
        
        return newState;
      });
      
      return { success: true };
    } catch {
      const errorMessage = "項目別プランの設定に失敗しました";
      set((state) => ({ ...state, lastError: errorMessage }));
      return { success: false, error: errorMessage };
    }
  },

  // エラー状態クリア
  clearError: () => {
    set((state) => ({ ...state, lastError: null }));
  },

  // 新構造での項目別プラン管理
  getItemPlans: (itemName: string) => {
    try {
      const state = get();
      
      if (!state.plans[itemName]) {
        // 項目が存在しない場合はデフォルトプランのみを返す
        return [{
          id: 'default',
          name: 'デフォルトプラン',
          isDefault: true,
          itemName: itemName,
        }];
      }

      // 利用可能プランからItemPlanDefinitionを生成
      const itemPlans: ItemPlanDefinition[] = state.plans[itemName].availablePlans.map((planName, index) => ({
        id: planName === 'デフォルトプラン' ? 'default' : `${itemName}-plan-${index}`,
        name: planName,
        isDefault: planName === 'デフォルトプラン',
        itemName: itemName,
      }));

      return itemPlans;
    } catch (error) {
      const errorMessage = `項目プラン取得中にエラーが発生しました: ${error}`;
      set((state) => ({ ...state, lastError: errorMessage }));
      return [{
        id: 'default',
        name: 'デフォルトプラン',
        isDefault: true,
        itemName: itemName,
      }];
    }
  },

  getItemActivePlan: (itemName: string) => {
    try {
      const state = get();
      
      if (!state.plans[itemName]) {
        // 項目が存在しない場合はデフォルトプランを返す
        return {
          id: 'default',
          name: 'デフォルトプラン',
          isDefault: true,
          itemName: itemName,
        };
      }

      const activePlanName = state.plans[itemName].activePlan;
      const planIndex = state.plans[itemName].availablePlans.indexOf(activePlanName);

      return {
        id: activePlanName === 'デフォルトプラン' ? 'default' : `${itemName}-plan-${planIndex}`,
        name: activePlanName,
        isDefault: activePlanName === 'デフォルトプラン',
        itemName: itemName,
      };
    } catch (error) {
      const errorMessage = `アクティブプラン取得中にエラーが発生しました: ${error}`;
      set((state) => ({ ...state, lastError: errorMessage }));
      return {
        id: 'default',
        name: 'デフォルトプラン',
        isDefault: true,
        itemName: itemName,
      };
    }
  },

  addItemPlan: (itemName: string, planName: string) => {
    try {
      // 必須パラメータの検証（KISS原則：シンプルで明確）
      if (!itemName || typeof itemName !== 'string' || !itemName.trim()) {
        const error = "項目名は必須です";
        set((state) => ({ ...state, lastError: error }));
        return { success: false, error };
      }

      // バリデーション
      const trimmedName = planName.trim();
      if (!trimmedName) {
        const error = "プラン名を入力してください";
        set((state) => ({ ...state, lastError: error }));
        return { success: false, error };
      }

      if (trimmedName.length > 50) {
        const error = "プラン名は50文字以内で入力してください";
        set((state) => ({ ...state, lastError: error }));
        return { success: false, error };
      }

      const state = get();
      const trimmedItemName = itemName.trim();
      
      // 項目が存在するかチェック
      if (!state.plans[trimmedItemName]) {
        const error = "指定された項目が見つかりません";
        set((state) => ({ ...state, lastError: error }));
        return { success: false, error };
      }

      // 同じ名前のプランが既に存在するかチェック
      const currentPlans = state.plans[trimmedItemName].availablePlans;
      const planExists = currentPlans.includes(trimmedName);
      
      if (planExists) {
        const error = "同じ名前のプランが既に存在します";
        set((state) => ({ ...state, lastError: error }));
        return { success: false, error };
      }

      // プランを追加
      set((state) => {
        const newState = {
          ...state,
          plans: {
            ...state.plans,
            [itemName.trim()]: {
              ...state.plans[itemName.trim()],
              availablePlans: [...state.plans[itemName.trim()].availablePlans, trimmedName],
            },
          },
          lastError: null,
        };

        // 実際の設定データも自動生成（setItemActivePlanのロジックを再利用）
        let categoryKey: 'incomes' | 'expenses' | 'assets' | 'debts' | null = null;
        if (state.incomes[itemName.trim()]) categoryKey = 'incomes';
        else if (state.expenses[itemName.trim()]) categoryKey = 'expenses';
        else if (state.assets[itemName.trim()]) categoryKey = 'assets';
        else if (state.debts[itemName.trim()]) categoryKey = 'debts';

        // カテゴリが見つかった場合、新プランのデフォルト設定を作成
        if (categoryKey) {
          const itemType = state[categoryKey][itemName.trim()].type;
          let defaultSetting: FlowItemDetail | StockItemDetail;

          if (itemType === 'flow') {
            // デフォルトプランの設定をコピーして新しいプランのデフォルト設定を作成
            const defaultPlanSetting = state[categoryKey][itemName.trim()].settings['デフォルトプラン'];
            defaultSetting = defaultPlanSetting ? { ...defaultPlanSetting } : {
              startYear: 2024,
              amount: 0,
              frequency: "monthly",
              growthRate: 0,
              yearlyChange: undefined,
            };
          } else {
            // ストック項目の場合
            const defaultPlanSetting = state[categoryKey][itemName.trim()].settings['デフォルトプラン'];
            defaultSetting = defaultPlanSetting ? { ...defaultPlanSetting } : {
              baseYear: 2024,
              baseAmount: 0,
              rate: 0,
              yearlyChange: 0,
            };
          }

          newState[categoryKey] = {
            ...newState[categoryKey],
            [itemName.trim()]: {
              ...newState[categoryKey][itemName.trim()],
              settings: {
                ...newState[categoryKey][itemName.trim()].settings,
                [trimmedName]: defaultSetting,
              },
            },
          };

          if (process.env.NODE_ENV === 'development') {
            console.log(`[addItemPlan] ${itemName.trim()}: プラン"${trimmedName}"の設定データを作成しました`, defaultSetting);
          }
        }

        return newState;
      });

      if (process.env.NODE_ENV === 'development') {
        console.log(`[addItemPlan] 項目"${itemName.trim()}"にプラン"${trimmedName}"を追加しました`);
      }

      return { success: true };
    } catch (error) {
      const errorMessage = `項目プラン追加中にエラーが発生しました: ${error}`;
      set((state) => ({ ...state, lastError: errorMessage }));
      return { success: false, error: errorMessage };
    }
  },

  deleteItemPlan: (itemName: string, planId: string) => {
    try {
      const state = get();
      
      // 項目が存在するかチェック
      if (!state.plans[itemName]) {
        const error = "指定された項目が見つかりません";
        set((state) => ({ ...state, lastError: error }));
        return { success: false, error };
      }

      // プラン名を取得（planIdは実際にはプラン名として使用）
      const planName = planId;
      
      // プランが存在するかチェック
      if (!state.plans[itemName].availablePlans.includes(planName)) {
        const error = "削除対象のプランが見つかりません";
        set((state) => ({ ...state, lastError: error }));
        return { success: false, error };
      }

      // デフォルトプランの削除を防止（強化版）
      if (planName === 'デフォルトプラン' || planId === 'default') {
        const error = "デフォルトプランは削除できません。デフォルトプランはすべての項目で必須です。";
        set((state) => ({ ...state, lastError: error }));
        return { success: false, error };
      }

      // プランを削除
      set((state) => {
        const updatedAvailablePlans = state.plans[itemName].availablePlans.filter(p => p !== planName);
        
        let newActivePlan = state.plans[itemName].activePlan;
        
        // 削除されたプランがアクティブだった場合、デフォルトプランをアクティブにする
        if (planName === state.plans[itemName].activePlan) {
          newActivePlan = 'デフォルトプラン';
        }

        return {
          ...state,
          plans: {
            ...state.plans,
            [itemName]: {
              ...state.plans[itemName],
              availablePlans: updatedAvailablePlans,
              activePlan: newActivePlan,
            },
          },
          lastError: null,
        };
      });

      if (process.env.NODE_ENV === 'development') {
        console.log(`[deleteItemPlan] 項目"${itemName}"からプラン"${planName}"を削除しました`);
      }

      return { success: true };
    } catch (error) {
      const errorMessage = `項目プラン削除中にエラーが発生しました: ${error}`;
      set((state) => ({ ...state, lastError: errorMessage }));
      return { success: false, error: errorMessage };
    }
  },

  renameItemPlan: (itemName: string, planId: string, newName: string) => {
    try {
      // バリデーション
      const trimmedNewName = newName.trim();
      if (!trimmedNewName) {
        const error = "新しいプラン名を入力してください";
        set((state) => ({ ...state, lastError: error }));
        return { success: false, error };
      }

      if (trimmedNewName.length > 50) {
        const error = "プラン名は50文字以内で入力してください";
        set((state) => ({ ...state, lastError: error }));
        return { success: false, error };
      }

      const state = get();
      
      // 項目が存在するかチェック
      if (!state.plans[itemName]) {
        const error = "指定された項目が見つかりません";
        set((state) => ({ ...state, lastError: error }));
        return { success: false, error };
      }

      // プラン名を取得（planIdは実際にはプラン名として使用）
      const oldPlanName = planId;
      
      // 変更対象のプランが存在するかチェック
      if (!state.plans[itemName].availablePlans.includes(oldPlanName)) {
        const error = "変更対象のプランが見つかりません";
        set((state) => ({ ...state, lastError: error }));
        return { success: false, error };
      }

      // デフォルトプランの名前変更を防止
      if (oldPlanName === 'デフォルトプラン') {
        const error = "デフォルトプランの名前は変更できません";
        set((state) => ({ ...state, lastError: error }));
        return { success: false, error };
      }

      // 新しい名前が既に存在するかチェック
      if (state.plans[itemName].availablePlans.includes(trimmedNewName)) {
        const error = "同じ名前のプランが既に存在します";
        set((state) => ({ ...state, lastError: error }));
        return { success: false, error };
      }

      // プラン名を変更
      set((state) => {
        // availablePlans配列内のプラン名を更新
        const updatedAvailablePlans = state.plans[itemName].availablePlans.map(planName => 
          planName === oldPlanName ? trimmedNewName : planName
        );
        
        // アクティブプランが変更対象だった場合も更新
        const newActivePlan = state.plans[itemName].activePlan === oldPlanName 
          ? trimmedNewName 
          : state.plans[itemName].activePlan;

        // 該当項目がどのカテゴリに属するかを判定して設定データも更新
        let categoryKey: 'incomes' | 'expenses' | 'assets' | 'debts' | null = null;
        if (state.incomes[itemName]) categoryKey = 'incomes';
        else if (state.expenses[itemName]) categoryKey = 'expenses';
        else if (state.assets[itemName]) categoryKey = 'assets';
        else if (state.debts[itemName]) categoryKey = 'debts';

        const newState = {
          ...state,
          plans: {
            ...state.plans,
            [itemName]: {
              ...state.plans[itemName],
              availablePlans: updatedAvailablePlans,
              activePlan: newActivePlan,
            },
          },
          lastError: null,
        };

        // カテゴリが見つかった場合、設定データのキーも更新
        if (categoryKey && state[categoryKey][itemName].settings[oldPlanName]) {
          const oldSetting = state[categoryKey][itemName].settings[oldPlanName];
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [oldPlanName]: _, ...otherSettings } = state[categoryKey][itemName].settings;
          
          newState[categoryKey] = {
            ...newState[categoryKey],
            [itemName]: {
              ...newState[categoryKey][itemName],
              settings: {
                ...otherSettings,
                [trimmedNewName]: oldSetting,
              },
            },
          };
        }

        return newState;
      });

      if (process.env.NODE_ENV === 'development') {
        console.log(`[renameItemPlan] 項目"${itemName}"のプラン"${oldPlanName}"を"${trimmedNewName}"に変更しました`);
      }

      return { success: true };
    } catch (error) {
      const errorMessage = `項目プラン名変更中にエラーが発生しました: ${error}`;
      set((state) => ({ ...state, lastError: errorMessage }));
      return { success: false, error: errorMessage };
    }
  },

  getAvailablePlans: (itemName: string) => {
    try {
      const state = get();
      
      // デフォルトプランは常に利用可能
      const defaultPlan: ItemPlanDefinition = {
        id: 'default',
        name: 'デフォルトプラン',
        isDefault: true,
        itemName: itemName,
      };

      // 項目が存在しない場合はデフォルトプランのみを返す
      if (!state.plans[itemName]) {
        return [defaultPlan];
      }

      // 項目固有のプランを取得（デフォルトプラン以外）
      const customPlans: ItemPlanDefinition[] = state.plans[itemName].availablePlans
        .filter(planName => planName !== 'デフォルトプラン')
        .map((planName, index) => ({
          id: `${itemName}-plan-${index + 1}`,
          name: planName,
          isDefault: false,
          itemName: itemName,
        }));

      // デフォルトプラン + 項目固有プランを返す
      return [defaultPlan, ...customPlans];
    } catch (error) {
      const errorMessage = `利用可能プラン取得中にエラーが発生しました: ${error}`;
      set((state) => ({ ...state, lastError: errorMessage }));
      
      // エラー時はデフォルトプランのみを返す
      return [{
        id: 'default',
        name: 'デフォルトプラン',
        isDefault: true,
        itemName: itemName,
      }];
    }
  },

  planExists: (itemName: string, planName: string) => {
    try {
      const state = get();
      
      // デフォルトプランは常に存在する
      if (planName === 'デフォルトプラン') {
        return true;
      }
      
      // 項目が存在しない場合はfalse
      if (!state.plans[itemName]) {
        return false;
      }
      
      // 項目内でプランが存在するかチェック
      return state.plans[itemName].availablePlans.includes(planName);
    } catch (error) {
      const errorMessage = `プラン存在チェック中にエラーが発生しました: ${error}`;
      set((state) => ({ ...state, lastError: errorMessage }));
      return false;
    }
  },



  // データ整合性チェック機能
  validatePlanData: () => {
    const state = get();
    return validatePlanData(state);
  },

  checkDataConsistency: () => {
    const state = get();
    return checkDataConsistency(state);
  },

  validatePlanReferences: () => {
    const state = get();
    return validatePlanReferences(state);
  },

  // 自動修復オプション付きデータ整合性修復
  fixDataIntegrityIssues: (autoFix: boolean) => {
    const state = get();
    const consistencyResult = checkDataConsistency(state);
    const planValidationResult = validatePlanData(state);
    const referenceValidationResult = validatePlanReferences(state);
    
    const allIssues = [
      ...consistencyResult.issues,
      ...planValidationResult.errors,
      ...referenceValidationResult.errors
    ];
    
    if (!autoFix) {
      return {
        success: false,
        fixedIssues: 0,
        remainingIssues: allIssues
      };
    }
    
    let fixedCount = 0;
    const remainingIssues: ValidationError[] = [];
    
    try {
      set((currentState) => {
        const newState = { ...currentState };
        
        // 修復可能な問題を自動修復
        allIssues.forEach(issue => {
          if (!issue.fixable) {
            remainingIssues.push(issue);
            return;
          }
          
          switch (issue.type) {
            case 'orphan_reference':
              if (issue.itemName && issue.planName) {
                // アクティブプランが無効な場合、デフォルトプランに設定
                if (newState.plans[issue.itemName]) {
                  newState.plans[issue.itemName].activePlan = 'デフォルトプラン';
                  fixedCount++;
                }
              }
              break;
            
            case 'missing_plan':
              if (issue.itemName) {
                // デフォルトプランが存在しない場合、追加
                if (!newState.plans[issue.itemName]) {
                  newState.plans[issue.itemName] = {
                    availablePlans: ['デフォルトプラン'],
                    activePlan: 'デフォルトプラン'
                  };
                } else if (!newState.plans[issue.itemName].availablePlans.includes('デフォルトプラン')) {
                  newState.plans[issue.itemName].availablePlans.push('デフォルトプラン');
                }
                fixedCount++;
              }
              break;
            
            case 'duplicate_plan':
              if (issue.itemName && issue.planName) {
                // 重複プランを削除（最初の1つを残す）
                const plans = newState.plans[issue.itemName].availablePlans;
                const firstIndex = plans.indexOf(issue.planName);
                newState.plans[issue.itemName].availablePlans = plans.filter((name, index) => 
                  name !== issue.planName || index === firstIndex
                );
                fixedCount++;
              }
              break;
            
            case 'inconsistent_data':
              if (issue.itemName && issue.planName) {
                // 設定データからプラン定義にないプランを削除
                const categories = ['incomes', 'expenses', 'assets', 'debts'] as const;
                categories.forEach(category => {
                  const categoryData = newState[category];
                  const itemData = categoryData[issue.itemName!];
                  if (itemData?.settings[issue.planName!]) {
                    delete itemData.settings[issue.planName!];
                  }
                });
                fixedCount++;
              }
              break;
            
            default:
              remainingIssues.push(issue);
          }
        });
        
        return {
          ...newState,
          lastError: null
        };
      });
      
      return {
        success: true,
        fixedIssues: fixedCount,
        remainingIssues
      };
    } catch (error) {
      const errorMessage = `データ整合性修復中にエラーが発生しました: ${error}`;
      set((state) => ({ ...state, lastError: errorMessage }));
      return {
        success: false,
        fixedIssues: 0,
        remainingIssues: allIssues
      };
    }
  },
    }),
    {
      name: 'plan-store', // localStorage key
      partialize: (state) => ({
        // 永続化対象から一時的なエラー状態は除外
        plans: state.plans,
        incomes: state.incomes,
        expenses: state.expenses,
        assets: state.assets,
        debts: state.debts,
      }),

    }
  )
);
