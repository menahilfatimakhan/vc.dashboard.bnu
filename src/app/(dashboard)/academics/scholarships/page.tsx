"use client";

import { Users, Wallet, Percent } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FilterBar, type FilterFieldConfig } from "@/components/ui/FilterBar";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { LineChartInner } from "@/components/ui/charts/LineChartInner";
import { ColumnStackedBarChartInner } from "@/components/ui/charts/ColumnStackedBarChartInner";
import { useModuleFilters, type DrillLevelConfig } from "@/hooks/useModuleFilters";
import { useAsync } from "@/hooks/useAsync";
import { SCHOOLS, resolveSchool, resolveProgramme } from "@/lib/data/catalog/schools";
import { SCHOLARSHIP_TYPES } from "@/lib/data/catalog/scholarshipTypes";
import { getScholarshipsSummary, type ScholarshipFilters } from "@/lib/services/scholarshipsService";
import { formatCurrencyPKR, formatCompactPKR } from "@/lib/utils/format";
import { SEMESTER_PERIOD_OPTIONS } from "@/lib/data/semesters";

const LEVELS: DrillLevelConfig[] = [
  { level: "school", filterKey: "schoolId", resolveLabel: resolveSchool },
  { level: "programme", filterKey: "programmeId", resolveLabel: resolveProgramme },
];

export default function ScholarshipsPage() {
  const { filters, breadcrumb, setFilter, jumpToBreadcrumb, resetAll } =
    useModuleFilters<ScholarshipFilters>({ levels: LEVELS });

  const summary = useAsync(() => getScholarshipsSummary(filters), [
    filters.schoolId,
    filters.programmeId,
    filters.scholarshipTypeId,
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
      key: "scholarshipTypeId",
      label: "Scholarship Type",
      kind: "select",
      options: SCHOLARSHIP_TYPES.map((t) => ({ value: t.id, label: t.name })),
    },
    { key: "semesterFrom", label: "From", kind: "select", options: SEMESTER_PERIOD_OPTIONS },
    { key: "semesterTo", label: "To", kind: "select", options: SEMESTER_PERIOD_OPTIONS },
  ];

  const spentTrendData = (summary.data?.spentTrend ?? []).map((t) => ({ x: t.label, y: t.amount }));

  const thresholdData = (summary.data?.threshold100kTrend ?? []).map((t) => ({
    label: t.label,
    "Above 100K": t.aboveThreshold,
    "Below 100K": t.belowThreshold,
  }));

  const typeNames = summary.data?.scholarshipTypeNames ?? [];
  const spentByTypeSeries = typeNames.map((name) => ({ dataKey: name, label: name }));

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Scholarships" />
      <Breadcrumb items={breadcrumb} onJump={jumpToBreadcrumb} />
      <FilterBar filters={filters} config={filterConfig} onChange={handleFilterChange} onClearAll={resetAll} />

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
        <SummaryCard label="Total Recipients" value={summary.data?.totalRecipients} loading={summary.loading} icon={Users} />
        <SummaryCard
          label="Total Spent"
          value={summary.data ? formatCurrencyPKR(summary.data.totalSpent) : undefined}
          loading={summary.loading}
          icon={Wallet}
        />
        <SummaryCard
          label="% of Student Body"
          value={summary.data ? `${summary.data.percentOfStudentBody.toFixed(1)}%` : undefined}
          loading={summary.loading}
          icon={Percent}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard title="Amount Spent by Semester" loading={summary.loading} height={260}>
          <LineChartInner data={spentTrendData} height={260} yTickFormatter={formatCompactPKR} />
        </ChartCard>
        <ChartCard
          title="% of Student Body on Scholarship"
          variant="pie"
          data={
            summary.data
              ? [
                  { key: "on", label: "On Scholarship", value: summary.data.totalRecipients },
                  {
                    key: "off",
                    label: "Not on Scholarship",
                    value: Math.max(0, summary.data.activeStudentCount - summary.data.totalRecipients),
                  },
                ]
              : undefined
          }
          loading={summary.loading}
          height={260}
        />
      </div>

      <ChartCard
        title="Recipients by School"
        subtitle="Click a bar to drill into that school"
        variant="bar"
        data={summary.data?.bySchool}
        loading={summary.loading}
        onSegmentClick={(key) => handleFilterChange("schoolId", key)}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard
          title="Recipients Above / Below Rs 100K"
          subtitle="By semester, year over year"
          loading={summary.loading}
          height={280}
        >
          <ColumnStackedBarChartInner
            data={thresholdData}
            categoryKey="label"
            series={[
              { dataKey: "Above 100K", label: "Above Rs 100K" },
              { dataKey: "Below 100K", label: "Below Rs 100K" },
            ]}
            height={280}
          />
        </ChartCard>
        <ChartCard title="Amount Spent by Type per Semester" loading={summary.loading} height={280}>
          <ColumnStackedBarChartInner
            data={summary.data?.spentByTypeBySemester ?? []}
            categoryKey="label"
            series={spentByTypeSeries}
            height={280}
            yTickFormatter={formatCompactPKR}
          />
        </ChartCard>
      </div>

      <ChartCard title="Scholarship Type by School" loading={summary.loading} height={Math.max(240, SCHOOLS.length * 34)}>
        <ColumnStackedBarChartInner
          data={summary.data?.typeBySchool ?? []}
          categoryKey="label"
          series={spentByTypeSeries}
          height={Math.max(240, SCHOOLS.length * 34)}
        />
      </ChartCard>

      <div className="rounded-2xl border border-hairline bg-surface p-5 shadow-card transition-all duration-150 hover:-translate-y-px hover:border-hairline-hover hover:shadow-card-hover">
        <h3 className="mb-3 text-[15px] font-semibold text-ink">Active Scholarship Types</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-hairline bg-canvas text-left text-[11px] font-semibold tracking-[0.04em] text-ink-muted uppercase">
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Awarding Criteria</th>
                <th className="px-3 py-2 text-right">Amount / Award</th>
                <th className="px-3 py-2 text-right">Recipients</th>
              </tr>
            </thead>
            <tbody>
              {summary.data?.activeTypes.map((t) => (
                <tr key={t.id} className="border-b border-hairline transition-colors duration-150 last:border-0 hover:bg-subtle">
                  <td className="px-3 py-2 font-medium text-ink">{t.name}</td>
                  <td className="px-3 py-2 text-ink-secondary">{t.awardingCriteria}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-ink">{formatCurrencyPKR(t.amountPerAward)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-ink">{t.recipients}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
