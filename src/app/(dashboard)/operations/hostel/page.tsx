"use client";

import { Building2, Home, TreePine } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FilterBar, type FilterFieldConfig } from "@/components/ui/FilterBar";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { StackedBarChartInner } from "@/components/ui/charts/StackedBarChartInner";
import { useModuleFilters, type DrillLevelConfig } from "@/hooks/useModuleFilters";
import { useAsync } from "@/hooks/useAsync";
import { HOSTELS, resolveHostel } from "@/lib/data/catalog/hostels";
import { getHostelSummary, type HostelFilters } from "@/lib/services/hostelService";
import type { HostelType } from "@/lib/data/types";

const LEVELS: DrillLevelConfig[] = [{ level: "hostel", filterKey: "hostelId", resolveLabel: resolveHostel }];

export default function HostelPage() {
  const { filters, breadcrumb, setFilter, jumpToBreadcrumb, resetAll } =
    useModuleFilters<HostelFilters>({ levels: LEVELS });

  const summary = useAsync(() => getHostelSummary(filters), [filters.hostelId, filters.hostelType]);

  function handleFilterChange(key: string, value: string | undefined) {
    setFilter(key, value);
  }

  const filterConfig: FilterFieldConfig[] = [
    { key: "hostelId", label: "Hostel", kind: "select", options: HOSTELS.map((h) => ({ value: h.id, label: h.name })) },
  ];

  const occupancyData = (summary.data?.byHostel ?? []).map((h) => ({
    name: h.name,
    Occupied: h.occupied,
    Vacant: h.capacity - h.occupied,
  }));

  const onCampus = summary.data?.byType.find((t) => t.key === "On-campus")?.value ?? 0;
  const offCampus = summary.data?.byType.find((t) => t.key === "Off-campus")?.value ?? 0;

  const offCampusSplit = (summary.data?.byHostel ?? [])
    .filter((h) => h.type === "Off-campus")
    .map((h) => ({ key: h.id, label: h.name, value: h.occupied }));

  const TOGGLE_OPTIONS: { value: HostelType | undefined; label: string }[] = [
    { value: undefined, label: "All" },
    { value: "On-campus", label: "On-campus" },
    { value: "Off-campus", label: "Off-campus" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Hostel Accommodation" />
      <Breadcrumb items={breadcrumb} onJump={jumpToBreadcrumb} />
      <FilterBar filters={filters} config={filterConfig} onChange={handleFilterChange} onClearAll={resetAll} />

      <div className="flex items-center gap-2">
        {TOGGLE_OPTIONS.map((opt) => {
          const isActive = filters.hostelType === opt.value;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => handleFilterChange("hostelType", opt.value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                isActive ? "bg-accent-500 text-white" : "bg-surface border border-hairline text-ink-secondary hover:bg-subtle"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
        <SummaryCard label="Total Residents" value={summary.data?.totalResidents} loading={summary.loading} icon={Building2} />
        <SummaryCard label="On-Campus" value={onCampus} loading={summary.loading} icon={Home} />
        <SummaryCard label="Off-Campus" value={offCampus} loading={summary.loading} icon={TreePine} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard title="On-Campus vs Off-Campus" variant="donut" data={summary.data?.byType} loading={summary.loading} />
        <ChartCard
          title="Off-Campus Split — Bedian vs Safari"
          variant="donut"
          data={offCampusSplit}
          loading={summary.loading}
        />
      </div>

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
  );
}
