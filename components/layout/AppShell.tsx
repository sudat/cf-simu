import { ReactNode } from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative">
      <div className="max-w-sm mx-auto min-h-screen flex flex-col shadow-2xl bg-white/90 backdrop-blur-xl border border-white/30">
        <Header />
        <main className="flex-1 p-4 pb-24 overflow-y-auto">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
