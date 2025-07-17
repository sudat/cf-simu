"use client";

import { usePlanStore } from "@/lib/store/plan-store";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebugBadgePage() {
  const store = usePlanStore();
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setDebugLog(prev => [...prev, message]);
  };

  const clearLog = () => {
    setDebugLog([]);
  };

  const runDebugTest = () => {
    clearLog();
    addLog("=== プラン設定とバッジ表示問題の調査 ===");
    
    // 1. 現在のプラン設定を確認
    addLog("1. 現在のプラン設定:");
    addLog(`Plans: ${JSON.stringify(store.plans, null, 2)}`);
    
    // 2. 各項目の状態を確認
    addLog("\n2. 各項目の状態確認:");
    Object.entries(store.plans).forEach(([itemName, planConfig]) => {
      addLog(`\n項目: ${itemName}`);
      addLog(`  利用可能プラン: ${planConfig.availablePlans.join(", ")}`);
      addLog(`  アクティブプラン: ${planConfig.activePlan}`);
      addLog(`  デフォルトプランか: ${planConfig.activePlan === "デフォルトプラン"}`);
      
      // getItemActivePlan関数の動作確認
      const activePlan = store.getItemActivePlan(itemName);
      addLog(`  getItemActivePlan結果: ${JSON.stringify(activePlan)}`);
      addLog(`  バッジ表示判定: ${!activePlan.isDefault && activePlan.name !== "デフォルトプラン"}`);
    });
    
    // 3. 設定データとプラン定義の一致確認
    addLog("\n3. 設定データとプラン定義の一致確認:");
    const categories = [
      { key: 'incomes', name: '収入' },
      { key: 'expenses', name: '支出' },
      { key: 'assets', name: '資産' },
      { key: 'debts', name: '負債' }
    ] as const;
    
    categories.forEach(({ key, name }) => {
      const categoryData = store[key];
      addLog(`\n${name}カテゴリ:`);
      Object.entries(categoryData).forEach(([itemName, itemData]) => {
        addLog(`  項目: ${itemName}`);
        addLog(`    設定されているプラン: ${Object.keys(itemData.settings).join(", ")}`);
        addLog(`    プラン定義: ${store.plans[itemName]?.availablePlans.join(", ") || "なし"}`);
        addLog(`    アクティブプラン: ${store.plans[itemName]?.activePlan || "なし"}`);
      });
    });
  };

  const testPlanAddition = () => {
    addLog("\n4. プラン追加処理のシミュレーション:");
    // 給与項目に楽観プランを追加してみる
    const testItemName = "給与";
    const testPlanName = "楽観プラン";
    
    addLog(`${testItemName}に${testPlanName}を追加前の状態:`);
    addLog(`  プラン定義: ${store.plans[testItemName]?.availablePlans.join(", ") || "なし"}`);
    addLog(`  アクティブプラン: ${store.plans[testItemName]?.activePlan || "なし"}`);
    
    const addResult = store.addItemPlan(testItemName, testPlanName);
    addLog(`プラン追加結果: ${addResult.success ? "成功" : "失敗"}`);
    if (!addResult.success) {
      addLog(`エラー: ${addResult.error}`);
    }
    
    // 追加後の状態確認
    addLog(`${testItemName}に${testPlanName}を追加後の状態:`);
    addLog(`  プラン定義: ${store.plans[testItemName]?.availablePlans.join(", ") || "なし"}`);
    addLog(`  アクティブプラン: ${store.plans[testItemName]?.activePlan || "なし"}`);
  };

  const testActiveSetup = () => {
    addLog("\n5. アクティブプラン設定のシミュレーション:");
    const testItemName = "給与";
    const testPlanName = "楽観プラン";
    
    const setActiveResult = store.setItemActivePlan(testItemName, testPlanName);
    addLog(`アクティブプラン設定結果: ${setActiveResult.success ? "成功" : "失敗"}`);
    if (!setActiveResult.success) {
      addLog(`エラー: ${setActiveResult.error}`);
    }
    
    // 設定後の状態確認
    addLog(`${testItemName}のアクティブプラン設定後の状態:`);
    addLog(`  プラン定義: ${store.plans[testItemName]?.availablePlans.join(", ") || "なし"}`);
    addLog(`  アクティブプラン: ${store.plans[testItemName]?.activePlan || "なし"}`);
    
    const finalActivePlan = store.getItemActivePlan(testItemName);
    addLog(`  getItemActivePlan結果: ${JSON.stringify(finalActivePlan)}`);
    addLog(`  バッジ表示判定: ${!finalActivePlan.isDefault && finalActivePlan.name !== "デフォルトプラン"}`);
  };

  const testAmountDialogItemName = () => {
    addLog("\n6. AmountDialogで使用されるitemName確認:");
    const mockItemId = "income-給与";
    const parts = mockItemId.split('-');
    const extractedItemName = parts.slice(1).join('-');
    addLog(`itemId: ${mockItemId}`);
    addLog(`抽出されるitemName: ${extractedItemName}`);
    addLog(`プラン定義存在: ${!!store.plans[extractedItemName]}`);
    
    if (store.plans[extractedItemName]) {
      const dialogActivePlan = store.getItemActivePlan(extractedItemName);
      addLog(`AmountDialogで取得されるアクティブプラン: ${JSON.stringify(dialogActivePlan)}`);
      addLog(`AmountDialogでのバッジ表示判定: ${!dialogActivePlan.isDefault && dialogActivePlan.name !== "デフォルトプラン"}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">プラン設定とバッジ表示問題のデバッグ</h1>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={runDebugTest}>基本状態確認</Button>
          <Button onClick={testPlanAddition}>プラン追加テスト</Button>
          <Button onClick={testActiveSetup}>アクティブプラン設定テスト</Button>
          <Button onClick={testAmountDialogItemName}>AmountDialogテスト</Button>
          <Button onClick={clearLog} variant="outline">ログクリア</Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>デバッグログ</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap max-h-96 overflow-y-auto bg-gray-100 p-4">
              {debugLog.join('\n')}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}