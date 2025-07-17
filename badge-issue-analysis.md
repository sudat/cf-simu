# プラン選択後にAmountDialogでバッジが表示されない問題の詳細分析

## 修正難易度
★★☆ 修正範囲は狭いが、状態管理とダイアログ連携の技術的な課題がある。バグ0件で修正できる可能性は60%程度。

## 問題の概要

プラン選択後にAmountDialogでプラン名のバッジが表示されない問題について、実際のコードフローを詳しく調査しました。

## 現在のコードフロー

### 1. PlanDialog → PlanManagementDialog の連携

```typescript
// PlanDialog.tsx (行150)
onManagePlans?.(item.id)

// CurrentPlanCard.tsx (行45-49)
onManagePlans={(itemId) => {
  const itemName = itemId.split("-").slice(1).join("-");
  openPlanManagement(itemId, itemName);
}}
```

### 2. PlanManagementDialog でのプラン選択

```typescript
// PlanManagementDialog.tsx (行98-100)
const handleSelectPlan = (planName: string) => {
  setItemActivePlan(itemName, planName);
};
```

### 3. AmountDialog の開き方

```typescript
// CurrentPlanCard.tsx (行50-82)
onSettingsItem={(itemId) => {
  const state = usePlanStore.getState();
  const activePlan = state.plans[itemName]?.activePlan || "デフォルトプラン";
  openAmountSetting(itemId, itemName, itemType, activePlan);
}}
```

### 4. AmountDialog でのプラン情報取得

```typescript
// AmountDialog.tsx (行125-127)
const { getItemActivePlan } = usePlanStore();
const activeItemPlan = getItemActivePlan(itemName);
const isDefaultPlan = activeItemPlan.isDefault;
```

### 5. PlanNameBadge の表示条件

```typescript
// PlanNameBadge.tsx (行14-17)
if (isDefault || planName === "デフォルトプラン") {
  return null;
}
```

## 問題の原因特定

### 主な問題点

1. **ダイアログ連携のタイミング問題**
   - PlanManagementDialogでプラン選択→AmountDialogが開かれる際の状態更新のタイミング
   - usePlanStoreの状態変更とAmountDialogの再レンダリングのタイミング

2. **プラン選択後の状態伝播**
   - `setItemActivePlan`でプランを選択後、AmountDialogに正しく状態が伝播されているか
   - AmountDialogが開かれる際に最新の状態を取得できているか

3. **PlanNameBadgeの表示ロジック**
   - `activeItemPlan.isDefault`の値が正しく更新されているか
   - `activeItemPlan.name`が選択したプラン名になっているか

## 実際のコード検証

### usePlanStore.getItemActivePlan の実装

```typescript
// plan-store.ts (行605-638)
getItemActivePlan: (itemName: string) => {
  const state = get();
  
  if (!state.plans[itemName]) {
    return {
      id: 'default',
      name: 'デフォルトプラン',
      isDefault: true,
      itemName: itemName,
    };
  }

  const activePlanName = state.plans[itemName].activePlan;
  const planIndex = state.plans[itemName].availablePlans.indexOf(activePlanName);

  return {
    id: activePlanName === 'デフォルトプラン' ? 'default' : `${itemName}-plan-${planIndex}`,
    name: activePlanName,
    isDefault: activePlanName === 'デフォルトプラン',
    itemName: itemName,
  };
}
```

### setItemActivePlan の実装

```typescript
// plan-store.ts (行464-562)
setItemActivePlan: (itemName: string, planName: string) => {
  // バリデーション後
  set((state) => {
    const newState = {
      ...state,
      plans: {
        ...state.plans,
        [itemName]: {
          ...state.plans[itemName],
          activePlan: planName,
        },
      },
      lastError: null,
    };
    return newState;
  });
  
  return { success: true };
}
```

## 予想される問題シナリオ

### シナリオ1: ダイアログ連携のタイミング問題

1. PlanManagementDialogでプラン選択
2. `setItemActivePlan`で状態更新
3. AmountDialogが開かれる
4. AmountDialogで`getItemActivePlan`を呼び出し
5. **問題**: 状態更新のタイミングでAmountDialogが古い状態を取得

### シナリオ2: プラン選択からAmountDialogへの直接連携がない

現在のフローでは：
- PlanManagementDialog → プラン選択 → （ダイアログ閉じる）
- PlanDialog → 設定ボタン → AmountDialog開く

この間に状態が正しく伝播されない可能性があります。

## 解決策の提案

### 1. プラン選択時のプラン名バッジ更新の強制

```typescript
// AmountDialog.tsx
useEffect(() => {
  if (open && itemName) {
    // ダイアログが開かれる際に強制的に最新の状態を取得
    const currentActiveItemPlan = getItemActivePlan(itemName);
    // 状態を強制更新
  }
}, [open, itemName, getItemActivePlan]);
```

### 2. プラン選択後の直接連携

```typescript
// PlanManagementDialog.tsx
const handleSelectPlan = (planName: string) => {
  setItemActivePlan(itemName, planName);
  // プラン選択後、AmountDialogを直接開く
  if (onPlanSelected) {
    onPlanSelected(planName);
  }
};
```

### 3. プラン選択コールバックの追加

```typescript
// AmountDialog.tsx
onPlanSelect={() => {
  // プラン選択ボタンクリック時に現在のプラン情報を更新
  const currentActiveItemPlan = getItemActivePlan(itemName);
  // 強制的に再レンダリング
}}
```

## 次のステップ

1. **実際のアプリケーションでの動作確認**
2. **状態更新のタイミングの詳細調査**
3. **解決策の実装と検証**
4. **ユーザー受入テストの実施**

## ユーザー受入テスト項目

プラン選択後のバッジ表示を確認するためのチェックリスト：

- [ ] PlanDialogを開く
- [ ] 項目の「プラン設定」ボタンをクリック
- [ ] PlanManagementDialogが開く
- [ ] 新しいプランを追加
- [ ] 作成したプランを選択
- [ ] PlanManagementDialogを閉じる
- [ ] 同じ項目の「金額設定」ボタンをクリック
- [ ] AmountDialogが開く
- [ ] **期待結果**: 選択したプラン名のバッジが表示される
- [ ] **実際の結果**: バッジが表示されない場合は問題確認

## 技術的な検証ポイント

1. **usePlanStore状態の確認**
   - `plans[itemName].activePlan`が正しく更新されているか
   - `getItemActivePlan`が正しい値を返すか

2. **AmountDialogの再レンダリング**
   - プラン選択後にAmountDialogが適切に再レンダリングされるか
   - `activeItemPlan`の値が正しく更新されるか

3. **PlanNameBadgeの表示ロジック**
   - `isDefault`フラグが正しく設定されているか
   - プラン名が正しく伝播されているか