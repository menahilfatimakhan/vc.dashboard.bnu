"use client";

import { useId } from "react";
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ACCENT, INK, TOOLTIP } from "@/config/theme";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export interface LineDatum {
  x: string | number;
  y: number;
}

export interface LineChartInnerProps {
  data: LineDatum[];
  height?: number;
  color?: string;
}

export function LineChartInner({ data, height = 260, color = ACCENT[500] }: LineChartInnerProps) {
  const reducedMotion = usePrefersReducedMotion();
  const gradientId = `line-area-gradient-${useId().replace(/[:]/g, "")}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 4 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.28} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={INK.grid} />
        <XAxis dataKey="x" tick={{ fontSize: 11, fill: INK.muted }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: INK.muted }} axisLine={false} tickLine={false} width={40} />
        <Tooltip
          contentStyle={TOOLTIP.contentStyle}
          itemStyle={TOOLTIP.itemStyle}
          labelStyle={TOOLTIP.labelStyle}
          cursor={{ stroke: INK.hairlineHover, strokeWidth: 1, strokeDasharray: "4 4" }}
        />
        <Area
          type="monotone"
          dataKey="y"
          stroke="none"
          fill={`url(#${gradientId})`}
          isAnimationActive={!reducedMotion}
          animationDuration={600}
        />
        <Line
          type="monotone"
          dataKey="y"
          stroke={color}
          strokeWidth={2}
          dot={{ r: 4, fill: color, stroke: INK.surface, strokeWidth: 2 }}
          activeDot={{ r: 6, fill: color, stroke: INK.surface, strokeWidth: 2 }}
          isAnimationActive={!reducedMotion}
          animationDuration={600}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
