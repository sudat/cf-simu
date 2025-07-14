"use client";

import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export function TransitionHeader() {
  const currentPlan = "デフォルトプラン"; // TODO: 後でstate管理から取得

  return (
    <section className="bg-white/90 backdrop-blur-md border border-white/30 p-4 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">推移分析</h1>
        <Button className="bg-brand-500 border border-brand-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-brand-600 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-1">
          <Settings className="w-4 h-4" />
          <span>{currentPlan}</span>
        </Button>
      </div>
    </section>
  );
}
