import { getCanonicalData } from "../data/store";
import type { PaginatedResult, Pagination, ScholarshipRecipient } from "../data/types";
import { resolveProgramme, resolveSchoolShort } from "../data/catalog/schools";
import { resolveScholarshipType } from "../data/catalog/scholarshipTypes";
import { groupCount } from "./groupCount";
import { paginate } from "./paginate";
import { simulateDelay } from "./simulateDelay";
import { yearInRange } from "./dateRangeFilter";

export interface ScholarshipFilters {
  schoolId?: string;
  programmeId?: string;
  scholarshipTypeId?: string;
  dateFrom?: string;
  dateTo?: string;
}

function matches(filters: ScholarshipFilters) {
  return (r: ScholarshipRecipient) =>
    (!filters.schoolId || r.schoolId === filters.schoolId) &&
    (!filters.programmeId || r.programmeId === filters.programmeId) &&
    (!filters.scholarshipTypeId || r.scholarshipTypeId === filters.scholarshipTypeId) &&
    yearInRange(r.awardYear, filters.dateFrom, filters.dateTo);
}

export interface ScholarshipSummary {
  totalRecipients: number;
  percentOfStudentBody: number;
  totalDisbursed: number;
  activeTypes: { id: string; name: string; awardingCriteria: string; amountPerAward: number; recipients: number }[];
  bySchool: ReturnType<typeof groupCount>;
  byProgramme: ReturnType<typeof groupCount>;
}

export async function getScholarshipsSummary(filters: ScholarshipFilters): Promise<ScholarshipSummary> {
  await simulateDelay();
  const { students, scholarshipRecipients, scholarshipTypes } = getCanonicalData();
  const rows = scholarshipRecipients.filter(matches(filters));

  const activeStudentCount = students.filter((s) => s.enrollmentStatus === "Active").length;

  const activeTypes = scholarshipTypes.map((type) => {
    const recipients = rows.filter((r) => r.scholarshipTypeId === type.id).length;
    return {
      id: type.id,
      name: type.name,
      awardingCriteria: type.awardingCriteria,
      amountPerAward: type.amountPerAward,
      recipients,
    };
  });

  const totalDisbursed = activeTypes.reduce((sum, t) => sum + t.amountPerAward * t.recipients, 0);

  return {
    totalRecipients: rows.length,
    percentOfStudentBody: activeStudentCount > 0 ? (rows.length / activeStudentCount) * 100 : 0,
    totalDisbursed,
    activeTypes,
    bySchool: groupCount(rows, (r) => r.schoolId, resolveSchoolShort),
    byProgramme: groupCount(rows, (r) => r.programmeId, resolveProgramme),
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
