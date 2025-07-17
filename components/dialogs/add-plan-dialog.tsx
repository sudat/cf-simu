"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddPlanData } from "@/lib/types";
import { usePlanStore } from "@/lib/store/plan-store";
import { AlertCircle } from "lucide-react";

interface AddPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId?: string;
  itemName?: string;
  onAdd?: (data: AddPlanData) => void;
}

export function AddPlanDialog({
  open,
  onOpenChange,
  itemId = "",
  itemName = "項目",
  onAdd,
}: AddPlanDialogProps) {
  const [planName, setPlanName] = useState("");
  const { addItemPlan, setItemActivePlan, lastError, clearError } = usePlanStore();

  // ダイアログが開かれるたびにフォームをリセット
  useEffect(() => {
    if (open) {
      setPlanName("");
      clearError(); // エラー状態もクリア
    }
  }, [open, clearError]);

  const handleAdd = () => {
    if (!itemName || !planName.trim()) return;

    // 項目別プラン追加を実行（重複チェックも含む）
    const result = addItemPlan(itemName, planName.trim());

    if (result.success) {
      // プラン追加後、自動的にアクティブプランに設定
      const setActiveResult = setItemActivePlan(itemName, planName.trim());
      
      if (setActiveResult.success) {
        // プラン変更イベントを発行
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('plan-changed', {
            detail: { itemName, planName: planName.trim() }
          }));
        }
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('[AddPlanDialog] プラン追加後のアクティブプラン設定:', {
          itemName,
          planName: planName.trim(),
          addResult: result,
          setActiveResult
        });
      }

      const data: AddPlanData = {
        itemId,
        planName: planName.trim(),
      };

      onAdd?.(data);
      onOpenChange(false);
    }
    // エラーの場合はlastErrorが設定されるので、UIで表示される
  };

  const handleCancel = () => {
    clearError(); // ダイアログを閉じる時にもエラーをクリア
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) {
        clearError(); // ダイアログが閉じられる時にエラーをクリア
      }
      onOpenChange(open);
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>プラン追加</DialogTitle>
          <DialogDescription>
            {itemName}に新しいプランを追加します
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="planName">プラン名</Label>
            <Input
              id="planName"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="例: 積極投資プラン、コンサバプラン"
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>

          {/* 項目別対応のエラーメッセージ表示 */}
          {lastError && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{lastError}</span>
            </div>
          )}

          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <div className="font-medium mb-1">プラン名の例:</div>
            <div>• コンサバプラン</div>
            <div>• 積極投資プラン</div>
            <div className="mt-2 text-blue-600">
              ※ このプランは「{itemName}」項目でのみ利用できます
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            キャンセル
          </Button>
          <Button onClick={handleAdd} disabled={!planName.trim()}>
            追加
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
