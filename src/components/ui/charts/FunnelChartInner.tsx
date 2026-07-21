"use client";

import { Funnel, FunnelChart, LabelList, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { ORDINAL_FUNNEL, TOOLTIP } from "@/config/theme";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export interface FunnelDatum {
  stage: string;
  value: number;
}

export interface FunnelChartInnerProps {
  data: FunnelDatum[];
  height?: number;
}

export function FunnelChartInner({ data, height = 260 }: FunnelChartInnerProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <ResponsiveContainer width="100%" height={height}>
      <FunnelChart>
        <Tooltip
          contentStyle={TOOLTIP.contentStyle}
          itemStyle={TOOLTIP.itemStyle}
          labelStyle={TOOLTIP.labelStyle}
          formatter={(value) => Number(value).toLocaleString()}
        />
        <Funnel
          dataKey="value"
          data={data}
          nameKey="stage"
          isAnimationActive={!reducedMotion}
          animationDuration={600}
        >
          <LabelList dataKey="stage" position="center" fill="#ffffff" stroke="none" fontSize={13} fontWeight={600} dy={-10} />
          <LabelList
            dataKey="value"
            position="center"
            fill="#ffffff"
            stroke="none"
            fontSize={12}
            dy={10}
            formatter={(value) => Number(value).toLocaleString()}
          />
          {data.map((entry, i) => (
            <Cell key={entry.stage} fill={ORDINAL_FUNNEL[i % ORDINAL_FUNNEL.length]} />
          ))}
        </Funnel>
      </FunnelChart>
    </ResponsiveContainer>
  );
}
