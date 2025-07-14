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
import { Plus, Check, Edit, Trash2 } from "lucide-react";

interface PlanManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName?: string;
  plans?: string[];
  activePlan?: string;
  onSelectPlan?: (planName: string) => void;
  onAddPlan?: () => void;
  onEditPlan?: (planName: string) => void;
  onDeletePlan?: (planName: string) => void;
}

// サンプルデータ（後で実際のデータに置き換え）
const samplePlans = ["デフォルトプラン", "積極投資プラン", "コンサバプラン"];

export function PlanManagementDialog({
  open,
  onOpenChange,
  itemName = "項目",
  plans = samplePlans,
  activePlan = "デフォルトプラン",
  onSelectPlan,
  onAddPlan,
  onEditPlan,
  onDeletePlan,
}: PlanManagementDialogProps) {
  const [selectedPlan, setSelectedPlan] = useState(activePlan);

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    onSelectPlan?.(planName);
  };

  const handleDeletePlan = (planName: string) => {
    if (planName === "デフォルトプラン") {
      // デフォルトプランは削除不可
      return;
    }

    if (confirm(`「${planName}」を削除しますか？`)) {
      onDeletePlan?.(planName);

      // 削除しようとしているプランが選択中の場合、デフォルトプランに戻す
      if (selectedPlan === planName) {
        setSelectedPlan("デフォルトプラン");
        onSelectPlan?.("デフォルトプラン");
      }
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={onAddPlan}
            title="プラン追加"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3 py-4">
          {plans.map((planName) => {
            const isSelected = selectedPlan === planName;
            const isDefault = planName === "デフォルトプラン";

            return (
              <Card
                key={planName}
                className={`cursor-pointer transition-colors border ${
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => handleSelectPlan(planName)}
              >
                <CardContent className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span
                      className={`font-medium ${
                        isSelected ? "text-blue-700" : "text-gray-800"
                      }`}
                    >
                      {planName}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 bg-gray-100 text-gray-700 hover:bg-gray-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditPlan?.(planName);
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
                          handleDeletePlan(planName);
                        }}
                        title="削除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {plans.length === 0 && (
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
  );
}
