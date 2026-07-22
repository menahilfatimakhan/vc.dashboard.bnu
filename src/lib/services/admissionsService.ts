import { getCanonicalData } from "../data/store";
import type { Application, PaginatedResult, Pagination, Semester } from "../data/types";
import { resolveProgramme, resolveSchool } from "../data/catalog/schools";
import { groupCount } from "./groupCount";
import { paginate } from "./paginate";
import { simulateDelay } from "./simulateDelay";
import { inSemesterPeriodRange, SEMESTER_PERIODS } from "../data/semesters";

export interface AdmissionsFilters {
  schoolId?: string;
  programmeId?: string;
  semester?: Semester;
  semesterFrom?: string;
  semesterTo?: string;
}

function matchesApplication(filters: AdmissionsFilters) {
  return (a: Application) =>
    (!filters.schoolId || a.schoolId === filters.schoolId) &&
    (!filters.programmeId || a.programmeId === filters.programmeId) &&
    (!filters.semester || a.semester === filters.semester) &&
    inSemesterPeriodRange(a.year, a.semester, filters.semesterFrom, filters.semesterTo);
}

function matchesStudent(filters: AdmissionsFilters) {
  return (s: { schoolId: string; programmeId: string; semester: Semester; enrollmentYear: number }) =>
    (!filters.schoolId || s.schoolId === filters.schoolId) &&
    (!filters.programmeId || s.programmeId === filters.programmeId) &&
    (!filters.semester || s.semester === filters.semester) &&
    inSemesterPeriodRange(s.enrollmentYear, s.semester, filters.semesterFrom, filters.semesterTo);
}

export interface AdmissionsSummary {
  currentPoolCount: number;
  totalApplications: number;
  trailingYearTotal: number;
  trend: { year: number; count: number }[];
  admittedVsEnrolledTrend: { year: number; admitted: number; enrolled: number }[];
  funnel: { stage: string; value: number }[];
  byProgramme: ReturnType<typeof groupCount>;
  byIntake: ReturnType<typeof groupCount>;
  statusCounts: { active: number; frozen: number; dormant: number; struckOff: number };
  last4SemestersEnrollment: { period: string; label: string; year: number; semester: Semester; count: number }[];
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
  const feePaid = rows.filter((a) => a.feePaid).length;
  const admitted = rows.filter((a) => a.status === "Admitted").length;

  const matchedStudents = students.filter(matchesStudent(filters));

  // Trailing-1-year total = the two most recent semester periods present in the data.
  const recentPeriods = SEMESTER_PERIODS.slice(-2).map((p) => p.value);
  const trailingYearTotal = applications.filter(
    (a) => matchesApplication(filters)(a) && recentPeriods.includes(`${a.year}-${a.semester}`),
  ).length;

  const admittedVsEnrolledTrend = years.map((year) => ({
    year,
    admitted: rows.filter((a) => a.year === year && a.status === "Admitted").length,
    enrolled: matchedStudents.filter((s) => s.enrollmentYear === year).length,
  }));

  const statusCounts = {
    active: matchedStudents.filter((s) => s.enrollmentStatus === "Active").length,
    frozen: matchedStudents.filter((s) => s.enrollmentStatus === "Frozen").length,
    dormant: matchedStudents.filter((s) => s.enrollmentStatus === "Dormant").length,
    struckOff: matchedStudents.filter((s) => s.enrollmentStatus === "Struck Off").length,
  };

  const last4Periods = SEMESTER_PERIODS.slice(-4);
  const last4SemestersEnrollment = last4Periods.map((p) => ({
    period: p.value,
    label: p.label,
    year: p.year,
    semester: p.semester,
    count: matchedStudents.filter((s) => s.enrollmentYear === p.year && s.semester === p.semester).length,
  }));

  return {
    currentPoolCount: rows.filter((a) => a.status === "Received").length,
    totalApplications: received,
    trailingYearTotal,
    trend,
    admittedVsEnrolledTrend,
    funnel: [
      { stage: "Received", value: received },
      { stage: "Fee Paid", value: feePaid },
      { stage: "Admitted", value: admitted },
    ],
    byProgramme: groupCount(rows, (a) => a.programmeId, resolveProgramme),
    byIntake: groupCount(rows, (a) => a.semester),
    statusCounts,
    last4SemestersEnrollment,
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
