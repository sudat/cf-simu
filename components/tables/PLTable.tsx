"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Calculator,
} from "lucide-react";
import { defaultSampleData } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface PLTableProps {
  period?: number;
  startYear?: number;
}

export function PLTable({ period = 10, startYear = 2024 }: PLTableProps) {
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

  // 収入合計を計算
  const calculateIncomeTotal = (year: number) => {
    return Object.values(defaultSampleData.income).reduce(
      (sum, item) => sum + (item[year] || 0),
      0
    );
  };

  // 支出合計を計算
  const calculateExpenseTotal = (year: number) => {
    return Object.values(defaultSampleData.expense).reduce(
      (sum, item) => sum + (item[year] || 0),
      0
    );
  };

  return (
    <section className="bg-white/90 backdrop-blur-md border border-white/30 p-4 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">収支</h2>
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
            {/* 収入セクション */}
            <tr
              className="bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() => toggleSection("income")}
            >
              <td className="py-2 px-2 font-semibold text-blue-700 flex items-center">
                <ChevronRight
                  className={cn(
                    "w-4 h-4 mr-1 transition-transform",
                    expandedSections.has("income") && "rotate-90"
                  )}
                />
                <TrendingUp className="w-4 h-4" />
                <span className="ml-1">収入</span>
              </td>
              {years.slice(0, 3).map((year) => (
                <td
                  key={year}
                  className="text-right py-2 px-2 font-semibold text-success-600"
                >
                  {calculateIncomeTotal(year)}
                </td>
              ))}
            </tr>

            {/* 収入項目 */}
            {expandedSections.has("income") &&
              Object.entries(defaultSampleData.income).map(([item, values]) => (
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

            {/* 支出セクション */}
            <tr
              className="bg-red-50 cursor-pointer hover:bg-red-100 transition-colors"
              onClick={() => toggleSection("expense")}
            >
              <td className="py-2 px-2 font-semibold text-red-700 flex items-center">
                <ChevronRight
                  className={cn(
                    "w-4 h-4 mr-1 transition-transform",
                    expandedSections.has("expense") && "rotate-90"
                  )}
                />
                <TrendingDown className="w-4 h-4" />
                <span className="ml-1">支出</span>
              </td>
              {years.slice(0, 3).map((year) => (
                <td
                  key={year}
                  className="text-right py-2 px-2 font-semibold text-danger-600"
                >
                  {calculateExpenseTotal(year)}
                </td>
              ))}
            </tr>

            {/* 支出項目 */}
            {expandedSections.has("expense") &&
              Object.entries(defaultSampleData.expense).map(
                ([item, values]) => (
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
                )
              )}

            {/* 純収支セクション */}
            <tr className="bg-purple-50">
              <td className="py-2 px-2 font-semibold text-purple-700 flex items-center">
                <Calculator className="w-4 h-4" />
                <span className="ml-1">純収支</span>
              </td>
              {years.slice(0, 3).map((year) => {
                const income = calculateIncomeTotal(year);
                const expense = calculateExpenseTotal(year);
                const net = income - expense;
                const colorClass =
                  net >= 0 ? "text-purple-700" : "text-red-700";
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
