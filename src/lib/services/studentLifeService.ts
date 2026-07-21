import { getCanonicalData } from "../data/store";
import type { PaginatedResult, Pagination, StudentEvent } from "../data/types";
import { resolveSchool } from "../data/catalog/schools";
import { groupCount } from "./groupCount";
import { paginate } from "./paginate";
import { simulateDelay } from "./simulateDelay";
import { inDateRange } from "./dateRangeFilter";

export interface StudentLifeFilters {
  schoolId?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
}

function societySchoolId(societyId: string): string | null {
  return getCanonicalData().societies.find((s) => s.id === societyId)?.schoolId ?? null;
}

function societyCategory(societyId: string): string {
  return getCanonicalData().societies.find((s) => s.id === societyId)?.category ?? "";
}

function matches(filters: StudentLifeFilters) {
  return (e: StudentEvent) =>
    (!filters.schoolId || societySchoolId(e.societyId) === filters.schoolId) &&
    (!filters.category || societyCategory(e.societyId) === filters.category) &&
    inDateRange(e.date, filters.dateFrom, filters.dateTo);
}

export interface StudentLifeSummary {
  totalSocieties: number;
  totalEvents: number;
  totalParticipation: number;
  byCategory: ReturnType<typeof groupCount>;
  bySociety: { key: string; label: string; events: number; participation: number }[];
}

export async function getStudentLifeSummary(filters: StudentLifeFilters): Promise<StudentLifeSummary> {
  await simulateDelay();
  const { societies, studentEvents } = getCanonicalData();
  const rows = studentEvents.filter(matches(filters));

  const relevantSocieties = filters.schoolId
    ? societies.filter((s) => s.schoolId === filters.schoolId)
    : societies;

  const bySociety = relevantSocieties
    .map((society) => {
      const events = rows.filter((e) => e.societyId === society.id);
      return {
        key: society.id,
        label: society.name,
        events: events.length,
        participation: events.reduce((sum, e) => sum + e.participantCount, 0),
      };
    })
    .filter((s) => s.events > 0 || !filters.category);

  return {
    totalSocieties: relevantSocieties.length,
    totalEvents: rows.length,
    totalParticipation: rows.reduce((sum, e) => sum + e.participantCount, 0),
    byCategory: groupCount(rows, (e) => societyCategory(e.societyId)),
    bySociety,
  };
}

export async function getStudentEvents(
  filters: StudentLifeFilters,
  pagination: Pagination,
): Promise<PaginatedResult<StudentEvent & { societyName: string }>> {
  await simulateDelay();
  const { studentEvents, societies } = getCanonicalData();
  const rows = studentEvents
    .filter(matches(filters))
    .map((e) => ({
      ...e,
      societyName: societies.find((s) => s.id === e.societyId)?.name ?? "",
    }));
  return paginate(rows, pagination);
}

export { resolveSchool };
