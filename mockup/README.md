# キャッシュフローシミュレーション - 階層ナビゲーション対応

## 統合フロー

```
プラン変更ボタン → PlanDialog（収支項目管理）→ PlanManagementDialog → AmountDialog
```

## 主要コンポーネント

### 1. CurrentPlanCard
- **場所**: `components/dashboard/CurrentPlanCard.tsx`
- **機能**: 現在のプランを表示し、プラン変更ボタンを提供
- **ダイアログ**: PlanDialog → PlanManagementDialog → AmountDialog

### 2. TransitionHeader  
- **場所**: `components/transition/TransitionHeader.tsx`
- **機能**: ヘッダーにプラン情報とプラン変更ボタンを表示
- **ダイアログ**: PlanDialog → PlanManagementDialog → AmountDialog

### 3. PlanDialog
- **場所**: `components/dialogs/plan-dialog.tsx`
- **機能**: 収支項目の管理（追加、編集、削除）
- **ナビゲーション**: プラン管理ボタンでPlanManagementDialogへ

### 4. PlanManagementDialog
- **場所**: `components/dialogs/plan-management-dialog.tsx`
- **機能**: プランの作成、編集、削除
- **ナビゲーション**: 編集ボタンでPlanDialogへ戻る

### 5. AmountDialog
- **場所**: `components/dialogs/amount-dialog.tsx`
- **機能**: 金額設定（フロー型/ストック型）
- **ナビゲーション**: 保存後にPlanDialogへ戻る

## 状態管理

### usePlanDialogs フック
- **場所**: `lib/useDialog.ts`
- **機能**: 
  - 階層ダイアログの状態管理
  - プランデータの管理
  - ダイアログ間のナビゲーション
  - 非同期のAmountDialog処理

## 型定義

- **場所**: `lib/types.ts`
- **含まれる型**:
  - `PlanData`: プランの基本情報
  - `IncomeItem`, `ExpenseItem`: 収支項目
  - `FlowFormData`, `StockFormData`: 金額設定データ
  - 各ダイアログのProps型

## 使用方法

```tsx
import CurrentPlanCard from './components/dashboard/CurrentPlanCard';
import TransitionHeader from './components/transition/TransitionHeader';

// ダッシュボードでの使用
<CurrentPlanCard />

// ヘッダーでの使用  
<TransitionHeader />
```

## 実装の特徴

1. **階層ナビゲーション**: 各ダイアログから他のダイアログへスムーズに遷移
2. **状態の一元管理**: usePlanDialogsでプランデータと各ダイアログの状態を管理
3. **再利用可能性**: CurrentPlanCardとTransitionHeaderで同じフック・コンポーネントを使用
4. **非同期処理**: AmountDialogはPromiseベースで値の受け渡しを行う
5. **型安全性**: TypeScriptで全ての状態と Props を型定義

## 修正難易度: ★★☆

修正範囲は複数コンポーネントにまたがるが、各コンポーネントは独立性が高く、明確な責務分離により保守性が確保されています。