"use client";

import { useState } from "react";
import { CalendarCheck, CalendarX, Percent } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FilterBar, type FilterFieldConfig } from "@/components/ui/FilterBar";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { BarChartInner } from "@/components/ui/charts/BarChartInner";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusPill } from "@/components/ui/StatusPill";
import { useModuleFilters, type DrillLevelConfig } from "@/hooks/useModuleFilters";
import { useAsync } from "@/hooks/useAsync";
import { SCHOOLS, resolveSchool } from "@/lib/data/catalog/schools";
import { getClassSessions, getClassesSummary, type ClassesFilters } from "@/lib/services/classesService";
import { formatDateTime } from "@/lib/utils/format";

const LEVELS: DrillLevelConfig[] = [{ level: "school", filterKey: "schoolId", resolveLabel: resolveSchool }];

const PAGE_SIZE = 10;

export default function ClassesPage() {
  const { filters, breadcrumb, setFilter, jumpToBreadcrumb, resetAll } =
    useModuleFilters<ClassesFilters>({ levels: LEVELS });
  const [page, setPage] = useState(1);

  const summary = useAsync(() => getClassesSummary(filters), [filters.schoolId, filters.dateFrom, filters.dateTo]);
  const records = useAsync(
    () => getClassSessions(filters, { page, pageSize: PAGE_SIZE }),
    [filters.schoolId, filters.dateFrom, filters.dateTo, page],
  );

  function handleFilterChange(key: string, value: string | undefined) {
    setPage(1);
    setFilter(key, value);
  }

  const filterConfig: FilterFieldConfig[] = [
    { key: "schoolId", label: "School", kind: "select", options: SCHOOLS.map((s) => ({ value: s.id, label: s.name })) },
    { key: "dateFrom", label: "From", kind: "date" },
    { key: "dateTo", label: "To", kind: "date" },
  ];

  const attendanceRateData = (summary.data?.bySchool ?? []).map((s) => ({
    key: s.key,
    label: s.label,
    value: Number(s.attendanceRate.toFixed(1)),
  }));

  const columns: Column<{ id: string; schoolName: string; scheduledAt: string; attendanceStatus: string }>[] = [
    { key: "id", header: "Class ID" },
    { key: "schoolName", header: "School" },
    { key: "scheduledAt", header: "Scheduled", render: (r) => formatDateTime(r.scheduledAt) },
    { key: "attendanceStatus", header: "Attendance", render: (r) => <StatusPill status={r.attendanceStatus} /> },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Classes" />
      <Breadcrumb items={breadcrumb} onJump={jumpToBreadcrumb} />
      <FilterBar filters={filters} config={filterConfig} onChange={handleFilterChange} onClearAll={resetAll} />

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <SummaryCard label="Sessions Scheduled" value={summary.data?.totalScheduled} loading={summary.loading} icon={CalendarCheck} />
        <SummaryCard label="Attended" value={summary.data?.attended} loading={summary.loading} icon={CalendarCheck} />
        <SummaryCard label="Not Attended" value={summary.data?.notAttended} loading={summary.loading} icon={CalendarX} />
        <SummaryCard
          label="Attendance Rate"
          value={summary.data ? `${summary.data.attendanceRate.toFixed(1)}%` : undefined}
          loading={summary.loading}
          icon={Percent}
        />
      </div>

      <ChartCard
        title="Attendance Rate by School"
        subtitle="Click a bar to drill into that school"
        loading={summary.loading}
        height={280}
      >
        <BarChartInner
          data={attendanceRateData}
          height={280}
          onSegmentClick={(key) => handleFilterChange("schoolId", key)}
          valueFormatter={(v) => `${v}%`}
        />
      </ChartCard>

      <DataTable
        columns={columns}
        rows={records.data?.rows}
        total={records.data?.total}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        loading={records.loading}
        emptyMessage="No class sessions match the current filters."
      />
    </div>
  );
}
