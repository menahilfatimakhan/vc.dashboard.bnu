import { getCanonicalData } from "../data/store";
import { resolveSchoolShort } from "../data/catalog/schools";
import { getEPortalStatus, isGrantEndingSoon } from "./businessRules";
import { groupCount } from "./groupCount";
import { simulateDelay } from "./simulateDelay";

export interface OverviewSummary {
  totalEnrolled: number;
  facultyHeadcount: number;
  staffHeadcount: number;
  openDCCases: number;
  escalatedEPortalCases: number;
  grantsEndingSoon: number;
  scholarshipSpend: number;
  enrollmentBySchool: ReturnType<typeof groupCount>;
  cgpaAverage: number;
  activityFeed: { id: string; title: string; detail: string; kind: "critical" | "warning" | "good" }[];
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
    scholarshipTypes,
  } = getCanonicalData();

  const activeStudents = students.filter((s) => s.enrollmentStatus === "Active");
  const openDCCases = dcCases.filter((c) => c.status === "Pending");
  const escalatedCases = ePortalCases.filter((c) => getEPortalStatus(c.dateRaised) === "Escalated");
  const endingSoonGrants = grants.filter((g) => isGrantEndingSoon(g));

  const scholarshipSpend = scholarshipRecipients.reduce((sum, r) => {
    const type = scholarshipTypes.find((t) => t.id === r.scholarshipTypeId);
    return sum + (type?.amountPerAward ?? 0);
  }, 0);

  const cgpaAverage =
    activeStudents.length > 0
      ? activeStudents.reduce((sum, s) => sum + s.cgpa, 0) / activeStudents.length
      : 0;

  const activityFeed = [
    ...endingSoonGrants.slice(0, 2).map((g) => ({
      id: g.id,
      title: `Grant ending soon`,
      detail: `${g.title} (ends ${g.endDate})`,
      kind: "warning" as const,
    })),
    ...escalatedCases.slice(0, 2).map((c) => ({
      id: c.id,
      title: "E-Portal case escalated",
      detail: `${c.category} — raised ${c.dateRaised}`,
      kind: "critical" as const,
    })),
    ...openDCCases.slice(0, 2).map((c) => ({
      id: c.id,
      title: "DC case pending",
      detail: `${c.violationType} — ${c.studentName}`,
      kind: "warning" as const,
    })),
  ];

  return {
    totalEnrolled: activeStudents.length,
    facultyHeadcount: faculty.length,
    staffHeadcount: staff.length,
    openDCCases: openDCCases.length,
    escalatedEPortalCases: escalatedCases.length,
    grantsEndingSoon: endingSoonGrants.length,
    scholarshipSpend,
    enrollmentBySchool: groupCount(activeStudents, (s) => s.schoolId, resolveSchoolShort),
    cgpaAverage,
    activityFeed,
  };
}
