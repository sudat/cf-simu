import React from 'react';
import { usePlanDialogs } from '../../lib/useDialog';
import { PlanData } from '../../lib/types';
import PlanDialog from '../dialogs/plan-dialog';
import PlanManagementDialog from '../dialogs/plan-management-dialog';
import AmountDialog from '../dialogs/amount-dialog';

interface TransitionHeaderProps {
  className?: string;
}

export const TransitionHeader: React.FC<TransitionHeaderProps> = ({ className }) => {
  const {
    planDialog,
    planManagementDialog,
    amountDialog,
    plans,
    currentPlan,
    openPlanDialog,
    openPlanManagement,
    openAmountDialog,
    savePlan,
    createPlan,
    editPlan,
    deletePlan
  } = usePlanDialogs();

  // デフォルトプランを作成
  const defaultPlan: PlanData = {
    id: 'default',
    name: 'デフォルトプラン',
    description: '現在のプラン',
    startYear: new Date().getFullYear(),
    endYear: new Date().getFullYear() + 10,
    incomeItems: [
      {
        id: '1',
        name: '給与',
        type: 'flow',
        data: {
          startYear: new Date().getFullYear(),
          amount: 500000,
          frequency: 'monthly'
        }
      }
    ],
    expenseItems: [
      {
        id: '1',
        name: '生活費',
        type: 'flow',
        data: {
          startYear: new Date().getFullYear(),
          amount: 200000,
          frequency: 'monthly'
        }
      }
    ]
  };

  const displayPlan = currentPlan || defaultPlan;

  const handlePlanChange = () => {
    openPlanDialog(displayPlan);
  };

  // グローバルな関数として設定（PlanDialogから呼び出されるため）
  React.useEffect(() => {
    (window as any).openAmountDialog = openAmountDialog;
    (window as any).openPlanManagement = openPlanManagement;
    
    return () => {
      delete (window as any).openAmountDialog;
      delete (window as any).openPlanManagement;
    };
  }, [openAmountDialog, openPlanManagement]);

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              キャッシュフローシミュレーション
            </h1>
            <div className="text-sm text-gray-500">
              プラン: {displayPlan.name}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePlanChange}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              プラン変更
            </button>
            <div className="text-sm text-gray-500">
              期間: {displayPlan.startYear}年 - {displayPlan.endYear}年
            </div>
          </div>
        </div>
      </div>

      {/* ダイアログコンポーネント */}
      <PlanDialog
        isOpen={planDialog.isOpen}
        onClose={planDialog.closeDialog}
        planData={planDialog.data || displayPlan}
        onSave={savePlan}
      />

      <PlanManagementDialog
        isOpen={planManagementDialog.isOpen}
        onClose={planManagementDialog.closeDialog}
        onCreatePlan={createPlan}
        onEditPlan={editPlan}
        onDeletePlan={deletePlan}
        plans={plans}
      />

      {amountDialog.isOpen && amountDialog.data && (
        <AmountDialog
          isOpen={amountDialog.isOpen}
          onClose={amountDialog.closeDialog}
          itemName={amountDialog.data.itemName}
          itemType={amountDialog.data.itemType}
          initialData={amountDialog.data.initialData}
          onSave={amountDialog.data.onSave}
        />
      )}
    </div>
  );
};

export default TransitionHeader;