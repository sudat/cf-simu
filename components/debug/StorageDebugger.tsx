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
                cursor: 'pointer'
              }}
            >
              Clear
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