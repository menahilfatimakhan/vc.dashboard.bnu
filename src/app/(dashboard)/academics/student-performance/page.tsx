"use client";

import { useState } from "react";
import { GraduationCap, Award, TrendingUp, TrendingDown } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FilterBar, type FilterFieldConfig } from "@/components/ui/FilterBar";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { StackedBarChartInner } from "@/components/ui/charts/StackedBarChartInner";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { useModuleFilters, type DrillLevelConfig } from "@/hooks/useModuleFilters";
import { useAsync } from "@/hooks/useAsync";
import { SCHOOLS, resolveSchool, resolveProgramme } from "@/lib/data/catalog/schools";
import {
  getPerformanceRecords,
  getPerformanceSummary,
  type PerformanceFilters,
} from "@/lib/services/performanceService";

const LEVELS: DrillLevelConfig[] = [
  { level: "school", filterKey: "schoolId", resolveLabel: resolveSchool },
  { level: "programme", filterKey: "programmeId", resolveLabel: resolveProgramme },
];

const PAGE_SIZE = 10;
const DIVISION_SERIES = [
  { dataKey: "Division 3", label: "Division 3 (Top)" },
  { dataKey: "Division 2", label: "Division 2" },
  { dataKey: "Division 1", label: "Division 1" },
  { dataKey: "Unclassified", label: "Unclassified (< 2.00)" },
];

export default function StudentPerformancePage() {
  const { filters, breadcrumb, setFilter, jumpToBreadcrumb, resetAll } =
    useModuleFilters<PerformanceFilters>({ levels: LEVELS });
  const [page, setPage] = useState(1);

  const summary = useAsync(() => getPerformanceSummary(filters), [filters.schoolId, filters.programmeId]);
  const records = useAsync(
    () => getPerformanceRecords(filters, { page, pageSize: PAGE_SIZE }),
    [filters.schoolId, filters.programmeId, page],
  );

  function handleFilterChange(key: string, value: string | undefined) {
    setPage(1);
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

  const columns: Column<{
    id: string;
    name: string;
    schoolName: string;
    programmeName: string;
    cgpa: number;
    division: string;
  }>[] = [
    { key: "id", header: "Student ID" },
    { key: "name", header: "Name" },
    { key: "schoolName", header: "School" },
    { key: "programmeName", header: "Programme" },
    { key: "cgpa", header: "CGPA", align: "right" },
    { key: "division", header: "Division" },
  ];

  const div3 = summary.data?.byDivision.find((d) => d.key === "Division 3");
  const div2 = summary.data?.byDivision.find((d) => d.key === "Division 2");
  const div1 = summary.data?.byDivision.find((d) => d.key === "Division 1");

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Student Performance" />
      <Breadcrumb items={breadcrumb} onJump={jumpToBreadcrumb} />
      <FilterBar filters={filters} config={filterConfig} onChange={handleFilterChange} onClearAll={resetAll} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard label="Students Assessed" value={summary.data?.total} loading={summary.loading} icon={GraduationCap} />
        <SummaryCard
          label="Division 3 (Top)"
          value={div3 ? `${div3.value} (${div3.percent.toFixed(1)}%)` : undefined}
          loading={summary.loading}
          icon={Award}
        />
        <SummaryCard
          label="Division 2"
          value={div2 ? `${div2.value} (${div2.percent.toFixed(1)}%)` : undefined}
          loading={summary.loading}
          icon={TrendingUp}
        />
        <SummaryCard
          label="Division 1"
          value={div1 ? `${div1.value} (${div1.percent.toFixed(1)}%)` : undefined}
          loading={summary.loading}
          icon={TrendingDown}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="CGPA Division Split"
          variant="donut"
          data={summary.data?.byDivision.map((d) => ({ key: d.key, label: d.label, value: d.value }))}
          loading={summary.loading}
        />
        <ChartCard title="Divisions by School" loading={summary.loading} height={Math.max(220, bySchoolData.length * 40)}>
          {bySchoolData.length > 0 && (
            <StackedBarChartInner
              data={bySchoolData}
              categoryKey="label"
              series={DIVISION_SERIES}
              height={Math.max(220, bySchoolData.length * 40)}
            />
          )}
        </ChartCard>
      </div>

      <DataTable
        columns={columns}
        rows={records.data?.rows}
        total={records.data?.total}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        loading={records.loading}
        emptyMessage="No students match the current filters."
      />
    </div>
  );
}
