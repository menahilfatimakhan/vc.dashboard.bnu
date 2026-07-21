"use client";

import { useState } from "react";
import { Users, Wallet, Percent } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FilterBar, type FilterFieldConfig } from "@/components/ui/FilterBar";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { useModuleFilters, type DrillLevelConfig } from "@/hooks/useModuleFilters";
import { useAsync } from "@/hooks/useAsync";
import { SCHOOLS, resolveSchool, resolveProgramme } from "@/lib/data/catalog/schools";
import { SCHOLARSHIP_TYPES } from "@/lib/data/catalog/scholarshipTypes";
import {
  getScholarshipRecipients,
  getScholarshipsSummary,
  type ScholarshipFilters,
} from "@/lib/services/scholarshipsService";
import { formatCurrencyPKR } from "@/lib/utils/format";

const LEVELS: DrillLevelConfig[] = [
  { level: "school", filterKey: "schoolId", resolveLabel: resolveSchool },
  { level: "programme", filterKey: "programmeId", resolveLabel: resolveProgramme },
];

const PAGE_SIZE = 10;

export default function ScholarshipsPage() {
  const { filters, breadcrumb, setFilter, jumpToBreadcrumb, resetAll } =
    useModuleFilters<ScholarshipFilters>({ levels: LEVELS });
  const [page, setPage] = useState(1);

  const summary = useAsync(() => getScholarshipsSummary(filters), [
    filters.schoolId,
    filters.programmeId,
    filters.scholarshipTypeId,
    filters.dateFrom,
    filters.dateTo,
  ]);
  const records = useAsync(
    () => getScholarshipRecipients(filters, { page, pageSize: PAGE_SIZE }),
    [filters.schoolId, filters.programmeId, filters.scholarshipTypeId, filters.dateFrom, filters.dateTo, page],
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
      key: "scholarshipTypeId",
      label: "Scholarship Type",
      kind: "select",
      options: SCHOLARSHIP_TYPES.map((t) => ({ value: t.id, label: t.name })),
    },
    { key: "dateFrom", label: "Awarded from", kind: "date" },
    { key: "dateTo", label: "Awarded to", kind: "date" },
  ];

  const columns: Column<{ id: string; studentName: string; schoolId: string; programmeId: string; scholarshipTypeId: string; awardYear: number }>[] = [
    { key: "id", header: "Record ID" },
    { key: "studentName", header: "Student" },
    { key: "schoolId", header: "School", render: (r) => resolveSchool(r.schoolId) },
    { key: "programmeId", header: "Programme", render: (r) => resolveProgramme(r.programmeId) },
    {
      key: "scholarshipTypeId",
      header: "Type",
      render: (r) => SCHOLARSHIP_TYPES.find((t) => t.id === r.scholarshipTypeId)?.name ?? "",
    },
    { key: "awardYear", header: "Award Year", align: "right" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Scholarships" />
      <Breadcrumb items={breadcrumb} onJump={jumpToBreadcrumb} />
      <FilterBar filters={filters} config={filterConfig} onChange={handleFilterChange} onClearAll={resetAll} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <SummaryCard label="Total Recipients" value={summary.data?.totalRecipients} loading={summary.loading} icon={Users} />
        <SummaryCard
          label="Total Disbursed"
          value={summary.data ? formatCurrencyPKR(summary.data.totalDisbursed) : undefined}
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          title="% of Student Body on Scholarship"
          variant="gauge"
          gaugeValue={summary.data?.percentOfStudentBody}
          gaugeLabel="of active students"
          loading={summary.loading}
        />
        <div className="lg:col-span-2">
          <ChartCard
            title="Recipients by School"
            variant="bar"
            data={summary.data?.bySchool}
            loading={summary.loading}
            onSegmentClick={(key) => handleFilterChange("schoolId", key)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 bg-surface p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-ink">Active Scholarship Types</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-hairline text-left text-xs font-medium uppercase tracking-wide text-ink-muted">
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Awarding Criteria</th>
                <th className="px-3 py-2 text-right">Amount / Award</th>
                <th className="px-3 py-2 text-right">Recipients</th>
              </tr>
            </thead>
            <tbody>
              {summary.data?.activeTypes.map((t) => (
                <tr key={t.id} className="border-b border-hairline last:border-0">
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

      <DataTable
        columns={columns}
        rows={records.data?.rows}
        total={records.data?.total}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        loading={records.loading}
        emptyMessage="No scholarship recipients match the current filters."
      />
    </div>
  );
}
