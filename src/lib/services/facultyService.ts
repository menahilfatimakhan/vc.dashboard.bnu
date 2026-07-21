import { getCanonicalData } from "../data/store";
import type { EmploymentType, Faculty, PaginatedResult, Pagination } from "../data/types";
import { resolveSchool, resolveSchoolShort, SCHOOLS } from "../data/catalog/schools";
import { groupCount } from "./groupCount";
import { paginate } from "./paginate";
import { simulateDelay } from "./simulateDelay";

export interface FacultyFilters {
  schoolId?: string;
  employmentType?: EmploymentType;
}

function matches(filters: FacultyFilters) {
  return (f: Faculty) =>
    (!filters.schoolId || f.schoolId === filters.schoolId) &&
    (!filters.employmentType || f.employmentType === filters.employmentType);
}

export interface FacultySummary {
  total: number;
  fullTime: number;
  visiting: number;
  bySchool: ReturnType<typeof groupCount>;
  byEmploymentType: ReturnType<typeof groupCount>;
  bySchoolEmploymentType: { label: string; "Full-Time": number; Visiting: number }[];
}

export async function getFacultySummary(filters: FacultyFilters): Promise<FacultySummary> {
  await simulateDelay();
  const { faculty } = getCanonicalData();
  const rows = faculty.filter(matches(filters));

  const relevantSchools = filters.schoolId ? SCHOOLS.filter((s) => s.id === filters.schoolId) : SCHOOLS;
  const bySchoolEmploymentType = relevantSchools.map((s) => {
    const schoolRows = rows.filter((f) => f.schoolId === s.id);
    return {
      label: resolveSchoolShort(s.id),
      "Full-Time": schoolRows.filter((f) => f.employmentType === "Full-Time").length,
      Visiting: schoolRows.filter((f) => f.employmentType === "Visiting").length,
    };
  });

  return {
    total: rows.length,
    fullTime: rows.filter((f) => f.employmentType === "Full-Time").length,
    visiting: rows.filter((f) => f.employmentType === "Visiting").length,
    bySchool: groupCount(rows, (f) => f.schoolId, resolveSchoolShort),
    byEmploymentType: groupCount(rows, (f) => f.employmentType),
    bySchoolEmploymentType,
  };
}

export async function getFaculty(
  filters: FacultyFilters,
  pagination: Pagination,
): Promise<PaginatedResult<Faculty & { schoolName: string }>> {
  await simulateDelay();
  const { faculty } = getCanonicalData();
  const rows = faculty.filter(matches(filters)).map((f) => ({ ...f, schoolName: resolveSchool(f.schoolId) }));
  return paginate(rows, pagination);
}
