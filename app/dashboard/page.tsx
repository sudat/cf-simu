import { CurrentPlanCard } from "@/components/dashboard/CurrentPlanCard";
import { CashflowChart } from "@/components/charts/CashflowChart";
import { AssetsChart } from "@/components/charts/AssetsChart";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* アクティブプラン表示 */}
      <CurrentPlanCard />

      {/* 収支グラフ */}
      <CashflowChart />

      {/* 資産・負債グラフ */}
      <AssetsChart />
    </div>
  );
}
