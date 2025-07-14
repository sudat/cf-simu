// Amount Dialog types
export interface FlowFormData {
  startYear: number;
  endYear?: number;
  amount: number;
  frequency: 'monthly' | 'yearly';
  flowRate?: number;
}

export interface StockFormData {
  baseYear: number;
  baseAmount: number;
  rate?: number;
  yearlyChange?: number;
}

export interface AmountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemType: 'flow' | 'stock';
  initialData?: FlowFormData | StockFormData;
  onSave: (data: FlowFormData | StockFormData) => void;
}

export interface CalculationExample {
  year: number;
  amount: number;
  formula?: string;
}

// Plan Dialog types
export interface PlanData {
  id: string;
  name: string;
  description?: string;
  startYear: number;
  endYear: number;
  incomeItems: IncomeItem[];
  expenseItems: ExpenseItem[];
}

export interface IncomeItem {
  id: string;
  name: string;
  type: 'flow' | 'stock';
  data: FlowFormData | StockFormData;
}

export interface ExpenseItem {
  id: string;
  name: string;
  type: 'flow' | 'stock';
  data: FlowFormData | StockFormData;
}

export interface PlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  planData: PlanData;
  onSave: (data: PlanData) => void;
}

export interface PlanManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlan: () => void;
  onEditPlan: (planId: string) => void;
  onDeletePlan: (planId: string) => void;
  plans: PlanData[];
}