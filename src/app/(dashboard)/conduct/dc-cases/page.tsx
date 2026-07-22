"use client";

import { ShieldAlert, Clock, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FilterBar, type FilterFieldConfig } from "@/components/ui/FilterBar";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { useModuleFilters, type DrillLevelConfig } from "@/hooks/useModuleFilters";
import { useAsync } from "@/hooks/useAsync";
import { SCHOOLS, resolveSchool, resolveProgramme } from "@/lib/data/catalog/schools";
import { getDCCasesSummary, type DCCaseFilters } from "@/lib/services/dcCasesService";
import { SEMESTER_PERIOD_OPTIONS } from "@/lib/data/semesters";

const LEVELS: DrillLevelConfig[] = [
  { level: "school", filterKey: "schoolId", resolveLabel: resolveSchool },
  { level: "programme", filterKey: "programmeId", resolveLabel: resolveProgramme },
];

export default function DCCasesPage() {
  const { filters, breadcrumb, setFilter, jumpToBreadcrumb, resetAll } =
    useModuleFilters<DCCaseFilters>({ levels: LEVELS });

  const summary = useAsync(() => getDCCasesSummary(filters), [
    filters.schoolId,
    filters.programmeId,
    filters.status,
    filters.semesterFrom,
    filters.semesterTo,
  ]);

  function handleFilterChange(key: string, value: string | undefined) {
    setFilter(key, value);
  }

  const programmeOptions = filters.schoolId
    ? (SCHOOLS.find((s) => s.id === filters.schoolId)?.programmes ?? []).map((p) => ({ value: p.id, label: p.name }))
    : SCHOOLS.flatMap((s) => s.programmes.map((p) => ({ value: p.id, label: `${s.shortName} — ${p.name}` })));

  const filterConfig: FilterFieldConfig[] = [
    { key: "schoolId", label: "School", kind: "select", options: SCHOOLS.map((s) => ({ value: s.id, label: s.name })) },
    { key: "programmeId", label: "Programme", kind: "select", options: programmeOptions },
    {
      key: "status",
      label: "Status",
      kind: "select",
      options: [
        { value: "Pending", label: "Pending" },
        { value: "Resolved", label: "Resolved" },
      ],
    },
    { key: "semesterFrom", label: "From", kind: "select", options: SEMESTER_PERIOD_OPTIONS },
    { key: "semesterTo", label: "To", kind: "select", options: SEMESTER_PERIOD_OPTIONS },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="DC Cases" />
      <Breadcrumb items={breadcrumb} onJump={jumpToBreadcrumb} />
      <FilterBar filters={filters} config={filterConfig} onChange={handleFilterChange} onClearAll={resetAll} />

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
        <SummaryCard label="Total Cases" value={summary.data?.total} loading={summary.loading} icon={ShieldAlert} />
        <SummaryCard
          label="Pending"
          value={summary.data?.pending}
          loading={summary.loading}
          icon={Clock}
          accent={summary.data && summary.data.pending > 0 ? "danger" : "default"}
          onClick={() => handleFilterChange("status", "Pending")}
        />
        <SummaryCard
          label="Resolved"
          value={summary.data?.resolved}
          loading={summary.loading}
          icon={CheckCircle2}
          onClick={() => handleFilterChange("status", "Resolved")}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <ChartCard title="Pending vs Resolved" variant="donut" data={summary.data?.byStatus} loading={summary.loading} />
        <ChartCard title="By Violation Type" variant="bar" data={summary.data?.byViolationType} loading={summary.loading} />
        <ChartCard
          title="By School"
          variant="bar"
          data={summary.data?.bySchool}
          loading={summary.loading}
          onSegmentClick={(key) => handleFilterChange("schoolId", key)}
        />
      </div>
    </div>
  );
}
