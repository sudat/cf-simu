import { usePlanStore } from "@/lib/store/plan-store";

// プラン設定とバッジ表示問題のデバッグ
function debugBadgeIssue() {
  const store = usePlanStore.getState();
  
  console.log("=== プラン設定とバッジ表示問題の調査 ===");
  
  // 1. 現在のプラン設定を確認
  console.log("1. 現在のプラン設定:");
  console.log("Plans:", JSON.stringify(store.plans, null, 2));
  
  // 2. 各項目の状態を確認
  console.log("\n2. 各項目の状態確認:");
  Object.entries(store.plans).forEach(([itemName, planConfig]) => {
    console.log(`\n項目: ${itemName}`);
    console.log(`  利用可能プラン: ${planConfig.availablePlans.join(", ")}`);
    console.log(`  アクティブプラン: ${planConfig.activePlan}`);
    console.log(`  デフォルトプランか: ${planConfig.activePlan === "デフォルトプラン"}`);
    
    // getItemActivePlan関数の動作確認
    const activePlan = store.getItemActivePlan(itemName);
    console.log(`  getItemActivePlan結果:`, activePlan);
    console.log(`  バッジ表示判定: ${!activePlan.isDefault && activePlan.name !== "デフォルトプラン"}`);
  });
  
  // 3. 設定データとプラン定義の一致確認
  console.log("\n3. 設定データとプラン定義の一致確認:");
  const categories = [
    { key: 'incomes', name: '収入' },
    { key: 'expenses', name: '支出' },
    { key: 'assets', name: '資産' },
    { key: 'debts', name: '負債' }
  ] as const;
  
  categories.forEach(({ key, name }) => {
    const categoryData = store[key];
    console.log(`\n${name}カテゴリ:`);
    Object.entries(categoryData).forEach(([itemName, itemData]) => {
      console.log(`  項目: ${itemName}`);
      console.log(`    設定されているプラン: ${Object.keys(itemData.settings).join(", ")}`);
      console.log(`    プラン定義: ${store.plans[itemName]?.availablePlans.join(", ") || "なし"}`);
      console.log(`    アクティブプラン: ${store.plans[itemName]?.activePlan || "なし"}`);
    });
  });
  
  // 4. プラン追加処理のシミュレーション
  console.log("\n4. プラン追加処理のシミュレーション:");
  // 給与項目に楽観プランを追加してみる
  const testItemName = "給与";
  const testPlanName = "楽観プラン";
  
  console.log(`${testItemName}に${testPlanName}を追加前の状態:`);
  console.log(`  プラン定義: ${store.plans[testItemName]?.availablePlans.join(", ") || "なし"}`);
  console.log(`  アクティブプラン: ${store.plans[testItemName]?.activePlan || "なし"}`);
  
  const addResult = store.addItemPlan(testItemName, testPlanName);
  console.log(`プラン追加結果: ${addResult.success ? "成功" : "失敗"}`);
  if (!addResult.success) {
    console.log(`エラー: ${addResult.error}`);
  }
  
  // 追加後の状態確認
  console.log(`${testItemName}に${testPlanName}を追加後の状態:`);
  console.log(`  プラン定義: ${store.plans[testItemName]?.availablePlans.join(", ") || "なし"}`);
  console.log(`  アクティブプラン: ${store.plans[testItemName]?.activePlan || "なし"}`);
  
  // 5. アクティブプラン設定のシミュレーション
  console.log("\n5. アクティブプラン設定のシミュレーション:");
  const setActiveResult = store.setItemActivePlan(testItemName, testPlanName);
  console.log(`アクティブプラン設定結果: ${setActiveResult.success ? "成功" : "失敗"}`);
  if (!setActiveResult.success) {
    console.log(`エラー: ${setActiveResult.error}`);
  }
  
  // 設定後の状態確認
  console.log(`${testItemName}のアクティブプラン設定後の状態:`);
  console.log(`  プラン定義: ${store.plans[testItemName]?.availablePlans.join(", ") || "なし"}`);
  console.log(`  アクティブプラン: ${store.plans[testItemName]?.activePlan || "なし"}`);
  
  const finalActivePlan = store.getItemActivePlan(testItemName);
  console.log(`  getItemActivePlan結果:`, finalActivePlan);
  console.log(`  バッジ表示判定: ${!finalActivePlan.isDefault && finalActivePlan.name !== "デフォルトプラン"}`);
  
  // 6. AmountDialogで使用されるであろうitemName確認
  console.log("\n6. AmountDialogで使用されるitemName確認:");
  const mockItemId = "income-給与";
  const parts = mockItemId.split('-');
  const extractedItemName = parts.slice(1).join('-');
  console.log(`itemId: ${mockItemId}`);
  console.log(`抽出されるitemName: ${extractedItemName}`);
  console.log(`プラン定義存在: ${!!store.plans[extractedItemName]}`);
  
  if (store.plans[extractedItemName]) {
    const dialogActivePlan = store.getItemActivePlan(extractedItemName);
    console.log(`AmountDialogで取得されるアクティブプラン:`, dialogActivePlan);
    console.log(`AmountDialogでのバッジ表示判定: ${!dialogActivePlan.isDefault && dialogActivePlan.name !== "デフォルトプラン"}`);
  }
}

// 実行
debugBadgeIssue();