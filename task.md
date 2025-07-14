# CF Simulator – モバイル Web アプリ構築タスク (Next.js 15 / TailwindCSS 4 / Shadcn-ui 最新)

## プロジェクト概要

Pixel 8a 向けのモバイルファースト設計で、既存 `index.html` モックを Next.js 15 + TailwindCSS 4 + Shadcn-ui コンポーネントへ移植し、CF Simulator アプリの UI を構築する。

---

## 主要タスク & サブタスク

- [x] **プロジェクト初期化**

  - [ ] Node.js 18 以上を確認
  - [ ] `bun` 環境をセットアップ (`curl -fsSL https://bun.sh/install | bash`)
  - [ ] `npx create-next-app@latest cf-simulator --ts --tailwind --eslint --app` を実行
  - [ ] `src/` ディレクトリ構成・App Router を確認
  - [ ] Git 初期化 & `.gitignore` 生成
  - [ ] コミット規約 (Conventional Commits) ルールを追加

- [x] **TailwindCSS 4 設定**

  - [ ] `tailwindcss@^4` へアップグレード & PostCSS 8 依存解決
  - [ ] `tailwind.config.ts` → `content` に `app/**/*.{ts,tsx}` を追加
  - [ ] `theme.extend` に mockup から以下を移植
    - [ ] colors (brand / success / danger)
    - [ ] animation (`float`) / keyframes
    - [ ] backdropBlur (`xs`)
  - [ ] `globals.css` へ `@tailwind base/components/utilities` を追加

- [x] **Shadcn-ui CLI 導入**

  - [ ] `npm info shadcn version` で最新版を確認
  - [ ] `npx shadcn@latest init` を実行 (TypeScript, RSC = on, alias 設定)
  - [ ] 依存ライブラリ導入 (`lucide-react` `tailwindcss-animate` `class-variance-authority` `clsx` `tailwind-merge`)
  - [ ] 基本 UI コンポーネントを追加
    - [ ] Button
    - [ ] Dialog & Sheet
    - [ ] Popover
    - [ ] Tabs
    - [ ] Input / Label / Select

- [x] **レイアウト基盤作成**

  - [ ] `components/layout/AppShell.tsx` を作成
  - [ ] Header (`components/layout/Header.tsx`)
    - [ ] App 名・アイコンボタン配置
  - [ ] Main ラッパー (scroll, padding)
  - [ ] BottomNav (`components/layout/BottomNav.tsx`)
    - [ ] Dashboard / Transition タブボタン
  - [ ] `app/layout.tsx` で AppShell へ children をラップ

- [x] **ダッシュボード画面 `/dashboard`**

  - [ ] `app/(main)/dashboard/page.tsx` 生成
  - [ ] 現在プランカード (`components/dashboard/CurrentPlanCard.tsx`)
  - [ ] 収支グラフ (`components/charts/CashflowChart.tsx`)
  - [ ] 資産グラフ (`components/charts/AssetsChart.tsx`)
  - [ ] 期間セレクタ (`components/ui/PeriodSelector.tsx` + Popover)

- [x] **推移分析画面 `/transition`**

  - [ ] `app/(main)/transition/page.tsx` 生成
  - [ ] Header (プラン名表示 & Settings ボタン)
  - [ ] 期間セレクタ (Dashboard と共通コンポーネント再利用)
  - [ ] PL テーブル (`components/tables/PLTable.tsx`)
  - [ ] BS テーブル (`components/tables/BSTable.tsx`)
  - [ ] カテゴリ折り畳み機能 (Row コンポーネント)

- [ ] **モーダル群の実装**

  - [ ] 収支項目管理 `PlanDialog`
  - [ ] 金額設定 `AmountDialog` (flowForm / stockForm 切替)
  - [ ] プラン管理 `PlanManagementDialog`
    - [ ] プラン追加 `AddPlanDialog`
  - [ ] 項目追加 `AddItemDialog`
  - [ ] モーダル共通フック (`useDialog`) 作成

