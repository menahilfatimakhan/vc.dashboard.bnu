"use client";

import { useState } from "react";
import { Building2, Home, TreePine } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FilterBar, type FilterFieldConfig } from "@/components/ui/FilterBar";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { StackedBarChartInner } from "@/components/ui/charts/StackedBarChartInner";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { useModuleFilters, type DrillLevelConfig } from "@/hooks/useModuleFilters";
import { useAsync } from "@/hooks/useAsync";
import { HOSTELS, resolveHostel } from "@/lib/data/catalog/hostels";
import { getHostelResidents, getHostelSummary, type HostelFilters } from "@/lib/services/hostelService";
import { resolveSchool } from "@/lib/data/catalog/schools";

const LEVELS: DrillLevelConfig[] = [{ level: "hostel", filterKey: "hostelId", resolveLabel: resolveHostel }];

const PAGE_SIZE = 10;

export default function HostelPage() {
  const { filters, breadcrumb, setFilter, jumpToBreadcrumb, resetAll } =
    useModuleFilters<HostelFilters>({ levels: LEVELS });
  const [page, setPage] = useState(1);

  const summary = useAsync(() => getHostelSummary(filters), [filters.hostelId, filters.hostelType]);
  const records = useAsync(
    () => getHostelResidents(filters, { page, pageSize: PAGE_SIZE }),
    [filters.hostelId, filters.hostelType, page],
  );

  function handleFilterChange(key: string, value: string | undefined) {
    setPage(1);
    setFilter(key, value);
  }

  const filterConfig: FilterFieldConfig[] = [
    { key: "hostelId", label: "Hostel", kind: "select", options: HOSTELS.map((h) => ({ value: h.id, label: h.name })) },
    {
      key: "hostelType",
      label: "Type",
      kind: "select",
      options: [
        { value: "On-campus", label: "On-campus" },
        { value: "Off-campus", label: "Off-campus" },
      ],
    },
  ];

  const occupancyData = (summary.data?.byHostel ?? []).map((h) => ({
    name: h.name,
    Occupied: h.occupied,
    Vacant: h.capacity - h.occupied,
  }));

  const onCampus = summary.data?.byType.find((t) => t.key === "On-campus")?.value ?? 0;
  const offCampus = summary.data?.byType.find((t) => t.key === "Off-campus")?.value ?? 0;

  const columns: Column<{ id: string; studentName: string; schoolId: string; hostelId: string }>[] = [
    { key: "id", header: "Record ID" },
    { key: "studentName", header: "Student" },
    { key: "schoolId", header: "School", render: (r) => resolveSchool(r.schoolId) },
    { key: "hostelId", header: "Hostel", render: (r) => resolveHostel(r.hostelId) },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Hostel Accommodation" />
      <Breadcrumb items={breadcrumb} onJump={jumpToBreadcrumb} />
      <FilterBar filters={filters} config={filterConfig} onChange={handleFilterChange} onClearAll={resetAll} />

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
        <SummaryCard label="Total Residents" value={summary.data?.totalResidents} loading={summary.loading} icon={Building2} />
        <SummaryCard label="On-Campus" value={onCampus} loading={summary.loading} icon={Home} />
        <SummaryCard label="Off-Campus" value={offCampus} loading={summary.loading} icon={TreePine} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard title="On-Campus vs Off-Campus" variant="donut" data={summary.data?.byType} loading={summary.loading} />
        <ChartCard title="Occupancy vs Capacity" loading={summary.loading} height={220}>
          <StackedBarChartInner
            data={occupancyData}
            categoryKey="name"
            series={[
              { dataKey: "Occupied", label: "Occupied" },
              { dataKey: "Vacant", label: "Vacant" },
            ]}
            height={220}
          />
        </ChartCard>
      </div>

      <DataTable
        columns={columns}
        rows={records.data?.rows}
        total={records.data?.total}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        loading={records.loading}
        emptyMessage="No residents match the current filters."
      />
    </div>
  );
}
