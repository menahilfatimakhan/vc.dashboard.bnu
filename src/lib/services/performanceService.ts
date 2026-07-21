import { getCanonicalData } from "../data/store";
import type { PaginatedResult, Pagination, Student } from "../data/types";
import { resolveProgramme, resolveSchool, resolveSchoolShort } from "../data/catalog/schools";
import { getCgpaDivision, type CgpaDivision } from "./businessRules";
import { paginate } from "./paginate";
import { simulateDelay } from "./simulateDelay";

export interface PerformanceFilters {
  schoolId?: string;
  programmeId?: string;
}

function matches(filters: PerformanceFilters) {
  return (s: Student) =>
    s.enrollmentStatus !== "Withdrawn" &&
    (!filters.schoolId || s.schoolId === filters.schoolId) &&
    (!filters.programmeId || s.programmeId === filters.programmeId);
}

const DIVISIONS: CgpaDivision[] = ["Division 3", "Division 2", "Division 1", "Unclassified"];

export interface PerformanceSummary {
  total: number;
  byDivision: { key: CgpaDivision; label: string; value: number; percent: number }[];
  bySchool: { key: string; label: string; divisions: Record<CgpaDivision, number> }[];
}

export async function getPerformanceSummary(filters: PerformanceFilters): Promise<PerformanceSummary> {
  await simulateDelay();
  const { students, schools } = getCanonicalData();
  const rows = students.filter(matches(filters));

  const byDivision = DIVISIONS.map((division) => {
    const value = rows.filter((s) => getCgpaDivision(s.cgpa) === division).length;
    return { key: division, label: division, value, percent: rows.length > 0 ? (value / rows.length) * 100 : 0 };
  });

  const relevantSchools = filters.schoolId ? schools.filter((s) => s.id === filters.schoolId) : schools;
  const bySchool = relevantSchools.map((school) => {
    const schoolRows = rows.filter((s) => s.schoolId === school.id);
    const divisions = {} as Record<CgpaDivision, number>;
    for (const division of DIVISIONS) {
      divisions[division] = schoolRows.filter((s) => getCgpaDivision(s.cgpa) === division).length;
    }
    return { key: school.id, label: resolveSchoolShort(school.id), divisions };
  });

  return { total: rows.length, byDivision, bySchool };
}

export async function getPerformanceRecords(
  filters: PerformanceFilters,
  pagination: Pagination,
): Promise<PaginatedResult<Student & { schoolName: string; programmeName: string; division: CgpaDivision }>> {
  await simulateDelay();
  const { students } = getCanonicalData();
  const rows = students.filter(matches(filters)).map((s) => ({
    ...s,
    schoolName: resolveSchool(s.schoolId),
    programmeName: resolveProgramme(s.programmeId),
    division: getCgpaDivision(s.cgpa),
  }));
  return paginate(rows, pagination);
}
