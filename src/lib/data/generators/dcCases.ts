import type { SeededRandom } from "../prng";
import type { DCCase, Student } from "../types";

const VIOLATION_TYPES = [
  "Academic Dishonesty",
  "Harassment Complaint",
  "Property Damage",
  "Unauthorized Absence",
  "Code of Conduct Violation",
  "Substance Policy Violation",
  "Disruptive Behavior",
  "Plagiarism",
];

const CASE_RATE = 0.05; // ~5% of the roster generates a case
const CURRENT_YEAR = 2026;
const CURRENT_MONTH = 7; // July
const CURRENT_DAY = 21;

function randomPastDate(rng: SeededRandom, maxDaysAgo: number): string {
  const daysAgo = rng.int(0, maxDaysAgo);
  const d = new Date(Date.UTC(CURRENT_YEAR, CURRENT_MONTH - 1, CURRENT_DAY));
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

export function generateDCCases(rng: SeededRandom, students: Student[]): DCCase[] {
  const active = students.filter((s) => s.enrollmentStatus !== "Withdrawn");
  const caseCount = Math.round(active.length * CASE_RATE);
  const subjects = rng.shuffle(active).slice(0, caseCount);

  return subjects.map((student, i) => {
    const status = rng.bool(0.3) ? "Pending" : "Resolved";
    // Pending cases skew recent; resolved cases spread further back.
    const dateRaised = randomPastDate(rng, status === "Pending" ? 45 : 540);

    return {
      id: `BNU-DC-${String(i + 1).padStart(4, "0")}`,
      studentId: student.id,
      studentName: student.name,
      schoolId: student.schoolId,
      programmeId: student.programmeId,
      dateRaised,
      violationType: rng.pick(VIOLATION_TYPES),
      status,
    };
  });
}
