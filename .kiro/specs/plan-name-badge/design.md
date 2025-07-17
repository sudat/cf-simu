# Design Document

## Overview

収支項目ダイアログ（AmountDialog）において、現在アクティブなプラン名をバッジ形式で表示する機能を追加します。この機能により、ユーザーはダイアログを開いた瞬間に現在の設定状況を把握でき、プラン選択ボタンを押さなくても現在のプラン名を確認できるようになります。

## Architecture

### コンポーネント構造
```
AmountDialog
├── DialogHeader
│   ├── DialogTitle
│   └── DialogDescription (プラン名バッジを含む)
├── DialogContent (フォーム部分)
└── DialogFooter (ボタン部分)
```

### 新規追加要素
- **ShadcnのBadgeコンポーネント**: プラン名を表示するためのバッジ（新規インストール）
- **プラン選択ボタン**: 既存のAmountDialogに新規追加

## Components and Interfaces

### 1. ShadcnのBadgeコンポーネントの使用

```typescript
import { Badge } from "@/components/ui/badge";

interface PlanNameBadgeProps {
  planName: string;
  isDefault?: boolean;
  className?: string;
}

export function PlanNameBadge({ 
  planName, 
  isDefault = false, 
  className = "" 
}: PlanNameBadgeProps) {
  // デフォルトプランの場合は表示しない
  if (isDefault || planName === "デフォルトプラン") {
    return null;
  }

  return (
    <Badge 
      variant="secondary" 
      className={`bg-blue-100 text-blue-800 hover:bg-blue-200 ${className}`}
    >
      {planName}
    </Badge>
  );
}
```

**前提条件**: ShadcnのBadgeコンポーネントをインストールする必要があります：
```bash
bunx shadcn@latest add badge
```

### 2. AmountDialog の拡張

```typescript
interface AmountDialogProps {
  // 既存のprops...
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId?: string;
  itemName?: string;
  itemType?: ItemType;
  planName?: string;
  initialData?: FlowItemDetail | StockItemDetail;
  onSave?: (data: AmountSettingData) => void;
  useUnifiedForm?: boolean;
  onSaveUnified?: (data: AmountSettingFormData) => void;
  
  // 新規追加
  onPlanSelect?: () => void; // プラン選択ボタンのコールバック
}
```

### 3. プラン選択ボタンコンポーネント

```typescript
interface PlanSelectButtonProps {
  currentPlan: string;
  onClick: () => void;
  className?: string;
}

function PlanSelectButton({ 
  currentPlan, 
  onClick, 
  className = "" 
}: PlanSelectButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={`text-blue-600 border-blue-300 hover:bg-blue-50 ${className}`}
    >
      プラン選択
    </Button>
  );
}
```

## Data Models

### プラン情報の取得
```typescript
// usePlanStoreから現在のアクティブプランを取得
const getActiveItemPlan = (itemName: string) => {
  const { getItemActivePlan } = usePlanStore();
  return getItemActivePlan(itemName);
};

// デフォルトプランかどうかの判定
const isDefaultPlan = (planName: string) => {
  return planName === "デフォルトプラン";
};
```

## Error Handling

### エラーケース
1. **プラン情報取得エラー**: プラン情報が取得できない場合はデフォルトプランとして扱う
2. **プラン名が長すぎる場合**: CSS ellipsisで省略表示
3. **プラン選択ボタンのコールバックエラー**: エラーログを出力し、ユーザーには通知しない

### エラー処理実装
```typescript
const safeGetActivePlan = (itemName: string) => {
  try {
    const activePlan = getItemActivePlan(itemName);
    return activePlan;
  } catch (error) {
    console.warn('プラン情報の取得に失敗しました:', error);
    return {
      id: 'default',
      name: 'デフォルトプラン',
      isDefault: true,
      itemName: itemName,
    };
  }
};
```

## Testing Strategy

### 単体テスト
1. **PlanNameBadge コンポーネント**
   - デフォルトプランの場合に非表示になることを確認
   - 非デフォルトプランの場合に正しく表示されることを確認
   - 長いプラン名の省略表示を確認

2. **AmountDialog の拡張**
   - プラン名バッジが正しい位置に表示されることを確認
   - プラン選択ボタンが正しく動作することを確認
   - デフォルトプランの場合にバッジが表示されないことを確認

### 統合テスト
1. **プラン切り替えテスト**
   - プラン選択後にバッジの表示が更新されることを確認
   - デフォルトプランに戻した場合にバッジが非表示になることを確認

2. **UI/UXテスト**
   - バッジとプラン選択ボタンの視覚的関連性を確認
   - 色の統一性とアクセシビリティを確認

### テストケース例
```typescript
describe('PlanNameBadge', () => {
  it('デフォルトプランの場合は表示されない', () => {
    render(<PlanNameBadge planName="デフォルトプラン" isDefault={true} />);
    expect(screen.queryByText('デフォルトプラン')).not.toBeInTheDocument();
  });

  it('非デフォルトプランの場合は表示される', () => {
    render(<PlanNameBadge planName="カスタムプラン" isDefault={false} />);
    expect(screen.getByText('カスタムプラン')).toBeInTheDocument();
  });

  it('正しいスタイルが適用される', () => {
    render(<PlanNameBadge planName="テストプラン" />);
    const badge = screen.getByText('テストプラン');
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-800');
  });
});
```

## Design Decisions

### 1. バッジの配置
- **決定**: DialogDescriptionの横に配置
- **理由**: プラン選択ボタンとの視覚的関連性を保ちつつ、既存レイアウトへの影響を最小化

### 2. 色の選択
- **決定**: 青系統（bg-blue-100, text-blue-800）
- **理由**: プラン選択ボタンと同系統の色で関連性を示し、既存UIとの調和を保つ

### 3. デフォルトプランの扱い
- **決定**: デフォルトプランの場合はバッジを表示しない
- **理由**: 要求仕様に明記されており、UIの簡潔性を保つため

### 4. 実装方式
- **決定**: 既存AmountDialogコンポーネントの拡張
- **理由**: 新規コンポーネント作成よりも既存機能への影響が少なく、KISS原則に従う

### 5. プラン選択ボタンの追加
- **決定**: DialogHeaderまたはDialogFooterに配置
- **理由**: バッジとの視覚的関連性を保ち、ユーザーの操作フローを自然にする

## Implementation Notes

### CSS設計
- Tailwind CSSを使用し、既存のデザインシステムに準拠
- レスポンシブ対応は既存ダイアログと同様の方針
- アクセシビリティ（コントラスト比）を考慮した色選択

### パフォーマンス考慮
- プラン情報の取得は既存のusePlanStoreを活用
- 不要な再レンダリングを避けるためのメモ化を検討
- バッジの表示/非表示切り替えは軽量な条件分岐で実装

### 既存コードへの影響
- AmountDialogのpropsに新規追加（後方互換性を保持）
- 既存の動作には一切影響しない設計
- 段階的な実装が可能な構造