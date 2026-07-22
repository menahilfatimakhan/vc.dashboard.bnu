import { getCanonicalData } from "../data/store";
import type { PaginatedResult, Pagination, Student } from "../data/types";
import { resolveProgramme, resolveSchool, resolveSchoolShort } from "../data/catalog/schools";
import { getCgpaTier, type CgpaTier } from "./businessRules";
import { paginate } from "./paginate";
import { simulateDelay } from "./simulateDelay";

export interface PerformanceFilters {
  schoolId?: string;
  programmeId?: string;
}

function matches(filters: PerformanceFilters) {
  return (s: Student) =>
    s.enrollmentStatus !== "Struck Off" &&
    (!filters.schoolId || s.schoolId === filters.schoolId) &&
    (!filters.programmeId || s.programmeId === filters.programmeId);
}

const TIERS: CgpaTier[] = ["Tier 1", "Tier 2", "Tier 3", "Unclassified"];

export interface PerformanceSummary {
  total: number;
  byDivision: { key: CgpaTier; label: string; value: number; percent: number }[];
  bySchool: { key: string; label: string; divisions: Record<CgpaTier, number> }[];
}

export async function getPerformanceSummary(filters: PerformanceFilters): Promise<PerformanceSummary> {
  await simulateDelay();
  const { students, schools } = getCanonicalData();
  const rows = students.filter(matches(filters));

  const byDivision = TIERS.map((tier) => {
    const value = rows.filter((s) => getCgpaTier(s.cgpa) === tier).length;
    return { key: tier, label: tier, value, percent: rows.length > 0 ? (value / rows.length) * 100 : 0 };
  });

  const relevantSchools = filters.schoolId ? schools.filter((s) => s.id === filters.schoolId) : schools;
  const bySchool = relevantSchools.map((school) => {
    const schoolRows = rows.filter((s) => s.schoolId === school.id);
    const divisions = {} as Record<CgpaTier, number>;
    for (const tier of TIERS) {
      divisions[tier] = schoolRows.filter((s) => getCgpaTier(s.cgpa) === tier).length;
    }
    return { key: school.id, label: resolveSchoolShort(school.id), divisions };
  });

  return { total: rows.length, byDivision, bySchool };
}

export async function getPerformanceRecords(
  filters: PerformanceFilters,
  pagination: Pagination,
): Promise<PaginatedResult<Student & { schoolName: string; programmeName: string; division: CgpaTier }>> {
  await simulateDelay();
  const { students } = getCanonicalData();
  const rows = students.filter(matches(filters)).map((s) => ({
    ...s,
    schoolName: resolveSchool(s.schoolId),
    programmeName: resolveProgramme(s.programmeId),
    division: getCgpaTier(s.cgpa),
  }));
  return paginate(rows, pagination);
}
