# Design Document

## Overview

AmountDialog コンポーネントを機能別に分割し、保守性と再利用性を向上させる設計です。段階的な分割アプローチを採用し、既存機能を損なうことなく、テスト可能で理解しやすいコンポーネント群に再構築します。

## Architecture

### 分割戦略

現在の 1000 行超のモノリシックコンポーネントを以下の階層構造に分割：

```
components/dialogs/amount-dialog/
├── AmountDialog.tsx              # メインダイアログ（100行程度）
├── forms/
│   ├── UnifiedForm.tsx           # 統合フォーム（150-200行）
│   ├── FlowForm.tsx              # フロー項目フォーム（150-200行）
│   └── StockForm.tsx             # ストック項目フォーム（150-200行）
├── components/
│   ├── AmountInput.tsx           # 金額入力（50-80行）
│   ├── YearRangeInput.tsx        # 年度範囲入力（50-80行）
│   ├── CalculationExample.tsx    # 計算例表示（80-100行）
│   └── ErrorMessage.tsx          # エラー表示（30-50行）
├── hooks/
│   ├── useAmountCalculation.ts   # 計算ロジック（50-100行）
│   ├── useAmountValidation.ts    # バリデーション（50-100行）
│   └── useAmountForm.ts          # フォーム状態管理（50-100行）
├── utils/
│   ├── formatters.ts             # フォーマット関数（30-50行）
│   ├── calculations.ts           # 計算関数（30-50行）
│   └── validators.ts             # バリデーション関数（30-50行）
└── index.ts                      # エクスポート
```

### 段階的実装アプローチ

**Phase 1: ユーティリティ関数の抽出（難易度: 低）**

- formatters.ts: 数値フォーマット関数
- calculations.ts: 計算関数
- validators.ts: バリデーション関数

**Phase 2: 基本 UI 部品の分離（難易度: 低-中）**

- ErrorMessage.tsx: エラー表示
- AmountInput.tsx: 金額入力
- YearRangeInput.tsx: 年度範囲入力

**Phase 3: 複雑 UI 部品の分離（難易度: 中）**

- CalculationExample.tsx: 計算例表示

**Phase 4: カスタムフックの作成（難易度: 中-高）**

- useAmountCalculation.ts: 計算ロジック
- useAmountValidation.ts: バリデーション
- useAmountForm.ts: フォーム状態管理

**Phase 5: フォームコンポーネントの分割（難易度: 高）**

- UnifiedForm.tsx: 統合フォーム
- FlowForm.tsx: フロー項目フォーム
- StockForm.tsx: ストック項目フォーム

**Phase 6: メインダイアログの統合（難易度: 高）**

- AmountDialog.tsx: ルーティングと統合処理

## Components and Interfaces

### ユーティリティ関数

#### formatters.ts

```typescript
export const formatNumber = (value: number): string => {
  return value.toLocaleString("ja-JP");
};

export const getDisplayValue = (
  value: number | undefined,
  fieldName: string,
  focusedField: string | null
): string => {
  // フォーカス状態に応じた表示値の取得
};
```

#### calculations.ts

```typescript
export const calculateCompoundGrowth = (
  principal: number,
  rate: number,
  years: number
): number => {
  // 複利計算
};

export const calculateYearlyProgression = (
  baseAmount: number,
  changeAmount?: number,
  changeRate?: number,
  years: number = 5
): number[] => {
  // 年次推移計算
};
```

#### validators.ts

```typescript
export const validateUnifiedForm = (
  data: AmountSettingFormData
): ValidationErrors => {
  // 統合フォームバリデーション
};

export const validateYearRange = (
  startYear: number,
  endYear?: number
): string | null => {
  // 年度範囲バリデーション
};
```

### UI コンポーネント

#### AmountInput.tsx

```typescript
interface AmountInputProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  error?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  error,
  placeholder,
  label,
  required,
}) => {
  // フォーカス状態管理とフォーマット処理
};
```

#### YearRangeInput.tsx

```typescript
interface YearRangeInputProps {
  startYear: number;
  endYear?: number;
  onStartYearChange: (year: number) => void;
  onEndYearChange: (year?: number) => void;
  startYearError?: string;
  endYearError?: string;
}

export const YearRangeInput: React.FC<YearRangeInputProps> = ({
  startYear,
  endYear,
  onStartYearChange,
  onEndYearChange,
  startYearError,
  endYearError,
}) => {
  // 年度範囲入力UI
};
```

### カスタムフック

#### useAmountCalculation.ts

```typescript
export const useAmountCalculation = (formData: AmountSettingFormData) => {
  const calculationExample = useMemo(() => {
    // 計算例の生成
  }, [formData]);

  return { calculationExample };
};
```

#### useAmountValidation.ts

```typescript
export const useAmountValidation = (formData: AmountSettingFormData) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    const newErrors = validateUnifiedForm(formData);
    setErrors(newErrors);
  }, [formData]);

  return { errors, isValid: Object.keys(errors).length === 0 };
};
```

### フォームコンポーネント

#### UnifiedForm.tsx

```typescript
interface UnifiedFormProps {
  data: AmountSettingFormData;
  onChange: (data: AmountSettingFormData) => void;
  errors: ValidationErrors;
}

export const UnifiedForm: React.FC<UnifiedFormProps> = ({
  data,
  onChange,
  errors,
}) => {
  // 統合フォームUI
};
```

## Data Models

既存の型定義を活用：

- `AmountSettingFormData`: 統合フォームデータ
- `FlowItemDetail`: フロー項目データ
- `StockItemDetail`: ストック項目データ
- `ValidationErrors`: バリデーションエラー

## Error Handling

### バリデーションエラー

- フィールドレベルのエラー表示
- フォーム全体のエラー状態管理
- リアルタイムバリデーション

### 実行時エラー

- 計算エラーのハンドリング
- 型安全性の確保
- フォールバック値の提供

## Testing Strategy

### ユニットテスト

- ユーティリティ関数のテスト
- カスタムフックのテスト
- 個別コンポーネントのテスト

### 統合テスト

- フォーム全体の動作テスト
- データフローのテスト
- エラーハンドリングのテスト

### 回帰テスト

- 既存機能の動作確認
- UI/UX の一貫性確認
- パフォーマンステスト

## Migration Strategy

### 段階的移行

1. ユーティリティ関数から開始
2. 小さな UI 部品を順次分離
3. カスタムフックの導入
4. フォームコンポーネントの分割
5. メインダイアログの統合

### 後方互換性

- 既存のプロパティインターフェースを維持
- 段階的な移行により既存コードへの影響を最小化
- 各段階でのテスト実行

### リスク軽減

- 小さな変更の積み重ね
- 各段階での動作確認
- ロールバック可能な設計
