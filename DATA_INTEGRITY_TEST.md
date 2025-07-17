# データ整合性チェック機能 受入テスト

## テスト対象機能
- `validatePlanData` - プランデータの整合性検証
- `checkDataConsistency` - 項目別プランデータの一貫性チェック
- `validatePlanReferences` - アクティブプラン参照の有効性チェック
- `fixDataIntegrityIssues` - 自動修復機能

## 受入テストチェックリスト

### 1. 基本機能テスト

#### 1.1 validatePlanData 機能
- [ ] アクティブプランが利用可能プランに含まれていない場合にエラーを検出する
- [ ] 重複するプラン名がある場合にエラーを検出する
- [ ] デフォルトプランが存在しない場合に警告を出す
- [ ] 正常なデータの場合は `isValid: true` を返す

#### 1.2 checkDataConsistency 機能
- [ ] プラン定義に存在するが実際のデータがない項目を検出する
- [ ] 実際のデータが存在するがプラン定義がない項目を検出する
- [ ] 設定データにプラン定義にないプランが含まれている場合を検出する
- [ ] 無効な項目タイプ（'flow', 'stock'以外）を検出する
- [ ] サマリー情報（totalItems, totalPlans等）が正確に表示される

#### 1.3 validatePlanReferences 機能
- [ ] アクティブプランが利用可能プランに含まれていない場合にエラーを検出する
- [ ] 利用可能プランが空の場合にエラーを検出する
- [ ] 正常な参照の場合は `isValid: true` を返す

### 2. 自動修復機能テスト

#### 2.1 fixDataIntegrityIssues(false) - 検出のみ
- [ ] `autoFix: false` の場合、問題を検出するが修復しない
- [ ] 修復可能な問題と修復不可能な問題を正しく分類する
- [ ] `fixedIssues: 0` を返す

#### 2.2 fixDataIntegrityIssues(true) - 自動修復
- [ ] 無効なアクティブプランをデフォルトプランに修正する
- [ ] デフォルトプランが存在しない場合に追加する
- [ ] 重複プランを削除（最初の1つを残す）
- [ ] 設定データから無効なプランを削除する
- [ ] 修復された問題数を正確に返す
- [ ] 修復できない問題は `remainingIssues` に含める

### 3. エラーハンドリングテスト
- [ ] 例外が発生した場合にエラーメッセージを設定する
- [ ] `lastError` が適切に更新される
- [ ] 修復処理中のエラーを適切に処理する

### 4. データ形式テスト

#### 4.1 ValidationError 形式
- [ ] `type` フィールドが適切に設定される
- [ ] `message` フィールドに分かりやすいメッセージが含まれる
- [ ] `itemName`, `planName`, `category` が適切に設定される
- [ ] `fixable` フラグが正確に設定される

#### 4.2 結果オブジェクト形式
- [ ] ValidationResult の `isValid`, `errors`, `warnings` が正しく設定される
- [ ] ConsistencyCheckResult の `isConsistent`, `issues`, `summary` が正しく設定される

### 5. パフォーマンステスト
- [ ] 大量の項目・プランがある場合でも合理的な時間で処理が完了する
- [ ] メモリ使用量が過度に増加しない

## テスト実行方法

1. React開発環境でアプリケーションを起動
2. ブラウザのコンソールで以下のコマンドを実行:

```javascript
// ストアの取得
const store = usePlanStore.getState();

// 1. プランデータ検証
const planValidation = store.validatePlanData();
console.log('Plan Validation:', planValidation);

// 2. データ一貫性チェック
const consistencyCheck = store.checkDataConsistency();
console.log('Consistency Check:', consistencyCheck);

// 3. プラン参照の有効性チェック
const referenceValidation = store.validatePlanReferences();
console.log('Reference Validation:', referenceValidation);

// 4. 自動修復テスト（検出のみ）
const issuesOnly = store.fixDataIntegrityIssues(false);
console.log('Issues Detection:', issuesOnly);

// 5. 自動修復テスト（修復実行）
const fixResult = store.fixDataIntegrityIssues(true);
console.log('Fix Result:', fixResult);

// 6. 修復後の状態確認
const afterFixCheck = store.checkDataConsistency();
console.log('After Fix Check:', afterFixCheck);
```

## 期待される結果

### 正常なデータの場合
- すべての検証で `isValid: true` または `isConsistent: true`
- エラー・警告・問題が0件

### 問題があるデータの場合
- 各問題が適切に検出される
- 自動修復により修復可能な問題が解決される
- 修復不可能な問題は `remainingIssues` に残る

## テスト合格基準
- [ ] 全てのチェックリスト項目が✓になる
- [ ] エラーハンドリングが適切に動作する
- [ ] 自動修復機能が期待通りに動作する
- [ ] パフォーマンスが許容範囲内である