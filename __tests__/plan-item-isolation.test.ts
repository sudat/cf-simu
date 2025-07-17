/**
 * プラン項目別独立管理の統合テスト
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */

import { describe, it, expect, beforeEach } from "vitest";
import { usePlanStore } from "@/lib/store/plan-store";

// テスト用のストア状態をリセットする関数
const resetStore = () => {
  const store = usePlanStore.getState();
  // ストアを初期状態にリセット
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

describe("プラン項目別独立管理 統合テスト", () => {
  beforeEach(() => {
    resetStore();
  });

  describe("Requirement 1.1: 項目別プラン独立性", () => {
    it("一つの項目でプランを作成しても他の項目に影響しない", () => {
      const store = usePlanStore.getState();

      // 給与項目に新しいプランを追加
      const result1 = store.addItemPlan("給与", "楽観プラン");
      expect(result1.success).toBe(true);

      // 給与項目のプランを確認
      const salaryPlans = store.getAvailablePlans("給与");
      expect(salaryPlans).toHaveLength(2);
      expect(salaryPlans.map((p) => p.name)).toContain("楽観プラン");

      // 生活費項目のプランを確認（影響を受けていないことを確認）
      const expensePlans = store.getAvailablePlans("生活費");
      expect(expensePlans).toHaveLength(1);
      expect(expensePlans.map((p) => p.name)).not.toContain("楽観プラン");
      expect(expensePlans[0].name).toBe("デフォルトプラン");

      console.log("✅ テスト1.1: 項目別プラン独立性 - 成功");
    });
  });

  describe("Requirement 1.2: 複数項目での同名プラン作成", () => {
    it("異なる項目で同じ名前のプランを作成できる", () => {
      const store = usePlanStore.getState();

      // 給与項目に「楽観プラン」を追加
      const result1 = store.addItemPlan("給与", "楽観プラン");
      expect(result1.success).toBe(true);

      // 生活費項目にも「楽観プラン」を追加（同名だが独立）
      const result2 = store.addItemPlan("生活費", "楽観プラン");
      expect(result2.success).toBe(true);

      // 両方の項目で楽観プランが利用可能であることを確認
      const salaryPlans = store.getAvailablePlans("給与");
      const expensePlans = store.getAvailablePlans("生活費");

      expect(salaryPlans.map((p) => p.name)).toContain("楽観プラン");
      expect(expensePlans.map((p) => p.name)).toContain("楽観プラン");

      // それぞれが独立したプランであることを確認（IDが異なる）
      const salaryOptimisticPlan = salaryPlans.find(
        (p) => p.name === "楽観プラン"
      );
      const expenseOptimisticPlan = expensePlans.find(
        (p) => p.name === "楽観プラン"
      );

      expect(salaryOptimisticPlan?.itemName).toBe("給与");
      expect(expenseOptimisticPlan?.itemName).toBe("生活費");
      expect(salaryOptimisticPlan?.id).not.toBe(expenseOptimisticPlan?.id);

      console.log("✅ テスト1.2: 複数項目での同名プラン作成 - 成功");
    });
  });

  describe("Requirement 1.3: プラン削除の独立性", () => {
    it("一つの項目からプランを削除しても他の項目の同名プランには影響しない", () => {
      const store = usePlanStore.getState();

      // 両方の項目に同名プランを追加
      store.addItemPlan("給与", "テストプラン");
      store.addItemPlan("生活費", "テストプラン");

      // 給与項目からテストプランを削除
      const deleteResult = store.deleteItemPlan("給与", "テストプラン");
      expect(deleteResult.success).toBe(true);

      // 給与項目からはテストプランが削除されていることを確認
      const salaryPlans = store.getAvailablePlans("給与");
      expect(salaryPlans.map((p) => p.name)).not.toContain("テストプラン");

      // 生活費項目にはテストプランが残っていることを確認
      const expensePlans = store.getAvailablePlans("生活費");
      expect(expensePlans.map((p) => p.name)).toContain("テストプラン");

      console.log("✅ テスト1.3: プラン削除の独立性 - 成功");
    });
  });

  describe("Requirement 1.4: デフォルトプランの特別扱い", () => {
    it("デフォルトプランは削除できない", () => {
      const store = usePlanStore.getState();

      // デフォルトプランの削除を試行
      const deleteResult = store.deleteItemPlan("給与", "デフォルトプラン");
      expect(deleteResult.success).toBe(false);
      expect(deleteResult.error).toContain("デフォルトプランは削除できません");

      // デフォルトプランが残っていることを確認
      const salaryPlans = store.getAvailablePlans("給与");
      expect(salaryPlans.map((p) => p.name)).toContain("デフォルトプラン");

      console.log("✅ テスト1.4: デフォルトプラン削除防止 - 成功");
    });

    it("すべての項目でデフォルトプランが利用可能", () => {
      const store = usePlanStore.getState();

      // 新しい項目を追加
      store.addItem({
        name: "副業収入",
        category: "income",
        type: "flow",
      });

      // 新しい項目でもデフォルトプランが利用可能であることを確認
      const newItemPlans = store.getAvailablePlans("副業収入");
      expect(newItemPlans.map((p) => p.name)).toContain("デフォルトプラン");

      console.log("✅ テスト1.4: 新規項目でのデフォルトプラン自動提供 - 成功");
    });
  });

  describe("統合テスト: 複雑なシナリオ", () => {
    it("複数項目での複数プラン管理と削除の独立性", () => {
      const store = usePlanStore.getState();

      // 複数のプランを複数の項目に追加
      store.addItemPlan("給与", "楽観プラン");
      store.addItemPlan("給与", "悲観プラン");
      store.addItemPlan("生活費", "楽観プラン");
      store.addItemPlan("生活費", "節約プラン");

      // 各項目のプラン数を確認
      const salaryPlans = store.getAvailablePlans("給与");
      const expensePlans = store.getAvailablePlans("生活費");

      expect(salaryPlans).toHaveLength(3); // デフォルト + 楽観 + 悲観
      expect(expensePlans).toHaveLength(3); // デフォルト + 楽観 + 節約

      // 給与項目から楽観プランを削除
      store.deleteItemPlan("給与", "楽観プラン");

      // 給与項目の楽観プランが削除され、生活費項目の楽観プランは残っていることを確認
      const updatedSalaryPlans = store.getAvailablePlans("給与");
      const updatedExpensePlans = store.getAvailablePlans("生活費");

      expect(updatedSalaryPlans).toHaveLength(2);
      expect(updatedSalaryPlans.map((p) => p.name)).not.toContain("楽観プラン");
      expect(updatedSalaryPlans.map((p) => p.name)).toContain("悲観プラン");

      expect(updatedExpensePlans).toHaveLength(3);
      expect(updatedExpensePlans.map((p) => p.name)).toContain("楽観プラン");
      expect(updatedExpensePlans.map((p) => p.name)).toContain("節約プラン");

      console.log("✅ 統合テスト: 複雑なシナリオ - 成功");
    });

    it("プラン名の重複チェックが項目内でのみ機能する", () => {
      const store = usePlanStore.getState();

      // 給与項目に楽観プランを追加
      const result1 = store.addItemPlan("給与", "楽観プラン");
      expect(result1.success).toBe(true);

      // 同じ項目に同じ名前のプランを追加しようとする（失敗するはず）
      const result2 = store.addItemPlan("給与", "楽観プラン");
      expect(result2.success).toBe(false);
      expect(result2.error).toContain("同じ名前のプランが既に存在します");

      // 異なる項目に同じ名前のプランを追加する（成功するはず）
      const result3 = store.addItemPlan("生活費", "楽観プラン");
      expect(result3.success).toBe(true);

      console.log("✅ 統合テスト: 項目内重複チェック - 成功");
    });
  });

  describe("エラーハンドリングテスト", () => {
    it("存在しない項目への操作でエラーが発生する", () => {
      const store = usePlanStore.getState();

      // 存在しない項目にプランを追加しようとする
      const addResult = store.addItemPlan("存在しない項目", "テストプラン");
      expect(addResult.success).toBe(false);
      expect(addResult.error).toContain("指定された項目が見つかりません");

      // 存在しない項目からプランを削除しようとする
      const deleteResult = store.deleteItemPlan(
        "存在しない項目",
        "テストプラン"
      );
      expect(deleteResult.success).toBe(false);
      expect(deleteResult.error).toContain("指定された項目が見つかりません");

      console.log("✅ エラーハンドリング: 存在しない項目への操作 - 成功");
    });

    it("無効なプラン名でエラーが発生する", () => {
      const store = usePlanStore.getState();

      // 空のプラン名
      const result1 = store.addItemPlan("給与", "");
      expect(result1.success).toBe(false);
      expect(result1.error).toContain("プラン名を入力してください");

      // 長すぎるプラン名
      const longName = "a".repeat(51);
      const result2 = store.addItemPlan("給与", longName);
      expect(result2.success).toBe(false);
      expect(result2.error).toContain("プラン名は50文字以内で入力してください");

      console.log("✅ エラーハンドリング: 無効なプラン名 - 成功");
    });
  });
});
