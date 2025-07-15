"use client";

import React, { useState } from "react";
import { 
  AmountDialog, 
  AmountSettingDialog, 
  AmountSettingFormData,
  AmountSettingData
} from "@/components/dialogs";
import { Button } from "@/components/ui/button";

export default function TestAmountDialogPage() {
  // 統合ダイアログ用
  const [isUnifiedOpen, setIsUnifiedOpen] = useState(false);
  const [unifiedSavedData, setUnifiedSavedData] = useState<AmountSettingFormData | null>(null);
  
  // 既存ダイアログ用
  const [isLegacyOpen, setIsLegacyOpen] = useState(false);
  const [legacySavedData, setLegacySavedData] = useState<AmountSettingData | null>(null);
  
  // 元のAmountSettingDialog用
  const [isOriginalOpen, setIsOriginalOpen] = useState(false);
  const [originalSavedData, setOriginalSavedData] = useState<AmountSettingFormData | null>(null);

  const handleUnifiedSave = (data: AmountSettingFormData) => {
    setUnifiedSavedData(data);
    console.log("統合フォーム保存データ:", data);
  };

  const handleLegacySave = (data: AmountSettingData) => {
    setLegacySavedData(data);
    console.log("既存フォーム保存データ:", data);
  };

  const handleOriginalSave = (data: AmountSettingFormData) => {
    setOriginalSavedData(data);
    console.log("元のAmountSettingDialog保存データ:", data);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">統合AmountDialog テスト</h1>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">ダイアログテスト</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-medium mb-2">統合AmountDialog（推奨）</h3>
                <Button onClick={() => setIsUnifiedOpen(true)} className="mr-2">
                  統合フォームで開く
                </Button>
                <Button onClick={() => setIsLegacyOpen(true)} variant="outline">
                  既存モードで開く
                </Button>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">元のAmountSettingDialog（非推奨）</h3>
                <Button onClick={() => setIsOriginalOpen(true)} variant="secondary">
                  元のダイアログで開く
                </Button>
              </div>
            </div>
          </div>

          {(unifiedSavedData || legacySavedData || originalSavedData) && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">保存されたデータ</h2>
              
              {unifiedSavedData && (
                <div className="mb-4">
                  <h3 className="font-medium mb-2">統合フォームデータ:</h3>
                  <pre className="bg-green-100 p-4 rounded text-sm">
                    {JSON.stringify(unifiedSavedData, null, 2)}
                  </pre>
                </div>
              )}
              
              {legacySavedData && (
                <div className="mb-4">
                  <h3 className="font-medium mb-2">既存モードデータ:</h3>
                  <pre className="bg-blue-100 p-4 rounded text-sm">
                    {JSON.stringify(legacySavedData, null, 2)}
                  </pre>
                </div>
              )}
              
              {originalSavedData && (
                <div className="mb-4">
                  <h3 className="font-medium mb-2">元のAmountSettingDialogデータ:</h3>
                  <pre className="bg-yellow-100 p-4 rounded text-sm">
                    {JSON.stringify(originalSavedData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">テスト項目</h2>
            <div className="space-y-2 text-sm">
              <h3 className="font-medium">バリデーション機能（統合フォーム）:</h3>
              <ul className="space-y-1 ml-4">
                <li>• 年度(開始): 必須、1900-2100年、整数のみ</li>
                <li>• 年度(終了): 任意、開始年度より後、100年以内</li>
                <li>• 増減金額: 任意、整数のみ、9億円以内</li>
                <li>• 増減率: 任意、整数のみ、-100%以上1000%以下</li>
                <li>• 増減金額と増減率の同時指定不可</li>
                <li>• リアルタイムバリデーションとエラー表示</li>
                <li>• キーボードショートカット（Enter/Escape）</li>
              </ul>
              
              <h3 className="font-medium mt-4">統合機能:</h3>
              <ul className="space-y-1 ml-4">
                <li>• 既存AmountDialogと新AmountSettingDialogの統合</li>
                <li>• 後方互換性を維持した機能拡張</li>
                <li>• 統合フォームと既存モードの選択可能</li>
                <li>• 型安全性とデータ変換機能</li>
              </ul>
              
              <h3 className="font-medium mt-4">計算例機能:</h3>
              <ul className="space-y-1 ml-4">
                <li>• 複利計算の実装</li>
                <li>• 年額/月額の単位変換</li>
                <li>• 数値フォーマット（カンマ区切り）</li>
                <li>• リアルタイム計算例表示</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 統合AmountDialog（統合フォームモード） */}
        <AmountDialog
          open={isUnifiedOpen}
          onOpenChange={setIsUnifiedOpen}
          itemId="salary"
          itemName="給与"
          itemType="flow"
          planName="デフォルトプラン"
          useUnifiedForm={true}
          onSaveUnified={handleUnifiedSave}
        />
        
        {/* 統合AmountDialog（既存モード） */}
        <AmountDialog
          open={isLegacyOpen}
          onOpenChange={setIsLegacyOpen}
          itemId="salary_legacy"
          itemName="給与（既存モード）"
          itemType="flow"
          planName="デフォルトプラン"
          useUnifiedForm={false}
          onSave={handleLegacySave}
        />
        
        {/* 元のAmountSettingDialog（非推奨） */}
        <AmountSettingDialog
          open={isOriginalOpen}
          onOpenChange={setIsOriginalOpen}
          itemName="給与（元ダイアログ）"
          planName="デフォルトプラン"
          onSave={handleOriginalSave}
        />
      </div>
    </div>
  );
}