"use client";

import { useState } from "react";
import { Briefcase } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FilterBar, type FilterFieldConfig } from "@/components/ui/FilterBar";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { useModuleFilters, type DrillLevelConfig } from "@/hooks/useModuleFilters";
import { useAsync } from "@/hooks/useAsync";
import { DEPARTMENTS, resolveDepartment } from "@/lib/data/catalog/departments";
import { getStaff, getStaffSummary, type StaffFilters } from "@/lib/services/staffService";

const LEVELS: DrillLevelConfig[] = [{ level: "department", filterKey: "departmentId", resolveLabel: resolveDepartment }];

const PAGE_SIZE = 10;

export default function StaffPage() {
  const { filters, breadcrumb, setFilter, jumpToBreadcrumb, resetAll } =
    useModuleFilters<StaffFilters>({ levels: LEVELS });
  const [page, setPage] = useState(1);

  const summary = useAsync(() => getStaffSummary(filters), [filters.departmentId]);
  const records = useAsync(() => getStaff(filters, { page, pageSize: PAGE_SIZE }), [filters.departmentId, page]);

  function handleFilterChange(key: string, value: string | undefined) {
    setPage(1);
    setFilter(key, value);
  }

  const filterConfig: FilterFieldConfig[] = [
    {
      key: "departmentId",
      label: "Department",
      kind: "select",
      options: DEPARTMENTS.map((d) => ({ value: d.id, label: d.name })),
    },
  ];

  const columns: Column<{ id: string; name: string; departmentName: string; designation: string }>[] = [
    { key: "id", header: "Staff ID" },
    { key: "name", header: "Name" },
    { key: "departmentName", header: "Department" },
    { key: "designation", header: "Designation" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Staff" />
      <Breadcrumb items={breadcrumb} onJump={jumpToBreadcrumb} />
      <FilterBar filters={filters} config={filterConfig} onChange={handleFilterChange} onClearAll={resetAll} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <SummaryCard label="Total Staff" value={summary.data?.total} loading={summary.loading} icon={Briefcase} />
        <SummaryCard
          label="Departments Represented"
          value={summary.data?.byDepartment.length}
          loading={summary.loading}
          icon={Briefcase}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard
          title="By Department"
          subtitle="Click a bar to drill into that department"
          variant="bar"
          data={summary.data?.byDepartment}
          loading={summary.loading}
          onSegmentClick={(key) => handleFilterChange("departmentId", key)}
        />
        <ChartCard title="By Designation" variant="bar" data={summary.data?.byDesignation} loading={summary.loading} />
      </div>

      <DataTable
        columns={columns}
        rows={records.data?.rows}
        total={records.data?.total}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        loading={records.loading}
        emptyMessage="No staff match the current filters."
      />
    </div>
  );
}
