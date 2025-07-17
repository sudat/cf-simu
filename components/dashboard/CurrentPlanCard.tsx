"use client";

import { Button } from "@/components/ui/button";
import { usePlanDialogs } from "@/lib/useDialog";
import { PlanDialog } from "@/components/dialogs/plan-dialog";
import { PlanManagementDialog } from "@/components/dialogs/plan-management-dialog";
import { AddPlanDialog } from "@/components/dialogs/add-plan-dialog";
import { AmountDialog } from "@/components/dialogs/amount-dialog";
import { usePlanStore } from "@/lib/store/plan-store";

export function CurrentPlanCard() {
  const {
    openPlanMain,
    openPlanManagement,
    openAddPlan,
    openAmountSetting,
    isDialogOpen,
    closeDialog,
    getDialogData,
    goBack,
    DIALOG_IDS,
  } = usePlanDialogs();

  const { addItemPlan, saveAmountSetting } = usePlanStore();

  return (
    <>
      <section className="bg-white/90 backdrop-blur-md border border-white/30 p-4 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">現在のプラン</h2>
          <Button
            className="bg-brand-500 border border-brand-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-brand-600 transition-all duration-200 hover:-translate-y-0.5"
            onClick={openPlanMain}
          >
            プラン変更
          </Button>
        </div>
      </section>

      <PlanDialog
        open={isDialogOpen(DIALOG_IDS.PLAN_MAIN)}
        onOpenChange={(open) => {
          if (!open) closeDialog(DIALOG_IDS.PLAN_MAIN);
        }}
        onManagePlans={(itemId) => {
          // 項目IDから項目名を取得 (実際の実装では適切な方法で取得)
          const itemName = itemId.split("-").slice(1).join("-");
          openPlanManagement(itemId, itemName);
        }}
        onSettingsItem={(itemId) => {
          try {
            // itemIdから必要な情報を抽出: "category-name" 形式
            const parts = itemId.split("-");
            if (parts.length < 2) {
              console.error("Invalid itemId format:", itemId);
              return;
            }

            const category = parts[0] as
              | "income"
              | "expense"
              | "asset"
              | "debt";
            const itemName = parts.slice(1).join("-");

            // itemTypeを判定（カテゴリから推測）
            // income/expense: flow, asset/debt: stock
            const itemType =
              category === "income" || category === "expense"
                ? "flow"
                : "stock";

            // 実際の項目のアクティブプランを取得
            const state = usePlanStore.getState();
            const activePlan =
              state.plans[itemName]?.activePlan || "デフォルトプラン";

            openAmountSetting(itemId, itemName, itemType, activePlan);
          } catch (error) {
            console.error("Error opening amount setting:", error);
          }
        }}
        onAddItem={() => {
          // 項目追加機能（実装予定）
        }}
      />

      <PlanManagementDialog
        open={isDialogOpen(DIALOG_IDS.PLAN_MANAGEMENT)}
        onOpenChange={(open) => {
          if (!open) closeDialog(DIALOG_IDS.PLAN_MANAGEMENT);
        }}
        itemName={
          (getDialogData(DIALOG_IDS.PLAN_MANAGEMENT) as { itemName?: string })
            ?.itemName || "項目"
        }
        onAddPlan={() => {
          const data = getDialogData(DIALOG_IDS.PLAN_MANAGEMENT) as {
            itemId?: string;
            itemName?: string;
          };
          openAddPlan(data?.itemId || "", data?.itemName || "");
        }}
      />

      <AddPlanDialog
        open={isDialogOpen(DIALOG_IDS.ADD_PLAN)}
        onOpenChange={(open) => {
          if (!open) closeDialog(DIALOG_IDS.ADD_PLAN);
        }}
        itemId={
          (getDialogData(DIALOG_IDS.ADD_PLAN) as { itemId?: string })?.itemId ||
          ""
        }
        itemName={
          (getDialogData(DIALOG_IDS.ADD_PLAN) as { itemName?: string })
            ?.itemName || "項目"
        }
        onAdd={(data) => {
          const dialogData = getDialogData(DIALOG_IDS.ADD_PLAN) as {
            itemName?: string;
          };
          const itemName = dialogData?.itemName;
          if (itemName) {
            addItemPlan(itemName, data.planName);
          }
          goBack();
        }}
      />

      <AmountDialog
        open={isDialogOpen(DIALOG_IDS.AMOUNT_SETTING)}
        onOpenChange={(open) => {
          if (!open) closeDialog(DIALOG_IDS.AMOUNT_SETTING);
        }}
        itemId={
          (getDialogData(DIALOG_IDS.AMOUNT_SETTING) as { itemId?: string })
            ?.itemId
        }
        itemName={
          (getDialogData(DIALOG_IDS.AMOUNT_SETTING) as { itemName?: string })
            ?.itemName
        }
        itemType={
          (
            getDialogData(DIALOG_IDS.AMOUNT_SETTING) as {
              itemType?: "flow" | "stock";
            }
          )?.itemType
        }
        planName={
          (getDialogData(DIALOG_IDS.AMOUNT_SETTING) as { planName?: string })
            ?.planName
        }
        useUnifiedForm={true}
        onSaveUnified={(data) => {
          const dialogData = getDialogData(DIALOG_IDS.AMOUNT_SETTING) as {
            itemId?: string;
            planName?: string;
          };

          if (dialogData?.itemId && dialogData?.planName) {
            const result = saveAmountSetting(
              dialogData.itemId,
              dialogData.planName,
              data
            );
            if (result.success) {
              console.log("Amount setting saved successfully");
              goBack();
            } else {
              console.error("Failed to save amount setting:", result.error);
              // エラーハンドリング（現在はコンソールログのみ）
            }
          } else {
            console.error("Missing itemId or planName");
          }
        }}
      />
    </>
  );
}
