"use client";

import { Button } from "@/components/ui/button";
import { usePlanDialogs } from "@/lib/useDialog";
import { PlanDialog } from "@/components/dialogs/plan-dialog";
import { PlanManagementDialog } from "@/components/dialogs/plan-management-dialog";
import { usePlanStore } from "@/lib/store/plan-store";

export function CurrentPlanCard() {
  const { 
    openPlanMain, 
    openPlanManagement, 
    openAddPlan,
    isDialogOpen, 
    closeDialog, 
    getDialogData,
    DIALOG_IDS 
  } = usePlanDialogs();

  const { getActivePlan } = usePlanStore();
  const activePlan = getActivePlan();

  return (
    <>
      <section className="bg-white/90 backdrop-blur-md border border-white/30 p-4 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-800">現在のプラン</h2>
          <Button 
            className="bg-brand-500 border border-brand-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-brand-600 transition-all duration-200 hover:-translate-y-0.5"
            onClick={openPlanMain}
          >
            プラン変更
          </Button>
        </div>
        <p className="text-gray-600">{activePlan?.name || "デフォルトプラン"}</p>
      </section>

      <PlanDialog
        open={isDialogOpen(DIALOG_IDS.PLAN_MAIN)}
        onOpenChange={(open) => {
          if (!open) closeDialog(DIALOG_IDS.PLAN_MAIN);
        }}
        onManagePlans={(itemId) => {
          // 項目IDから項目名を取得 (実際の実装では適切な方法で取得)
          const itemName = itemId.split('-').slice(1).join('-');
          openPlanManagement(itemId, itemName);
        }}
        onSettingsItem={(itemId) => {
          alert(`${itemId}の金額設定機能を実装中です`);
        }}
        onAddItem={(category) => {
          alert(`${category}カテゴリの項目追加機能を実装中です`);
        }}
      />

      <PlanManagementDialog
        open={isDialogOpen(DIALOG_IDS.PLAN_MANAGEMENT)}
        onOpenChange={(open) => {
          if (!open) closeDialog(DIALOG_IDS.PLAN_MANAGEMENT);
        }}
        itemName={(getDialogData(DIALOG_IDS.PLAN_MANAGEMENT) as { itemName?: string })?.itemName || "項目"}
        onAddPlan={() => openAddPlan("", "")}
      />
    </>
  );
}
