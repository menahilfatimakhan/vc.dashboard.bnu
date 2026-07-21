"use client";

import type { LucideIcon } from "lucide-react";
import { SkeletonCard } from "./Skeleton";
import { useCountUp } from "@/hooks/useCountUp";

export interface SummaryCardProps {
  label: string;
  value: string | number | null | undefined;
  loading?: boolean;
  icon?: LucideIcon;
  accent?: "default" | "danger";
  onClick?: () => void;
}

export function SummaryCard({ label, value, loading, icon: Icon, accent = "default", onClick }: SummaryCardProps) {
  const displayValue = useCountUp(value);

  if (loading || value === null || value === undefined) {
    return <SkeletonCard />;
  }

  const Wrapper = onClick ? "button" : "div";
  const chipClasses = accent === "danger" ? "bg-status-critical-50 text-status-critical" : "bg-accent-50 text-accent-500";

  return (
    <Wrapper
      onClick={onClick}
      className={`w-full rounded-2xl border border-hairline bg-surface p-5 text-left shadow-card transition-all duration-150 hover:-translate-y-px hover:border-hairline-hover hover:shadow-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500/40 ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.04em] text-ink-muted">{label}</span>
        {Icon ? (
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${chipClasses}`}>
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </span>
        ) : null}
      </div>
      <div className="mt-3 text-[30px] leading-none font-bold tracking-[-0.02em] text-ink tabular-nums">
        {displayValue}
      </div>
    </Wrapper>
  );
}
