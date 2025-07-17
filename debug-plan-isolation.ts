/**
 * プラン項目別独立管理のデバッグ・動作確認スクリプト
 * KISS原則: シンプルで分かりやすいデバッグ機能
 */

import { usePlanStore } from "./lib/store/plan-store";

// デバッグ用のログ関数
const debugLog = (title: string, data: any) => {
  console.log(`\n=== ${title} ===`);
  console.log(JSON.stringify(data, null, 2));
};

// プラン項目別独立管理の動作確認
const testPlanItemIsolation = () => {
  console.log("🔍 プラン項目別独立管理の動作確認を開始します...\n");

  const store = usePlanStore.getState();

  // 初期状態の確認
  debugLog("初期状態", {
    plans: store.plans,
    incomes: Object.keys(store.incomes),
    expenses: Object.keys(store.expenses),
  });

  // テスト1: 項目別プラン独立性
  console.log("\n📋 テスト1: 項目別プラン独立性");

  // 給与項目に楽観プランを追加
  const addResult1 = store.addItemPlan("給与", "楽観プラン");
  console.log("給与に楽観プラン追加:", addResult1);

  // 生活費項目に節約プランを追加
  const addResult2 = store.addItemPlan("生活費", "節約プラン");
  console.log("生活費に節約プラン追加:", addResult2);

  // 各項目のプラン状況を確認
  const salaryPlans = store.getAvailablePlans("給与");
  const expensePlans = store.getAvailablePlans("生活費");

  debugLog(
    "給与項目のプラン",
    salaryPlans.map((p) => ({ name: p.name, id: p.id, itemName: p.itemName }))
  );
  debugLog(
    "生活費項目のプラン",
    expensePlans.map((p) => ({ name: p.name, id: p.id, itemName: p.itemName }))
  );

  // テスト2: 複数項目での同名プラン作成
  console.log("\n📋 テスト2: 複数項目での同名プラン作成");

  // 両方の項目に「特別プラン」を追加
  const addResult3 = store.addItemPlan("給与", "特別プラン");
  const addResult4 = store.addItemPlan("生活費", "特別プラン");

  console.log("給与に特別プラン追加:", addResult3);
  console.log("生活費に特別プラン追加:", addResult4);

  // 同名プランが独立していることを確認
  const updatedSalaryPlans = store.getAvailablePlans("給与");
  const updatedExpensePlans = store.getAvailablePlans("生活費");

  console.log(
    "給与項目の特別プラン:",
    updatedSalaryPlans.find((p) => p.name === "特別プラン")
  );
  console.log(
    "生活費項目の特別プラン:",
    updatedExpensePlans.find((p) => p.name === "特別プラン")
  );

  // テスト3: プラン削除の独立性
  console.log("\n📋 テスト3: プラン削除の独立性");

  // 給与項目から特別プランを削除
  const deleteResult = store.deleteItemPlan("給与", "特別プラン");
  console.log("給与から特別プラン削除:", deleteResult);

  // 削除後の状況確認
  const finalSalaryPlans = store.getAvailablePlans("給与");
  const finalExpensePlans = store.getAvailablePlans("生活費");

  console.log(
    "削除後の給与プラン:",
    finalSalaryPlans.map((p) => p.name)
  );
  console.log(
    "削除後の生活費プラン:",
    finalExpensePlans.map((p) => p.name)
  );

  // テスト4: データ整合性チェック
  console.log("\n📋 テスト4: データ整合性チェック");

  const validationResult = store.validatePlanData();
  const consistencyResult = store.checkDataConsistency();

  console.log("プランデータ検証:", {
    isValid: validationResult.isValid,
    errorsCount: validationResult.errors.length,
    warningsCount: validationResult.warnings.length,
  });

  console.log("データ一貫性チェック:", {
    isConsistent: consistencyResult.isConsistent,
    issuesCount: consistencyResult.issues.length,
    summary: consistencyResult.summary,
  });

  // テスト5: エラーハンドリング
  console.log("\n📋 テスト5: エラーハンドリング");

  // 存在しない項目への操作
  const errorResult1 = store.addItemPlan("存在しない項目", "テストプラン");
  console.log("存在しない項目への操作:", errorResult1);

  // デフォルトプランの削除試行
  const errorResult2 = store.deleteItemPlan("給与", "デフォルトプラン");
  console.log("デフォルトプラン削除試行:", errorResult2);

  // 重複プラン名の追加試行
  const errorResult3 = store.addItemPlan("給与", "楽観プラン"); // 既に存在
  console.log("重複プラン名追加試行:", errorResult3);

  console.log("\n✅ プラン項目別独立管理の動作確認が完了しました！");

  // 最終状態の確認
  debugLog("最終状態", {
    plans: store.plans,
    lastError: store.lastError,
  });
};

// 実行
if (typeof window === "undefined") {
  // Node.js環境での実行
  testPlanItemIsolation();
} else {
  // ブラウザ環境での実行
  console.log(
    "ブラウザのコンソールでtestPlanItemIsolation()を実行してください"
  );
  (window as any).testPlanItemIsolation = testPlanItemIsolation;
}

export { testPlanItemIsolation };
