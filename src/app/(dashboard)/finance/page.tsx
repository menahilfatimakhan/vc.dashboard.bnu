import { Wallet } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

export default function FinancePage() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Finance" showDate={false} />
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-black/5 bg-surface p-16 text-center shadow-sm">
        <Wallet className="h-10 w-10 text-ink-muted" strokeWidth={1.5} />
        <p className="text-base font-medium text-ink">Out of scope for this phase</p>
        <p className="max-w-md text-sm text-ink-muted">
          Finance is retained in the sidebar for structural completeness but is explicitly excluded from this
          build — see the root CLAUDE.md Scope guardrails. No finance data, charts, or metrics exist anywhere in
          this prototype.
        </p>
      </div>
    </div>
  );
}
