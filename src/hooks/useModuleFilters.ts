"use client";

import { useState } from "react";

export interface DrillLevelConfig {
  level: string;
  filterKey: string;
  resolveLabel: (id: string) => string;
}

export interface BreadcrumbItem {
  level: string;
  id: string | null;
  label: string;
}

export interface UseModuleFiltersOptions<F> {
  rootLabel?: string;
  levels: DrillLevelConfig[];
  initialFilters?: Partial<F>;
}

/**
 * The single mechanism every module page uses for University-wide -> School/
 * Department -> Programme drill-down, filter chips, and the breadcrumb. Both a
 * FilterBar dropdown change and a ChartCard segment click must call `setFilter` —
 * this is what guarantees they can never desync into different states.
 */
export function useModuleFilters<F extends object>(opts: UseModuleFiltersOptions<F>) {
  const rootLabel = opts.rootLabel ?? "BNU";
  const [filters, setFilters] = useState<Record<string, string | undefined>>({
    ...(opts.initialFilters as Record<string, string | undefined> | undefined ?? {}),
  });
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([
    { level: "university", id: null, label: rootLabel },
  ]);

  function setFilter(key: string, value: string | undefined) {
    const levelCfg = opts.levels.find((l) => l.filterKey === key);

    setFilters((prev) => {
      const next: Record<string, string | undefined> = { ...prev, [key]: value };
      if (levelCfg && value === undefined) {
        const idx = opts.levels.indexOf(levelCfg);
        for (const l of opts.levels.slice(idx)) delete next[l.filterKey];
      }
      return next;
    });

    if (levelCfg) {
      setBreadcrumb((prev) => {
        const parentDepth = opts.levels.indexOf(levelCfg) + 1; // +1 for the university root
        const truncated = prev.slice(0, parentDepth);
        return value === undefined
          ? truncated
          : [...truncated, { level: levelCfg.level, id: value, label: levelCfg.resolveLabel(value) }];
      });
    }
  }

  function jumpToBreadcrumb(index: number) {
    const target = breadcrumb[index];
    setBreadcrumb((prev) => prev.slice(0, index + 1));
    setFilters((prev) => {
      const next: Record<string, string | undefined> = { ...prev };
      const fromIdx =
        target.level === "university" ? 0 : opts.levels.findIndex((l) => l.level === target.level) + 1;
      for (const l of opts.levels.slice(fromIdx)) delete next[l.filterKey];
      return next;
    });
  }

  function resetAll() {
    setFilters({ ...(opts.initialFilters as Record<string, string | undefined> | undefined ?? {}) });
    setBreadcrumb([{ level: "university", id: null, label: rootLabel }]);
  }

  return { filters: filters as F, breadcrumb, setFilter, jumpToBreadcrumb, resetAll };
}
