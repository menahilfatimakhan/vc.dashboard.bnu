"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CATEGORICAL, INK } from "@/config/theme";

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

export function StackedBarChartInner({
  data,
  categoryKey,
  series,
  height = 280,
  stacked = true,
}: StackedBarChartInnerProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 4 }}>
        <CartesianGrid horizontal={false} stroke={INK.hairline} />
        <XAxis type="number" tick={{ fontSize: 11, fill: INK.muted }} axisLine={{ stroke: INK.hairline }} tickLine={false} />
        <YAxis
          type="category"
          dataKey={categoryKey}
          width={140}
          tick={{ fontSize: 12, fill: INK.secondary }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: INK.page }}
          contentStyle={{ borderRadius: 8, border: `1px solid ${INK.hairline}`, fontSize: 12 }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: INK.secondary }} iconType="circle" iconSize={8} />
        {series.map((s, i) => (
          <Bar
            key={s.dataKey}
            dataKey={s.dataKey}
            name={s.label}
            stackId={stacked ? "stack" : undefined}
            fill={CATEGORICAL[i % CATEGORICAL.length]}
            maxBarSize={22}
            isAnimationActive={false}
            radius={
              !stacked
                ? [0, 4, 4, 0]
                : i === series.length - 1
                  ? [0, 4, 4, 0]
                  : i === 0
                    ? [0, 0, 0, 0]
                    : [0, 0, 0, 0]
            }
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
