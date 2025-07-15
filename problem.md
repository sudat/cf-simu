## 問題の概要
Next.js + TypeScript + ShadcnUIで作成した金額設定ダイアログで、ラジオボタンが正常に動作しない問題があります。

## 現在の状況
### 症状
 - 初期状態では「年額」にラジオボタンのチェックが入っている
 - 「月額」をクリックしてもラジオボタンのチェックが移らない（見た目上）
 - しかし、内部の状態（state）は正しく更新されている
 - デバッグ表示では「現在の値 = monthly」と正しく表示される
### 確認済みの事実
 - 状態更新は正常: setUnifiedDataでfrequencyの値は正しく更新されている
 - イベントハンドラーは動作: onChangeイベントは正常に発火している
 - checked属性の判定は正常: unifiedData.frequency === "monthly"は正しくtrueになる
 - 型定義は正常: frequency: "yearly" | "monthly"として正しく定義されている
### 試した解決策
 - updateUnifiedData関数経由での更新 → 効果なし
 - 直接setUnifiedDataでの更新 → 効果なし
 - 型キャストの追加 → 効果なし
 - デバッグログの追加 → 状態は正しく更新されていることを確認