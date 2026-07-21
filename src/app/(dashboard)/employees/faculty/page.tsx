"use client";

import { useState } from "react";
import { UserCog, Building, Plane } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FilterBar, type FilterFieldConfig } from "@/components/ui/FilterBar";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { StackedBarChartInner } from "@/components/ui/charts/StackedBarChartInner";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { useModuleFilters, type DrillLevelConfig } from "@/hooks/useModuleFilters";
import { useAsync } from "@/hooks/useAsync";
import { SCHOOLS, resolveSchool } from "@/lib/data/catalog/schools";
import { getFaculty, getFacultySummary, type FacultyFilters } from "@/lib/services/facultyService";

const LEVELS: DrillLevelConfig[] = [{ level: "school", filterKey: "schoolId", resolveLabel: resolveSchool }];

const PAGE_SIZE = 10;

export default function FacultyPage() {
  const { filters, breadcrumb, setFilter, jumpToBreadcrumb, resetAll } =
    useModuleFilters<FacultyFilters>({ levels: LEVELS });
  const [page, setPage] = useState(1);

  const summary = useAsync(() => getFacultySummary(filters), [filters.schoolId, filters.employmentType]);
  const records = useAsync(
    () => getFaculty(filters, { page, pageSize: PAGE_SIZE }),
    [filters.schoolId, filters.employmentType, page],
  );

  function handleFilterChange(key: string, value: string | undefined) {
    setPage(1);
    setFilter(key, value);
  }

  const filterConfig: FilterFieldConfig[] = [
    { key: "schoolId", label: "School", kind: "select", options: SCHOOLS.map((s) => ({ value: s.id, label: s.name })) },
    {
      key: "employmentType",
      label: "Employment Type",
      kind: "select",
      options: [
        { value: "Full-Time", label: "Full-Time" },
        { value: "Visiting", label: "Visiting" },
      ],
    },
  ];

  const columns: Column<{ id: string; name: string; schoolName: string; employmentType: string }>[] = [
    { key: "id", header: "Faculty ID" },
    { key: "name", header: "Name" },
    { key: "schoolName", header: "School" },
    { key: "employmentType", header: "Employment Type" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Faculty" />
      <Breadcrumb items={breadcrumb} onJump={jumpToBreadcrumb} />
      <FilterBar filters={filters} config={filterConfig} onChange={handleFilterChange} onClearAll={resetAll} />

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
        <SummaryCard label="Total Faculty" value={summary.data?.total} loading={summary.loading} icon={UserCog} />
        <SummaryCard label="Full-Time" value={summary.data?.fullTime} loading={summary.loading} icon={Building} />
        <SummaryCard label="Visiting" value={summary.data?.visiting} loading={summary.loading} icon={Plane} />
      </div>

      <ChartCard
        title="Full-Time vs Visiting by School"
        loading={summary.loading}
        height={Math.max(220, (summary.data?.bySchoolEmploymentType.length ?? 0) * 40)}
      >
        {summary.data && (
          <StackedBarChartInner
            data={summary.data.bySchoolEmploymentType}
            categoryKey="label"
            series={[
              { dataKey: "Full-Time", label: "Full-Time" },
              { dataKey: "Visiting", label: "Visiting" },
            ]}
            height={Math.max(220, summary.data.bySchoolEmploymentType.length * 40)}
          />
        )}
      </ChartCard>

      <DataTable
        columns={columns}
        rows={records.data?.rows}
        total={records.data?.total}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        loading={records.loading}
        emptyMessage="No faculty match the current filters."
      />
    </div>
  );
}
