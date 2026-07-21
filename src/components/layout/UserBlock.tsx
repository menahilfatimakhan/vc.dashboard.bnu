import { ChevronDown } from "lucide-react";

export function UserBlock() {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-subtle px-3 py-2.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-100 text-sm font-semibold text-accent-600">
        VC
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-ink">Vice Chancellor</p>
        <p className="truncate text-[11px] text-ink-muted">BNU</p>
      </div>
      <ChevronDown className="h-4 w-4 shrink-0 text-ink-muted" strokeWidth={1.5} />
    </div>
  );
}
