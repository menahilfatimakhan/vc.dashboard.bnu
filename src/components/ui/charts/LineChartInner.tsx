"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CATEGORICAL, INK } from "@/config/theme";

export interface LineDatum {
  x: string | number;
  y: number;
}

export interface LineChartInnerProps {
  data: LineDatum[];
  height?: number;
  color?: string;
}

export function LineChartInner({ data, height = 260, color = CATEGORICAL[0] }: LineChartInnerProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 4 }}>
        <CartesianGrid vertical={false} stroke={INK.hairline} />
        <XAxis dataKey="x" tick={{ fontSize: 11, fill: INK.muted }} axisLine={{ stroke: INK.hairline }} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: INK.muted }} axisLine={false} tickLine={false} width={40} />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: `1px solid ${INK.hairline}`, fontSize: 12 }}
          cursor={{ stroke: INK.hairline }}
        />
        <Line
          type="monotone"
          dataKey="y"
          stroke={color}
          strokeWidth={2}
          dot={{ r: 4, fill: color, stroke: INK.surface, strokeWidth: 2 }}
          activeDot={{ r: 6, fill: color, stroke: INK.surface, strokeWidth: 2 }}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
