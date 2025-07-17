// LocalStorageの状態を確認・クリアするスクリプト
console.log("=== LocalStorage Debug ===");

// 現在のplan-storeの状態を確認
const planStoreData = localStorage.getItem('plan-store');
if (planStoreData) {
  console.log("現在のplan-store:", JSON.parse(planStoreData));
} else {
  console.log("plan-storeデータなし");
}

// エラー状態が含まれているかチェック
if (planStoreData) {
  const data = JSON.parse(planStoreData);
  if (data.state && data.state.lastError) {
    console.log("⚠️ lastErrorが保存されています:", data.state.lastError);
    
    // lastErrorを削除
    delete data.state.lastError;
    localStorage.setItem('plan-store', JSON.stringify(data));
    console.log("✅ lastErrorを削除しました");
  } else {
    console.log("✅ lastErrorは保存されていません");
  }
}

console.log("=== Debug完了 ===");
