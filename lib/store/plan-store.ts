import { create } from "zustand";
import { PlanState, AddItemData, PlanDefinition } from "../types";

// 初期データ（空）
const initialState: PlanState = {
  plans: {},
  incomes: {},
  expenses: {},
  assets: {},
  debts: {},
};

// グローバルプラン管理
interface GlobalPlanState {
  globalPlans: PlanDefinition[];
}

const initialGlobalPlans: PlanDefinition[] = [
  {
    id: "default",
    name: "デフォルトプラン",
    isDefault: true,
    isActive: true,
  },
];

export interface PlanStore extends PlanState, GlobalPlanState {
  addItem: (data: AddItemData) => void;
  // グローバルプラン管理
  addPlan: (name: string) => { success: boolean; error?: string };
  deletePlan: (id: string) => { success: boolean; error?: string };
  renamePlan: (id: string, newName: string) => { success: boolean; error?: string };
  setActivePlan: (id: string) => { success: boolean; error?: string };
  getActivePlan: () => PlanDefinition | null;
  // エラー状態管理
  lastError: string | null;
  clearError: () => void;
  // ...今後: removeItem, updateItem など
}

export const usePlanStore = create<PlanStore>((set, get) => ({
  ...initialState,
  globalPlans: initialGlobalPlans,
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

  // 新規プラン追加
  addPlan: (name: string) => {
    try {
      // バリデーション
      const trimmedName = name.trim();
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
      const existingPlan = state.globalPlans.find(p => p.name === trimmedName);
      if (existingPlan) {
        const error = "同じ名前のプランが既に存在します";
        set((state) => ({ ...state, lastError: error }));
        return { success: false, error };
      }

      // プラン追加
      set((state) => ({
        ...state,
        globalPlans: [
          ...state.globalPlans,
          {
            id: `plan-${Date.now()}`,
            name: trimmedName,
            isDefault: false,
            isActive: false,
          },
        ],
        lastError: null,
      }));
      
      return { success: true };
    } catch (error) {
      const errorMessage = "プランの追加に失敗しました";
      set((state) => ({ ...state, lastError: errorMessage }));
      return { success: false, error: errorMessage };
    }
  },

  // プラン削除（デフォルトプラン以外）
  deletePlan: (id: string) => {
    try {
      const state = get();
      const plan = state.globalPlans.find((p) => p.id === id);
      
      if (!plan) {
        const error = "削除対象のプランが見つかりません";
        set((state) => ({ ...state, lastError: error }));
        return { success: false, error };
      }

      if (plan.isDefault) {
        const error = "デフォルトプランは削除できません";
        set((state) => ({ ...state, lastError: error }));
        return { success: false, error };
      }

      const newPlans = state.globalPlans.filter((p) => p.id !== id);
      
      // 削除されたプランがアクティブだった場合、デフォルトプランをアクティブにする
      if (plan.isActive) {
        const defaultPlan = newPlans.find((p) => p.isDefault);
        if (defaultPlan) {
          defaultPlan.isActive = true;
        }
      }

      set((state) => ({
        ...state,
        globalPlans: newPlans,
        lastError: null,
      }));
      
      return { success: true };
    } catch (error) {
      const errorMessage = "プランの削除に失敗しました";
      set((state) => ({ ...state, lastError: errorMessage }));
      return { success: false, error: errorMessage };
    }
  },

  // プラン名変更
  renamePlan: (id: string, newName: string) => {
    try {
      const state = get();
      const trimmedName = newName.trim();
      
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

      const targetPlan = state.globalPlans.find((p) => p.id === id);
      if (!targetPlan) {
        const error = "変更対象のプランが見つかりません";
        set((state) => ({ ...state, lastError: error }));
        return { success: false, error };
      }

      // 同じ名前のプランが既に存在するかチェック（自分以外）
      const existingPlan = state.globalPlans.find(p => p.name === trimmedName && p.id !== id);
      if (existingPlan) {
        const error = "同じ名前のプランが既に存在します";
        set((state) => ({ ...state, lastError: error }));
        return { success: false, error };
      }

      set((state) => ({
        ...state,
        globalPlans: state.globalPlans.map((plan) =>
          plan.id === id ? { ...plan, name: trimmedName } : plan
        ),
        lastError: null,
      }));
      
      return { success: true };
    } catch (error) {
      const errorMessage = "プラン名の変更に失敗しました";
      set((state) => ({ ...state, lastError: errorMessage }));
      return { success: false, error: errorMessage };
    }
  },

  // アクティブプラン設定（一意性制約）
  setActivePlan: (id: string) => {
    try {
      const state = get();
      const targetPlan = state.globalPlans.find((p) => p.id === id);
      
      if (!targetPlan) {
        const error = "指定されたプランが見つかりません";
        set((state) => ({ ...state, lastError: error }));
        return { success: false, error };
      }

      set((state) => ({
        ...state,
        globalPlans: state.globalPlans.map((plan) => ({
          ...plan,
          isActive: plan.id === id,
        })),
        lastError: null,
      }));
      
      return { success: true };
    } catch (error) {
      const errorMessage = "アクティブプランの設定に失敗しました";
      set((state) => ({ ...state, lastError: errorMessage }));
      return { success: false, error: errorMessage };
    }
  },

  // アクティブプラン取得
  getActivePlan: () => {
    const state = get();
    return state.globalPlans.find((plan) => plan.isActive) || null;
  },

  // エラー状態クリア
  clearError: () => {
    set((state) => ({ ...state, lastError: null }));
  },
}));
