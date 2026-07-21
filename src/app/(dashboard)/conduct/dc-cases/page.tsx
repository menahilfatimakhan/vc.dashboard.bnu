"use client";

import { useState } from "react";
import { ShieldAlert, Clock, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FilterBar, type FilterFieldConfig } from "@/components/ui/FilterBar";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { useModuleFilters, type DrillLevelConfig } from "@/hooks/useModuleFilters";
import { useAsync } from "@/hooks/useAsync";
import { SCHOOLS, resolveSchool, resolveProgramme } from "@/lib/data/catalog/schools";
import { getDCCases, getDCCasesSummary, type DCCaseFilters } from "@/lib/services/dcCasesService";
import { formatDate } from "@/lib/utils/format";

const LEVELS: DrillLevelConfig[] = [
  { level: "school", filterKey: "schoolId", resolveLabel: resolveSchool },
  { level: "programme", filterKey: "programmeId", resolveLabel: resolveProgramme },
];

const PAGE_SIZE = 10;

export default function DCCasesPage() {
  const { filters, breadcrumb, setFilter, jumpToBreadcrumb, resetAll } =
    useModuleFilters<DCCaseFilters>({ levels: LEVELS });
  const [page, setPage] = useState(1);

  const summary = useAsync(() => getDCCasesSummary(filters), [
    filters.schoolId,
    filters.programmeId,
    filters.status,
    filters.dateFrom,
    filters.dateTo,
  ]);
  const records = useAsync(
    () => getDCCases(filters, { page, pageSize: PAGE_SIZE }),
    [filters.schoolId, filters.programmeId, filters.status, filters.dateFrom, filters.dateTo, page],
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
    {
      key: "status",
      label: "Status",
      kind: "select",
      options: [
        { value: "Pending", label: "Pending" },
        { value: "Resolved", label: "Resolved" },
      ],
    },
    { key: "dateFrom", label: "From", kind: "date" },
    { key: "dateTo", label: "To", kind: "date" },
  ];

  const columns: Column<{ id: string; studentName: string; schoolName: string; programmeName: string; dateRaised: string; violationType: string; status: string }>[] = [
    { key: "id", header: "Case ID" },
    { key: "studentName", header: "Student" },
    { key: "schoolName", header: "School" },
    { key: "programmeName", header: "Programme" },
    { key: "dateRaised", header: "Date Raised", render: (r) => formatDate(r.dateRaised) },
    { key: "violationType", header: "Violation" },
    { key: "status", header: "Status" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="DC Cases" />
      <Breadcrumb items={breadcrumb} onJump={jumpToBreadcrumb} />
      <FilterBar filters={filters} config={filterConfig} onChange={handleFilterChange} onClearAll={resetAll} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
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

      <DataTable
        columns={columns}
        rows={records.data?.rows}
        total={records.data?.total}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        loading={records.loading}
        emptyMessage="No DC cases match the current filters."
      />
    </div>
  );
}
