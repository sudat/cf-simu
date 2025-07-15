"use client";

import { useState, useCallback } from "react";
import { HierarchicalDialogState, DialogHistoryItem } from "./types";

export interface UseDialogReturn {
  // ダイアログ状態
  dialogs: Record<string, HierarchicalDialogState>;

  // 基本ダイアログ制御
  openDialog: (dialogId: string, title?: string, data?: unknown) => void;
  closeDialog: (dialogId: string) => void;
  isDialogOpen: (dialogId: string) => boolean;
  getDialogData: (dialogId: string) => unknown;
  getDialogTitle: (dialogId: string) => string | undefined;

  // 階層ナビゲーション機能
  openChildDialog: (
    parentDialogId: string,
    childDialogId: string,
    title?: string,
    data?: unknown
  ) => void;
  goBack: () => void;
  closeAllDialogs: () => void;
  getCurrentDialog: () => string | null;
  getDialogHistory: () => DialogHistoryItem[];
  canGoBack: boolean;
  currentDialogLevel: number;

  // よく使用されるダイアログID
  DIALOG_IDS: {
    PLAN_MAIN: string;
    ADD_ITEM: string;
    PLAN_MANAGEMENT: string;
    ADD_PLAN: string;
    AMOUNT_SETTING: string;
  };
}

export function useDialog(): UseDialogReturn {
  const [dialogs, setDialogs] = useState<
    Record<string, HierarchicalDialogState>
  >({});
  const [dialogHistory, setDialogHistory] = useState<DialogHistoryItem[]>([]);

  const DIALOG_IDS = {
    PLAN_MAIN: "plan-main",
    ADD_ITEM: "add-item",
    PLAN_MANAGEMENT: "plan-management",
    ADD_PLAN: "add-plan",
    AMOUNT_SETTING: "amount-setting",
  };

  // 現在開いているダイアログを取得
  const getCurrentDialog = useCallback(() => {
    const openDialogs = Object.entries(dialogs).filter(
      ([, state]) => state.isOpen
    );
    if (openDialogs.length === 0) return null;

    // 最も階層が深いダイアログを返す
    return openDialogs.reduce((current, [dialogId, state]) => {
      if (!current) return dialogId;
      const currentLevel = dialogs[current]?.level ?? 0;
      return state.level > currentLevel ? dialogId : current;
    }, null as string | null);
  }, [dialogs]);

  // 現在の階層レベルを取得
  const currentDialogLevel = useCallback(() => {
    const current = getCurrentDialog();
    return current ? dialogs[current]?.level ?? 0 : 0;
  }, [dialogs, getCurrentDialog])();

  // 戻ることができるかチェック
  const canGoBack = dialogHistory.length > 0;

  // 基本のダイアログ開く機能
  const openDialog = useCallback(
    (dialogId: string, title?: string, data?: unknown) => {
      setDialogs((prev) => ({
        ...prev,
        [dialogId]: {
          isOpen: true,
          title,
          data,
          level: 0,
        },
      }));

      // 履歴をリセット（新しいルートダイアログ）
      setDialogHistory([]);
    },
    []
  );

  // 子ダイアログを開く（親を閉じて階層を進む）
  const openChildDialog = useCallback(
    (
      parentDialogId: string,
      childDialogId: string,
      title?: string,
      data?: unknown
    ) => {
      const parentDialog = dialogs[parentDialogId];
      if (!parentDialog || !parentDialog.isOpen) {
        console.warn(`Parent dialog ${parentDialogId} is not open`);
        return false;
      }

      // 履歴に親ダイアログを追加
      setDialogHistory((prev) => [
        ...prev,
        {
          dialogId: parentDialogId,
          title: parentDialog.title,
          data: parentDialog.data,
          timestamp: Date.now(),
        },
      ]);

      // 親ダイアログを閉じて子ダイアログを開く
      setDialogs((prev) => ({
        ...prev,
        [parentDialogId]: {
          ...prev[parentDialogId],
          isOpen: false,
        },
        [childDialogId]: {
          isOpen: true,
          title,
          data,
          parentDialogId,
          level: parentDialog.level + 1,
        },
      }));
      
      return true;
    },
    [dialogs]
  );

  // 前のダイアログに戻る
  const goBack = useCallback(() => {
    if (dialogHistory.length === 0) return;

    const lastHistory = dialogHistory[dialogHistory.length - 1];
    const currentDialog = getCurrentDialog();

    if (currentDialog) {
      // 現在のダイアログを閉じる
      setDialogs((prev) => ({
        ...prev,
        [currentDialog]: {
          ...prev[currentDialog],
          isOpen: false,
        },
      }));
    }

    // 前のダイアログを復元
    setDialogs((prev) => ({
      ...prev,
      [lastHistory.dialogId]: {
        ...prev[lastHistory.dialogId],
        isOpen: true,
        title: lastHistory.title,
        data: lastHistory.data,
      },
    }));

    // 履歴から削除
    setDialogHistory((prev) => prev.slice(0, -1));
  }, [dialogHistory, getCurrentDialog]);

  // 全てのダイアログを閉じる
  const closeAllDialogs = useCallback(() => {
    setDialogs((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        updated[key] = {
          ...updated[key],
          isOpen: false,
        };
      });
      return updated;
    });
    setDialogHistory([]);
  }, []);

  // 個別のダイアログを閉じる
  const closeDialog = useCallback((dialogId: string) => {
    setDialogs((prev) => ({
      ...prev,
      [dialogId]: {
        ...prev[dialogId],
        isOpen: false,
      },
    }));

    // 閉じたダイアログが履歴にある場合は削除
    setDialogHistory((prev) =>
      prev.filter((item) => item.dialogId !== dialogId)
    );
  }, []);

  const isDialogOpen = useCallback(
    (dialogId: string) => {
      return dialogs[dialogId]?.isOpen ?? false;
    },
    [dialogs]
  );

  const getDialogData = useCallback(
    (dialogId: string) => {
      return dialogs[dialogId]?.data;
    },
    [dialogs]
  );

  const getDialogTitle = useCallback(
    (dialogId: string) => {
      return dialogs[dialogId]?.title;
    },
    [dialogs]
  );

  const getDialogHistory = useCallback(() => {
    return dialogHistory;
  }, [dialogHistory]);

  return {
    dialogs,
    openDialog,
    closeDialog,
    isDialogOpen,
    getDialogData,
    getDialogTitle,
    openChildDialog,
    goBack,
    closeAllDialogs,
    getCurrentDialog,
    getDialogHistory,
    canGoBack,
    currentDialogLevel,
    DIALOG_IDS,
  };
}

