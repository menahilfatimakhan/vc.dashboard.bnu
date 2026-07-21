"use client";

import { useState } from "react";
import { Users, UserCheck, Sun, Snowflake } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FilterBar, type FilterFieldConfig } from "@/components/ui/FilterBar";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { useModuleFilters, type DrillLevelConfig } from "@/hooks/useModuleFilters";
import { useAsync } from "@/hooks/useAsync";
import { SCHOOLS, resolveSchool, resolveProgramme } from "@/lib/data/catalog/schools";
import {
  getEnrolledStudents,
  getEnrolledStudentsSummary,
  type EnrolledFilters,
} from "@/lib/services/enrolledStudentsService";
import type { Student } from "@/lib/data/types";

const LEVELS: DrillLevelConfig[] = [
  { level: "school", filterKey: "schoolId", resolveLabel: resolveSchool },
  { level: "programme", filterKey: "programmeId", resolveLabel: resolveProgramme },
];

const PAGE_SIZE = 10;

export default function EnrolledStudentsPage() {
  const { filters, breadcrumb, setFilter, jumpToBreadcrumb, resetAll } =
    useModuleFilters<EnrolledFilters>({ levels: LEVELS });
  const [page, setPage] = useState(1);

  const summary = useAsync(() => getEnrolledStudentsSummary(filters), [
    filters.schoolId,
    filters.programmeId,
    filters.semester,
    filters.dateFrom,
    filters.dateTo,
  ]);

  const records = useAsync(
    () => getEnrolledStudents(filters, { page, pageSize: PAGE_SIZE }),
    [filters.schoolId, filters.programmeId, filters.semester, filters.dateFrom, filters.dateTo, page],
  );

  function handleFilterChange(key: string, value: string | undefined) {
    setPage(1);
    setFilter(key, value);
  }

  const programmeOptions = filters.schoolId
    ? (SCHOOLS.find((s) => s.id === filters.schoolId)?.programmes ?? []).map((p) => ({
        value: p.id,
        label: p.name,
      }))
    : SCHOOLS.flatMap((s) => s.programmes.map((p) => ({ value: p.id, label: `${s.shortName} — ${p.name}` })));

  const filterConfig: FilterFieldConfig[] = [
    { key: "schoolId", label: "School", kind: "select", options: SCHOOLS.map((s) => ({ value: s.id, label: s.name })) },
    { key: "programmeId", label: "Programme", kind: "select", options: programmeOptions },
    {
      key: "semester",
      label: "Semester",
      kind: "select",
      options: [
        { value: "Fall", label: "Fall" },
        { value: "Spring", label: "Spring" },
      ],
    },
    { key: "dateFrom", label: "Enrolled from", kind: "date" },
    { key: "dateTo", label: "Enrolled to", kind: "date" },
  ];

  const byProgrammeData = filters.schoolId
    ? summary.data?.byProgramme
    : summary.data?.byProgramme.slice(0, 10);

  const columns: Column<Student>[] = [
    { key: "id", header: "Student ID" },
    { key: "name", header: "Name" },
    { key: "schoolId", header: "School", render: (r) => resolveSchool(r.schoolId) },
    { key: "programmeId", header: "Programme", render: (r) => resolveProgramme(r.programmeId) },
    { key: "semester", header: "Semester" },
    { key: "enrollmentYear", header: "Year", align: "right" },
    { key: "enrollmentStatus", header: "Status" },
    { key: "cgpa", header: "CGPA", align: "right" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Enrolled Students" />
      <Breadcrumb items={breadcrumb} onJump={jumpToBreadcrumb} />
      <FilterBar filters={filters} config={filterConfig} onChange={handleFilterChange} onClearAll={resetAll} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard label="Total Enrolled" value={summary.data?.total} loading={summary.loading} icon={Users} />
        <SummaryCard label="Active" value={summary.data?.active} loading={summary.loading} icon={UserCheck} />
        <SummaryCard
          label="Fall Semester"
          value={summary.data?.bySemester.find((s) => s.key === "Fall")?.value ?? 0}
          loading={summary.loading}
          icon={Sun}
        />
        <SummaryCard
          label="Spring Semester"
          value={summary.data?.bySemester.find((s) => s.key === "Spring")?.value ?? 0}
          loading={summary.loading}
          icon={Snowflake}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="By School"
          subtitle="Click a bar to drill into that school"
          variant="bar"
          data={summary.data?.bySchool}
          loading={summary.loading}
          onSegmentClick={(key) => handleFilterChange("schoolId", key)}
        />
        <ChartCard
          title="By Programme"
          subtitle={filters.schoolId ? undefined : "Top 10 shown — drill into a school for the full list"}
          variant="bar"
          data={byProgrammeData}
          loading={summary.loading}
          onSegmentClick={(key) => handleFilterChange("programmeId", key)}
        />
        <ChartCard
          title="Fall vs Spring"
          variant="donut"
          data={summary.data?.bySemester}
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
        emptyMessage="No enrolled students match the current filters."
      />
    </div>
  );
}
