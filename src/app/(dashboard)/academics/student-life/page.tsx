"use client";

import { useState } from "react";
import { Users2, CalendarDays, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FilterBar, type FilterFieldConfig } from "@/components/ui/FilterBar";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { useModuleFilters, type DrillLevelConfig } from "@/hooks/useModuleFilters";
import { useAsync } from "@/hooks/useAsync";
import { SCHOOLS, resolveSchool } from "@/lib/data/catalog/schools";
import {
  getStudentEvents,
  getStudentLifeSummary,
  type StudentLifeFilters,
} from "@/lib/services/studentLifeService";
import { formatDate } from "@/lib/utils/format";

const LEVELS: DrillLevelConfig[] = [{ level: "school", filterKey: "schoolId", resolveLabel: resolveSchool }];

const PAGE_SIZE = 10;
const CATEGORIES = [
  "Literary & Debate",
  "Performing Arts",
  "Visual Arts",
  "Business & Innovation",
  "Community & Advocacy",
  "Sports",
];

export default function StudentLifePage() {
  const { filters, breadcrumb, setFilter, jumpToBreadcrumb, resetAll } =
    useModuleFilters<StudentLifeFilters>({ levels: LEVELS });
  const [page, setPage] = useState(1);

  const summary = useAsync(() => getStudentLifeSummary(filters), [
    filters.schoolId,
    filters.category,
    filters.dateFrom,
    filters.dateTo,
  ]);
  const records = useAsync(
    () => getStudentEvents(filters, { page, pageSize: PAGE_SIZE }),
    [filters.schoolId, filters.category, filters.dateFrom, filters.dateTo, page],
  );

  function handleFilterChange(key: string, value: string | undefined) {
    setPage(1);
    setFilter(key, value);
  }

  const filterConfig: FilterFieldConfig[] = [
    { key: "schoolId", label: "School", kind: "select", options: SCHOOLS.map((s) => ({ value: s.id, label: s.name })) },
    { key: "category", label: "Category", kind: "select", options: CATEGORIES.map((c) => ({ value: c, label: c })) },
    { key: "dateFrom", label: "From", kind: "date" },
    { key: "dateTo", label: "To", kind: "date" },
  ];

  const bySocietyData = (summary.data?.bySociety ?? [])
    .filter((s) => s.participation > 0)
    .map((s) => ({ key: s.key, label: s.label, value: s.participation }))
    .sort((a, b) => b.value - a.value);

  const columns: Column<{ id: string; name: string; societyName: string; date: string; participantCount: number }>[] = [
    { key: "id", header: "Event ID" },
    { key: "name", header: "Event" },
    { key: "societyName", header: "Society" },
    { key: "date", header: "Date", render: (r) => formatDate(r.date) },
    { key: "participantCount", header: "Participants", align: "right" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Student Life" speculative />
      <Breadcrumb items={breadcrumb} onJump={jumpToBreadcrumb} />
      <FilterBar filters={filters} config={filterConfig} onChange={handleFilterChange} onClearAll={resetAll} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <SummaryCard label="Societies" value={summary.data?.totalSocieties} loading={summary.loading} icon={Users2} />
        <SummaryCard label="Events" value={summary.data?.totalEvents} loading={summary.loading} icon={CalendarDays} />
        <SummaryCard label="Total Participation" value={summary.data?.totalParticipation} loading={summary.loading} icon={Sparkles} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Events by Category" variant="donut" data={summary.data?.byCategory} loading={summary.loading} />
        <ChartCard title="Participation by Society" variant="bar" data={bySocietyData} loading={summary.loading} />
      </div>

      <DataTable
        columns={columns}
        rows={records.data?.rows}
        total={records.data?.total}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        loading={records.loading}
        emptyMessage="No events match the current filters."
      />
    </div>
  );
}
