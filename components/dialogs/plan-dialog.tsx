"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Clipboard,
  Settings,
} from "lucide-react";
import { CategoryType, PlanItem } from "@/lib/types";

interface PlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: () => void;
  onAddItem?: (category: CategoryType) => void;
  onManagePlans?: (itemId: string) => void;
  onSettingsItem?: (itemId: string) => void;
}

// サンプルデータ（後で実際のデータに置き換え）
const sampleItems: Record<CategoryType, PlanItem[]> = {
  income: [
    {
      id: "salary",
      name: "給与",
      category: "income",
      type: "flow",
      activePlan: "デフォルトプラン",
      availablePlans: ["デフォルトプラン"],
    },
    {
      id: "bonus",
      name: "ボーナス",
      category: "income",
      type: "flow",
      activePlan: "デフォルトプラン",
      availablePlans: ["デフォルトプラン"],
    },
    {
      id: "pension",
      name: "年金",
      category: "income",
      type: "flow",
      activePlan: "デフォルトプラン",
      availablePlans: ["デフォルトプラン"],
    },
  ],
  expense: [
    {
      id: "housing-loan",
      name: "住宅ローン",
      category: "expense",
      type: "flow",
      activePlan: "デフォルトプラン",
      availablePlans: ["デフォルトプラン"],
    },
    {
      id: "living-cost",
      name: "生活費",
      category: "expense",
      type: "flow",
      activePlan: "デフォルトプラン",
      availablePlans: ["デフォルトプラン"],
    },
    {
      id: "education",
      name: "学費",
      category: "expense",
      type: "flow",
      activePlan: "デフォルトプラン",
      availablePlans: ["デフォルトプラン"],
    },
    {
      id: "medical",
      name: "医療費",
      category: "expense",
      type: "flow",
      activePlan: "デフォルトプラン",
      availablePlans: ["デフォルトプラン"],
    },
  ],
  asset: [
    {
      id: "savings",
      name: "預金",
      category: "asset",
      type: "stock",
      activePlan: "デフォルトプラン",
      availablePlans: ["デフォルトプラン"],
    },
    {
      id: "investment",
      name: "投資信託",
      category: "asset",
      type: "stock",
      activePlan: "デフォルトプラン",
      availablePlans: ["デフォルトプラン"],
    },
  ],
  debt: [
    {
      id: "housing-debt",
      name: "住宅ローン残債",
      category: "debt",
      type: "stock",
      activePlan: "デフォルトプラン",
      availablePlans: ["デフォルトプラン"],
    },
    {
      id: "car-loan",
      name: "自動車ローン",
      category: "debt",
      type: "stock",
      activePlan: "デフォルトプラン",
      availablePlans: ["デフォルトプラン"],
    },
  ],
};

const categoryConfig = {
  income: {
    title: "収入",
    bgColor: "bg-brand-500",
    textColor: "text-white",
    hoverColor: "hover:bg-brand-600",
  },
  expense: {
    title: "支出",
    bgColor: "bg-brand-500",
    textColor: "text-white",
    hoverColor: "hover:bg-brand-600",
  },
  asset: {
    title: "資産",
    bgColor: "bg-brand-500",
    textColor: "text-white",
    hoverColor: "hover:bg-brand-600",
  },
  debt: {
    title: "負債",
    bgColor: "bg-brand-500",
    textColor: "text-white",
    hoverColor: "hover:bg-brand-600",
  },
};

export function PlanDialog({
  open,
  onOpenChange,
  onSave,
  onAddItem,
  onManagePlans,
  onSettingsItem,
}: PlanDialogProps) {
  const [items] = useState(sampleItems);

  const handleSave = () => {
    onSave?.();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const CategorySection = ({ category }: { category: CategoryType }) => {
    const config = categoryConfig[category];
    const categoryItems = items[category] || [];

    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-semibold text-gray-800">{config.title}</h3>
          <Button
            size="sm"
            variant="ghost"
            className={`h-8 w-8 p-0 ${config.bgColor} ${config.textColor} rounded-lg text-sm ${config.hoverColor} transition-all duration-200 flex items-center justify-center`}
            onClick={() => onAddItem?.(category)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {categoryItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-md border border-white/30 rounded-xl"
            >
              <span className="text-gray-800">{item.name}</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-all duration-200 flex items-center justify-center"
                  onClick={() => onManagePlans?.(item.id)}
                  title="プラン設定"
                >
                  <Clipboard className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition-all duration-200 flex items-center justify-center"
                  onClick={() => onSettingsItem?.(item.id)}
                  title="金額設定"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {categoryItems.length === 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              項目がありません
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto glass-modal rounded-2xl shadow-2xl" showCloseButton={false}>
        <DialogHeader className="flex justify-between items-center p-4 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold">収支項目管理</DialogTitle>
          <button 
            onClick={handleCancel}
            className="text-2xl text-gray-600 hover:text-gray-800 p-1"
          >
            ×
          </button>
        </DialogHeader>

        <div className="p-4">
          <CategorySection category="income" />
          <CategorySection category="expense" />
          <CategorySection category="asset" />
          <CategorySection category="debt" />
        </div>

        <DialogFooter className="flex gap-3 p-4 border-t border-gray-200">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="flex-1 bg-white/60 backdrop-blur-md border border-white/30 text-gray-700 py-3 rounded-xl font-medium hover:bg-white/80 transition-all duration-200"
          >
            キャンセル
          </Button>
          <Button 
            onClick={handleSave}
            className="flex-1 bg-brand-500 text-white py-3 rounded-xl font-medium hover:bg-brand-600 transition-all duration-200"
          >
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
