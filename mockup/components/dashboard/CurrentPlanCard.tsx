import React from 'react';
import { usePlanDialogs } from '../../lib/useDialog';
import { PlanData } from '../../lib/types';
import PlanDialog from '../dialogs/plan-dialog';
import PlanManagementDialog from '../dialogs/plan-management-dialog';
import AmountDialog from '../dialogs/amount-dialog';

interface CurrentPlanCardProps {
  className?: string;
}

export const CurrentPlanCard: React.FC<CurrentPlanCardProps> = ({ className }) => {
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
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">現在のプラン</h2>
        <button
          onClick={handlePlanChange}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          プラン変更
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-lg">{displayPlan.name}</h3>
          {displayPlan.description && (
            <p className="text-gray-600 text-sm">{displayPlan.description}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            期間: {displayPlan.startYear}年 - {displayPlan.endYear}年
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-green-600 mb-2">収入項目</h4>
            <div className="space-y-1">
              {displayPlan.incomeItems.map((item) => (
                <div key={item.id} className="text-sm">
                  {item.name} ({item.type === 'flow' ? 'フロー' : 'ストック'})
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-red-600 mb-2">支出項目</h4>
            <div className="space-y-1">
              {displayPlan.expenseItems.map((item) => (
                <div key={item.id} className="text-sm">
                  {item.name} ({item.type === 'flow' ? 'フロー' : 'ストック'})
                </div>
              ))}
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

export default CurrentPlanCard;