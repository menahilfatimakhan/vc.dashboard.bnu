"use client";

import { FileText, CheckCircle2, Users, Inbox } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FilterBar, type FilterFieldConfig } from "@/components/ui/FilterBar";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { BarChartInner } from "@/components/ui/charts/BarChartInner";
import { ColumnStackedBarChartInner } from "@/components/ui/charts/ColumnStackedBarChartInner";
import { useModuleFilters, type DrillLevelConfig } from "@/hooks/useModuleFilters";
import { useAsync } from "@/hooks/useAsync";
import { SCHOOLS, resolveSchool, resolveProgramme } from "@/lib/data/catalog/schools";
import { getAdmissionsSummary, type AdmissionsFilters } from "@/lib/services/admissionsService";
import { SEMESTER_PERIOD_OPTIONS } from "@/lib/data/semesters";

const LEVELS: DrillLevelConfig[] = [
  { level: "school", filterKey: "schoolId", resolveLabel: resolveSchool },
  { level: "programme", filterKey: "programmeId", resolveLabel: resolveProgramme },
];

export default function AdmissionsPage() {
  const { filters, breadcrumb, setFilter, jumpToBreadcrumb, resetAll } =
    useModuleFilters<AdmissionsFilters>({ levels: LEVELS });

  const summary = useAsync(() => getAdmissionsSummary(filters), [
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
    { key: "semesterFrom", label: "From", kind: "select", options: SEMESTER_PERIOD_OPTIONS },
    { key: "semesterTo", label: "To", kind: "select", options: SEMESTER_PERIOD_OPTIONS },
  ];

  const trendData = (summary.data?.trend ?? []).map((t) => ({ key: String(t.year), label: String(t.year), value: t.count }));

  const admittedVsEnrolledData = (summary.data?.admittedVsEnrolledTrend ?? []).map((t) => ({
    label: String(t.year),
    Admitted: t.admitted,
    Enrolled: t.enrolled,
  }));

  const last4Data = (summary.data?.last4SemestersEnrollment ?? []).map((p) => ({
    key: p.period,
    label: p.label,
    value: p.count,
  }));

  const statusData = summary.data
    ? [
        { key: "Active", label: "Active", value: summary.data.statusCounts.active },
        { key: "Frozen", label: "Frozen", value: summary.data.statusCounts.frozen },
        { key: "Dormant", label: "Dormant", value: summary.data.statusCounts.dormant },
        { key: "Struck Off", label: "Struck Off", value: summary.data.statusCounts.struckOff },
      ]
    : undefined;

  const totalActiveFrozen = summary.data ? summary.data.statusCounts.active + summary.data.statusCounts.frozen : undefined;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Admissions & Applications" />
      <Breadcrumb items={breadcrumb} onJump={jumpToBreadcrumb} />
      <FilterBar filters={filters} config={filterConfig} onChange={handleFilterChange} onClearAll={resetAll} />

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <SummaryCard label="Current Application Pool" value={summary.data?.currentPoolCount} loading={summary.loading} icon={Inbox} />
        <SummaryCard label="Applications (Trailing Year)" value={summary.data?.trailingYearTotal} loading={summary.loading} icon={FileText} />
        <SummaryCard
          label="Admitted"
          value={summary.data?.funnel.find((f) => f.stage === "Admitted")?.value}
          loading={summary.loading}
          icon={CheckCircle2}
        />
        <SummaryCard label="Total Students (Active + Frozen)" value={totalActiveFrozen} loading={summary.loading} icon={Users} />
      </div>

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <SummaryCard
          label="Active"
          value={summary.data?.statusCounts.active}
          loading={summary.loading}
        />
        <SummaryCard
          label="Frozen"
          value={summary.data?.statusCounts.frozen}
          loading={summary.loading}
        />
        <SummaryCard
          label="Dormant"
          value={summary.data?.statusCounts.dormant}
          loading={summary.loading}
        />
        <SummaryCard
          label="Struck Off"
          value={summary.data?.statusCounts.struckOff}
          loading={summary.loading}
          accent={summary.data && summary.data.statusCounts.struckOff > 0 ? "danger" : "default"}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard title="Total Applications — Trailing Trend" variant="bar" data={trendData} loading={summary.loading} />
        <ChartCard
          title="Received → Fee Paid → Admitted"
          variant="funnel"
          funnelData={summary.data?.funnel}
          loading={summary.loading}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard title="Admitted vs Enrolled" loading={summary.loading} height={280}>
          <ColumnStackedBarChartInner
            data={admittedVsEnrolledData}
            categoryKey="label"
            series={[
              { dataKey: "Admitted", label: "Admitted" },
              { dataKey: "Enrolled", label: "Enrolled" },
            ]}
            stacked={false}
            height={280}
          />
        </ChartCard>
        <ChartCard title="Student Status Breakdown" variant="bar" data={statusData} loading={summary.loading} />
      </div>

      <ChartCard title="Enrolled — Last 4 Semesters" loading={summary.loading} height={260}>
        <BarChartInner data={last4Data} height={260} />
      </ChartCard>
    </div>
  );
}
