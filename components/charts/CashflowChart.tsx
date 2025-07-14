"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Calendar } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";

const chartConfig = {
  income: {
    label: "収入",
    color: "#059669", // Tailwind success green
  },
  expense: {
    label: "支出",
    color: "#dc2626", // Tailwind danger red
  },
} satisfies ChartConfig;

const MotionCard = motion(Card);

export function CashflowChart() {
  const [period, setPeriod] = useState(10);
  const [isOpen, setIsOpen] = useState(false);

  const periods = [5, 10, 20, 30, 50];

  // サンプルデータ生成（積み重ね用）
  const generateChartData = (years: number) => {
    const data = [];
    const currentYear = 2025;

    for (let i = 0; i <= years; i++) {
      const year = currentYear + i;
      const income = Math.round(600 * Math.pow(1.03, i)); // 年3%増
      const expense = Math.round(450 * Math.pow(1.025, i)); // 年2.5%増

      data.push({
        year: year.toString(),
        income,
        expense,
        net: income - expense,
      });
    }

    return data;
  };

  const chartData = generateChartData(period);

  return (
    <MotionCard
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white/90 backdrop-blur-md border border-white/30 shadow-lg gap-4"
    >
      <CardHeader className="px-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-800">
              収支
            </CardTitle>
          </div>
          <div className="flex gap-2 items-center">
            <div className="text-sm text-gray-600">{period}年間</div>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
                >
                  <Calendar className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" align="end">
                <div className="flex gap-2 flex-wrap">
                  {periods.map((p) => (
                    <Button
                      key={p}
                      variant={period === p ? "default" : "ghost"}
                      size="sm"
                      onClick={() => {
                        setPeriod(p);
                        setIsOpen(false);
                      }}
                      className={
                        period === p
                          ? "bg-brand-500 text-white hover:bg-brand-600"
                          : ""
                      }
                    >
                      {p}年
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4">
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 30,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(-2)}
              interval={
                period <= 5 ? 0 : period <= 10 ? 1 : period <= 20 ? 2 : 4
              }
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={2}
              width={20}
              tickFormatter={(value) =>
                `${Math.round(Number(value) / 200) * 200}万円`
              }
              tick={{ fontSize: 10 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
              formatter={(value, name) => [
                `${Number(value).toLocaleString()}万円`,
                chartConfig[name as keyof typeof chartConfig]?.label || name,
              ]}
            />
            {/* 収入エリア（下） */}
            <Area
              dataKey="income"
              type="monotone"
              fill="#059669"
              fillOpacity={0.25}
              stroke="#059669"
              strokeWidth={2}
            />
            {/* 支出エリア（上） */}
            <Area
              dataKey="expense"
              type="monotone"
              fill="#dc2626"
              fillOpacity={0.35}
              stroke="#dc2626"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </MotionCard>
  );
}
