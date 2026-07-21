import { getCanonicalData } from "../data/store";
import type { ClassSession, PaginatedResult, Pagination } from "../data/types";
import { resolveSchool, resolveSchoolShort, SCHOOLS } from "../data/catalog/schools";
import { paginate } from "./paginate";
import { simulateDelay } from "./simulateDelay";
import { inDateRange } from "./dateRangeFilter";

export interface ClassesFilters {
  schoolId?: string;
  dateFrom?: string;
  dateTo?: string;
}

function matches(filters: ClassesFilters) {
  return (c: ClassSession) =>
    (!filters.schoolId || c.schoolId === filters.schoolId) &&
    inDateRange(c.scheduledAt.slice(0, 10), filters.dateFrom, filters.dateTo);
}

export interface ClassesSummary {
  totalScheduled: number;
  attended: number;
  notAttended: number;
  attendanceRate: number;
  bySchool: { key: string; label: string; scheduled: number; attended: number; attendanceRate: number }[];
}

export async function getClassesSummary(filters: ClassesFilters): Promise<ClassesSummary> {
  await simulateDelay();
  const { classSessions } = getCanonicalData();
  const rows = classSessions.filter(matches(filters));
  const attended = rows.filter((c) => c.attendanceStatus === "Attended").length;

  const relevantSchools = filters.schoolId ? SCHOOLS.filter((s) => s.id === filters.schoolId) : SCHOOLS;
  const bySchool = relevantSchools.map((s) => {
    const schoolRows = rows.filter((c) => c.schoolId === s.id);
    const schoolAttended = schoolRows.filter((c) => c.attendanceStatus === "Attended").length;
    return {
      key: s.id,
      label: resolveSchoolShort(s.id),
      scheduled: schoolRows.length,
      attended: schoolAttended,
      attendanceRate: schoolRows.length > 0 ? (schoolAttended / schoolRows.length) * 100 : 0,
    };
  });

  return {
    totalScheduled: rows.length,
    attended,
    notAttended: rows.length - attended,
    attendanceRate: rows.length > 0 ? (attended / rows.length) * 100 : 0,
    bySchool,
  };
}

export async function getClassSessions(
  filters: ClassesFilters,
  pagination: Pagination,
): Promise<PaginatedResult<ClassSession & { schoolName: string }>> {
  await simulateDelay();
  const { classSessions } = getCanonicalData();
  const rows = classSessions.filter(matches(filters)).map((c) => ({ ...c, schoolName: resolveSchool(c.schoolId) }));
  return paginate(rows, pagination);
}
