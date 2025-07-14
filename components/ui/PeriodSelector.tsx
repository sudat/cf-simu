"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "lucide-react";

interface PeriodSelectorProps {
  defaultPeriod?: number;
  onPeriodChange?: (period: number) => void;
}

export function PeriodSelector({
  defaultPeriod = 10,
  onPeriodChange,
}: PeriodSelectorProps) {
  const [period, setPeriod] = useState(defaultPeriod);
  const [isOpen, setIsOpen] = useState(false);

  const periods = [5, 10, 20, 30, 50];

  const handlePeriodChange = (newPeriod: number) => {
    setPeriod(newPeriod);
    onPeriodChange?.(newPeriod);
    setIsOpen(false);
  };

  return (
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
                onClick={() => handlePeriodChange(p)}
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
  );
}
