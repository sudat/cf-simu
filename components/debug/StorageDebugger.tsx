"use client";

import { useState, useEffect } from "react";
import { usePlanStore } from "@/lib/store/plan-store";

export function StorageDebugger() {
  const [localStorageContent, setLocalStorageContent] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const storeState = usePlanStore();

  const refreshLocalStorage = () => {
    try {
      const content = localStorage.getItem('plan-store');
      setLocalStorageContent(content ? JSON.stringify(JSON.parse(content), null, 2) : "No data found");
    } catch (error) {
      setLocalStorageContent(`Error reading localStorage: ${error}`);
    }
  };

  useEffect(() => {
    refreshLocalStorage();
  }, [storeState]);

  const clearLocalStorage = () => {
    localStorage.removeItem('plan-store');
    refreshLocalStorage();
  };

  // 楽観プラン重複エラーの修復
  const fixOptimisticPlanError = () => {
    try {
      const planStoreData = localStorage.getItem('plan-store');
      if (!planStoreData) {
        alert('LocalStorageにデータが見つかりません');
        return;
      }

      const parsedData = JSON.parse(planStoreData);
      let fixed = false;

      // 全ての項目から「楽観」関連のプランを削除
      const optimisticPlanNames = ['楽観', '楽観プラン', 'Optimistic', 'optimistic'];
      
      if (parsedData.state && parsedData.state.plans) {
        Object.keys(parsedData.state.plans).forEach(itemName => {
          optimisticPlanNames.forEach(planName => {
            const plans = parsedData.state.plans[itemName];
            if (plans.availablePlans.includes(planName)) {
              // プランを削除
              plans.availablePlans = plans.availablePlans.filter((p: string) => p !== planName);
              // アクティブプランが削除された場合はデフォルトプランに戻す
              if (plans.activePlan === planName) {
                plans.activePlan = 'デフォルトプラン';
              }
              fixed = true;
              console.log(`修復: 項目"${itemName}"からプラン"${planName}"を削除しました`);
            }
          });
        });
      }

      if (fixed) {
        localStorage.setItem('plan-store', JSON.stringify(parsedData));
        alert('楽観プラン重複エラーを修復しました。ページをリロードします。');
        window.location.reload();
      } else {
        alert('修復が必要な楽観プランは見つかりませんでした。');
      }
    } catch (error) {
      alert(`修復中にエラーが発生しました: ${error}`);
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      zIndex: 9999,
      backgroundColor: 'white',
      border: '2px solid #ccc',
      borderRadius: '8px',
      padding: '10px',
      maxWidth: '400px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <button 
        onClick={() => setIsVisible(!isVisible)}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '10px'
        }}
      >
        {isVisible ? 'Hide' : 'Show'} Storage Debug
      </button>
      
      {isVisible && (
        <div>
          <div style={{ marginBottom: '10px' }}>
            <button 
              onClick={refreshLocalStorage}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '8px'
              }}
            >
              Refresh
            </button>
            <button 
              onClick={clearLocalStorage}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '8px'
              }}
            >
              Clear
            </button>
            <button 
              onClick={fixOptimisticPlanError}
              style={{
                backgroundColor: '#ffc107',
                color: 'black',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Fix 楽観プラン
            </button>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Current Store State:</h4>
            <pre style={{ 
              fontSize: '10px', 
              backgroundColor: '#f8f9fa',
              padding: '8px',
              borderRadius: '4px',
              overflow: 'auto',
              maxHeight: '150px',
              margin: 0
            }}>
              {JSON.stringify({
                incomes: storeState.incomes,
                expenses: storeState.expenses,
                plans: storeState.plans
              }, null, 2)}
            </pre>
          </div>
          
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>LocalStorage Content:</h4>
            <pre style={{ 
              fontSize: '10px', 
              backgroundColor: '#f8f9fa',
              padding: '8px',
              borderRadius: '4px',
              overflow: 'auto',
              maxHeight: '200px',
              margin: 0
            }}>
              {localStorageContent}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}