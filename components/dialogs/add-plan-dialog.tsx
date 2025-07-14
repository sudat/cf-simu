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

  // ダイアログが開かれるたびにフォームをリセット
  useEffect(() => {
    if (open) {
      setPlanName("");
    }
  }, [open]);

  const handleAdd = () => {
    if (!itemId || !planName.trim()) return;

    const data: AddPlanData = {
      itemId,
      planName: planName.trim(),
    };

    onAdd?.(data);
    onOpenChange(false);
  };

  const handleCancel = () => {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
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

          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <div className="font-medium mb-1">プラン名の例:</div>
            <div>• コンサバプラン</div>
            <div>• 積極投資プラン</div>
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
