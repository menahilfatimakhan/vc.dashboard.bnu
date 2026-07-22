"use client";

import { Users, UserCheck, Sun, Snowflake } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FilterBar, type FilterFieldConfig } from "@/components/ui/FilterBar";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { useModuleFilters, type DrillLevelConfig } from "@/hooks/useModuleFilters";
import { useAsync } from "@/hooks/useAsync";
import { SCHOOLS, resolveSchool, resolveProgramme } from "@/lib/data/catalog/schools";
import { getEnrolledStudentsSummary, type EnrolledFilters } from "@/lib/services/enrolledStudentsService";
import { SEMESTER_PERIOD_OPTIONS } from "@/lib/data/semesters";

const LEVELS: DrillLevelConfig[] = [
  { level: "school", filterKey: "schoolId", resolveLabel: resolveSchool },
  { level: "programme", filterKey: "programmeId", resolveLabel: resolveProgramme },
];

export default function EnrolledStudentsPage() {
  const { filters, breadcrumb, setFilter, jumpToBreadcrumb, resetAll } =
    useModuleFilters<EnrolledFilters>({ levels: LEVELS });

  const summary = useAsync(() => getEnrolledStudentsSummary(filters), [
    filters.schoolId,
    filters.programmeId,
    filters.semester,
    filters.semesterFrom,
    filters.semesterTo,
  ]);

  function handleFilterChange(key: string, value: string | undefined) {
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
    { key: "semesterFrom", label: "From", kind: "select", options: SEMESTER_PERIOD_OPTIONS },
    { key: "semesterTo", label: "To", kind: "select", options: SEMESTER_PERIOD_OPTIONS },
  ];

  const byProgrammeData = filters.schoolId
    ? summary.data?.byProgramme
    : summary.data?.byProgramme.slice(0, 10);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Enrolled Students" />
      <Breadcrumb items={breadcrumb} onJump={jumpToBreadcrumb} />
      <FilterBar filters={filters} config={filterConfig} onChange={handleFilterChange} onClearAll={resetAll} />

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
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

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
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
        <ChartCard title="Fall vs Spring" variant="donut" data={summary.data?.bySemester} loading={summary.loading} />
        <ChartCard title="By Status" variant="pie" data={summary.data?.byStatus} loading={summary.loading} />
      </div>
    </div>
  );
}
