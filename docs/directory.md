# ディレクトリ構造設計書

## アプリケーション全体構造

Next.js (App Router) と shadcn/ui の規約に基づいた構造を採用します。

```
cf-simu/
├── .next/                      # Next.jsビルド成果物
├── app/                        # App Router
│   ├── (main)/                 # メインコンテンツ
│   │   ├── dashboard/          # F001: ダッシュボード画面
│   │   │   └── page.tsx
│   │   └── transition/         # F002: 推移分析画面
│   │       └── page.tsx
│   ├── layout.tsx              # ルートレイアウト
│   ├── globals.css             # グローバルスタイル
│   └── favicon.ico
├── components/                 # Reactコンポーネント
│   ├── common/                 # 共通UIパーツ (Button, Modalなど)
│   ├── icons/                  # アイコンコンポーネント
│   ├── charts/                 # グラフコンポーネント
│   │   ├── cashflow-chart.tsx
│   │   └── assets-chart.tsx
│   ├── modals/                 # モーダルコンポーネント
│   │   ├── plan-modal.tsx      # F003: 収支項目管理
│   │   ├── amount-modal.tsx    # F004: 金額設定
│   │   ├── plan-management-modal.tsx # F005: プラン管理
│   │   └── ...
│   └── layout/                 # レイアウトコンポーネント
│       ├── header.tsx
│       └── bottom-navigation.tsx
├── lib/                        # ライブラリ、ユーティリティ
│   ├── simulation/             # シミュレーション関連ロジック
│   │   ├── engine.ts           # 計算エンジン
│   │   └── calculator.ts       # 各種計算ロジック
│   ├── store/                  # 状態管理 (Zustandなど)
│   │   ├── plan-store.ts
│   │   └── simulation-store.ts
│   ├── types/                  # 型定義
│   │   ├── index.ts
│   │   └── simulation.ts
│   └── utils.ts                # 汎用ユーティリティ (shadcn/ui)
├── public/                     # 静的ファイル
│   └── ...
├── docs/                       # ドキュメント
│   └── ...
├── tests/                      # テスト
│   └── ...
├── .gitignore
├── next.config.ts
├── package.json
└── tsconfig.json
```

## 画面・コンポーネント対応

| 画面/機能 ID | モックアップID / 説明 | 実装コンポーネント |
| :--- | :--- | :--- |
| F001 | `dashboardScreen` | `app/(main)/dashboard/page.tsx` |
| F002 | `transitionScreen` | `app/(main)/transition/page.tsx` |
| F003 | `planModal` (収支項目管理) | `components/modals/plan-modal.tsx` |
| F004 | `amountModal` (金額設定) | `components/modals/amount-modal.tsx` |
| F005 | `planManagementModal` (プラン管理) | `components/modals/plan-management-modal.tsx` |
| - | ボトムナビゲーション | `components/layout/bottom-navigation.tsx` |
| - | 収支推移グラフ | `components/charts/cashflow-chart.tsx` |
| - | 資産・負債推移グラフ | `components/charts/assets-chart.tsx` |

## コンポーネント責務

- **app/(main)/**: 各ページの主要コンテンツを配置。データ取得とビジネスロジックの呼び出しを担当。
- **components/modals/**: 各種設定を行うモーダルウィンドウ。状態は`lib/store`で管理。
- **components/charts/**: D3.jsやRecharts等を利用したグラフ描画専門のコンポーネント。
- **lib/simulation/**: シミュレーションの中核となる計算ロジック。UIから独立。
- **lib/store/**: Zustandを用いたグローバルな状態管理。プランデータ、シミュレーション結果などを保持。
