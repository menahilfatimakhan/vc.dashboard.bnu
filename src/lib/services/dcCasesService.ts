import { getCanonicalData } from "../data/store";
import type { DCCase, DCCaseStatus, PaginatedResult, Pagination } from "../data/types";
import { resolveProgramme, resolveSchool, resolveSchoolShort } from "../data/catalog/schools";
import { groupCount } from "./groupCount";
import { paginate } from "./paginate";
import { simulateDelay } from "./simulateDelay";
import { inSemesterPeriodRange } from "../data/semesters";

export interface DCCaseFilters {
  schoolId?: string;
  programmeId?: string;
  status?: DCCaseStatus;
  semesterFrom?: string;
  semesterTo?: string;
}

function matches(filters: DCCaseFilters) {
  return (c: DCCase) =>
    (!filters.schoolId || c.schoolId === filters.schoolId) &&
    (!filters.programmeId || c.programmeId === filters.programmeId) &&
    (!filters.status || c.status === filters.status) &&
    inSemesterPeriodRange(c.year, c.semester, filters.semesterFrom, filters.semesterTo);
}

export interface DCCasesSummary {
  total: number;
  pending: number;
  resolved: number;
  byStatus: ReturnType<typeof groupCount>;
  byViolationType: ReturnType<typeof groupCount>;
  bySchool: ReturnType<typeof groupCount>;
}

export async function getDCCasesSummary(filters: DCCaseFilters): Promise<DCCasesSummary> {
  await simulateDelay();
  const { dcCases } = getCanonicalData();
  const rows = dcCases.filter(matches(filters));

  return {
    total: rows.length,
    pending: rows.filter((c) => c.status === "Pending").length,
    resolved: rows.filter((c) => c.status === "Resolved").length,
    byStatus: groupCount(rows, (c) => c.status),
    byViolationType: groupCount(rows, (c) => c.violationType),
    bySchool: groupCount(rows, (c) => c.schoolId, resolveSchoolShort),
  };
}

export async function getDCCases(
  filters: DCCaseFilters,
  pagination: Pagination,
): Promise<PaginatedResult<DCCase & { schoolName: string; programmeName: string }>> {
  await simulateDelay();
  const { dcCases } = getCanonicalData();
  const rows = dcCases
    .filter(matches(filters))
    .map((c) => ({ ...c, schoolName: resolveSchool(c.schoolId), programmeName: resolveProgramme(c.programmeId) }));
  return paginate(rows, pagination);
}
