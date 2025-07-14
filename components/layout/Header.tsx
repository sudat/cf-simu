import { Button } from "@/components/ui/button";
import { Share, Menu } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 text-gray-800 p-4 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-gray-800">CF Simulator</h1>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
        >
          <Share className="w-5 h-5 text-gray-600" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </Button>
      </div>
    </header>
  );
}
