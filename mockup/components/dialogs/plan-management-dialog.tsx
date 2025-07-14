import React from 'react';
import { PlanManagementDialogProps } from '../../lib/types';

export const PlanManagementDialog: React.FC<PlanManagementDialogProps> = ({
  isOpen,
  onClose,
  onCreatePlan,
  onEditPlan,
  onDeletePlan,
  plans
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">プラン管理</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <button
            onClick={onCreatePlan}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            新規プラン作成
          </button>
        </div>

        <div className="space-y-3">
          {plans.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              プランがありません。新規作成してください。
            </p>
          ) : (
            plans.map((plan) => (
              <div
                key={plan.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{plan.name}</h3>
                  {plan.description && (
                    <p className="text-gray-600 text-sm mt-1">{plan.description}</p>
                  )}
                  <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                    <span>期間: {plan.startYear}年 - {plan.endYear}年</span>
                    <span>収入項目: {plan.incomeItems.length}件</span>
                    <span>支出項目: {plan.expenseItems.length}件</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditPlan(plan.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`「${plan.name}」を削除しますか？`)) {
                        onDeletePlan(plan.id);
                      }
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanManagementDialog;