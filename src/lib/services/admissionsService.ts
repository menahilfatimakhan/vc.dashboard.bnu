import { getCanonicalData } from "../data/store";
import type { Application, PaginatedResult, Pagination, Semester } from "../data/types";
import { resolveProgramme, resolveSchool } from "../data/catalog/schools";
import { groupCount } from "./groupCount";
import { paginate } from "./paginate";
import { simulateDelay } from "./simulateDelay";
import { yearInRange } from "./dateRangeFilter";

export interface AdmissionsFilters {
  schoolId?: string;
  programmeId?: string;
  semester?: Semester;
  dateFrom?: string;
  dateTo?: string;
}

function matchesApplication(filters: AdmissionsFilters) {
  return (a: Application) =>
    (!filters.schoolId || a.schoolId === filters.schoolId) &&
    (!filters.programmeId || a.programmeId === filters.programmeId) &&
    (!filters.semester || a.semester === filters.semester) &&
    yearInRange(a.year, filters.dateFrom, filters.dateTo);
}

export interface AdmissionsSummary {
  currentPoolCount: number;
  totalApplications: number;
  trend: { year: number; count: number }[];
  funnel: { stage: string; value: number }[];
  byProgramme: ReturnType<typeof groupCount>;
  byIntake: ReturnType<typeof groupCount>;
}

export async function getAdmissionsSummary(filters: AdmissionsFilters): Promise<AdmissionsSummary> {
  await simulateDelay();
  const { applications, students } = getCanonicalData();
  const rows = applications.filter(matchesApplication(filters));

  const years = Array.from(new Set(applications.map((a) => a.year))).sort();
  const trend = years.map((year) => ({
    year,
    count: rows.filter((a) => a.year === year).length,
  }));

  const received = rows.length;
  const admitted = rows.filter((a) => a.status === "Admitted").length;

  const enrolledCount = students.filter(
    (s) =>
      (!filters.schoolId || s.schoolId === filters.schoolId) &&
      (!filters.programmeId || s.programmeId === filters.programmeId) &&
      (!filters.semester || s.semester === filters.semester) &&
      yearInRange(s.enrollmentYear, filters.dateFrom, filters.dateTo),
  ).length;

  return {
    currentPoolCount: rows.filter((a) => a.status === "Received").length,
    totalApplications: received,
    trend,
    funnel: [
      { stage: "Received", value: received },
      { stage: "Admitted", value: admitted },
      { stage: "Enrolled", value: enrolledCount },
    ],
    byProgramme: groupCount(rows, (a) => a.programmeId, resolveProgramme),
    byIntake: groupCount(rows, (a) => a.semester),
  };
}

export async function getApplications(
  filters: AdmissionsFilters,
  pagination: Pagination,
): Promise<PaginatedResult<Application & { schoolName: string; programmeName: string }>> {
  await simulateDelay();
  const { applications } = getCanonicalData();
  const rows = applications
    .filter(matchesApplication(filters))
    .map((a) => ({ ...a, schoolName: resolveSchool(a.schoolId), programmeName: resolveProgramme(a.programmeId) }));
  return paginate(rows, pagination);
}
