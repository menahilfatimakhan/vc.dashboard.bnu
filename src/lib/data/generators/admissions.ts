import type { SeededRandom } from "../prng";
import type { Application, School, Student } from "../types";

const YEARS = [2022, 2023, 2024, 2025, 2026];
const CURRENT_YEAR = 2026;

export function generateAdmissions(
  rng: SeededRandom,
  schools: School[],
  students: Student[],
): Application[] {
  const applications: Application[] = [];
  let counter = 1;

  // Average cohort size per programme, derived from the already-generated roster,
  // so application volume roughly tracks how large each programme actually is.
  const enrollCountByProgramme = new Map<string, number>();
  for (const student of students) {
    enrollCountByProgramme.set(
      student.programmeId,
      (enrollCountByProgramme.get(student.programmeId) ?? 0) + 1,
    );
  }

  for (const school of schools) {
    for (const programme of school.programmes) {
      const perYearBase = Math.max(8, (enrollCountByProgramme.get(programme.id) ?? 20) / YEARS.length);
      // Admit rate is fixed per programme (not per year) so the funnel narrows
      // consistently rather than jittering year to year.
      const admitRate = rng.float(0.55, 0.72);

      for (const year of YEARS) {
        const volumeFactor = rng.float(1.6, 2.3);
        const semesterVariance = rng.float(0.9, 1.1);
        const count = Math.round(perYearBase * volumeFactor * semesterVariance);

        for (let i = 0; i < count; i++) {
          const semester = rng.bool(0.85) ? "Fall" : "Spring";

          // The current cycle (Fall/Spring 2026) is still mid-admissions per BNU's
          // published schedule (tests/interviews late July-Aug, merit lists Aug 8) —
          // no decisions have been made yet, so every current-year application sits
          // at "Received." Past years are fully resolved.
          const status =
            year === CURRENT_YEAR ? "Received" : rng.bool(admitRate) ? "Admitted" : "Rejected";

          applications.push({
            id: `BNU-ADM-${String(counter).padStart(6, "0")}`,
            schoolId: school.id,
            programmeId: programme.id,
            semester,
            year,
            status,
          });
          counter++;
        }
      }
    }
  }

  return applications;
}
