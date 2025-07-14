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
import { CategoryType, AddItemData } from "@/lib/types";

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryType | null;
  onAdd?: (data: AddItemData) => void;
}

const categoryConfig = {
  income: {
    title: "収入項目を追加",
    description: "収入項目です。後で金額と期間を設定できます。",
    placeholder: "例: 副業収入",
    type: "flow" as const,
  },
  expense: {
    title: "支出項目を追加",
    description: "支出項目です。後で金額と期間を設定できます。",
    placeholder: "例: 光熱費",
    type: "flow" as const,
  },
  asset: {
    title: "資産項目を追加",
    description: "資産項目です。後で基準金額と増減率を設定できます。",
    placeholder: "例: 株式投資",
    type: "stock" as const,
  },
  debt: {
    title: "負債項目を追加",
    description: "負債項目です。後で基準金額と増減率を設定できます。",
    placeholder: "例: クレジットローン",
    type: "stock" as const,
  },
};

export function AddItemDialog({
  open,
  onOpenChange,
  category,
  onAdd,
}: AddItemDialogProps) {
  const [itemName, setItemName] = useState("");

  // ダイアログが開かれるたびにフォームをリセット
  useEffect(() => {
    if (open) {
      setItemName("");
    }
  }, [open]);

  const handleAdd = () => {
    if (!category || !itemName.trim()) return;

    const config = categoryConfig[category];
    const data: AddItemData = {
      name: itemName.trim(),
      category,
      type: config.type,
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

  if (!category) return null;

  const config = categoryConfig[category];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="itemName">項目名</Label>
            <Input
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder={config.placeholder}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            キャンセル
          </Button>
          <Button onClick={handleAdd} disabled={!itemName.trim()}>
            追加
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