- [ ] **SVG グラフ React 化**

  - [ ] `components/charts/AreaMirrorChart.tsx` 共通化
  - [ ] `lib/chartUtils.ts` にポイント生成ロジックを移植
  - [ ] Cashflow / Assets チャートに適用
  - [ ] ResizeObserver でレスポンシブ対応

- [ ] **サンプルデータ実装**

  - [ ] `lib/mockData.ts` へ既存 `generateSampleData` を TypeScript 化
  - [ ] 型定義 `types/chart.ts` `types/data.ts`
  - [ ] Context もしくは hooks (`useSampleData`) で提供

- [ ] **レスポンシブ調整**

  - [ ] Tailwind `max-w-sm mx-auto` コンテナ適用
  - [ ] Pixel 8a (412×915) で Chrome DevTools チェック
  - [ ] タブレット幅 (≥640px) で幅調整
  - [ ] iOS Safari アドレスバー隠れ／固定 BottomNav 検証

- [ ] **静的解析 & CI**

  - [ ] eslint 設定 (`next/core-web-vitals`, import/order)
  - [ ] prettier 設定, husky + lint-staged
  - [ ] tailwindcss-lint 設定
  - [ ] GitHub Actions: node 18 → `bun install`, `bun run lint`, `bun run typecheck`, `bun run build`

- [ ] **README 整備**
  - [ ] プロジェクト概要・目的
  - [ ] セットアップ手順 (`bun install && bun run dev`)
  - [ ] 開発ガイドライン (コミット規約, ブランチ戦略)
  - [ ] 今後のロードマップ / TODO

---

## 詳細ステップ & 依存関係

1. **T1:** `npx create-next-app@latest cf-simulator --ts --tailwind --eslint --app`
   - Node 18 以上確認
   - オプション: `src/` ディレクトリ使用、`app/` ルーター有効
2. **T2:** Tailwind 4 へアップグレード (PostCSS 8)
   - `tailwind.config.ts` → `content` に `app/**/*.{ts,tsx}` を追加
   - `theme.extend` に mockup から colors / animation / backdropBlur をコピー
3. **T3:** `npx shadcn@latest init` 実行
   - CLI の最新バージョンを `npm info shadcn version` で確認
   - Base style: New York, Base color: Zinc (後から brand 色を上書き)
   - 必要依存: `lucide-react`, `tailwindcss-animate`, `class-variance-authority`, `clsx`, `tailwind-merge`
4. **T4:** `components/layout/AppShell.tsx` を作成
   - Props: `children`
   - Header, Main (overflow-y-auto), BottomNav を配置
5. **T5:** `app/(main)/dashboard/page.tsx`
   - `DashboardHeader`, `CashflowChart`, `AssetsChart` コンポーネントを読み込み
   - 期間セレクタを Shadcn `Popover` で作成
6. **T6:** `app/(main)/transition/page.tsx`
   - `TransitionHeader`, `PLTable`, `BSTable` を配置
7. **T7:** `components/dialogs/` 以下にモーダルコンポーネント群を配置
   - 収支項目管理: `PlanDialog`
   - 金額設定: `AmountDialog` (flow / stock 切替)
   - プラン管理: `PlanManagementDialog`
   - 項目追加: `AddItemDialog`
8. **T8:** `components/charts/AreaMirrorChart.tsx`
   - Props: `type` ('income' | 'expense' | 'assets' | 'debts'), `years`, `initial`, `rate`
   - d3 依存なしで SVG path 生成 (後日アップグレード可)
9. **T9:** `lib/mockData.ts` に sampleData 生成関数を移植
10. **T10:** `@/styles/globals.css` で `max-w-sm`, `mx-auto` などを調整し、Safari/Chrome DevTools で Pixel 8a サイズ検証
11. **T11:** `.github/workflows/ci.yml` で `pnpm lint` `pnpm typecheck`
12. **T12:** `README.md` 更新

---

## 今後拡張予定 (スコープ外)

- Zustand などによる状態管理
- 国際化 (i18n) 対応
- チャートライブラリ (Recharts / Visx など) への置換
- PWA オフライン対応

---

_Last updated: 2025-07-14_
