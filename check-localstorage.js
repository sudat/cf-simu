/**
 * LocalStorageの内容を確認するスクリプト
 * ブラウザのコンソールで実行してください
 */

// LocalStorage内容の確認関数
function checkLocalStorage() {
  console.log("=== LocalStorage データ確認 ===");
  
  // plan-storeキーの確認
  const planStoreData = localStorage.getItem('plan-store');
  if (planStoreData) {
    console.log("plan-store データ見つかりました:");
    try {
      const parsed = JSON.parse(planStoreData);
      console.log("解析結果:", JSON.stringify(parsed, null, 2));
      
      // 楽観プランの存在確認
      if (parsed.state && parsed.state.plans) {
        console.log("\n=== プラン状況 ===");
        Object.keys(parsed.state.plans).forEach(itemName => {
          const planConfig = parsed.state.plans[itemName];
          console.log(`${itemName}:`, planConfig.availablePlans);
          
          // 楽観プランがあるかチェック
          if (planConfig.availablePlans.includes("楽観プラン")) {
            console.log(`⚠️ ${itemName}に「楽観プラン」が残留している可能性があります`);
          }
        });
      }
      
      // 各カテゴリの設定データを確認
      if (parsed.state) {
        console.log("\n=== 設定データの確認 ===");
        ['incomes', 'expenses', 'assets', 'debts'].forEach(category => {
          if (parsed.state[category]) {
            console.log(`${category}:`, Object.keys(parsed.state[category]));
            Object.entries(parsed.state[category]).forEach(([itemName, itemData]) => {
              if (itemData.settings) {
                const settingPlans = Object.keys(itemData.settings);
                console.log(`  ${itemName} 設定プラン:`, settingPlans);
                if (settingPlans.includes("楽観プラン")) {
                  console.log(`  ⚠️ ${itemName}の設定に「楽観プラン」が残留`);
                }
              }
            });
          }
        });
      }
    } catch (error) {
      console.error("JSONパース中にエラー:", error);
    }
  } else {
    console.log("plan-store データが見つかりません");
  }
  
  // その他のLocalStorageキーも確認
  console.log("\n=== 全LocalStorageキー ===");
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    console.log(`${i}: ${key} (${localStorage.getItem(key)?.length || 0} chars)`);
  }
}

// データ修復関数
function fixPlanData() {
  console.log("=== データ修復実行 ===");
  
  const planStoreData = localStorage.getItem('plan-store');
  if (!planStoreData) {
    console.log("plan-store データが見つかりません");
    return;
  }
  
  try {
    const data = JSON.parse(planStoreData);
    let modified = false;
    
    if (data.state && data.state.plans) {
      // 各項目のプラン設定から楽観プランを削除
      Object.keys(data.state.plans).forEach(itemName => {
        const planConfig = data.state.plans[itemName];
        const optimisticIndex = planConfig.availablePlans.indexOf("楽観プラン");
        
        if (optimisticIndex !== -1) {
          console.log(`${itemName}から楽観プランを削除中...`);
          planConfig.availablePlans.splice(optimisticIndex, 1);
          
          // アクティブプランが楽観プランだった場合はデフォルトに変更
          if (planConfig.activePlan === "楽観プラン") {
            planConfig.activePlan = "デフォルトプラン";
            console.log(`${itemName}のアクティブプランをデフォルトプランに変更`);
          }
          modified = true;
        }
      });
      
      // 各カテゴリの設定データからも楽観プランを削除
      ['incomes', 'expenses', 'assets', 'debts'].forEach(category => {
        if (data.state[category]) {
          Object.entries(data.state[category]).forEach(([itemName, itemData]) => {
            if (itemData.settings && itemData.settings["楽観プラン"]) {
              console.log(`${itemName}の設定から楽観プランを削除中...`);
              delete itemData.settings["楽観プラン"];
              modified = true;
            }
          });
        }
      });
    }
    
    if (modified) {
      localStorage.setItem('plan-store', JSON.stringify(data));
      console.log("✅ データ修復完了");
      console.log("修復後のデータ:", JSON.stringify(data.state.plans, null, 2));
    } else {
      console.log("修復が必要なデータは見つかりませんでした");
    }
  } catch (error) {
    console.error("データ修復中にエラー:", error);
  }
}

// グローバルに関数を公開
window.checkLocalStorage = checkLocalStorage;
window.fixPlanData = fixPlanData;

console.log("LocalStorage調査ツールを読み込みました");
console.log("使用方法:");
console.log("- checkLocalStorage() : LocalStorageの内容を確認");
console.log("- fixPlanData() : 楽観プランの残留データを修復");