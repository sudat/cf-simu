import { TransitionHeader } from "@/components/transition/TransitionHeader";
import { PeriodSelector } from "@/components/ui/PeriodSelector";
import { PLTable } from "@/components/tables/PLTable";
import { BSTable } from "@/components/tables/BSTable";

export default function TransitionPage() {
  return (
    <div className="space-y-6">
      {/* Header with plan name and settings */}
      <TransitionHeader />

      {/* Period selector */}
      <section className="bg-white/90 backdrop-blur-md border border-white/30 p-4 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">表示期間</h2>
          <PeriodSelector defaultPeriod={10} />
        </div>
      </section>

      {/* PL (Profit & Loss) Table */}
      <PLTable />

      {/* BS (Balance Sheet) Table */}
      <BSTable />
    </div>
  );
}
