◆デフォルトプランのみ
{state: {plans: {給与: {availablePlans: ["デフォルトプラン"], activePlan: "デフォルトプラン"},…},…}, version: 0}
state
: 
{plans: {給与: {availablePlans: ["デフォルトプラン"], activePlan: "デフォルトプラン"},…},…}
version
: 
0

◆楽観プラン追加後
{state: {plans: {給与: {availablePlans: ["デフォルトプラン", "楽観"], activePlan: "デフォルトプラン"},…},…}, version: 0}
state
: 
{plans: {給与: {availablePlans: ["デフォルトプラン", "楽観"], activePlan: "デフォルトプラン"},…},…}
assets
: 
{}
debts
: 
{}
expenses
: 
{生活費: {type: "flow",…}}
incomes
: 
{給与: {type: "flow",…}}
plans
: 
{給与: {availablePlans: ["デフォルトプラン", "楽観"], activePlan: "デフォルトプラン"},…}
生活費
: 
{availablePlans: ["デフォルトプラン"], activePlan: "デフォルトプラン"}
給与
: 
{availablePlans: ["デフォルトプラン", "楽観"], activePlan: "デフォルトプラン"}
version
: 
0



◆コンソールログ

[addItemPlan] 開始: Object
plan-store.ts:672 [addItemPlan] 状態確認: Object
plan-store.ts:691 [addItemPlan] 重複チェック: Object
plan-store.ts:764 [addItemPlan] 給与: プラン"faffa"の設定データを作成しました Object
plan-store.ts:772 [addItemPlan] 項目"給与"にプラン"faffa"を追加しました
plan-store.ts:643 [addItemPlan] 開始: Object
plan-store.ts:672 [addItemPlan] 状態確認: Object
plan-store.ts:691 [addItemPlan] 重複チェック: Object
plan-store.ts:700 [addItemPlan] エラー: プラン名重複 Object


◆コンソールログ2

