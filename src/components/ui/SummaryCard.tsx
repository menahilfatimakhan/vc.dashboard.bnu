import type { LucideIcon } from "lucide-react";
import { SkeletonCard } from "./Skeleton";

export interface SummaryCardProps {
  label: string;
  value: string | number | null | undefined;
  loading?: boolean;
  icon?: LucideIcon;
  accent?: "default" | "danger";
  onClick?: () => void;
}

export function SummaryCard({ label, value, loading, icon: Icon, accent = "default", onClick }: SummaryCardProps) {
  if (loading || value === null || value === undefined) {
    return <SkeletonCard />;
  }

  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      onClick={onClick}
      className={`w-full rounded-2xl border border-black/5 bg-surface p-5 text-left shadow-sm transition-shadow ${
        onClick ? "cursor-pointer hover:shadow-md" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">{label}</span>
        {Icon ? (
          <Icon
            className={`h-4 w-4 ${accent === "danger" ? "text-status-critical" : "text-brand-steel"}`}
            strokeWidth={2}
          />
        ) : null}
      </div>
      <div
        className={`mt-2 text-2xl font-semibold ${accent === "danger" ? "text-status-critical" : "text-ink"}`}
      >
        {value}
      </div>
    </Wrapper>
  );
}
