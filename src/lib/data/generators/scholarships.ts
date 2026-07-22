import type { SeededRandom } from "../prng";
import type { ScholarshipRecipient, ScholarshipType, Semester, Student } from "../types";

const RECIPIENT_RATE = 0.1; // ~10% of active students hold a scholarship, per year
const YEARS = [2022, 2023, 2024, 2025, 2026];

export function generateScholarships(
  rng: SeededRandom,
  students: Student[],
  scholarshipTypes: ScholarshipType[],
): ScholarshipRecipient[] {
  const active = students.filter((s) => s.enrollmentStatus !== "Struck Off");
  const recipients: ScholarshipRecipient[] = [];
  let counter = 1;

  for (const year of YEARS) {
    const recipientCount = Math.round(active.length * RECIPIENT_RATE * rng.float(0.85, 1.15));
    const yearRecipients = rng.shuffle(active).slice(0, recipientCount);

    for (const student of yearRecipients) {
      const type = rng.pick(scholarshipTypes);
      const awardSemester: Semester = rng.bool(0.82) ? "Fall" : "Spring";
      const amount = Math.round((type.amountPerAward * rng.float(0.85, 1.15)) / 5000) * 5000;

      recipients.push({
        id: `BNU-SCH-${String(counter).padStart(4, "0")}`,
        studentId: student.id,
        studentName: student.name,
        schoolId: student.schoolId,
        programmeId: student.programmeId,
        scholarshipTypeId: type.id,
        awardYear: year,
        awardSemester,
        amount,
      });
      counter++;
    }
  }

  return recipients;
}
