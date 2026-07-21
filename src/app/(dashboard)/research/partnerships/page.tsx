"use client";

import { useState } from "react";
import { BookOpen, Award, Globe2, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FilterBar, type FilterFieldConfig } from "@/components/ui/FilterBar";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { useModuleFilters, type DrillLevelConfig } from "@/hooks/useModuleFilters";
import { useAsync } from "@/hooks/useAsync";
import { SCHOOLS, resolveSchool } from "@/lib/data/catalog/schools";
import { getPublications, getResearchSummary, type ResearchFilters } from "@/lib/services/researchService";

const LEVELS: DrillLevelConfig[] = [{ level: "school", filterKey: "schoolId", resolveLabel: resolveSchool }];

const PAGE_SIZE = 10;

export default function ResearchPartnershipsPage() {
  const { filters, breadcrumb, setFilter, jumpToBreadcrumb, resetAll } =
    useModuleFilters<ResearchFilters>({ levels: LEVELS });
  const [page, setPage] = useState(1);

  const summary = useAsync(() => getResearchSummary(filters), [filters.schoolId, filters.dateFrom, filters.dateTo]);
  const records = useAsync(
    () => getPublications(filters, { page, pageSize: PAGE_SIZE }),
    [filters.schoolId, filters.dateFrom, filters.dateTo, page],
  );

  function handleFilterChange(key: string, value: string | undefined) {
    setPage(1);
    setFilter(key, value);
  }

  const filterConfig: FilterFieldConfig[] = [
    { key: "schoolId", label: "School", kind: "select", options: SCHOOLS.map((s) => ({ value: s.id, label: s.name })) },
    { key: "dateFrom", label: "Year from", kind: "date" },
    { key: "dateTo", label: "Year to", kind: "date" },
  ];

  const columns: Column<{ id: string; title: string; schoolName: string; year: number }>[] = [
    { key: "id", header: "Publication ID" },
    { key: "title", header: "Title" },
    { key: "schoolName", header: "School" },
    { key: "year", header: "Year", align: "right" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Research, Partnerships & ORIP" speculative />
      <Breadcrumb items={breadcrumb} onJump={jumpToBreadcrumb} />
      <FilterBar filters={filters} config={filterConfig} onChange={handleFilterChange} onClearAll={resetAll} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard label="Publications" value={summary.data?.totalPublications} loading={summary.loading} icon={BookOpen} />
        <SummaryCard label="Grants Applied" value={summary.data?.grantsApplied} loading={summary.loading} icon={Award} />
        <SummaryCard label="Grants Won" value={summary.data?.grantsWon} loading={summary.loading} icon={Award} />
        <SummaryCard label="Active Partnerships" value={summary.data?.partnerships.length} loading={summary.loading} icon={Globe2} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          title="Publications — 5-Year Trend"
          variant="line"
          trend={summary.data?.publicationTrend.map((t) => ({ x: t.year, y: t.count }))}
          loading={summary.loading}
        />
        <ChartCard
          title="Publications by School"
          variant="bar"
          data={summary.data?.publicationsBySchool}
          loading={summary.loading}
          onSegmentClick={(key) => handleFilterChange("schoolId", key)}
        />
        <ChartCard title="Research Grants: Applied vs Won vs Rejected" variant="donut" data={summary.data?.grantsByStatus} loading={summary.loading} />
      </div>

      <div className="rounded-2xl border border-black/5 bg-surface p-5 shadow-sm">
        <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold text-ink">
          <Sparkles className="h-4 w-4 text-brand-steel" /> Flagship Initiatives
        </h3>
        <p className="mb-3 text-xs text-ink-muted">Real, confirmed via bnu.edu.pk — not part of the dummy data set below.</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {summary.data?.flagshipInitiatives.map((initiative) => (
            <div key={initiative.id} className="rounded-xl border border-hairline p-4">
              <p className="text-sm font-semibold text-ink">{initiative.name}</p>
              <p className="mt-1 text-xs text-ink-secondary">{initiative.description}</p>
              <p className="mt-2 text-xs text-ink-muted">
                {initiative.leadRole}: {initiative.leadName}
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {initiative.relatedEntities.map((e) => (
                  <li key={e} className="rounded-full bg-brand-steel/10 px-2 py-0.5 text-[10px] font-medium text-brand-navy">
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 bg-surface p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-ink">Active MoUs & Partnerships</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-hairline text-left text-xs font-medium uppercase tracking-wide text-ink-muted">
                <th className="px-3 py-2">Partner</th>
                <th className="px-3 py-2">Country</th>
                <th className="px-3 py-2">Focus Area</th>
                <th className="px-3 py-2 text-right">Signed</th>
              </tr>
            </thead>
            <tbody>
              {summary.data?.partnerships.map((p) => (
                <tr key={p.id} className="border-b border-hairline last:border-0">
                  <td className="px-3 py-2 font-medium text-ink">{p.partnerName}</td>
                  <td className="px-3 py-2 text-ink-secondary">{p.country}</td>
                  <td className="px-3 py-2 text-ink-secondary">{p.focusArea}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-ink">{p.signedYear}</td>
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
        emptyMessage="No publications match the current filters."
      />
    </div>
  );
}
