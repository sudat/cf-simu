import { describe, it, expect, beforeEach } from 'vitest';
import { usePlanStore } from '../plan-store';

describe('PlanStore Migration Integration', () => {
  beforeEach(() => {
    // テスト前にストアを初期状態にリセット
    const store = usePlanStore.getState();
    store.clearError();
    
    // ストアを初期状態に戻す（テスト間の独立性を確保）
    usePlanStore.setState({
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
      lastError: null,
    });
  });



  describe('getItemPlans', () => {
    it('項目のプラン一覧を正常に取得できる', () => {
      const store = usePlanStore.getState();
      
      const itemPlans = store.getItemPlans('給与');

      expect(itemPlans).toHaveLength(1);
      expect(itemPlans[0].name).toBe('デフォルトプラン');
      expect(itemPlans[0].isDefault).toBe(true);
      expect(itemPlans[0].itemName).toBe('給与');
    });

    it('存在しない項目でもデフォルトプランを返す', () => {
      const store = usePlanStore.getState();
      
      const itemPlans = store.getItemPlans('存在しない項目');

      expect(itemPlans).toHaveLength(1);
      expect(itemPlans[0].name).toBe('デフォルトプラン');
      expect(itemPlans[0].isDefault).toBe(true);
      expect(itemPlans[0].itemName).toBe('存在しない項目');
    });
  });

  describe('getItemActivePlan', () => {
    it('項目のアクティブプランを正常に取得できる', () => {
      const store = usePlanStore.getState();
      
      const activePlan = store.getItemActivePlan('給与');

      expect(activePlan.name).toBe('デフォルトプラン');
      expect(activePlan.isDefault).toBe(true);
      expect(activePlan.itemName).toBe('給与');
    });

    it('存在しない項目でもデフォルトプランを返す', () => {
      const store = usePlanStore.getState();
      
      const activePlan = store.getItemActivePlan('存在しない項目');

      expect(activePlan.name).toBe('デフォルトプラン');
      expect(activePlan.isDefault).toBe(true);
      expect(activePlan.itemName).toBe('存在しない項目');
    });
  });

  describe('addItemPlan', () => {
    it('項目に新しいプランを追加できる', () => {
      const store = usePlanStore.getState();
      
      const result = store.addItemPlan('給与', '新しいプラン');

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();

      // 追加されたことを確認
      const currentState = usePlanStore.getState();
      expect(currentState.plans["給与"].availablePlans).toContain('新しいプラン');
    });

    it('重複するプラン名の場合はエラーを返す', () => {
      const store = usePlanStore.getState();
      
      const result = store.addItemPlan('給与', 'デフォルトプラン');

      expect(result.success).toBe(false);
      expect(result.error).toBe('同じ名前のプランが既に存在します');
    });

    it('存在しない項目の場合はエラーを返す', () => {
      const store = usePlanStore.getState();
      
      const result = store.addItemPlan('存在しない項目', '新しいプラン');

      expect(result.success).toBe(false);
      expect(result.error).toBe('指定された項目が見つかりません');
    });
  });

  describe('deleteItemPlan', () => {
    it('項目からプランを削除できる', () => {
      const store = usePlanStore.getState();
      
      // まずプランを追加
      const addResult = store.addItemPlan('給与', '削除テストプラン');
      expect(addResult.success).toBe(true);

      // プランを削除（プラン名をIDとして使用）
      const deleteResult = store.deleteItemPlan('給与', '削除テストプラン');

      expect(deleteResult.success).toBe(true);
      expect(deleteResult.error).toBeUndefined();

      // 削除されたことを確認
      const updatedState = usePlanStore.getState();
      expect(updatedState.plans["給与"].availablePlans).not.toContain('削除テストプラン');
    });

    it('デフォルトプランの削除はエラーを返す', () => {
      const store = usePlanStore.getState();
      
      const result = store.deleteItemPlan('給与', 'デフォルトプラン');

      expect(result.success).toBe(false);
      expect(result.error).toBe('デフォルトプランは削除できません。デフォルトプランはすべての項目で必須です。');
    });

    it('存在しないプランの削除はエラーを返す', () => {
      const store = usePlanStore.getState();
      
      const result = store.deleteItemPlan('給与', '存在しないID');

      expect(result.success).toBe(false);
      expect(result.error).toBe('削除対象のプランが見つかりません');
    });
  });

  describe('エラー処理', () => {
    it('エラー状態が正常に管理される', () => {
      const store = usePlanStore.getState();
      
      // エラーを発生させる
      const result = store.addItemPlan('存在しない項目', '新しいプラン');
      expect(result.success).toBe(false);

      // エラー状態が設定されていることを確認
      const currentState = usePlanStore.getState();
      expect(currentState.lastError).toBe('指定された項目が見つかりません');

      // エラーをクリア
      store.clearError();
      const clearedState = usePlanStore.getState();
      expect(clearedState.lastError).toBeNull();
    });
  });
});