import { ChevronDown } from "lucide-react";

export function UserBlock() {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-steel text-sm font-semibold text-white">
        VC
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">Vice Chancellor</p>
        <p className="truncate text-xs text-white/60">BNU</p>
      </div>
      <ChevronDown className="h-4 w-4 shrink-0 text-white/50" />
    </div>
  );
}
