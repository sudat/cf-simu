"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      id: "dashboard",
      label: "ダッシュボード",
      icon: BarChart3,
      href: "/dashboard",
      isActive: pathname === "/dashboard" || pathname === "/",
    },
    {
      id: "transition",
      label: "推移",
      icon: TrendingUp,
      href: "/transition",
      isActive: pathname === "/transition",
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm h-16 bg-white backdrop-blur-xl border-t border-gray-200 flex shadow-2xl z-[9999]"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
      }}
    >
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          onClick={() => router.push(item.href)}
          className={cn(
            "flex-1 h-full flex flex-col items-center justify-center py-2 px-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100/50 transition-all duration-200 rounded-none",
            item.isActive && "text-brand-600 bg-brand-50/50"
          )}
        >
          <item.icon className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">{item.label}</span>
        </Button>
      ))}
    </nav>
  );
}
