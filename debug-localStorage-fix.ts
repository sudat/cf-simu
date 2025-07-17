/**
 * LocalStorageデータ修復用ヘルパー関数
 * 「楽観」プラン重複エラーの修復
 */

// ブラウザ環境でのLocalStorageデータ確認・修復機能
export const createLocalStorageFixHelpers = () => {
  // LocalStorageのplan-storeデータを確認
  const checkLocalStorage = () => {
    console.log("🔍 LocalStorageのplan-storeデータを確認します...\n");
    
    try {
      const planStoreData = localStorage.getItem('plan-store');
      if (!planStoreData) {
        console.log("❌ LocalStorageにplan-storeデータが見つかりません");
        return null;
      }

      const parsedData = JSON.parse(planStoreData);
      console.log("📊 現在のLocalStorageデータ:");
      console.log(JSON.stringify(parsedData, null, 2));
      
      // 各項目のプラン一覧を表示
      if (parsedData.state && parsedData.state.plans) {
        console.log("\n📋 項目別プラン一覧:");
        Object.entries(parsedData.state.plans).forEach(([itemName, planConfig]: [string, any]) => {
          console.log(`${itemName}: [${planConfig.availablePlans.join(', ')}]`);
          console.log(`  アクティブ: ${planConfig.activePlan}`);
        });
      }
      
      return parsedData;
    } catch (error) {
      console.error("❌ LocalStorageデータの解析でエラーが発生しました:", error);
      return null;
    }
  };

  // 特定のプランを項目から削除
  const removePlanFromItem = (itemName: string, planName: string) => {
    console.log(`🗑️ 項目"${itemName}"からプラン"${planName}"を削除します...`);
    
    try {
      const planStoreData = localStorage.getItem('plan-store');
      if (!planStoreData) {
        console.log("❌ LocalStorageデータが見つかりません");
        return false;
      }

      const parsedData = JSON.parse(planStoreData);
      
      if (!parsedData.state || !parsedData.state.plans || !parsedData.state.plans[itemName]) {
        console.log(`❌ 項目"${itemName}"が見つかりません`);
        return false;
      }

      const plans = parsedData.state.plans[itemName];
      const updatedPlans = plans.availablePlans.filter((p: string) => p !== planName);
      
      if (updatedPlans.length === plans.availablePlans.length) {
        console.log(`⚠️ プラン"${planName}"は項目"${itemName}"に存在しません`);
        return false;
      }

      // プランを削除
      parsedData.state.plans[itemName].availablePlans = updatedPlans;
      
      // アクティブプランが削除された場合はデフォルトプランに戻す
      if (plans.activePlan === planName) {
        parsedData.state.plans[itemName].activePlan = 'デフォルトプラン';
        console.log(`📝 アクティブプランを"デフォルトプラン"に変更しました`);
      }

      // LocalStorageを更新
      localStorage.setItem('plan-store', JSON.stringify(parsedData));
      console.log(`✅ プラン"${planName}"を項目"${itemName}"から削除しました`);
      return true;
      
    } catch (error) {
      console.error("❌ プラン削除中にエラーが発生しました:", error);
      return false;
    }
  };

  // LocalStorageの完全リセット
  const resetLocalStorage = () => {
    console.log("🔄 LocalStorageのplan-storeデータを完全リセットします...");
    
    const confirmation = confirm("⚠️ 警告: これにより全てのプランデータが失われます。続行しますか？");
    if (!confirmation) {
      console.log("❌ リセットがキャンセルされました");
      return false;
    }

    try {
      localStorage.removeItem('plan-store');
      console.log("✅ LocalStorageのplan-storeデータをリセットしました");
      console.log("🔄 ページをリロードして初期状態に戻します...");
      window.location.reload();
      return true;
    } catch (error) {
      console.error("❌ リセット中にエラーが発生しました:", error);
      return false;
    }
  };

  // 楽観プラン専用の修復関数
  const fixOptimisticPlanError = () => {
    console.log("🔧 「楽観」プラン重複エラーを修復します...\n");
    
    const data = checkLocalStorage();
    if (!data) return false;

    let fixed = false;

    // 全ての項目から「楽観」関連のプランを削除
    const optimisticPlanNames = ['楽観', '楽観プラン', 'Optimistic', 'optimistic'];
    
    if (data.state && data.state.plans) {
      Object.keys(data.state.plans).forEach(itemName => {
        optimisticPlanNames.forEach(planName => {
          if (removePlanFromItem(itemName, planName)) {
            fixed = true;
          }
        });
      });
    }

    if (fixed) {
      console.log("\n✅ 「楽観」プラン関連のデータを修復しました");
      console.log("🔄 ページをリロードして状態を更新します...");
      window.location.reload();
    } else {
      console.log("\n ℹ️ 修復が必要な「楽観」プランは見つかりませんでした");
    }

    return fixed;
  };

  return {
    checkLocalStorage,
    removePlanFromItem,
    resetLocalStorage,
    fixOptimisticPlanError
  };
};

// ブラウザ環境でのグローバル関数として登録
if (typeof window !== 'undefined') {
  const helpers = createLocalStorageFixHelpers();
  
  // グローバル関数として登録
  (window as any).checkLocalStorage = helpers.checkLocalStorage;
  (window as any).removePlanFromItem = helpers.removePlanFromItem;
  (window as any).resetLocalStorage = helpers.resetLocalStorage;
  (window as any).fixOptimisticPlanError = helpers.fixOptimisticPlanError;
  
  console.log(`
🔧 LocalStorage修復ツールが利用可能になりました！

利用可能な関数:
• checkLocalStorage() - 現在のデータを確認
• fixOptimisticPlanError() - 楽観プラン重複エラーを自動修復
• removePlanFromItem('項目名', 'プラン名') - 特定プランを削除
• resetLocalStorage() - 完全リセット（注意：全データ削除）

推奨手順:
1. checkLocalStorage() でデータ確認
2. fixOptimisticPlanError() で自動修復
3. ページリロード後に「楽観」プラン追加をテスト
  `);
}

export default createLocalStorageFixHelpers;