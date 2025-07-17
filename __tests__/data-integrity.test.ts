/**
 * データ整合性チェック機能のテスト
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */

import { describe, it, expect, beforeEach } from "vitest";
import { usePlanStore } from "@/lib/store/plan-store";

// テスト用のストア状態をリセットする関数
const resetStore = () => {
  usePlanStore.setState({
    plans: {
      給与: {
        availablePlans: ["デフォルトプラン"],
        activePlan: "デフォルトプラン",
      },
      生活費: {
        availablePlans: ["デフォルトプラン"],
        activePlan: "デフォルトプラン",
      },
    },
    incomes: {
      給与: {
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
      生活費: {
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
    lastError: null,
  });
};

describe("データ整合性チェック機能テスト", () => {
  beforeEach(() => {
    resetStore();
  });

  describe("基本的なデータ整合性チェック", () => {
    it("正常なデータ状態では整合性チェックが成功する", () => {
      const store = usePlanStore.getState();

      const validationResult = store.validatePlanData();
      const consistencyResult = store.checkDataConsistency();
      const referenceResult = store.validatePlanReferences();

      expect(validationResult.isValid).toBe(true);
      expect(validationResult.errors).toHaveLength(0);
      expect(consistencyResult.isConsistent).toBe(true);
      expect(consistencyResult.issues).toHaveLength(0);
      expect(referenceResult.isValid).toBe(true);
      expect(referenceResult.errors).toHaveLength(0);

      console.log("✅ 基本的なデータ整合性チェック - 成功");
    });
  });

  describe("プラン参照の整合性チェック", () => {
    it("無効なアクティブプランを検出する", () => {
      // 無効なアクティブプランを設定
      usePlanStore.setState((state) => ({
        ...state,
        plans: {
          ...state.plans,
          給与: {
            availablePlans: ["デフォルトプラン"],
            activePlan: "存在しないプラン", // 無効なプラン
          },
        },
      }));

      const store = usePlanStore.getState();
      const validationResult = store.validatePlanData();

      expect(validationResult.isValid).toBe(false);
      expect(validationResult.errors).toHaveLength(1);
      expect(validationResult.errors[0].type).toBe("orphan_reference");
      expect(validationResult.errors[0].itemName).toBe("給与");
      expect(validationResult.errors[0].planName).toBe("存在しないプラン");

      console.log("✅ 無効なアクティブプラン検出 - 成功");
    });

    it("重複プラン名を検出する", () => {
      // 重複プラン名を設定
      usePlanStore.setState((state) => ({
        ...state,
        plans: {
          ...state.plans,
          給与: {
            availablePlans: ["デフォルトプラン", "楽観プラン", "楽観プラン"], // 重複
            activePlan: "デフォルトプラン",
          },
        },
      }));

      const store = usePlanStore.getState();
      const validationResult = store.validatePlanData();

      expect(validationResult.isValid).toBe(false);
      expect(
        validationResult.errors.some((e) => e.type === "duplicate_plan")
      ).toBe(true);

      console.log("✅ 重複プラン名検出 - 成功");
    });
  });

  describe("データ一貫性チェック", () => {
    it("孤立したプラン定義を検出する", () => {
      // 実際の項目データが存在しないプラン定義を追加
      usePlanStore.setState((state) => ({
        ...state,
        plans: {
          ...state.plans,
          存在しない項目: {
            availablePlans: ["デフォルトプラン"],
            activePlan: "デフォルトプラン",
          },
        },
      }));

      const store = usePlanStore.getState();
      const consistencyResult = store.checkDataConsistency();

      expect(consistencyResult.isConsistent).toBe(false);
      expect(
        consistencyResult.issues.some((i) => i.type === "orphan_reference")
      ).toBe(true);
      expect(consistencyResult.summary.orphanReferences).toBeGreaterThan(0);

      console.log("✅ 孤立したプラン定義検出 - 成功");
    });

    it("プラン定義が存在しない項目を検出する", () => {
      // プラン定義なしで項目データを追加
      usePlanStore.setState((state) => ({
        ...state,
        incomes: {
          ...state.incomes,
          プラン定義なし項目: {
            type: "flow",
            settings: {
              デフォルトプラン: {
                startYear: 2024,
                amount: 100000,
                frequency: "monthly",
                growthRate: 0,
                yearlyChange: undefined,
              },
            },
          },
        },
      }));

      const store = usePlanStore.getState();
      const consistencyResult = store.checkDataConsistency();

      expect(consistencyResult.isConsistent).toBe(false);
      expect(
        consistencyResult.issues.some((i) => i.type === "missing_plan")
      ).toBe(true);

      console.log("✅ プラン定義なし項目検出 - 成功");
    });
  });

  describe("自動修復機能", () => {
    it("修復可能な問題を自動修復する", () => {
      // 無効なアクティブプランを設定
      usePlanStore.setState((state) => ({
        ...state,
        plans: {
          ...state.plans,
          給与: {
            availablePlans: ["デフォルトプラン", "楽観プラン"],
            activePlan: "存在しないプラン", // 無効なプラン
          },
        },
      }));

      const store = usePlanStore.getState();

      // 修復前の状態確認
      const beforeFix = store.validatePlanData();
      expect(beforeFix.isValid).toBe(false);

      // 自動修復実行
      const fixResult = store.fixDataIntegrityIssues(true);
      expect(fixResult.success).toBe(true);
      expect(fixResult.fixedIssues).toBeGreaterThan(0);

      // 修復後の状態確認
      const afterFix = store.validatePlanData();
      expect(afterFix.isValid).toBe(true);

      // アクティブプランがデフォルトプランに修復されていることを確認
      const updatedStore = usePlanStore.getState();
      expect(updatedStore.plans["給与"].activePlan).toBe("デフォルトプラン");

      console.log("✅ 自動修復機能 - 成功");
    });

    it("修復不可能な問題は残る", () => {
      // 修復不可能な問題を作成（無効なデータタイプ）
      usePlanStore.setState((state) => ({
        ...state,
        incomes: {
          ...state.incomes,
          無効項目: {
            type: "invalid_type" as any, // 無効なタイプ
            settings: {
              デフォルトプラン: {
                startYear: 2024,
                amount: 100000,
                frequency: "monthly",
                growthRate: 0,
                yearlyChange: undefined,
              },
            },
          },
        },
        plans: {
          ...state.plans,
          無効項目: {
            availablePlans: ["デフォルトプラン"],
            activePlan: "デフォルトプラン",
          },
        },
      }));

      const store = usePlanStore.getState();
      const fixResult = store.fixDataIntegrityIssues(true);

      // 修復不可能な問題が残っていることを確認
      expect(fixResult.remainingIssues.length).toBeGreaterThan(0);
      expect(fixResult.remainingIssues.some((i) => !i.fixable)).toBe(true);

      console.log("✅ 修復不可能な問題の検出 - 成功");
    });
  });

  describe("エラー状態管理", () => {
    it("エラー状態が正しく管理される", () => {
      const store = usePlanStore.getState();

      // 初期状態ではエラーなし
      expect(store.lastError).toBeNull();

      // 無効な操作でエラーが設定される
      const result = store.addItemPlan("存在しない項目", "テストプラン");
      expect(result.success).toBe(false);

      const updatedStore = usePlanStore.getState();
      expect(updatedStore.lastError).not.toBeNull();

      // エラーをクリア
      updatedStore.clearError();
      const clearedStore = usePlanStore.getState();
      expect(clearedStore.lastError).toBeNull();

      console.log("✅ エラー状態管理 - 成功");
    });
  });
});
