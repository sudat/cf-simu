import { create } from "zustand";
import { PlanState, AddItemData } from "../types";

// 初期データ（空）
const initialState: PlanState = {
  plans: {},
  incomes: {},
  expenses: {},
  assets: {},
  debts: {},
};

export interface PlanStore extends PlanState {
  addItem: (data: AddItemData) => void;
  // ...今後: removeItem, updateItem など
}

export const usePlanStore = create<PlanStore>((set) => ({
  ...initialState,
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
}));
