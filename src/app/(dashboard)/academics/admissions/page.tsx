"use client";

import { useState } from "react";
import { FileText, CheckCircle2, Users, Inbox } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FilterBar, type FilterFieldConfig } from "@/components/ui/FilterBar";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { useModuleFilters, type DrillLevelConfig } from "@/hooks/useModuleFilters";
import { useAsync } from "@/hooks/useAsync";
import { SCHOOLS, resolveSchool, resolveProgramme } from "@/lib/data/catalog/schools";
import { getAdmissionsSummary, getApplications, type AdmissionsFilters } from "@/lib/services/admissionsService";

const LEVELS: DrillLevelConfig[] = [
  { level: "school", filterKey: "schoolId", resolveLabel: resolveSchool },
  { level: "programme", filterKey: "programmeId", resolveLabel: resolveProgramme },
];

const PAGE_SIZE = 10;

export default function AdmissionsPage() {
  const { filters, breadcrumb, setFilter, jumpToBreadcrumb, resetAll } =
    useModuleFilters<AdmissionsFilters>({ levels: LEVELS });
  const [page, setPage] = useState(1);

  const summary = useAsync(() => getAdmissionsSummary(filters), [
    filters.schoolId,
    filters.programmeId,
    filters.semester,
    filters.dateFrom,
    filters.dateTo,
  ]);
  const records = useAsync(
    () => getApplications(filters, { page, pageSize: PAGE_SIZE }),
    [filters.schoolId, filters.programmeId, filters.semester, filters.dateFrom, filters.dateTo, page],
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
      key: "semester",
      label: "Intake",
      kind: "select",
      options: [
        { value: "Fall", label: "Fall" },
        { value: "Spring", label: "Spring" },
      ],
    },
    { key: "dateFrom", label: "Year from", kind: "date" },
    { key: "dateTo", label: "Year to", kind: "date" },
  ];

  const columns: Column<{ id: string; schoolName: string; programmeName: string; semester: string; year: number; status: string }>[] = [
    { key: "id", header: "Application ID" },
    { key: "schoolName", header: "School" },
    { key: "programmeName", header: "Programme" },
    { key: "semester", header: "Intake" },
    { key: "year", header: "Year", align: "right" },
    { key: "status", header: "Status" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Admissions & Applications" />
      <Breadcrumb items={breadcrumb} onJump={jumpToBreadcrumb} />
      <FilterBar filters={filters} config={filterConfig} onChange={handleFilterChange} onClearAll={resetAll} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard label="Current Application Pool" value={summary.data?.currentPoolCount} loading={summary.loading} icon={Inbox} />
        <SummaryCard label="Total Applications (5yr)" value={summary.data?.totalApplications} loading={summary.loading} icon={FileText} />
        <SummaryCard
          label="Admitted"
          value={summary.data?.funnel.find((f) => f.stage === "Admitted")?.value}
          loading={summary.loading}
          icon={CheckCircle2}
        />
        <SummaryCard
          label="Enrolled"
          value={summary.data?.funnel.find((f) => f.stage === "Enrolled")?.value}
          loading={summary.loading}
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Applications Received — 5-Year Trend"
          variant="line"
          trend={summary.data?.trend.map((t) => ({ x: t.year, y: t.count }))}
          loading={summary.loading}
        />
        <ChartCard
          title="Received → Admitted → Enrolled"
          variant="funnel"
          funnelData={summary.data?.funnel}
          loading={summary.loading}
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
        emptyMessage="No applications match the current filters."
      />
    </div>
  );
}
