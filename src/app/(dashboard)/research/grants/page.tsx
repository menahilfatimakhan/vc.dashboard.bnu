"use client";

import { useState } from "react";
import { HandCoins, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FilterBar, type FilterFieldConfig } from "@/components/ui/FilterBar";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusPill } from "@/components/ui/StatusPill";
import { useModuleFilters, type DrillLevelConfig } from "@/hooks/useModuleFilters";
import { useAsync } from "@/hooks/useAsync";
import { SCHOOLS } from "@/lib/data/catalog/schools";
import { DEPARTMENTS } from "@/lib/data/catalog/departments";
import { getGrants, getGrantsSummary, resolveOwnerById, type GrantFilters } from "@/lib/services/grantsService";
import { formatDate } from "@/lib/utils/format";

const LEVELS: DrillLevelConfig[] = [{ level: "owner", filterKey: "ownerId", resolveLabel: resolveOwnerById }];

const PAGE_SIZE = 10;

export default function GrantsPage() {
  const { filters, breadcrumb, setFilter, jumpToBreadcrumb, resetAll } =
    useModuleFilters<GrantFilters>({ levels: LEVELS });
  const [page, setPage] = useState(1);

  const summary = useAsync(() => getGrantsSummary(filters), [filters.ownerId, filters.status]);
  const records = useAsync(() => getGrants(filters, { page, pageSize: PAGE_SIZE }), [filters.ownerId, filters.status, page]);

  function handleFilterChange(key: string, value: string | undefined) {
    setPage(1);
    setFilter(key, value);
  }

  const ownerOptions = [
    ...SCHOOLS.map((s) => ({ value: s.id, label: s.name })),
    ...DEPARTMENTS.map((d) => ({ value: d.id, label: d.name })),
  ];

  const filterConfig: FilterFieldConfig[] = [
    { key: "ownerId", label: "Owning Unit", kind: "select", options: ownerOptions },
    {
      key: "status",
      label: "Status",
      kind: "select",
      options: [
        { value: "Completed", label: "Completed" },
        { value: "Underway", label: "Underway" },
      ],
    },
  ];

  const columns: Column<{ id: string; title: string; ownerName: string; status: string; startDate: string; endDate: string; endingSoon: boolean }>[] = [
    { key: "id", header: "Grant ID" },
    { key: "title", header: "Title" },
    { key: "ownerName", header: "Owning Unit" },
    { key: "status", header: "Status", render: (r) => <StatusPill status={r.status} /> },
    { key: "endDate", header: "End Date", render: (r) => formatDate(r.endDate) },
    {
      key: "endingSoon",
      header: "Flag",
      render: (r) =>
        r.endingSoon ? (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-status-critical-50 px-2 py-1 text-xs font-medium whitespace-nowrap text-status-critical">
            <AlertTriangle className="h-3.5 w-3.5" strokeWidth={1.5} /> Ending soon
          </span>
        ) : (
          ""
        ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Grants" />
      <Breadcrumb items={breadcrumb} onJump={jumpToBreadcrumb} />
      <FilterBar filters={filters} config={filterConfig} onChange={handleFilterChange} onClearAll={resetAll} />

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <SummaryCard label="Total Grants" value={summary.data?.total} loading={summary.loading} icon={HandCoins} />
        <SummaryCard label="Completed" value={summary.data?.completed} loading={summary.loading} icon={CheckCircle2} />
        <SummaryCard label="Underway" value={summary.data?.underway} loading={summary.loading} icon={Clock} />
        <SummaryCard
          label="Ending Within 6 Months"
          value={summary.data?.endingSoon}
          loading={summary.loading}
          icon={AlertTriangle}
          accent={summary.data && summary.data.endingSoon > 0 ? "danger" : "default"}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard title="Completed vs Underway" variant="donut" data={summary.data?.byStatus} loading={summary.loading} />
        <ChartCard
          title="By Owning Unit"
          variant="bar"
          data={summary.data?.byOwner}
          loading={summary.loading}
          onSegmentClick={(key) => handleFilterChange("ownerId", key)}
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
        emptyMessage="No grants match the current filters."
      />
    </div>
  );
}
