import React, { useState } from 'react';
import { PlanDialogProps, PlanData, IncomeItem, ExpenseItem, FlowFormData, StockFormData } from '../../lib/types';

export const PlanDialog: React.FC<PlanDialogProps> = ({ isOpen, onClose, planData, onSave }) => {
  const [editingPlan, setEditingPlan] = useState<PlanData>(planData);

  const handleAddIncomeItem = async (openAmountDialog: (itemName: string, itemType: 'flow' | 'stock', initialData?: FlowFormData | StockFormData) => Promise<FlowFormData | StockFormData>) => {
    const itemName = prompt('収入項目名を入力してください:');
    if (!itemName) return;
    
    const itemType = confirm('フロー型の収入ですか？ (キャンセルでストック型)') ? 'flow' : 'stock';
    
    try {
      const data = await openAmountDialog(itemName, itemType);
      const newItem: IncomeItem = {
        id: Date.now().toString(),
        name: itemName,
        type: itemType,
        data
      };
      
      setEditingPlan(prev => ({
        ...prev,
        incomeItems: [...prev.incomeItems, newItem]
      }));
    } catch (error) {
      // User cancelled
    }
  };

  const handleAddExpenseItem = async (openAmountDialog: (itemName: string, itemType: 'flow' | 'stock', initialData?: FlowFormData | StockFormData) => Promise<FlowFormData | StockFormData>) => {
    const itemName = prompt('支出項目名を入力してください:');
    if (!itemName) return;
    
    const itemType = confirm('フロー型の支出ですか？ (キャンセルでストック型)') ? 'flow' : 'stock';
    
    try {
      const data = await openAmountDialog(itemName, itemType);
      const newItem: ExpenseItem = {
        id: Date.now().toString(),
        name: itemName,
        type: itemType,
        data
      };
      
      setEditingPlan(prev => ({
        ...prev,
        expenseItems: [...prev.expenseItems, newItem]
      }));
    } catch (error) {
      // User cancelled
    }
  };

  const handleEditItem = async (
    item: IncomeItem | ExpenseItem,
    isIncome: boolean,
    openAmountDialog: (itemName: string, itemType: 'flow' | 'stock', initialData?: FlowFormData | StockFormData) => Promise<FlowFormData | StockFormData>
  ) => {
    try {
      const data = await openAmountDialog(item.name, item.type, item.data);
      const updatedItem = { ...item, data };
      
      setEditingPlan(prev => ({
        ...prev,
        [isIncome ? 'incomeItems' : 'expenseItems']: 
          prev[isIncome ? 'incomeItems' : 'expenseItems'].map(i => 
            i.id === item.id ? updatedItem : i
          )
      }));
    } catch (error) {
      // User cancelled
    }
  };

  const handleDeleteItem = (itemId: string, isIncome: boolean) => {
    if (confirm('この項目を削除しますか？')) {
      setEditingPlan(prev => ({
        ...prev,
        [isIncome ? 'incomeItems' : 'expenseItems']: 
          prev[isIncome ? 'incomeItems' : 'expenseItems'].filter(i => i.id !== itemId)
      }));
    }
  };

  const handleSave = () => {
    onSave(editingPlan);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">プラン編集</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              プラン名
            </label>
            <input
              type="text"
              value={editingPlan.name}
              onChange={(e) => setEditingPlan(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              説明
            </label>
            <textarea
              value={editingPlan.description || ''}
              onChange={(e) => setEditingPlan(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                開始年
              </label>
              <input
                type="number"
                value={editingPlan.startYear}
                onChange={(e) => setEditingPlan(prev => ({ ...prev, startYear: parseInt(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                終了年
              </label>
              <input
                type="number"
                value={editingPlan.endYear}
                onChange={(e) => setEditingPlan(prev => ({ ...prev, endYear: parseInt(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* 収入項目セクション */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-green-600">収入項目</h3>
              <button
                onClick={() => {
                  // This will be passed from the parent component
                  const openAmountDialog = (window as any).openAmountDialog;
                  if (openAmountDialog) {
                    handleAddIncomeItem(openAmountDialog);
                  }
                }}
                className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                + 追加
              </button>
            </div>
            <div className="space-y-2">
              {editingPlan.incomeItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-green-50 rounded-md">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      ({item.type === 'flow' ? 'フロー' : 'ストック'})
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const openAmountDialog = (window as any).openAmountDialog;
                        if (openAmountDialog) {
                          handleEditItem(item, true, openAmountDialog);
                        }
                      }}
                      className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id, true)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 支出項目セクション */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-red-600">支出項目</h3>
              <button
                onClick={() => {
                  const openAmountDialog = (window as any).openAmountDialog;
                  if (openAmountDialog) {
                    handleAddExpenseItem(openAmountDialog);
                  }
                }}
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                + 追加
              </button>
            </div>
            <div className="space-y-2">
              {editingPlan.expenseItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-md">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      ({item.type === 'flow' ? 'フロー' : 'ストック'})
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const openAmountDialog = (window as any).openAmountDialog;
                        if (openAmountDialog) {
                          handleEditItem(item, false, openAmountDialog);
                        }
                      }}
                      className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id, false)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6 pt-4 border-t">
          <button
            onClick={() => {
              const openPlanManagement = (window as any).openPlanManagement;
              if (openPlanManagement) {
                openPlanManagement();
              }
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            プラン管理
          </button>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDialog;