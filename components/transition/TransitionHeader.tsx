"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { usePlanDialogs } from "@/lib/useDialog";
import { PlanManagementDialog } from "@/components/dialogs/plan-management-dialog";

export function TransitionHeader() {
  const { openPlanMain, isDialogOpen, closeDialog, DIALOG_IDS } = usePlanDialogs();
  
  // プラン一覧の状態管理
  const [plans, setPlans] = useState<string[]>(["デフォルトプラン", "積極投資プラン", "コンサバプラン"]);
  const [activePlan, setActivePlan] = useState<string>("デフォルトプラン");
  
  // コールバック関数の実装
  const handleAddPlan = () => {
    alert("新規プラン追加機能は準備中です");
  };
  
  const handleEditPlan = (planName: string) => {
    alert(`プラン「${planName}」の編集機能は準備中です`);
  };
  
  const handleDeletePlan = (planName: string) => {
    if (planName === "デフォルトプラン") {
      alert("デフォルトプランは削除できません");
      return;
    }
    
    const updatedPlans = plans.filter(plan => plan !== planName);
    setPlans(updatedPlans);
    
    // 削除されたプランがアクティブプランの場合、デフォルトプランに戻す
    if (activePlan === planName) {
      setActivePlan("デフォルトプラン");
    }
  };
  
  const handleSelectPlan = (planName: string) => {
    setActivePlan(planName);
  };

  return (
    <>
      <section className="bg-white/90 backdrop-blur-md border border-white/30 p-4 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">推移分析</h1>
          <Button 
            className="bg-brand-500 border border-brand-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-brand-600 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-1"
            onClick={openPlanMain}
          >
            <Settings className="w-4 h-4" />
            <span>{activePlan}</span>
          </Button>
        </div>
      </section>

      <PlanManagementDialog
        open={isDialogOpen(DIALOG_IDS.PLAN_MAIN)}
        onOpenChange={(open) => {
          if (!open) closeDialog(DIALOG_IDS.PLAN_MAIN);
        }}
        itemName="推移分析プラン"
        plans={plans}
        activePlan={activePlan}
        onSelectPlan={handleSelectPlan}
        onAddPlan={handleAddPlan}
        onEditPlan={handleEditPlan}
        onDeletePlan={handleDeletePlan}
      />
    </>
  );
}
