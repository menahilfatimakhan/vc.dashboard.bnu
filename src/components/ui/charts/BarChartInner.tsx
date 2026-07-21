"use client";

import { useState } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ACCENT, INK, TOOLTIP } from "@/config/theme";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export interface BarDatum {
  key: string;
  label: string;
  value: number;
}

export interface BarChartInnerProps {
  data: BarDatum[];
  onSegmentClick?: (key: string) => void;
  height?: number;
  color?: string;
  valueFormatter?: (value: number) => string;
}

export function BarChartInner({
  data,
  onSegmentClick,
  height = 260,
  color = ACCENT[500],
  valueFormatter = (v) => v.toLocaleString(),
}: BarChartInnerProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const maxValue = Math.max(...data.map((d) => d.value));
  const valueByLabel = new Map(data.map((d) => [d.label, d.value]));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 8, bottom: 4, left: 4 }} barCategoryGap="30%">
        <XAxis type="number" tick={{ fontSize: 11, fill: INK.muted }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="label"
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
          formatter={(value) => valueFormatter(Number(value))}
        />
        <Bar
          dataKey="value"
          radius={[0, 6, 6, 0]}
          maxBarSize={20}
          isAnimationActive={!reducedMotion}
          animationDuration={600}
          onClick={onSegmentClick ? (entry) => onSegmentClick((entry as unknown as BarDatum).key) : undefined}
          cursor={onSegmentClick ? "pointer" : undefined}
        >
          {data.map((entry) => {
            const isFocused = hoverKey === entry.key || (hoverKey === null && entry.value === maxValue);
            return (
              <Cell
                key={entry.key}
                fill={color}
                fillOpacity={isFocused ? 1 : 0.55}
                onMouseEnter={() => setHoverKey(entry.key)}
                onMouseLeave={() => setHoverKey(null)}
                style={{ transition: "fill-opacity 150ms ease-out" }}
              />
            );
          })}
        </Bar>
        {/* Mirrored category axis used only to print the value column — since it
            shares the same categorical scale as the left YAxis, each label lands
            exactly level with its bar, forming a clean right-hand column instead
            of floating at the ragged end of each bar. */}
        <YAxis
          yAxisId="value-labels"
          orientation="right"
          type="category"
          dataKey="label"
          width={48}
          axisLine={false}
          tickLine={false}
          tick={(props: { x: number | string; y: number | string; payload: { value: string } }) => {
            const { x, y, payload } = props;
            const value = valueByLabel.get(payload.value) ?? 0;
            return (
              <text x={x} y={y} dy={4} textAnchor="start" fontSize={12} fill={INK.secondary}>
                {valueFormatter(value)}
              </text>
            );
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
