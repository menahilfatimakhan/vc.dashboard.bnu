"use client";

import { GraduationCap, Award, TrendingUp, TrendingDown } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FilterBar, type FilterFieldConfig } from "@/components/ui/FilterBar";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { StackedBarChartInner } from "@/components/ui/charts/StackedBarChartInner";
import { useModuleFilters, type DrillLevelConfig } from "@/hooks/useModuleFilters";
import { useAsync } from "@/hooks/useAsync";
import { SCHOOLS, resolveSchool, resolveProgramme } from "@/lib/data/catalog/schools";
import { getPerformanceSummary, type PerformanceFilters } from "@/lib/services/performanceService";

const LEVELS: DrillLevelConfig[] = [
  { level: "school", filterKey: "schoolId", resolveLabel: resolveSchool },
  { level: "programme", filterKey: "programmeId", resolveLabel: resolveProgramme },
];

const TIER_SERIES = [
  { dataKey: "Tier 1", label: "Tier 1 (3.50-4.00)" },
  { dataKey: "Tier 2", label: "Tier 2 (3.00-3.49)" },
  { dataKey: "Tier 3", label: "Tier 3 (2.00-2.99)" },
  { dataKey: "Unclassified", label: "Unclassified (< 2.00)" },
];

export default function StudentPerformancePage() {
  const { filters, breadcrumb, setFilter, jumpToBreadcrumb, resetAll } =
    useModuleFilters<PerformanceFilters>({ levels: LEVELS });

  const summary = useAsync(() => getPerformanceSummary(filters), [filters.schoolId, filters.programmeId]);

  function handleFilterChange(key: string, value: string | undefined) {
    setFilter(key, value);
  }

  const programmeOptions = filters.schoolId
    ? (SCHOOLS.find((s) => s.id === filters.schoolId)?.programmes ?? []).map((p) => ({ value: p.id, label: p.name }))
    : SCHOOLS.flatMap((s) => s.programmes.map((p) => ({ value: p.id, label: `${s.shortName} — ${p.name}` })));

  const filterConfig: FilterFieldConfig[] = [
    { key: "schoolId", label: "School", kind: "select", options: SCHOOLS.map((s) => ({ value: s.id, label: s.name })) },
    { key: "programmeId", label: "Programme", kind: "select", options: programmeOptions },
  ];

  const bySchoolData = (summary.data?.bySchool ?? []).map((s) => ({ label: s.label, ...s.divisions }));

  const tier1 = summary.data?.byDivision.find((d) => d.key === "Tier 1");
  const tier2 = summary.data?.byDivision.find((d) => d.key === "Tier 2");
  const tier3 = summary.data?.byDivision.find((d) => d.key === "Tier 3");

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Student Performance" />
      <Breadcrumb items={breadcrumb} onJump={jumpToBreadcrumb} />
      <FilterBar filters={filters} config={filterConfig} onChange={handleFilterChange} onClearAll={resetAll} />

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <SummaryCard label="Students Assessed" value={summary.data?.total} loading={summary.loading} icon={GraduationCap} />
        <SummaryCard
          label="Tier 1 (Top)"
          value={tier1 ? `${tier1.value} (${tier1.percent.toFixed(1)}%)` : undefined}
          loading={summary.loading}
          icon={Award}
        />
        <SummaryCard
          label="Tier 2"
          value={tier2 ? `${tier2.value} (${tier2.percent.toFixed(1)}%)` : undefined}
          loading={summary.loading}
          icon={TrendingUp}
        />
        <SummaryCard
          label="Tier 3"
          value={tier3 ? `${tier3.value} (${tier3.percent.toFixed(1)}%)` : undefined}
          loading={summary.loading}
          icon={TrendingDown}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard
          title="CGPA Tier Split"
          variant="donut"
          data={summary.data?.byDivision.map((d) => ({ key: d.key, label: d.label, value: d.value }))}
          loading={summary.loading}
        />
        <ChartCard title="Tiers by School" loading={summary.loading} height={Math.max(220, bySchoolData.length * 40)}>
          {bySchoolData.length > 0 && (
            <StackedBarChartInner
              data={bySchoolData}
              categoryKey="label"
              series={TIER_SERIES}
              height={Math.max(220, bySchoolData.length * 40)}
            />
          )}
        </ChartCard>
      </div>
    </div>
  );
}
