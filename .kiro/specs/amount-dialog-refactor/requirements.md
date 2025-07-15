# Requirements Document

## Introduction

AmountDialog コンポーネントが 1000 行を超える大きなコンポーネントになっており、保守性と拡張性の向上のために適切なサイズに分割する必要があります。機能を損なうことなく、単一責任原則に従った小さなコンポーネント群に分割し、テスト容易性と再利用性を向上させます。

## Requirements

### Requirement 1

**User Story:** 開発者として、AmountDialog コンポーネントを保守しやすい小さなコンポーネントに分割したい。そうすることで、コードの理解と修正が容易になる。

#### Acceptance Criteria

1. WHEN 各コンポーネントファイルを確認する THEN 各ファイルは 200 行以下になっている SHALL
2. WHEN コンポーネントを分割する THEN 既存の機能は全て保持されている SHALL
3. WHEN 分割後のコンポーネントを確認する THEN 各コンポーネントは単一の責任を持っている SHALL

### Requirement 2

**User Story:** 開発者として、ユーティリティ関数を独立したモジュールに分離したい。そうすることで、他のコンポーネントでも再利用できる。

#### Acceptance Criteria

1. WHEN formatters.ts を作成する THEN 数値フォーマット関数が独立したモジュールになっている SHALL
2. WHEN calculations.ts を作成する THEN 計算関数が独立したモジュールになっている SHALL
3. WHEN validators.ts を作成する THEN バリデーション関数が独立したモジュールになっている SHALL
4. WHEN ユーティリティ関数を使用する THEN 元のコンポーネントと同じ動作をする SHALL

### Requirement 3

**User Story:** 開発者として、UI 部品を再利用可能なコンポーネントに分離したい。そうすることで、他の画面でも同じ UI 部品を使用できる。

#### Acceptance Criteria

1. WHEN AmountInput コンポーネントを作成する THEN 金額入力機能が独立したコンポーネントになっている SHALL
2. WHEN YearRangeInput コンポーネントを作成する THEN 年度範囲入力機能が独立したコンポーネントになっている SHALL
3. WHEN ErrorMessage コンポーネントを作成する THEN エラー表示機能が独立したコンポーネントになっている SHALL
4. WHEN UI 部品を使用する THEN 元のダイアログと同じ見た目と動作をする SHALL

### Requirement 4

**User Story:** 開発者として、フォームロジックをカスタムフックに分離したい。そうすることで、状態管理とビジネスロジックが整理される。

#### Acceptance Criteria

1. WHEN useAmountCalculation フックを作成する THEN 計算ロジックが独立したフックになっている SHALL
2. WHEN useAmountValidation フックを作成する THEN バリデーションロジックが独立したフックになっている SHALL
3. WHEN useAmountForm フックを作成する THEN フォーム状態管理が独立したフックになっている SHALL
4. WHEN カスタムフックを使用する THEN 元のコンポーネントと同じ動作をする SHALL

### Requirement 5

**User Story:** 開発者として、フォームタイプ別にコンポーネントを分離したい。そうすることで、各フォームの責任が明確になる。

#### Acceptance Criteria

1. WHEN UnifiedForm コンポーネントを作成する THEN 統合フォーム機能が独立したコンポーネントになっている SHALL
2. WHEN FlowForm コンポーネントを作成する THEN フロー項目フォーム機能が独立したコンポーネントになっている SHALL
3. WHEN StockForm コンポーネントを作成する THEN ストック項目フォーム機能が独立したコンポーネントになっている SHALL
4. WHEN 各フォームを使用する THEN 元のダイアログと同じ機能を提供する SHALL

### Requirement 6

**User Story:** 開発者として、メインダイアログを簡素化したい。そうすることで、ルーティングと統合処理に集中できる。

#### Acceptance Criteria

1. WHEN メイン AmountDialog を修正する THEN ファイルサイズが 200 行以下になっている SHALL
2. WHEN メインダイアログを確認する THEN フォームタイプの判定とルーティングのみを担当している SHALL
3. WHEN 分割後のダイアログを使用する THEN 元のダイアログと同じ機能を提供する SHALL
4. WHEN 全ての分割が完了する THEN 既存のテストが全て通る SHALL
