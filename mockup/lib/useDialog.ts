import { useState } from 'react';
import { PlanData, IncomeItem, ExpenseItem, FlowFormData, StockFormData } from './types';

export interface DialogState {
  isOpen: boolean;
  data?: any;
}

export function useDialog<T = any>() {
  const [state, setState] = useState<DialogState>({
    isOpen: false,
    data: undefined
  });

  const openDialog = (data?: T) => {
    setState({
      isOpen: true,
      data
    });
  };

  const closeDialog = () => {
    setState({
      isOpen: false,
      data: undefined
    });
  };

  const updateData = (newData: Partial<T>) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, ...newData }
    }));
  };

  return {
    isOpen: state.isOpen,
    data: state.data,
    openDialog,
    closeDialog,
    updateData
  };
}

// 階層ナビゲーション対応のプランダイアログフック
export function usePlanDialogs() {
  const planDialog = useDialog<PlanData>();
  const planManagementDialog = useDialog();
  const amountDialog = useDialog<{
    itemName: string;
    itemType: 'flow' | 'stock';
    initialData?: FlowFormData | StockFormData;
    onSave: (data: FlowFormData | StockFormData) => void;
  }>();

  const [plans, setPlans] = useState<PlanData[]>([]);
  const [currentPlan, setCurrentPlan] = useState<PlanData | null>(null);

  const openPlanDialog = (planData: PlanData) => {
    setCurrentPlan(planData);
    planDialog.openDialog(planData);
  };

  const openPlanManagement = () => {
    planDialog.closeDialog();
    planManagementDialog.openDialog();
  };

  const openAmountDialog = (itemName: string, itemType: 'flow' | 'stock', initialData?: FlowFormData | StockFormData) => {
    return new Promise<FlowFormData | StockFormData>((resolve) => {
      amountDialog.openDialog({
        itemName,
        itemType,
        initialData,
        onSave: (data) => {
          amountDialog.closeDialog();
          resolve(data);
        }
      });
    });
  };

  const savePlan = (planData: PlanData) => {
    setPlans(prev => {
      const existingIndex = prev.findIndex(p => p.id === planData.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = planData;
        return updated;
      }
      return [...prev, planData];
    });
    setCurrentPlan(planData);
    planDialog.closeDialog();
  };

  const createPlan = () => {
    const newPlan: PlanData = {
      id: Date.now().toString(),
      name: '新しいプラン',
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear() + 10,
      incomeItems: [],
      expenseItems: []
    };
    planManagementDialog.closeDialog();
    openPlanDialog(newPlan);
  };

  const editPlan = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      planManagementDialog.closeDialog();
      openPlanDialog(plan);
    }
  };

  const deletePlan = (planId: string) => {
    setPlans(prev => prev.filter(p => p.id !== planId));
    if (currentPlan?.id === planId) {
      setCurrentPlan(null);
    }
  };

  return {
    // Dialog states
    planDialog,
    planManagementDialog,
    amountDialog,
    
    // Data states
    plans,
    currentPlan,
    
    // Actions
    openPlanDialog,
    openPlanManagement,
    openAmountDialog,
    savePlan,
    createPlan,
    editPlan,
    deletePlan
  };
}