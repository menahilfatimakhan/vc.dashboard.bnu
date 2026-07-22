import { getCanonicalData } from "../data/store";
import type { PaginatedResult, Pagination, Semester, Student } from "../data/types";
import { resolveProgramme, resolveSchoolShort } from "../data/catalog/schools";
import { groupCount } from "./groupCount";
import { paginate } from "./paginate";
import { simulateDelay } from "./simulateDelay";
import { inSemesterPeriodRange } from "../data/semesters";

export interface EnrolledFilters {
  schoolId?: string;
  programmeId?: string;
  semester?: Semester;
  semesterFrom?: string;
  semesterTo?: string;
}

function matches(filters: EnrolledFilters) {
  return (s: Student) =>
    (!filters.schoolId || s.schoolId === filters.schoolId) &&
    (!filters.programmeId || s.programmeId === filters.programmeId) &&
    (!filters.semester || s.semester === filters.semester) &&
    inSemesterPeriodRange(s.enrollmentYear, s.semester, filters.semesterFrom, filters.semesterTo);
}

export interface EnrolledSummary {
  total: number;
  active: number;
  bySchool: ReturnType<typeof groupCount>;
  byProgramme: ReturnType<typeof groupCount>;
  bySemester: ReturnType<typeof groupCount>;
  byStatus: ReturnType<typeof groupCount>;
}

export async function getEnrolledStudentsSummary(filters: EnrolledFilters): Promise<EnrolledSummary> {
  await simulateDelay();
  const { students } = getCanonicalData();
  const rows = students.filter(matches(filters));

  return {
    total: rows.length,
    active: rows.filter((s) => s.enrollmentStatus === "Active").length,
    bySchool: groupCount(rows, (s) => s.schoolId, resolveSchoolShort),
    byProgramme: groupCount(rows, (s) => s.programmeId, resolveProgramme),
    bySemester: groupCount(rows, (s) => s.semester),
    byStatus: groupCount(rows, (s) => s.enrollmentStatus),
  };
}

export async function getEnrolledStudents(
  filters: EnrolledFilters,
  pagination: Pagination,
): Promise<PaginatedResult<Student>> {
  await simulateDelay();
  const { students } = getCanonicalData();
  return paginate(students.filter(matches(filters)), pagination);
}
