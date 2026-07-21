import { HelpCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

export default function HelpPage() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Help" showDate={false} />
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-black/5 bg-surface p-16 text-center shadow-sm">
        <HelpCircle className="h-10 w-10 text-ink-muted" strokeWidth={1.5} />
        <p className="text-base font-medium text-ink">Not interactive in this prototype</p>
        <p className="max-w-md text-sm text-ink-muted">
          Included for visual completeness of the sidebar. Support documentation will be added once the dashboard
          moves beyond Phase 1a.
        </p>
      </div>
    </div>
  );
}
