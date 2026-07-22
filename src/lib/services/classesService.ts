import { getCanonicalData } from "../data/store";
import type { ClassSession, Session } from "../data/types";
import { resolveSchool, resolveSchoolShort, SCHOOLS } from "../data/catalog/schools";
import { simulateDelay } from "./simulateDelay";
import { inSemesterPeriodRange } from "../data/semesters";

export interface ClassesFilters {
  schoolId?: string;
  sessionId?: string;
  semesterFrom?: string;
  semesterTo?: string;
}

function matches(filters: ClassesFilters) {
  return (c: ClassSession) =>
    (!filters.schoolId || c.schoolId === filters.schoolId) &&
    (!filters.sessionId || c.sessionId === filters.sessionId) &&
    inSemesterPeriodRange(c.year, c.semester, filters.semesterFrom, filters.semesterTo);
}

export interface ClassesSummary {
  totalScheduled: number;
  attended: number;
  notAttended: number;
  attendanceRate: number;
  bySchool: { key: string; label: string; scheduled: number; attended: number; attendanceRate: number }[];
}

export async function getClassesSummary(filters: ClassesFilters): Promise<ClassesSummary> {
  await simulateDelay();
  const { classSessions } = getCanonicalData();
  const rows = classSessions.filter(matches(filters));
  const attended = rows.filter((c) => c.attendanceStatus === "Attended").length;

  const relevantSchools = filters.schoolId ? SCHOOLS.filter((s) => s.id === filters.schoolId) : SCHOOLS;
  const bySchool = relevantSchools.map((s) => {
    const schoolRows = rows.filter((c) => c.schoolId === s.id);
    const schoolAttended = schoolRows.filter((c) => c.attendanceStatus === "Attended").length;
    return {
      key: s.id,
      label: resolveSchoolShort(s.id),
      scheduled: schoolRows.length,
      attended: schoolAttended,
      attendanceRate: schoolRows.length > 0 ? (schoolAttended / schoolRows.length) * 100 : 0,
    };
  });

  return {
    totalScheduled: rows.length,
    attended,
    notAttended: rows.length - attended,
    attendanceRate: rows.length > 0 ? (attended / rows.length) * 100 : 0,
    bySchool,
  };
}

export interface SessionSummary {
  id: string;
  name: string;
  schoolName: string;
  scheduled: number;
  attended: number;
  attendanceRate: number;
}

/** Session -> Classes drill-down: one row per Session, aggregating its ClassSession occurrences. */
export async function getSessions(filters: ClassesFilters): Promise<SessionSummary[]> {
  await simulateDelay();
  const { sessions, classSessions } = getCanonicalData();
  const relevantSessions = filters.schoolId ? sessions.filter((s) => s.schoolId === filters.schoolId) : sessions;

  return relevantSessions
    .map((session: Session) => {
      const rows = classSessions
        .filter((c) => c.sessionId === session.id)
        .filter(matches({ ...filters, sessionId: undefined }));
      const attended = rows.filter((c) => c.attendanceStatus === "Attended").length;
      return {
        id: session.id,
        name: session.name,
        schoolName: resolveSchool(session.schoolId),
        scheduled: rows.length,
        attended,
        attendanceRate: rows.length > 0 ? (attended / rows.length) * 100 : 0,
      };
    })
    .filter((s) => s.scheduled > 0);
}

export async function getSessionClasses(sessionId: string): Promise<ClassSession[]> {
  await simulateDelay();
  const { classSessions } = getCanonicalData();
  return classSessions
    .filter((c) => c.sessionId === sessionId)
    .sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt));
}

export function resolveSessionName(id: string | undefined): string {
  if (!id) return "BNU";
  return getCanonicalData().sessions.find((s) => s.id === id)?.name ?? id;
}