// プラン管理に特化したカスタムフック
export function usePlanDialogs() {
  const dialog = useDialog();
  const [currentItem, setCurrentItem] = useState<{
    id: string;
    name: string;
    type: "flow" | "stock";
    category: "income" | "expense" | "asset" | "debt";
  } | null>(null);

  const openPlanMain = useCallback(() => {
    dialog.openDialog(dialog.DIALOG_IDS.PLAN_MAIN, "収支項目管理");
  }, [dialog]);

  const openAddItem = useCallback(
    (category: "income" | "expense" | "asset" | "debt") => {
      dialog.openChildDialog(
        dialog.DIALOG_IDS.PLAN_MAIN,
        dialog.DIALOG_IDS.ADD_ITEM,
        "項目追加",
        { category }
      );
    },
    [dialog]
  );

  const openPlanManagement = useCallback(
    (itemId: string, itemName: string) => {
      dialog.openChildDialog(
        dialog.DIALOG_IDS.PLAN_MAIN,
        dialog.DIALOG_IDS.PLAN_MANAGEMENT,
        "プラン管理",
        { itemId, itemName }
      );
    },
    [dialog]
  );

  const openAddPlan = useCallback(
    (itemId: string, itemName: string) => {
      dialog.openChildDialog(
        dialog.DIALOG_IDS.PLAN_MANAGEMENT,
        dialog.DIALOG_IDS.ADD_PLAN,
        "プラン追加",
        { itemId, itemName }
      );
    },
    [dialog]
  );

  const openAmountSetting = useCallback(
    (
      itemId: string,
      itemName: string,
      itemType: "flow" | "stock",
      planName?: string
    ) => {
      // アクティブプランを動的に取得（planNameが指定されていない場合）
      const activePlanName = planName || "デフォルトプラン"; // 現在は固定値、後でusePlanStoreから取得予定
      
      // カテゴリをitemIdから抽出
      const parts = itemId.split('-');
      const category = parts[0] as "income" | "expense" | "asset" | "debt";
      
      setCurrentItem({
        id: itemId,
        name: itemName,
        type: itemType,
        category: category,
      });
      
      dialog.openChildDialog(
        dialog.DIALOG_IDS.PLAN_MANAGEMENT,
        dialog.DIALOG_IDS.AMOUNT_SETTING,
        "金額設定",
        { itemId, itemName, itemType, planName: activePlanName }
      );
    },
    [dialog]
  );

  return {
    ...dialog,
    currentItem,
    setCurrentItem,
    openPlanMain,
    openAddItem,
    openPlanManagement,
    openAddPlan,
    openAmountSetting,
  };
}
