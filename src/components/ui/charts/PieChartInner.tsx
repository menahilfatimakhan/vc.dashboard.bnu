"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CATEGORICAL, INK } from "@/config/theme";

export interface PieDatum {
  key: string;
  label: string;
  value: number;
}

export interface PieChartInnerProps {
  data: PieDatum[];
  donut?: boolean;
  onSegmentClick?: (key: string) => void;
  height?: number;
  colors?: readonly string[];
}

const RADIAN = Math.PI / 180;

interface InsideLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  value: number;
  percentTotal: number;
}

function renderInsideLabel(props: InsideLabelProps) {
  const { cx, cy, midAngle, innerRadius, outerRadius, value, percentTotal } = props;
  const pct = percentTotal > 0 ? (value / percentTotal) * 100 : 0;
  if (pct < 8) return null; // selective labeling — skip slivers, table/legend carry the rest

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="#ffffff" textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight={600}>
      {`${pct.toFixed(0)}%`}
    </text>
  );
}

export function PieChartInner({ data, donut, onSegmentClick, height = 260, colors = CATEGORICAL }: PieChartInnerProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius={donut ? "58%" : 0}
          outerRadius="85%"
          paddingAngle={data.length > 1 ? 2 : 0}
          stroke={INK.surface}
          strokeWidth={2}
          isAnimationActive={false}
          onClick={onSegmentClick ? (entry) => onSegmentClick((entry as unknown as PieDatum).key) : undefined}
          cursor={onSegmentClick ? "pointer" : undefined}
          label={(props) => renderInsideLabel({ ...props, percentTotal: total } as InsideLabelProps)}
          labelLine={false}
        >
          {data.map((entry, i) => (
            <Cell key={entry.key} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ borderRadius: 8, border: `1px solid ${INK.hairline}`, fontSize: 12 }}
          formatter={(value, _name, entry) => [
            Number(value).toLocaleString(),
            (entry.payload as PieDatum).label,
          ]}
        />
        {data.length >= 2 && <Legend wrapperStyle={{ fontSize: 12, color: INK.secondary }} iconType="circle" iconSize={8} />}
      </PieChart>
    </ResponsiveContainer>
  );
}
