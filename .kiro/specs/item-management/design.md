# Design Document

## Overview

収支項目管理機能に削除・リネーム機能を追加する設計です。現在のシステムでは項目の追加のみ可能ですが、ユーザビリティ向上のため、各項目に対して削除・リネーム操作を可能にします。

既存のプラン管理ダイアログ（PlanManagementDialog）には既にプランの削除・リネーム機能が実装されているため、同様のパターンを項目管理に適用します。

## Architecture

### 現在のアーキテクチャ

```
PlanDialog
├── CategorySection (収入/支出/資産/負債)
│   ├── 項目リスト表示
│   ├── 項目追加ボタン (+)
│   └── 各項目の操作ボタン
│       ├── プラン管理ボタン (List)
│       └── 金額設定ボタン (Settings)
└── AddItemDialog (項目追加)
```

### 新しいアーキテクチャ

```
PlanDialog (拡張)
├── CategorySection (拡張)
│   ├── 項目リスト表示
│   ├── 項目追加ボタン (+)
│   └── 各項目の操作ボタン (拡張)
│       ├── プラン管理ボタン (List)
│       ├── 金額設定ボタン (Settings)
│       ├── リネームボタン (Edit) ← 新規追加
│       └── 削除ボタン (Trash2) ← 新規追加
├── AddItemDialog (既存)
├── DeleteConfirmDialog ← 新規追加
└── InlineEditMode ← 新規追加
```

## Components and Interfaces

### 1. PlanDialog の拡張

**KISS原則**: 既存のPlanDialogコンポーネントを拡張し、新機能を追加します。

```typescript
// 新しいprops
interface PlanDialogProps {
  // 既存のprops
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: () => void;
  onAddItem?: (category: CategoryType) => void;
  onManagePlans?: (itemId: string) => void;
  onSettingsItem?: (itemId: string) => void;
  
  // 新規追加
  onRenameItem?: (itemId: string, newName: string) => void;
  onDeleteItem?: (itemId: string) => void;
}
```

### 2. 削除確認ダイアログ

**DRY原則**: PlanManagementDialogの削除確認ダイアログを再利用します。

```typescript
interface ItemDeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  onConfirm: () => void;
}
```

### 3. インライン編集機能

**YAGNI原則**: シンプルなインライン編集機能を実装します。

```typescript
interface InlineEditState {
  editingItemId: string | null;
  editingName: string;
}
```

### 4. PlanStore の拡張

```typescript
interface PlanStore {
  // 既存のメソッド
  addItem: (data: AddItemData) => void;
  
  // 新規追加
  removeItem: (itemName: string) => { success: boolean; error?: string };
  renameItem: (oldName: string, newName: string) => { success: boolean; error?: string };
}
```

## Data Models

### 項目削除時のデータ整合性

削除対象データ:
1. **CategoryItems**: 該当カテゴリから項目データを削除
2. **PlanState.plans**: 項目のプラン定義を削除
3. **関連設定**: 項目に紐づく全プランの設定データを削除

### 項目リネーム時のデータ整合性

更新対象データ:
1. **CategoryItems**: カテゴリ内の項目キーを変更
2. **PlanState.plans**: プラン定義のキーを変更
3. **設定データ**: 全プランの設定データを新しいキーに移行

## Error Handling

### バリデーション

**削除時:**
- 項目が存在するかチェック
- システム必須項目（給与、生活費など）の削除防止

**リネーム時:**
- 空の名前の入力防止
- 重複する項目名の防止
- 50文字以内の制限

### エラーメッセージ

```typescript
const ERROR_MESSAGES = {
  ITEM_NOT_FOUND: "指定された項目が見つかりません",
  DUPLICATE_NAME: "同じ名前の項目が既に存在します",
  EMPTY_NAME: "項目名を入力してください",
  NAME_TOO_LONG: "項目名は50文字以内で入力してください",
  SYSTEM_ITEM_DELETE: "システム項目は削除できません",
  DELETE_CONFIRMATION: "この項目を削除しますか？関連するデータも全て削除されます。"
};
```

## Testing Strategy

### 単体テスト

```typescript
describe('Item Management', () => {
  test('removeItem - 正常削除', () => {
    // 項目削除の成功ケース
  });
  
  test('removeItem - システム項目削除防止', () => {
    // 給与、生活費などの削除防止
  });
  
  test('renameItem - 正常リネーム', () => {
    // 項目名変更の成功ケース
  });
  
  test('renameItem - 重複名防止', () => {
    // 既存項目名との重複防止
  });
  
  test('データ整合性チェック', () => {
    // 削除・リネーム後のデータ整合性確認
  });
});
```

### 統合テスト

```typescript
describe('Item Management Integration', () => {
  test('削除操作のフルフロー', () => {
    // UI操作から削除完了まで
  });
  
  test('リネーム操作のフルフロー', () => {
    // インライン編集から保存まで
  });
  
  test('エラーハンドリング', () => {
    // エラー発生時のUI表示確認
  });
});
```

### UI/UXテスト

- 削除確認ダイアログの表示確認
- インライン編集の操作性確認
- ボタンのツールチップ表示確認
- モバイル表示での操作性確認

## Security Considerations

### データ保護
- 削除操作の確認ダイアログ必須
- システム重要項目の削除防止
- ローカルストレージの適切な更新
- 不正な項目名の入力防止

### 入力検証
- XSS攻撃防止のための入力サニタイズ
- 項目名の長さ制限
- 特殊文字の制限

## Performance Considerations

### 最適化ポイント
- 大量項目での削除・リネーム操作の効率化
- React.memoを使用した不要な再レンダリングの防止
- 不要な再レンダリングの防止
- ローカルストレージ更新の最適化

### メモリ管理
- 削除された項目データの適切なクリーンアップ
- イベントリスナーの適切な削除
- 状態管理の最適化

## Implementation Notes

### 段階的実装アプローチ

1. **Phase 1**: PlanStoreの拡張（removeItem, renameItem）
2. **Phase 2**: 削除確認ダイアログの実装
3. **Phase 3**: インライン編集機能の実装
4. **Phase 4**: PlanDialogのUI拡張
5. **Phase 5**: テスト実装とバグ修正

### 既存コードとの互換性

- 既存のPlanDialogの動作に影響しない
- 既存のデータ構造を維持
- 後方互換性を保持

### 技術的制約

- TypeScriptの型安全性を維持
- Zustandの状態管理パターンに準拠
- 既存のUIコンポーネントライブラリを活用
- レスポンシブデザインの維持