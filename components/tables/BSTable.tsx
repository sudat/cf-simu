"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, PiggyBank, CreditCard, Wallet } from "lucide-react";
import { defaultSampleData } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface BSTableProps {
  period?: number;
  startYear?: number;
}

export function BSTable({ period = 10, startYear = 2024 }: BSTableProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  const years = Array.from({ length: period }, (_, i) => startYear + i);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // テキスト切り捨て関数
  const truncateText = (text: string, maxLength = 10) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // 資産合計を計算
  const calculateAssetsTotal = (year: number) => {
    return Object.values(defaultSampleData.assets).reduce(
      (sum, item) => sum + (item[year] || 0),
      0
    );
  };

  // 負債合計を計算
  const calculateDebtsTotal = (year: number) => {
    return Object.values(defaultSampleData.debts).reduce(
      (sum, item) => sum + (item[year] || 0),
      0
    );
  };

  return (
    <section className="bg-white/90 backdrop-blur-md border border-white/30 p-4 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">資産・負債</h2>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-2 font-medium text-gray-700">
                項目
              </th>
              {years.slice(0, 3).map((year) => (
                <th
                  key={year}
                  className="text-right py-2 px-2 font-medium text-gray-700"
                >
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 資産セクション */}
            <tr
              className="bg-green-50 cursor-pointer hover:bg-green-100 transition-colors"
              onClick={() => toggleSection("assets")}
            >
              <td className="py-2 px-2 font-semibold text-green-700 flex items-center">
                <ChevronRight
                  className={cn(
                    "w-4 h-4 mr-1 transition-transform",
                    expandedSections.has("assets") && "rotate-90"
                  )}
                />
                <PiggyBank className="w-4 h-4" />
                <span className="ml-1">資産</span>
              </td>
              {years.slice(0, 3).map((year) => (
                <td
                  key={year}
                  className="text-right py-2 px-2 font-semibold text-green-700"
                >
                  {calculateAssetsTotal(year)}
                </td>
              ))}
            </tr>

            {/* 資産項目 */}
            {expandedSections.has("assets") &&
              Object.entries(defaultSampleData.assets).map(([item, values]) => (
                <tr key={item} className="border-b border-gray-100">
                  <td className="py-2 px-6 text-gray-700 max-w-0">
                    <div className="truncate" title={item}>
                      {truncateText(item)}
                    </div>
                  </td>
                  {years.slice(0, 3).map((year) => (
                    <td
                      key={year}
                      className="text-right py-2 px-2 text-gray-800 font-medium"
                    >
                      {values[year] || 0}
                    </td>
                  ))}
                </tr>
              ))}

            {/* 負債セクション */}
            <tr
              className="bg-orange-50 cursor-pointer hover:bg-orange-100 transition-colors"
              onClick={() => toggleSection("debts")}
            >
              <td className="py-2 px-2 font-semibold text-orange-700 flex items-center">
                <ChevronRight
                  className={cn(
                    "w-4 h-4 mr-1 transition-transform",
                    expandedSections.has("debts") && "rotate-90"
                  )}
                />
                <CreditCard className="w-4 h-4" />
                <span className="ml-1">負債</span>
              </td>
              {years.slice(0, 3).map((year) => (
                <td
                  key={year}
                  className="text-right py-2 px-2 font-semibold text-orange-700"
                >
                  {calculateDebtsTotal(year)}
                </td>
              ))}
            </tr>

            {/* 負債項目 */}
            {expandedSections.has("debts") &&
              Object.entries(defaultSampleData.debts).map(([item, values]) => (
                <tr key={item} className="border-b border-gray-100">
                  <td className="py-2 px-6 text-gray-700 max-w-0">
                    <div className="truncate" title={item}>
                      {truncateText(item)}
                    </div>
                  </td>
                  {years.slice(0, 3).map((year) => (
                    <td
                      key={year}
                      className="text-right py-2 px-2 text-gray-800 font-medium"
                    >
                      {values[year] || 0}
                    </td>
                  ))}
                </tr>
              ))}

            {/* 純資産セクション */}
            <tr className="bg-indigo-50">
              <td className="py-2 px-2 font-semibold text-indigo-700 flex items-center">
                <Wallet className="w-4 h-4" />
                <span className="ml-1">純資産</span>
              </td>
              {years.slice(0, 3).map((year) => {
                const assets = calculateAssetsTotal(year);
                const debts = calculateDebtsTotal(year);
                const net = assets - debts;
                const colorClass =
                  net >= 0 ? "text-indigo-700" : "text-red-700";
                return (
                  <td
                    key={year}
                    className={cn(
                      "text-right py-2 px-2 font-semibold",
                      colorClass
                    )}
                  >
                    {net}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