[AddPlanDialog] handleAdd開始: {itemName: '給与', planName: 'test123', open: true}
add-plan-dialog.tsx:53 [AddPlanDialog] addItemPlan呼び出し前
plan-store.ts:643 [addItemPlan] 開始: {itemName: '給与', planName: 'test123', trimmedItemName: '給与', trimmedPlanName: 'test123'}
plan-store.ts:672 [addItemPlan] 状態確認: {trimmedItemName: '給与', trimmedName: 'test123', itemExists: true, currentPlans: Array(1)}
plan-store.ts:691 [addItemPlan] 重複チェック: {trimmedName: 'test123', currentPlans: Array(1), planExists: false, comparison: Array(1)}
plan-store.ts:764 [addItemPlan] 給与: プラン"test123"の設定データを作成しました {startYear: 2024, amount: 500000, frequency: 'monthly', growthRate: 3}
plan-store.ts:772 [addItemPlan] 項目"給与"にプラン"test123"を追加しました
add-plan-dialog.tsx:56 [AddPlanDialog] addItemPlan結果: {success: true}
add-plan-dialog.tsx:64 [AddPlanDialog] 成功処理: {data: {…}, onAddExists: true}
plan-store.ts:643 [addItemPlan] 開始: {itemName: '給与', planName: 'test123', trimmedItemName: '給与', trimmedPlanName: 'test123'}
plan-store.ts:672 [addItemPlan] 状態確認: {trimmedItemName: '給与', trimmedName: 'test123', itemExists: true, currentPlans: Array(2)}
plan-store.ts:691 [addItemPlan] 重複チェック: {trimmedName: 'test123', currentPlans: Array(2), planExists: true, comparison: Array(2)}
plan-store.ts:700 [addItemPlan] エラー: プラン名重複 {trimmedName: 'test123', currentPlans: Array(2)}
simulation.ts:62 [収入計算] 給与: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(2), 全設定データ: {…}, 使用中設定データ: {…}, 年: 2025}
simulation.ts:81 [収入計算] 給与: 2025年の金額=6,180,000円
simulation.ts:86 [収入計算] 2025年の総収入: 6,180,000円
simulation.ts:107 [支出計算] 生活費: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(1), 設定データ: {…}, 年: 2025}
simulation.ts:125 [支出計算] 生活費: 2025年の金額=3,672,000円
simulation.ts:130 [支出計算] 2025年の総支出: 3,672,000円
simulation.ts:62 [収入計算] 給与: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(2), 全設定データ: {…}, 使用中設定データ: {…}, 年: 2026}
simulation.ts:81 [収入計算] 給与: 2026年の金額=6,365,400円
simulation.ts:86 [収入計算] 2026年の総収入: 6,365,400円
simulation.ts:107 [支出計算] 生活費: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(1), 設定データ: {…}, 年: 2026}
simulation.ts:125 [支出計算] 生活費: 2026年の金額=3,745,440円
simulation.ts:130 [支出計算] 2026年の総支出: 3,745,440円
simulation.ts:62 [収入計算] 給与: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(2), 全設定データ: {…}, 使用中設定データ: {…}, 年: 2027}
simulation.ts:81 [収入計算] 給与: 2027年の金額=6,556,362円
simulation.ts:86 [収入計算] 2027年の総収入: 6,556,362円
simulation.ts:107 [支出計算] 生活費: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(1), 設定データ: {…}, 年: 2027}
simulation.ts:125 [支出計算] 生活費: 2027年の金額=3,820,349円
simulation.ts:130 [支出計算] 2027年の総支出: 3,820,349円
simulation.ts:62 [収入計算] 給与: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(2), 全設定データ: {…}, 使用中設定データ: {…}, 年: 2028}
simulation.ts:81 [収入計算] 給与: 2028年の金額=6,753,053円
simulation.ts:86 [収入計算] 2028年の総収入: 6,753,053円
simulation.ts:107 [支出計算] 生活費: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(1), 設定データ: {…}, 年: 2028}
simulation.ts:125 [支出計算] 生活費: 2028年の金額=3,896,756円
simulation.ts:130 [支出計算] 2028年の総支出: 3,896,756円
simulation.ts:62 [収入計算] 給与: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(2), 全設定データ: {…}, 使用中設定データ: {…}, 年: 2029}
simulation.ts:81 [収入計算] 給与: 2029年の金額=6,955,644円
simulation.ts:86 [収入計算] 2029年の総収入: 6,955,644円
simulation.ts:107 [支出計算] 生活費: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(1), 設定データ: {…}, 年: 2029}
simulation.ts:125 [支出計算] 生活費: 2029年の金額=3,974,691円
simulation.ts:130 [支出計算] 2029年の総支出: 3,974,691円
simulation.ts:62 [収入計算] 給与: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(2), 全設定データ: {…}, 使用中設定データ: {…}, 年: 2030}
simulation.ts:81 [収入計算] 給与: 2030年の金額=7,164,314円
simulation.ts:86 [収入計算] 2030年の総収入: 7,164,314円
simulation.ts:107 [支出計算] 生活費: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(1), 設定データ: {…}, 年: 2030}
simulation.ts:125 [支出計算] 生活費: 2030年の金額=4,054,185円
simulation.ts:130 [支出計算] 2030年の総支出: 4,054,185円
simulation.ts:62 [収入計算] 給与: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(2), 全設定データ: {…}, 使用中設定データ: {…}, 年: 2031}
simulation.ts:81 [収入計算] 給与: 2031年の金額=7,379,243円
simulation.ts:86 [収入計算] 2031年の総収入: 7,379,243円
simulation.ts:107 [支出計算] 生活費: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(1), 設定データ: {…}, 年: 2031}
simulation.ts:125 [支出計算] 生活費: 2031年の金額=4,135,268円
simulation.ts:130 [支出計算] 2031年の総支出: 4,135,268円
simulation.ts:62 [収入計算] 給与: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(2), 全設定データ: {…}, 使用中設定データ: {…}, 年: 2032}
simulation.ts:81 [収入計算] 給与: 2032年の金額=7,600,620円
simulation.ts:86 [収入計算] 2032年の総収入: 7,600,620円
simulation.ts:107 [支出計算] 生活費: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(1), 設定データ: {…}, 年: 2032}
simulation.ts:125 [支出計算] 生活費: 2032年の金額=4,217,974円
simulation.ts:130 [支出計算] 2032年の総支出: 4,217,974円
simulation.ts:62 [収入計算] 給与: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(2), 全設定データ: {…}, 使用中設定データ: {…}, 年: 2033}
simulation.ts:81 [収入計算] 給与: 2033年の金額=7,828,639円
simulation.ts:86 [収入計算] 2033年の総収入: 7,828,639円
simulation.ts:107 [支出計算] 生活費: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(1), 設定データ: {…}, 年: 2033}
simulation.ts:125 [支出計算] 生活費: 2033年の金額=4,302,333円
simulation.ts:130 [支出計算] 2033年の総支出: 4,302,333円
simulation.ts:62 [収入計算] 給与: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(2), 全設定データ: {…}, 使用中設定データ: {…}, 年: 2034}
simulation.ts:81 [収入計算] 給与: 2034年の金額=8,063,498円
simulation.ts:86 [収入計算] 2034年の総収入: 8,063,498円
simulation.ts:107 [支出計算] 生活費: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(1), 設定データ: {…}, 年: 2034}
simulation.ts:125 [支出計算] 生活費: 2034年の金額=4,388,380円
simulation.ts:130 [支出計算] 2034年の総支出: 4,388,380円
simulation.ts:62 [収入計算] 給与: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(2), 全設定データ: {…}, 使用中設定データ: {…}, 年: 2035}
simulation.ts:81 [収入計算] 給与: 2035年の金額=8,305,403円
simulation.ts:86 [収入計算] 2035年の総収入: 8,305,403円
simulation.ts:107 [支出計算] 生活費: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(1), 設定データ: {…}, 年: 2035}
simulation.ts:125 [支出計算] 生活費: 2035年の金額=4,476,148円
simulation.ts:130 [支出計算] 2035年の総支出: 4,476,148円
simulation.ts:62 [収入計算] 給与: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(2), 全設定データ: {…}, 使用中設定データ: {…}, 年: 2025}
simulation.ts:81 [収入計算] 給与: 2025年の金額=6,180,000円
simulation.ts:86 [収入計算] 2025年の総収入: 6,180,000円
simulation.ts:107 [支出計算] 生活費: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(1), 設定データ: {…}, 年: 2025}
simulation.ts:125 [支出計算] 生活費: 2025年の金額=3,672,000円
simulation.ts:130 [支出計算] 2025年の総支出: 3,672,000円
simulation.ts:62 [収入計算] 給与: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(2), 全設定データ: {…}, 使用中設定データ: {…}, 年: 2026}
simulation.ts:81 [収入計算] 給与: 2026年の金額=6,365,400円
simulation.ts:86 [収入計算] 2026年の総収入: 6,365,400円
simulation.ts:107 [支出計算] 生活費: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(1), 設定データ: {…}, 年: 2026}
simulation.ts:125 [支出計算] 生活費: 2026年の金額=3,745,440円
simulation.ts:130 [支出計算] 2026年の総支出: 3,745,440円
simulation.ts:62 [収入計算] 給与: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(2), 全設定データ: {…}, 使用中設定データ: {…}, 年: 2027}
simulation.ts:81 [収入計算] 給与: 2027年の金額=6,556,362円
simulation.ts:86 [収入計算] 2027年の総収入: 6,556,362円
simulation.ts:107 [支出計算] 生活費: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(1), 設定データ: {…}, 年: 2027}
simulation.ts:125 [支出計算] 生活費: 2027年の金額=3,820,349円
simulation.ts:130 [支出計算] 2027年の総支出: 3,820,349円
simulation.ts:62 [収入計算] 給与: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(2), 全設定データ: {…}, 使用中設定データ: {…}, 年: 2028}
simulation.ts:81 [収入計算] 給与: 2028年の金額=6,753,053円
simulation.ts:86 [収入計算] 2028年の総収入: 6,753,053円
simulation.ts:107 [支出計算] 生活費: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(1), 設定データ: {…}, 年: 2028}
simulation.ts:125 [支出計算] 生活費: 2028年の金額=3,896,756円
simulation.ts:130 [支出計算] 2028年の総支出: 3,896,756円
simulation.ts:62 [収入計算] 給与: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(2), 全設定データ: {…}, 使用中設定データ: {…}, 年: 2029}
simulation.ts:81 [収入計算] 給与: 2029年の金額=6,955,644円
simulation.ts:86 [収入計算] 2029年の総収入: 6,955,644円
simulation.ts:107 [支出計算] 生活費: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(1), 設定データ: {…}, 年: 2029}
simulation.ts:125 [支出計算] 生活費: 2029年の金額=3,974,691円
simulation.ts:130 [支出計算] 2029年の総支出: 3,974,691円
simulation.ts:62 [収入計算] 給与: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(2), 全設定データ: {…}, 使用中設定データ: {…}, 年: 2030}
simulation.ts:81 [収入計算] 給与: 2030年の金額=7,164,314円
simulation.ts:86 [収入計算] 2030年の総収入: 7,164,314円
simulation.ts:107 [支出計算] 生活費: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(1), 設定データ: {…}, 年: 2030}
simulation.ts:125 [支出計算] 生活費: 2030年の金額=4,054,185円
simulation.ts:130 [支出計算] 2030年の総支出: 4,054,185円
simulation.ts:62 [収入計算] 給与: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(2), 全設定データ: {…}, 使用中設定データ: {…}, 年: 2031}
simulation.ts:81 [収入計算] 給与: 2031年の金額=7,379,243円
simulation.ts:86 [収入計算] 2031年の総収入: 7,379,243円
simulation.ts:107 [支出計算] 生活費: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(1), 設定データ: {…}, 年: 2031}
simulation.ts:125 [支出計算] 生活費: 2031年の金額=4,135,268円
simulation.ts:130 [支出計算] 2031年の総支出: 4,135,268円
simulation.ts:62 [収入計算] 給与: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(2), 全設定データ: {…}, 使用中設定データ: {…}, 年: 2032}
simulation.ts:81 [収入計算] 給与: 2032年の金額=7,600,620円
simulation.ts:86 [収入計算] 2032年の総収入: 7,600,620円
simulation.ts:107 [支出計算] 生活費: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(1), 設定データ: {…}, 年: 2032}
simulation.ts:125 [支出計算] 生活費: 2032年の金額=4,217,974円
simulation.ts:130 [支出計算] 2032年の総支出: 4,217,974円
simulation.ts:62 [収入計算] 給与: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(2), 全設定データ: {…}, 使用中設定データ: {…}, 年: 2033}
simulation.ts:81 [収入計算] 給与: 2033年の金額=7,828,639円
simulation.ts:86 [収入計算] 2033年の総収入: 7,828,639円
simulation.ts:107 [支出計算] 生活費: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(1), 設定データ: {…}, 年: 2033}
simulation.ts:125 [支出計算] 生活費: 2033年の金額=4,302,333円
simulation.ts:130 [支出計算] 2033年の総支出: 4,302,333円
simulation.ts:62 [収入計算] 給与: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(2), 全設定データ: {…}, 使用中設定データ: {…}, 年: 2034}
simulation.ts:81 [収入計算] 給与: 2034年の金額=8,063,498円
simulation.ts:86 [収入計算] 2034年の総収入: 8,063,498円
simulation.ts:107 [支出計算] 生活費: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(1), 設定データ: {…}, 年: 2034}
simulation.ts:125 [支出計算] 生活費: 2034年の金額=4,388,380円
simulation.ts:130 [支出計算] 2034年の総支出: 4,388,380円
simulation.ts:62 [収入計算] 給与: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(2), 全設定データ: {…}, 使用中設定データ: {…}, 年: 2035}
simulation.ts:81 [収入計算] 給与: 2035年の金額=8,305,403円
simulation.ts:86 [収入計算] 2035年の総収入: 8,305,403円
simulation.ts:107 [支出計算] 生活費: アクティブプラン="デフォルトプラン" {利用可能プラン: Array(1), 設定データ: {…}, 年: 2035}
simulation.ts:125 [支出計算] 生活費: 2035年の金額=4,476,148円
simulation.ts:130 [支出計算] 2035年の総支出: 4,476,148円