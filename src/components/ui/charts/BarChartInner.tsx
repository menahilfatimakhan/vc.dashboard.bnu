"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CATEGORICAL, INK } from "@/config/theme";

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
  color = CATEGORICAL[0],
  valueFormatter = (v) => v.toLocaleString(),
}: BarChartInnerProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 32, bottom: 4, left: 4 }}>
        <CartesianGrid horizontal={false} stroke={INK.hairline} />
        <XAxis type="number" tick={{ fontSize: 11, fill: INK.muted }} axisLine={{ stroke: INK.hairline }} tickLine={false} />
        <YAxis
          type="category"
          dataKey="label"
          width={140}
          tick={{ fontSize: 12, fill: INK.secondary }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: INK.page }}
          contentStyle={{ borderRadius: 8, border: `1px solid ${INK.hairline}`, fontSize: 12 }}
          formatter={(value) => valueFormatter(Number(value))}
        />
        <Bar
          dataKey="value"
          fill={color}
          radius={[0, 4, 4, 0]}
          maxBarSize={22}
          isAnimationActive={false}
          onClick={onSegmentClick ? (entry) => onSegmentClick((entry as unknown as BarDatum).key) : undefined}
          cursor={onSegmentClick ? "pointer" : undefined}
        >
          <LabelList
            dataKey="value"
            position="right"
            style={{ fill: INK.secondary, fontSize: 11 }}
            formatter={(value) => valueFormatter(Number(value))}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
