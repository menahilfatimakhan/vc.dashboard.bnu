import type { SeededRandom } from "../prng";
import type { ScholarshipRecipient, ScholarshipType, Student } from "../types";

const RECIPIENT_RATE = 0.1; // ~10% of active students hold a scholarship
const CURRENT_YEAR = 2026;

export function generateScholarships(
  rng: SeededRandom,
  students: Student[],
  scholarshipTypes: ScholarshipType[],
): ScholarshipRecipient[] {
  const active = students.filter((s) => s.enrollmentStatus === "Active");
  const recipientCount = Math.round(active.length * RECIPIENT_RATE);
  const recipients = rng.shuffle(active).slice(0, recipientCount);

  return recipients.map((student, i) => ({
    id: `BNU-SCH-${String(i + 1).padStart(4, "0")}`,
    studentId: student.id,
    studentName: student.name,
    schoolId: student.schoolId,
    programmeId: student.programmeId,
    scholarshipTypeId: rng.pick(scholarshipTypes).id,
    awardYear: CURRENT_YEAR - rng.int(0, 1),
  }));
}
