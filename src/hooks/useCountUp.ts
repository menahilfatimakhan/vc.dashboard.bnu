"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const NUMBER_PATTERN = /-?\d[\d,]*\.?\d*/;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Animates the first numeric token inside a KPI value from zero, once, at
 * mount — preserving any surrounding text (currency prefixes, "%", trailing
 * "(12.3%)" etc). Values with no numeric token render immediately. Later
 * value changes (e.g. a drill-down filter) update the display without
 * re-animating — the count-up is a mount effect, not a per-update one.
 */
export function useCountUp(value: string | number | null | undefined, durationMs = 600): string {
  const reducedMotion = usePrefersReducedMotion();
  const target = value === null || value === undefined ? "" : String(value);
  const [display, setDisplay] = useState(target);
  const hasAnimated = useRef(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const match = target.match(NUMBER_PATTERN);

    if (hasAnimated.current || !match || reducedMotion || !target) {
      setDisplay(target);
      if (target) hasAnimated.current = true;
      return;
    }

    hasAnimated.current = true;
    const raw = match[0];
    const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
    const numericTarget = parseFloat(raw.replace(/,/g, ""));
    const prefix = target.slice(0, match.index);
    const suffix = target.slice((match.index ?? 0) + raw.length);
    const start = performance.now();

    function tick(now: number) {
      const t = Math.min(1, (now - start) / durationMs);
      const current = numericTarget * easeOutCubic(t);
      const formatted = current.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      if (t < 1) {
        setDisplay(`${prefix}${formatted}${suffix}`);
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, reducedMotion]);

  return display;
}
