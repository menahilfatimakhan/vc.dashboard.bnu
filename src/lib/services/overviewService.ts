import { getCanonicalData } from "../data/store";
import { resolveSchoolShort } from "../data/catalog/schools";
import { getEPortalStatus, isGrantEndingSoon } from "./businessRules";
import { groupCount } from "./groupCount";
import { simulateDelay } from "./simulateDelay";
import { CURRENT_SEMESTER_PERIOD } from "../data/semesters";
import type { SchoolCountApplicantsDatum, TuitionRevenuePoint } from "../data/types";

export interface OverviewSummary {
  totalEnrolled: number;
  facultyHeadcount: number;
  staffHeadcount: number;
  openDCCases: number;
  escalatedEPortalCases: number;
  grantsEndingSoon: number;
  scholarshipSpend: number;
  applicationPoolUpcoming: number;
  upcomingSemesterLabel: string;
  enrollmentBySchool: ReturnType<typeof groupCount>;
  cgpaAverage: number;
  schoolCountApplicants: SchoolCountApplicantsDatum[];
  tuitionRevenue: TuitionRevenuePoint[];
}

export async function getOverviewSummary(): Promise<OverviewSummary> {
  await simulateDelay();
  const {
    students,
    faculty,
    staff,
    dcCases,
    ePortalCases,
    grants,
    scholarshipRecipients,
    applications,
    schoolCountApplicants,
    tuitionRevenue,
  } = getCanonicalData();

  const activeStudents = students.filter((s) => s.enrollmentStatus === "Active");
  const openDCCases = dcCases.filter((c) => c.status === "Pending");
  const escalatedCases = ePortalCases.filter((c) => getEPortalStatus(c.dateRaised) === "Escalated");
  const endingSoonGrants = grants.filter((g) => isGrantEndingSoon(g));

  const scholarshipSpend = scholarshipRecipients.reduce((sum, r) => sum + r.amount, 0);

  const cgpaAverage =
    activeStudents.length > 0
      ? activeStudents.reduce((sum, s) => sum + s.cgpa, 0) / activeStudents.length
      : 0;

  const applicationPoolUpcoming = applications.filter(
    (a) => a.year === CURRENT_SEMESTER_PERIOD.year && a.semester === CURRENT_SEMESTER_PERIOD.semester,
  ).length;

  return {
    totalEnrolled: activeStudents.length,
    facultyHeadcount: faculty.length,
    staffHeadcount: staff.length,
    openDCCases: openDCCases.length,
    escalatedEPortalCases: escalatedCases.length,
    grantsEndingSoon: endingSoonGrants.length,
    scholarshipSpend,
    applicationPoolUpcoming,
    upcomingSemesterLabel: CURRENT_SEMESTER_PERIOD.label,
    enrollmentBySchool: groupCount(activeStudents, (s) => s.schoolId, resolveSchoolShort),
    cgpaAverage,
    schoolCountApplicants,
    tuitionRevenue,
  };
}
