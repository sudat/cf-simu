import { Button } from "@/components/ui/button";

export function CurrentPlanCard() {
  return (
    <section className="bg-white/90 backdrop-blur-md border border-white/30 p-4 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">現在のプラン</h2>
        <Button className="bg-brand-500 border border-brand-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-brand-600 transition-all duration-200 hover:-translate-y-0.5">
          プラン変更
        </Button>
      </div>
      <p className="text-gray-600">デフォルトプラン</p>
    </section>
  );
}
