"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Plus,
  CheckCircle,
  Edit,
  Trash2,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { usePlanStore } from "@/lib/store/plan-store";

interface PlanManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName?: string;
  onAddPlan?: () => void;
}

// 削除確認ダイアログ
interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName: string;
  onConfirm: () => void;
}

function DeleteConfirmDialog({
  open,
  onOpenChange,
  planName,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>プラン削除の確認</DialogTitle>
          <DialogDescription>
            「{planName}」を削除しますか？
            <br />
            この操作は取り消せません。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            削除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PlanManagementDialog({
  open,
  onOpenChange,
  itemName = "項目",
  onAddPlan,
}: PlanManagementDialogProps) {
  const {
    getAvailablePlans,
    deleteItemPlan,
    setItemActivePlan,
    renameItemPlan,
    plans,
    lastError,
  } = usePlanStore();

  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // 項目のプラン一覧を取得（新しいgetAvailablePlans関数を使用）
  const itemPlans = getAvailablePlans(itemName);

  // プラン選択（項目別プラン管理）
  const handleSelectPlan = (planName: string) => {
    setItemActivePlan(itemName, planName);
  };

  // インライン編集開始
  const handleEditStart = (planId: string, currentName: string) => {
    setEditingPlanId(planId);
    setEditingName(currentName);
  };

  // インライン編集確定（項目別プラン管理対応）
  const handleEditConfirm = () => {
    if (editingPlanId && editingName.trim()) {
      const result = renameItemPlan(
        itemName,
        editingPlanId,
        editingName.trim()
      );
      if (result.success) {
        setEditingPlanId(null);
        setEditingName("");
      }
      // エラーの場合はlastErrorが更新されるのでUIに表示される
    } else {
      // 空の名前の場合はキャンセル扱い
      handleEditCancel();
    }
  };

  // インライン編集キャンセル
  const handleEditCancel = () => {
    setEditingPlanId(null);
    setEditingName("");
  };

  // 削除確認ダイアログ表示
  const handleDeleteStart = (planId: string, planName: string) => {
    setPlanToDelete({ id: planId, name: planName });
    setDeleteConfirmOpen(true);
  };

  // 削除実行
  const handleDeleteConfirm = () => {
    if (planToDelete) {
      deleteItemPlan(itemName, planToDelete.name);
      setPlanToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };

  // 新規プラン追加
  const handleAddPlan = () => {
    onAddPlan?.();
  };

  const handleClose = () => {
    // 編集中の場合はキャンセル
    if (editingPlanId) {
      handleEditCancel();
    }
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{itemName} - プラン管理</DialogTitle>
            <DialogDescription>
              この項目に設定するプランを選択してください
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end mb-4">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 bg-blue-500 text-white hover:bg-blue-600"
              onClick={handleAddPlan}
              title="プラン追加"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {lastError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">{lastError}</p>
            </div>
          )}

          <div className="space-y-3 py-4">
            {itemPlans.map((plan) => {
              // 特定項目のプラン管理か、グローバルプラン管理かで選択状態を判定
              const isActive =
                itemName !== "項目" && plans[itemName]
                  ? plans[itemName].activePlan === plan.name
                  : plan.isDefault;
              const isDefault = plan.isDefault;
              const isEditing = editingPlanId === plan.id;

              return (
                <Card
                  key={plan.id}
                  className={`transition-colors border ${
                    isActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  } ${isEditing ? "ring-2 ring-blue-300" : ""}`}
                  onClick={() => !isEditing && handleSelectPlan(plan.name)}
                >
                  <CardContent className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          isActive ? "text-blue-500" : "text-gray-300"
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </div>

                      {isEditing ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="h-8 text-sm"
                            placeholder="プラン名を入力"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleEditConfirm();
                              } else if (e.key === "Escape") {
                                handleEditCancel();
                              }
                            }}
                            autoFocus
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 bg-green-100 text-green-700 hover:bg-green-200"
                            onClick={handleEditConfirm}
                            title="確定"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 bg-gray-100 text-gray-700 hover:bg-gray-200"
                            onClick={handleEditCancel}
                            title="キャンセル"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <span
                          className={`font-medium ${
                            isActive ? "text-blue-700" : "text-gray-800"
                          }`}
                        >
                          {plan.name}
                        </span>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 bg-gray-100 text-gray-700 hover:bg-gray-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditStart(plan.id, plan.name);
                          }}
                          title="編集"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {!isDefault && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 bg-red-100 text-red-700 hover:bg-red-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteStart(plan.id, plan.name);
                            }}
                            title="削除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {itemPlans.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                プランがありません
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={handleClose}>閉じる</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        planName={planToDelete?.name || ""}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
