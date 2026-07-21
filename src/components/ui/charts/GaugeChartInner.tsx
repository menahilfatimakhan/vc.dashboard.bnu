"use client";

import { RadialBar, RadialBarChart, PolarAngleAxis } from "recharts";
import { METER } from "@/config/theme";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export interface GaugeChartInnerProps {
  value: number; // 0-100
  label?: string;
  height?: number;
  fill?: string;
}

export function GaugeChartInner({ value, label, height = 200, fill = METER.fill }: GaugeChartInnerProps) {
  const reducedMotion = usePrefersReducedMotion();
  const clamped = Math.max(0, Math.min(100, value));
  const data = [{ name: "value", value: clamped, fill }];

  return (
    <div className="relative" style={{ height }}>
      <RadialBarChart
        width={260}
        height={height}
        cx="50%"
        cy="80%"
        innerRadius="120%"
        outerRadius="180%"
        barSize={18}
        startAngle={180}
        endAngle={0}
        data={data}
        style={{ margin: "0 auto" }}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar
          dataKey="value"
          cornerRadius={9}
          background={{ fill: METER.track }}
          isAnimationActive={!reducedMotion}
          animationDuration={600}
        />
      </RadialBarChart>
      <div className="absolute inset-x-0 bottom-2 flex flex-col items-center">
        <span className="text-2xl font-bold text-ink tabular-nums">{clamped.toFixed(1)}%</span>
        {label && <span className="text-xs text-ink-muted">{label}</span>}
      </div>
    </div>
  );
}
