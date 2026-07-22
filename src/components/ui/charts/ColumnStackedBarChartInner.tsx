"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CATEGORICAL, INK, TOOLTIP } from "@/config/theme";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export interface StackedSeries {
  dataKey: string;
  label: string;
}

export interface ColumnStackedBarChartInnerProps {
  data: Record<string, string | number>[];
  categoryKey: string;
  series: StackedSeries[];
  height?: number;
  stacked?: boolean;
  yTickFormatter?: (value: number) => string;
}

function barRadius(index: number, seriesCount: number, stacked: boolean): [number, number, number, number] {
  if (!stacked) return [6, 6, 0, 0];
  if (seriesCount === 1) return [6, 6, 6, 6];
  if (index === seriesCount - 1) return [6, 6, 0, 0]; // outer (free) end of the topmost stacked segment
  return [0, 0, 0, 0]; // inner joins between segments stay square
}

/** Time-series-oriented variant of StackedBarChartInner — categories run left-to-right
 * on the X axis (columns), for trends across ordered periods (e.g. semesters). */
export function ColumnStackedBarChartInner({
  data,
  categoryKey,
  series,
  height = 280,
  stacked = true,
  yTickFormatter,
}: ColumnStackedBarChartInnerProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: 4 }} barCategoryGap="30%">
        <CartesianGrid vertical={false} stroke={INK.grid} />
        <XAxis
          dataKey={categoryKey}
          tick={{ fontSize: 11, fill: INK.muted }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11, fill: INK.muted }}
          axisLine={false}
          tickLine={false}
          width={yTickFormatter ? 56 : 44}
          tickFormatter={yTickFormatter}
        />
        <Tooltip
          cursor={{ fill: INK.subtle }}
          contentStyle={TOOLTIP.contentStyle}
          itemStyle={TOOLTIP.itemStyle}
          labelStyle={TOOLTIP.labelStyle}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: INK.muted }} iconType="circle" iconSize={8} />
        {series.map((s, i) => (
          <Bar
            key={s.dataKey}
            dataKey={s.dataKey}
            name={s.label}
            stackId={stacked ? "stack" : undefined}
            fill={CATEGORICAL[i % CATEGORICAL.length]}
            maxBarSize={28}
            isAnimationActive={!reducedMotion}
            animationDuration={600}
            animationBegin={i * 40}
            radius={barRadius(i, series.length, stacked)}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
