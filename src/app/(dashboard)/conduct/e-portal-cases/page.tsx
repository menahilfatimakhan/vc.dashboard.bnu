"use client";

import { useState } from "react";
import { Inbox, Clock, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FilterBar, type FilterFieldConfig } from "@/components/ui/FilterBar";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { useModuleFilters } from "@/hooks/useModuleFilters";
import { useAsync } from "@/hooks/useAsync";
import { getEPortalCases, getEPortalSummary, type EPortalFilters } from "@/lib/services/ePortalService";
import { formatDate } from "@/lib/utils/format";

const PAGE_SIZE = 10;
const CATEGORIES = [
  "Fee Payment Issue",
  "Transcript Request",
  "Course Registration",
  "Hostel Complaint",
  "IT / Portal Access",
  "Certificate Request",
  "Grade Dispute",
  "Leave Application",
];

export default function EPortalCasesPage() {
  const { filters, breadcrumb, setFilter, jumpToBreadcrumb, resetAll } = useModuleFilters<EPortalFilters>({
    levels: [],
  });
  const [page, setPage] = useState(1);

  const summary = useAsync(() => getEPortalSummary(filters), [
    filters.category,
    filters.status,
    filters.dateFrom,
    filters.dateTo,
  ]);
  const records = useAsync(
    () => getEPortalCases(filters, { page, pageSize: PAGE_SIZE }),
    [filters.category, filters.status, filters.dateFrom, filters.dateTo, page],
  );

  function handleFilterChange(key: string, value: string | undefined) {
    setPage(1);
    setFilter(key, value);
  }

  const filterConfig: FilterFieldConfig[] = [
    { key: "category", label: "Category", kind: "select", options: CATEGORIES.map((c) => ({ value: c, label: c })) },
    {
      key: "status",
      label: "Status",
      kind: "select",
      options: [
        { value: "In-Process", label: "In-Process" },
        { value: "Escalated", label: "Escalated" },
      ],
    },
    { key: "dateFrom", label: "From", kind: "date" },
    { key: "dateTo", label: "To", kind: "date" },
  ];

  const columns: Column<{ id: string; category: string; dateRaised: string; daysOpen: number; status: string }>[] = [
    { key: "id", header: "Case ID" },
    { key: "category", header: "Category" },
    { key: "dateRaised", header: "Date Raised", render: (r) => formatDate(r.dateRaised) },
    { key: "daysOpen", header: "Days Open", align: "right" },
    { key: "status", header: "Status" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="E-Portal Cases" />
      <Breadcrumb items={breadcrumb} onJump={jumpToBreadcrumb} />
      <FilterBar filters={filters} config={filterConfig} onChange={handleFilterChange} onClearAll={resetAll} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <SummaryCard label="Total Open Cases" value={summary.data?.total} loading={summary.loading} icon={Inbox} />
        <SummaryCard
          label="In-Process"
          value={summary.data?.inProcess}
          loading={summary.loading}
          icon={Clock}
          onClick={() => handleFilterChange("status", "In-Process")}
        />
        <SummaryCard
          label="Escalated"
          value={summary.data?.escalated}
          loading={summary.loading}
          icon={AlertTriangle}
          accent={summary.data && summary.data.escalated > 0 ? "danger" : "default"}
          onClick={() => handleFilterChange("status", "Escalated")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="In-Process vs Escalated" variant="donut" data={summary.data?.byStatus} loading={summary.loading} />
        <ChartCard title="By Category" variant="bar" data={summary.data?.byCategory} loading={summary.loading} />
      </div>

      <DataTable
        columns={columns}
        rows={records.data?.rows}
        total={records.data?.total}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        loading={records.loading}
        emptyMessage="No E-Portal cases match the current filters."
      />
    </div>
  );
}
