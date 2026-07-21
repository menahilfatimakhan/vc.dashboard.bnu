import { Settings as SettingsIcon } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Settings" showDate={false} />
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-black/5 bg-surface p-16 text-center shadow-sm">
        <SettingsIcon className="h-10 w-10 text-ink-muted" strokeWidth={1.5} />
        <p className="text-base font-medium text-ink">Not interactive in this prototype</p>
        <p className="max-w-md text-sm text-ink-muted">
          Included for visual completeness of the sidebar. There are no configurable settings in Phase 1a — the
          dashboard is read-only and single-user.
        </p>
      </div>
    </div>
  );
}
