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
import { Plus, List, Settings } from "lucide-react";
import {
  CategoryType,
  AddItemData,
  CategoryItems,
  ItemSetting,
} from "@/lib/types";
import { AddItemDialog } from "./add-item-dialog";
import { usePlanStore } from "@/lib/store/plan-store";
import type { PlanStore } from "@/lib/store/plan-store";
import { PlanNameBadge } from "./amount-dialog/components/PlanNameBadge";

interface PlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: () => void;
  onAddItem?: (category: CategoryType) => void;
  onManagePlans?: (itemId: string) => void;
  onSettingsItem?: (itemId: string) => void;
}

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
  // Zustandストアからデータ取得
  const incomes = usePlanStore((s: PlanStore) => s.incomes);
  const expenses = usePlanStore((s: PlanStore) => s.expenses);
  const assets = usePlanStore((s: PlanStore) => s.assets);
  const debts = usePlanStore((s: PlanStore) => s.debts);
  const addItem = usePlanStore((s: PlanStore) => s.addItem);
  const getItemActivePlan = usePlanStore((s: PlanStore) => s.getItemActivePlan);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null
  );

  const handleSave = () => {
    onSave?.();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleAddItemClick = (category: CategoryType) => {
    setSelectedCategory(category);
    setShowAddDialog(true);
    onAddItem?.(category);
  };

  const handleAddItem = (data: AddItemData) => {
    addItem(data);
    setShowAddDialog(false);
    setSelectedCategory(null);
  };

  const categoryItemsMap: Record<CategoryType, CategoryItems> = {
    income: incomes,
    expense: expenses,
    asset: assets,
    debt: debts,
  };

  const CategorySection = ({ category }: { category: CategoryType }) => {
    const config = categoryConfig[category];
    const categoryItems = Object.entries(categoryItemsMap[category] || {}).map(
      ([name, value]: [
        string,
        { type: "flow" | "stock"; settings: ItemSetting }
      ]) => ({
        id: `${category}-${name}`,
        name,
        category,
        type: value.type,
        activePlan: "デフォルトプラン",
        availablePlans: ["デフォルトプラン"],
      })
    );

    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-semibold text-gray-800">
            {config.title}
          </h3>
          <Button
            size="sm"
            variant="ghost"
            className={`h-8 w-8 p-0 ${config.bgColor} ${config.textColor} rounded-lg text-sm ${config.hoverColor} transition-all duration-200 flex items-center justify-center`}
            onClick={() => handleAddItemClick(category)}
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
              <div className="flex items-center gap-2">
                <span className="text-gray-800">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <PlanNameBadge 
                  planName={getItemActivePlan(item.name).name}
                  isDefault={getItemActivePlan(item.name).isDefault}
                />
                <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-all duration-200 flex items-center justify-center"
                  onClick={() => onManagePlans?.(item.id)}
                  title="プラン設定"
                >
                  <List className="w-4 h-4" />
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
      <DialogContent
        className="max-w-sm max-h-[80vh] overflow-y-auto glass-modal rounded-2xl shadow-2xl"
      >
        <DialogHeader className="p-4 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold">
            収支項目管理
          </DialogTitle>
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

        <AddItemDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          category={selectedCategory}
          onAdd={handleAddItem}
        />
      </DialogContent>
    </Dialog>
  );
}
