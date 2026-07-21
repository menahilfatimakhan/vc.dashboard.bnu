"use client";

import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CATEGORICAL, INK, TOOLTIP } from "@/config/theme";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export interface StackedSeries {
  dataKey: string;
  label: string;
}

export interface StackedBarChartInnerProps {
  data: Record<string, string | number>[];
  categoryKey: string;
  series: StackedSeries[];
  height?: number;
  stacked?: boolean;
}

function barRadius(index: number, seriesCount: number, stacked: boolean): [number, number, number, number] {
  if (!stacked) return [0, 6, 6, 0];
  if (seriesCount === 1) return [6, 6, 6, 6];
  if (index === 0) return [6, 0, 0, 6]; // outer (free) end of the first stacked segment
  if (index === seriesCount - 1) return [0, 6, 6, 0]; // outer (free) end of the last stacked segment
  return [0, 0, 0, 0]; // inner joins between segments stay square
}

export function StackedBarChartInner({
  data,
  categoryKey,
  series,
  height = 280,
  stacked = true,
}: StackedBarChartInnerProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 4 }} barCategoryGap="30%">
        <XAxis type="number" tick={{ fontSize: 11, fill: INK.muted }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey={categoryKey}
          width={140}
          tick={{ fontSize: 12, fill: INK.secondary }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: INK.subtle }}
          contentStyle={TOOLTIP.contentStyle}
          itemStyle={TOOLTIP.itemStyle}
          labelStyle={TOOLTIP.labelStyle}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, color: INK.muted }}
          iconType="circle"
          iconSize={8}
        />
        {series.map((s, i) => (
          <Bar
            key={s.dataKey}
            dataKey={s.dataKey}
            name={s.label}
            stackId={stacked ? "stack" : undefined}
            fill={CATEGORICAL[i % CATEGORICAL.length]}
            maxBarSize={20}
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
