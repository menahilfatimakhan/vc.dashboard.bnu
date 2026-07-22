import { getCanonicalData } from "../data/store";
import type { PaginatedResult, Pagination, ScholarshipRecipient } from "../data/types";
import { resolveProgramme, resolveSchoolShort } from "../data/catalog/schools";
import { resolveScholarshipType } from "../data/catalog/scholarshipTypes";
import { groupCount } from "./groupCount";
import { paginate } from "./paginate";
import { simulateDelay } from "./simulateDelay";
import { inSemesterPeriodRange, SEMESTER_PERIODS } from "../data/semesters";

const THRESHOLD = 100000;

export interface ScholarshipFilters {
  schoolId?: string;
  programmeId?: string;
  scholarshipTypeId?: string;
  semesterFrom?: string;
  semesterTo?: string;
}

function matches(filters: ScholarshipFilters) {
  return (r: ScholarshipRecipient) =>
    (!filters.schoolId || r.schoolId === filters.schoolId) &&
    (!filters.programmeId || r.programmeId === filters.programmeId) &&
    (!filters.scholarshipTypeId || r.scholarshipTypeId === filters.scholarshipTypeId) &&
    inSemesterPeriodRange(r.awardYear, r.awardSemester, filters.semesterFrom, filters.semesterTo);
}

export interface ScholarshipSummary {
  totalRecipients: number;
  percentOfStudentBody: number;
  activeStudentCount: number;
  totalSpent: number;
  activeTypes: { id: string; name: string; awardingCriteria: string; amountPerAward: number; recipients: number }[];
  bySchool: ReturnType<typeof groupCount>;
  byProgramme: ReturnType<typeof groupCount>;
  spentTrend: { period: string; label: string; amount: number }[];
  threshold100kTrend: { period: string; label: string; aboveThreshold: number; belowThreshold: number }[];
  spentByTypeBySemester: Record<string, string | number>[];
  typeBySchool: Record<string, string | number>[];
  scholarshipTypeNames: string[];
}

export async function getScholarshipsSummary(filters: ScholarshipFilters): Promise<ScholarshipSummary> {
  await simulateDelay();
  const { students, scholarshipRecipients, scholarshipTypes } = getCanonicalData();
  const rows = scholarshipRecipients.filter(matches(filters));

  const activeStudentCount = students.filter((s) => s.enrollmentStatus === "Active").length;

  const activeTypes = scholarshipTypes.map((type) => {
    const typeRows = rows.filter((r) => r.scholarshipTypeId === type.id);
    return {
      id: type.id,
      name: type.name,
      awardingCriteria: type.awardingCriteria,
      amountPerAward: type.amountPerAward,
      recipients: typeRows.length,
    };
  });

  const totalSpent = rows.reduce((sum, r) => sum + r.amount, 0);

  const spentTrend = SEMESTER_PERIODS.map((period) => {
    const periodRows = rows.filter((r) => r.awardYear === period.year && r.awardSemester === period.semester);
    return { period: period.value, label: period.label, amount: periodRows.reduce((sum, r) => sum + r.amount, 0) };
  });

  const threshold100kTrend = SEMESTER_PERIODS.map((period) => {
    const periodRows = rows.filter((r) => r.awardYear === period.year && r.awardSemester === period.semester);
    return {
      period: period.value,
      label: period.label,
      aboveThreshold: periodRows.filter((r) => r.amount >= THRESHOLD).length,
      belowThreshold: periodRows.filter((r) => r.amount < THRESHOLD).length,
    };
  });

  const scholarshipTypeNames = scholarshipTypes.map((t) => t.name);

  const spentByTypeBySemester = SEMESTER_PERIODS.map((period) => {
    const periodRows = rows.filter((r) => r.awardYear === period.year && r.awardSemester === period.semester);
    const entry: Record<string, string | number> = { label: period.label };
    for (const type of scholarshipTypes) {
      entry[type.name] = periodRows.filter((r) => r.scholarshipTypeId === type.id).reduce((sum, r) => sum + r.amount, 0);
    }
    return entry;
  });

  const relevantSchools = filters.schoolId
    ? getCanonicalData().schools.filter((s) => s.id === filters.schoolId)
    : getCanonicalData().schools;
  const typeBySchool = relevantSchools.map((school) => {
    const schoolRows = rows.filter((r) => r.schoolId === school.id);
    const entry: Record<string, string | number> = { label: resolveSchoolShort(school.id) };
    for (const type of scholarshipTypes) {
      entry[type.name] = schoolRows.filter((r) => r.scholarshipTypeId === type.id).length;
    }
    return entry;
  });

  return {
    totalRecipients: rows.length,
    percentOfStudentBody: activeStudentCount > 0 ? (rows.length / activeStudentCount) * 100 : 0,
    activeStudentCount,
    totalSpent,
    activeTypes,
    bySchool: groupCount(rows, (r) => r.schoolId, resolveSchoolShort),
    byProgramme: groupCount(rows, (r) => r.programmeId, resolveProgramme),
    spentTrend,
    threshold100kTrend,
    spentByTypeBySemester,
    typeBySchool,
    scholarshipTypeNames,
  };
}

export async function getScholarshipRecipients(
  filters: ScholarshipFilters,
  pagination: Pagination,
): Promise<PaginatedResult<ScholarshipRecipient>> {
  await simulateDelay();
  const { scholarshipRecipients } = getCanonicalData();
  return paginate(scholarshipRecipients.filter(matches(filters)), pagination);
}

export { resolveScholarshipType };
