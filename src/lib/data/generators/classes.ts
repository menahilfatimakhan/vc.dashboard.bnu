import type { SeededRandom } from "../prng";
import type { ClassSession, School, Session } from "../types";
import { SCHOOL_ENROLLMENT_WEIGHTS } from "../catalog/schools";

const WEEKS_WINDOW = 14; // rolling ~14-week term window
const CURRENT_YEAR = 2026;
const CURRENT_MONTH = 7;
const CURRENT_DAY = 21;

// Per-school baseline attendance rate, kept in the 70-90% band per the brief,
// varied per school so the attendance-rate bar chart isn't flat.
const ATTENDANCE_RATE_BY_SCHOOL: Record<string, number> = {
  "sch-mdsvad": 0.83,
  "sch-rhsa": 0.87,
  "sch-slass": 0.78,
  "sch-smc": 0.8,
  "sch-scit": 0.75,
  "sch-se": 0.85,
  "sch-sms": 0.79,
  "sch-ip": 0.82,
};

const COURSE_LABELS = [
  "Core Lecture", "Studio Session", "Lab Session", "Seminar", "Tutorial",
  "Workshop", "Practicum", "Section A", "Section B", "Section C",
];

export function generateSessions(rng: SeededRandom, schools: School[]): Session[] {
  const sessions: Session[] = [];
  let counter = 1;

  for (const school of schools) {
    const sessionCount = Math.round(4 + (SCHOOL_ENROLLMENT_WEIGHTS[school.id] ?? 1) * 3);
    for (let i = 0; i < sessionCount; i++) {
      sessions.push({
        id: `BNU-SES-${String(counter).padStart(4, "0")}`,
        schoolId: school.id,
        name: `${school.shortName} — ${rng.pick(COURSE_LABELS)} ${i + 1}`,
      });
      counter++;
    }
  }

  return sessions;
}

export function generateClasses(rng: SeededRandom, schools: School[], sessions: Session[]): ClassSession[] {
  const classSessions: ClassSession[] = [];
  let counter = 1;
  const now = new Date(Date.UTC(CURRENT_YEAR, CURRENT_MONTH - 1, CURRENT_DAY));

  for (const school of schools) {
    const attendanceRate = ATTENDANCE_RATE_BY_SCHOOL[school.id] ?? 0.8;
    const schoolSessions = sessions.filter((s) => s.schoolId === school.id);

    for (const session of schoolSessions) {
      for (let week = 0; week < WEEKS_WINDOW; week++) {
        const daysAgo = week * 7 + rng.int(0, 6);
        const scheduled = new Date(now);
        scheduled.setUTCDate(scheduled.getUTCDate() - daysAgo);
        scheduled.setUTCHours(rng.int(8, 17), rng.pick([0, 15, 30, 45]), 0, 0);

        const month = scheduled.getUTCMonth();
        const semester = month < 6 ? "Spring" : "Fall";

        classSessions.push({
          id: `BNU-CLS-${String(counter).padStart(6, "0")}`,
          schoolId: school.id,
          sessionId: session.id,
          scheduledAt: scheduled.toISOString(),
          year: scheduled.getUTCFullYear(),
          semester,
          attendanceStatus: rng.bool(attendanceRate) ? "Attended" : "Not Attended",
        });
        counter++;
      }
    }
  }

  return classSessions;
}
