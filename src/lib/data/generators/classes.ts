import type { SeededRandom } from "../prng";
import type { ClassSession, School } from "../types";
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

export function generateClasses(rng: SeededRandom, schools: School[]): ClassSession[] {
  const sessions: ClassSession[] = [];
  let counter = 1;
  const now = new Date(Date.UTC(CURRENT_YEAR, CURRENT_MONTH - 1, CURRENT_DAY));

  for (const school of schools) {
    const attendanceRate = ATTENDANCE_RATE_BY_SCHOOL[school.id] ?? 0.8;
    const sessionsPerWeek = Math.round(18 + (SCHOOL_ENROLLMENT_WEIGHTS[school.id] ?? 1) * 14);

    for (let week = 0; week < WEEKS_WINDOW; week++) {
      for (let s = 0; s < sessionsPerWeek; s++) {
        const daysAgo = week * 7 + rng.int(0, 6);
        const scheduled = new Date(now);
        scheduled.setUTCDate(scheduled.getUTCDate() - daysAgo);
        scheduled.setUTCHours(rng.int(8, 17), rng.pick([0, 15, 30, 45]), 0, 0);

        sessions.push({
          id: `BNU-CLS-${String(counter).padStart(6, "0")}`,
          schoolId: school.id,
          scheduledAt: scheduled.toISOString(),
          attendanceStatus: rng.bool(attendanceRate) ? "Attended" : "Not Attended",
        });
        counter++;
      }
    }
  }

  return sessions;
}
