// Dialog components export
export { PlanDialog } from "./plan-dialog";
export { AddItemDialog } from "./add-item-dialog";
export { PlanManagementDialog } from "./plan-management-dialog";
export { AddPlanDialog } from "./add-plan-dialog";
export { AmountDialog } from "./amount-dialog";
// AmountSettingDialogは非推奨、AmountDialogのuseUnifiedForm=trueを使用してください
export { AmountSettingDialog } from "./amount-setting-dialog";

// Dialog hooks
export { useDialog, usePlanDialogs } from "../../lib/useDialog";

// Types
export type {
  CategoryType,
  ItemType,
  PlanItem,
  AddItemData,
  AddPlanData,
  AmountSettingData,
  AmountSettingFormData,
  ValidationErrors,
  FlowItemDetail,
  StockItemDetail,
} from "../../lib/types";

// 後方互換性のため旧AmountSettingDialogからのエクスポートも維持
export type { AmountSettingFormData as AmountSettingFormDataLegacy } from "./amount-setting-dialog";
