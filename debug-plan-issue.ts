/**
 * 「楽観プランがないのに追加時に重複エラー」問題の調査用デバッグスクリプト
 */

import { usePlanStore } from "./lib/store/plan-store";

// デバッグ関数
function debugPlanIssue() {
  console.log("=== 「楽観プラン」重複エラー問題の調査 ===\n");

  const store = usePlanStore.getState();

  // 1. 現在のストア状態を確認
  console.log("1. 現在のストア状態:");
  console.log("plans:", JSON.stringify(store.plans, null, 2));
  console.log("incomes:", JSON.stringify(store.incomes, null, 2));
  console.log("expenses:", JSON.stringify(store.expenses, null, 2));
  console.log("assets:", JSON.stringify(store.assets, null, 2));
  console.log("debts:", JSON.stringify(store.debts, null, 2));
  console.log("\n");

  // 2. 各項目で「楽観プラン」が存在するかチェック
  console.log("2. 各項目での「楽観プラン」存在チェック:");
  const allItemNames = [
    ...Object.keys(store.incomes),
    ...Object.keys(store.expenses),
    ...Object.keys(store.assets),
    ...Object.keys(store.debts),
  ];

  allItemNames.forEach(itemName => {
    if (store.plans[itemName]) {
      const hasOptimisticPlan = store.plans[itemName].availablePlans.includes("楽観プラン");
      console.log(`  ${itemName}: ${hasOptimisticPlan ? "✓存在" : "✗なし"} (プラン: ${store.plans[itemName].availablePlans.join(", ")})`);
    } else {
      console.log(`  ${itemName}: プラン定義なし`);
    }
  });
  console.log("\n");

  // 3. 試しに「楽観プラン」を追加してみる
  console.log("3. 「楽観プラン」追加テスト:");
  
  // 給与項目で試す
  if (store.plans["給与"]) {
    console.log("給与項目への「楽観プラン」追加テスト:");
    console.log("  追加前のプラン:", store.plans["給与"].availablePlans);
    
    const result = store.addItemPlan("給与", "楽観プラン");
    console.log(`  追加結果: ${result.success ? "成功" : "失敗"}`);
    if (!result.success) {
      console.log(`  エラーメッセージ: ${result.error}`);
    }
    
    // 追加後の状態を確認
    const currentState = usePlanStore.getState();
    console.log("  追加後のプラン:", currentState.plans["給与"]?.availablePlans || "項目が見つかりません");
  }
  console.log("\n");

  // 4. addItemPlan関数の重複チェックロジックを詳細分析
  console.log("4. 重複チェックロジックの詳細分析:");
  const itemName = "給与";
  const planName = "楽観プラン";
  
  if (store.plans[itemName]) {
    console.log(`  項目名: ${itemName}`);
    console.log(`  プラン名: ${planName}`);
    console.log(`  トリム後プラン名: "${planName.trim()}"`);
    console.log(`  利用可能プラン配列: [${store.plans[itemName].availablePlans.map(p => `"${p}"`).join(", ")}]`);
    
    // includes メソッドの動作を詳細に確認
    const availablePlans = store.plans[itemName].availablePlans;
    const includesResult = availablePlans.includes(planName.trim());
    console.log(`  includes("${planName.trim()}")の結果: ${includesResult}`);
    
    // 各プランとの比較を詳細に確認
    console.log("  詳細比較:");
    availablePlans.forEach((existingPlan, index) => {
      const isEqual = existingPlan === planName.trim();
      console.log(`    [${index}] "${existingPlan}" === "${planName.trim()}" : ${isEqual}`);
      console.log(`         長さ: ${existingPlan.length} vs ${planName.trim().length}`);
      console.log(`         文字コード: [${existingPlan.split('').map(c => c.charCodeAt(0)).join(',')}] vs [${planName.trim().split('').map(c => c.charCodeAt(0)).join(',')}]`);
    });
  }
  console.log("\n");

  // 5. 他の項目での確認
  console.log("5. 他の項目での同じ問題の確認:");
  const otherItems = allItemNames.filter(name => name !== "給与");
  otherItems.forEach(itemName => {
    if (store.plans[itemName]) {
      const result = store.addItemPlan(itemName, "楽観プラン");
      console.log(`  ${itemName}: ${result.success ? "成功" : "失敗"} ${result.error ? `(${result.error})` : ""}`);
    }
  });
  console.log("\n");

  // 6. データ整合性チェック
  console.log("6. データ整合性チェック:");
  const validationResult = store.validatePlanData();
  const consistencyResult = store.checkDataConsistency();
  
  console.log("  プランデータ検証:", validationResult.isValid ? "問題なし" : "問題あり");
  if (!validationResult.isValid) {
    console.log("    エラー:", validationResult.errors.map(e => e.message));
  }
  
  console.log("  一貫性チェック:", consistencyResult.isConsistent ? "問題なし" : "問題あり");
  if (!consistencyResult.isConsistent) {
    console.log("    問題:", consistencyResult.issues.map(i => i.message));
  }

  console.log("\n=== 調査完了 ===");
}

// 実行
debugPlanIssue();