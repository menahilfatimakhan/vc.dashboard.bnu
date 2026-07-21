"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CATEGORICAL, INK, TOOLTIP } from "@/config/theme";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

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
  const reducedMotion = usePrefersReducedMotion();
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex flex-col">
      <div className="relative" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={donut ? "62%" : 0}
              outerRadius="85%"
              cornerRadius={donut ? 6 : 0}
              paddingAngle={data.length > 1 ? 3 : 0}
              stroke={INK.surface}
              strokeWidth={2}
              isAnimationActive={!reducedMotion}
              animationDuration={600}
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
              contentStyle={TOOLTIP.contentStyle}
              itemStyle={TOOLTIP.itemStyle}
              labelStyle={TOOLTIP.labelStyle}
              formatter={(value, _name, entry) => [
                Number(value).toLocaleString(),
                (entry.payload as PieDatum).label,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>

        {donut && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-ink tabular-nums">{total.toLocaleString()}</span>
            <span className="text-xs text-ink-muted">Total</span>
          </div>
        )}
      </div>

      {data.length >= 2 && (
        <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
          {data.map((entry, i) => {
            const pct = total > 0 ? (entry.value / total) * 100 : 0;
            return (
              <li key={entry.key} className="flex items-center gap-1.5 text-xs text-ink-muted">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: colors[i % colors.length] }}
                />
                {entry.label}
                <span className="tabular-nums text-ink-secondary">{pct.toFixed(0)}%</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
