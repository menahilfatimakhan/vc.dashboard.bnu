import type { ReactNode } from "react";
import { SkeletonChart } from "./Skeleton";
import { EmptyState } from "./EmptyState";
import { BarChartInner, type BarDatum } from "./charts/BarChartInner";
import { PieChartInner, type PieDatum } from "./charts/PieChartInner";
import { LineChartInner, type LineDatum } from "./charts/LineChartInner";
import { FunnelChartInner, type FunnelDatum } from "./charts/FunnelChartInner";
import { GaugeChartInner } from "./charts/GaugeChartInner";

export type ChartVariant = "pie" | "donut" | "bar" | "line" | "funnel" | "gauge";

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  loading?: boolean;
  height?: number;
  emptyMessage?: string;

  variant?: ChartVariant;
  data?: BarDatum[] | PieDatum[];
  trend?: LineDatum[];
  funnelData?: FunnelDatum[];
  gaugeValue?: number;
  gaugeLabel?: string;
  onSegmentClick?: (key: string) => void;

  /** Escape hatch for compound charts (e.g. stacked bars) that don't fit the variant model. */
  children?: ReactNode;
}

export function ChartCard({
  title,
  subtitle,
  loading,
  height = 260,
  emptyMessage = "No data for the current filters.",
  variant,
  data,
  trend,
  funnelData,
  gaugeValue,
  gaugeLabel,
  onSegmentClick,
  children,
}: ChartCardProps) {
  const isEmpty =
    !loading &&
    ((variant && ["pie", "donut", "bar"].includes(variant) && (!data || data.length === 0)) ||
      (variant === "line" && (!trend || trend.length === 0)) ||
      (variant === "funnel" && (!funnelData || funnelData.length === 0)));

  return (
    <div className="rounded-2xl border border-black/5 bg-surface p-5 shadow-sm">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        {subtitle && <p className="text-xs text-ink-muted">{subtitle}</p>}
      </div>

      {loading ? (
        <SkeletonChart height={height} />
      ) : isEmpty ? (
        <EmptyState message={emptyMessage} />
      ) : children ? (
        children
      ) : variant === "bar" ? (
        <BarChartInner data={data as BarDatum[]} height={height} onSegmentClick={onSegmentClick} />
      ) : variant === "pie" ? (
        <PieChartInner data={data as PieDatum[]} height={height} onSegmentClick={onSegmentClick} />
      ) : variant === "donut" ? (
        <PieChartInner data={data as PieDatum[]} donut height={height} onSegmentClick={onSegmentClick} />
      ) : variant === "line" ? (
        <LineChartInner data={trend ?? []} height={height} />
      ) : variant === "funnel" ? (
        <FunnelChartInner data={funnelData ?? []} height={height} />
      ) : variant === "gauge" ? (
        <GaugeChartInner value={gaugeValue ?? 0} label={gaugeLabel} height={height} />
      ) : null}
    </div>
  );
}
