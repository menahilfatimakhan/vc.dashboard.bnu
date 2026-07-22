"use client";

import { HandCoins, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FilterBar, type FilterFieldConfig } from "@/components/ui/FilterBar";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { useModuleFilters, type DrillLevelConfig } from "@/hooks/useModuleFilters";
import { useAsync } from "@/hooks/useAsync";
import { SCHOOLS } from "@/lib/data/catalog/schools";
import { DEPARTMENTS } from "@/lib/data/catalog/departments";
import { getGrantsSummary, resolveOwnerById, type GrantFilters } from "@/lib/services/grantsService";

const LEVELS: DrillLevelConfig[] = [{ level: "owner", filterKey: "ownerId", resolveLabel: resolveOwnerById }];

export default function GrantsPage() {
  const { filters, breadcrumb, setFilter, jumpToBreadcrumb, resetAll } =
    useModuleFilters<GrantFilters>({ levels: LEVELS });

  const summary = useAsync(() => getGrantsSummary(filters), [filters.ownerId, filters.status]);

  function handleFilterChange(key: string, value: string | undefined) {
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
    </div>
  );
}
