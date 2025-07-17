"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePlanStore } from "@/lib/store/plan-store";
import { AmountDialog } from "@/components/dialogs/amount-dialog";
import { PlanManagementDialog } from "@/components/dialogs/plan-management-dialog";
import { AddPlanDialog } from "@/components/dialogs/add-plan-dialog";

export default function TestBadgeFixPage() {
  const store = usePlanStore();
  const [showAmountDialog, setShowAmountDialog] = useState(false);
  const [showPlanManagementDialog, setShowPlanManagementDialog] = useState(false);
  const [showAddPlanDialog, setShowAddPlanDialog] = useState(false);

  const testItemName = "給与";
  const testItemId = "income-給与";


  const handleAddPlan = () => {
    setShowPlanManagementDialog(false);
    setShowAddPlanDialog(true);
  };

  const handlePlanAdded = () => {
    console.log("プラン追加完了");
    setShowAddPlanDialog(false);
    // プラン追加後、AmountDialogを直接開く（プラン追加後はアクティブプランに設定されるため）
    setTimeout(() => {
      setShowAmountDialog(true);
    }, 100);
  };

  const handlePlanSelected = (planName: string) => {
    console.log(`プラン選択: ${planName}`);
    setShowPlanManagementDialog(false);
    setShowAmountDialog(true);
  };

  const getCurrentPlanInfo = () => {
    const activePlan = store.getItemActivePlan(testItemName);
    return {
      name: activePlan.name,
      isDefault: activePlan.isDefault,
      shouldShowBadge: !activePlan.isDefault && activePlan.name !== "デフォルトプラン"
    };
  };

  const planInfo = getCurrentPlanInfo();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">プラン名バッジ表示問題の修正テスト</h1>
      
      <div className="space-y-6">
        {/* 現在の状態表示 */}
        <Card>
          <CardHeader>
            <CardTitle>現在の状態</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>項目名: {testItemName}</div>
              <div>アクティブプラン: {planInfo.name}</div>
              <div>デフォルトプランか: {planInfo.isDefault ? "はい" : "いいえ"}</div>
              <div>バッジ表示判定: {planInfo.shouldShowBadge ? "表示する" : "表示しない"}</div>
              <div>利用可能プラン: {store.plans[testItemName]?.availablePlans.join(", ") || "なし"}</div>
            </div>
          </CardContent>
        </Card>

        {/* 操作ボタン */}
        <Card>
          <CardHeader>
            <CardTitle>操作テスト</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={() => setShowAmountDialog(true)}>
                  AmountDialog開く
                </Button>
                <Button onClick={() => setShowPlanManagementDialog(true)}>
                  プラン管理Dialog開く
                </Button>
                <Button onClick={() => setShowAddPlanDialog(true)}>
                  プラン追加Dialog開く
                </Button>
              </div>
              
              <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded">
                <div className="font-medium mb-2">テストシナリオ:</div>
                <div className="space-y-1">
                  <div>1. 「プラン追加Dialog開く」をクリック</div>
                  <div>2. 「楽観プラン」を入力して追加</div>
                  <div>3. 自動でAmountDialogが開く</div>
                  <div>4. 「楽観プラン」バッジが表示されることを確認</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* デバッグ情報 */}
        <Card>
          <CardHeader>
            <CardTitle>デバッグ情報</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-100 p-4 rounded whitespace-pre-wrap">
              {JSON.stringify({
                plans: store.plans,
                incomes: store.incomes,
                lastError: store.lastError
              }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>

      {/* AmountDialog */}
      <AmountDialog
        open={showAmountDialog}
        onOpenChange={setShowAmountDialog}
        itemId={testItemId}
        itemName={testItemName}
        itemType="flow"
        useUnifiedForm={true}
        onSaveUnified={(data) => {
          console.log("保存データ:", data);
          const result = store.saveAmountSetting(testItemId, planInfo.name, data);
          console.log("保存結果:", result);
          setShowAmountDialog(false);
        }}
      />

      {/* PlanManagementDialog */}
      <PlanManagementDialog
        open={showPlanManagementDialog}
        onOpenChange={setShowPlanManagementDialog}
        itemName={testItemName}
        onAddPlan={handleAddPlan}
        onPlanSelected={handlePlanSelected}
      />

      {/* AddPlanDialog */}
      <AddPlanDialog
        open={showAddPlanDialog}
        onOpenChange={setShowAddPlanDialog}
        itemId={testItemId}
        itemName={testItemName}
        onAdd={handlePlanAdded}
      />
    </div>
  );
}