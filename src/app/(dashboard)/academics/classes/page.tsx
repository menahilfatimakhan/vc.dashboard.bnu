"use client";

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
import {
  getClassesSummary,
  getSessionClasses,
  getSessions,
  resolveSessionName,
  type ClassesFilters,
} from "@/lib/services/classesService";
import { formatDateTime } from "@/lib/utils/format";
import { SEMESTER_PERIOD_OPTIONS } from "@/lib/data/semesters";

const LEVELS: DrillLevelConfig[] = [
  { level: "school", filterKey: "schoolId", resolveLabel: resolveSchool },
  { level: "session", filterKey: "sessionId", resolveLabel: resolveSessionName },
];

export default function ClassesPage() {
  const { filters, breadcrumb, setFilter, jumpToBreadcrumb, resetAll } =
    useModuleFilters<ClassesFilters>({ levels: LEVELS });

  const summary = useAsync(() => getClassesSummary(filters), [
    filters.schoolId,
    filters.sessionId,
    filters.semesterFrom,
    filters.semesterTo,
  ]);
  const sessions = useAsync(() => getSessions(filters), [filters.schoolId, filters.semesterFrom, filters.semesterTo]);
  const sessionClasses = useAsync(
    () => (filters.sessionId ? getSessionClasses(filters.sessionId) : Promise.resolve([])),
    [filters.sessionId],
  );

  function handleFilterChange(key: string, value: string | undefined) {
    setFilter(key, value);
  }

  const filterConfig: FilterFieldConfig[] = [
    { key: "schoolId", label: "School", kind: "select", options: SCHOOLS.map((s) => ({ value: s.id, label: s.name })) },
    { key: "semesterFrom", label: "From", kind: "select", options: SEMESTER_PERIOD_OPTIONS },
    { key: "semesterTo", label: "To", kind: "select", options: SEMESTER_PERIOD_OPTIONS },
  ];

  const attendanceRateData = (summary.data?.bySchool ?? []).map((s) => ({
    key: s.key,
    label: s.label,
    value: Number(s.attendanceRate.toFixed(1)),
  }));

  const sessionColumns: Column<{ id: string; name: string; schoolName: string; scheduled: number; attended: number; attendanceRate: number }>[] = [
    { key: "name", header: "Session" },
    { key: "schoolName", header: "School" },
    { key: "scheduled", header: "Scheduled", align: "right" },
    { key: "attended", header: "Attended", align: "right" },
    { key: "attendanceRate", header: "Attendance", align: "right", render: (r) => `${r.attendanceRate.toFixed(1)}%` },
  ];

  const classColumns: Column<{ id: string; scheduledAt: string; attendanceStatus: string }>[] = [
    { key: "id", header: "Class ID" },
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

      {!filters.sessionId ? (
        <DataTable
          columns={sessionColumns}
          rows={sessions.data}
          total={sessions.data?.length}
          page={1}
          pageSize={sessions.data?.length ?? 20}
          onPageChange={() => {}}
          loading={sessions.loading}
          emptyMessage="No sessions match the current filters."
        />
      ) : (
        <DataTable
          columns={classColumns}
          rows={sessionClasses.data}
          total={sessionClasses.data?.length}
          page={1}
          pageSize={sessionClasses.data?.length ?? 20}
          onPageChange={() => {}}
          loading={sessionClasses.loading}
          emptyMessage="No individual class occurrences for this session."
        />
      )}
    </div>
  );
}
