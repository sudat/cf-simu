# Design Document

## Overview

プラン管理システムを項目別独立管理に変更するための設計です。現在のグローバルプラン管理から、各項目が独自のプランセットを持つ構造に変更し、プランの作成・削除・選択が他の項目に影響しないようにします。

## Architecture

### Current Architecture Issues

現在の問題点：

- `globalPlans`配列でプランをグローバル管理
- `plans[itemName].availablePlans`で項目別の利用可能プランを管理
- プラン追加時に`globalPlans`に追加し、特定項目の`availablePlans`にも追加
- プラン削除時に`globalPlans`から削除するため、他の項目からも削除される

### New Architecture

新しい設計：

- プランを項目別に完全独立管理
- `globalPlans`は廃止し、各項目が独自のプランデータを保持
- デフォルトプランは特別扱いで全項目に自動提供

## Components and Interfaces

### Data Structure Changes

#### Before (Current)

```typescript
interface PlanStore {
  globalPlans: PlanDefinition[]; // グローバルプラン管理
  plans: {
    [itemName: string]: {
      availablePlans: string[]; // プラン名の配列
      activePlan: string;
    };
  };
}
```

#### After (New)

```typescript
interface PlanStore {
  plans: {
    [itemName: string]: {
      itemPlans: PlanDefinition[]; // 項目別プラン定義
      activePlan: string;
    };
  };
}

interface PlanDefinition {
  id: string;
  name: string;
  isDefault: boolean;
  itemName: string; // 所属項目名を追加
}
```

### Core Functions Redesign

#### 1. プラン追加 (addPlan)

```typescript
// 新しい実装
addPlan: (planName: string, itemName: string) => {
  // 特定項目にのみプランを追加
  // globalPlansは使用しない
  // itemName必須パラメータ
};
```

#### 2. プラン削除 (deletePlan)

```typescript
// 新しい実装
deletePlan: (planId: string, itemName: string) => {
  // 特定項目からのみプランを削除
  // 他の項目の同名プランには影響しない
};
```

#### 3. プラン取得 (getAvailablePlans)

```typescript
// 新しい関数
getAvailablePlans: (itemName: string) => PlanDefinition[] => {
  // デフォルトプラン + 項目固有プラン
  // 他の項目のプランは含まない
}
```

## Data Models

### Migration Strategy

既存データの移行：

1. `globalPlans`から各項目の`itemPlans`に移行
2. デフォルトプラン以外は最初に作成された項目に割り当て
3. 既存の`availablePlans`配列は削除

### Default Plan Handling

デフォルトプランの特別扱い：

- すべての項目で自動的に利用可能
- 削除不可
- 項目作成時に自動追加
- `isDefault: true`フラグで識別

## Error Handling

### Validation Rules

1. プラン名の重複チェックは項目内でのみ実施
2. デフォルトプランの削除を防止
3. 存在しない項目へのプラン操作を防止
4. 必須パラメータ（itemName）の検証

### Error Messages

- "同じ項目内に同じ名前のプランが既に存在します"
- "デフォルトプランは削除できません"
- "指定された項目が見つかりません"
- "項目名は必須です"

## Testing Strategy

### Unit Tests

1. プラン追加の項目別独立性テスト
2. プラン削除の項目別独立性テスト
3. デフォルトプランの自動提供テスト
4. データ移行の整合性テスト

### Integration Tests

1. UI 操作による項目別プラン管理テスト
2. プラン選択と金額設定の連携テスト
3. 複数項目での同名プラン作成テスト

### Migration Tests

1. 既存データの移行テスト
2. 後方互換性テスト
3. データ整合性テスト

## Implementation Notes

### Phase 1: Data Structure Migration

- 既存の`globalPlans`から新しい`itemPlans`構造への移行
- 後方互換性を保つためのアダプター関数

### Phase 2: Core Functions Update

- `addPlan`, `deletePlan`, `renamePlan`の項目別対応
- 新しい`getAvailablePlans`関数の実装

### Phase 3: UI Components Update

- `PlanManagementDialog`の項目別プラン表示
- プラン操作の項目スコープ対応
- `AddPlanDialog`の項目別プラン追加機能（完了）

### Phase 4: Testing and Validation

- 全機能の動作確認
- データ移行の検証
- パフォーマンステスト
