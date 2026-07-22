import type { SeededRandom } from "../prng";
import type { School, Student } from "../types";
import { SCHOOL_ENROLLMENT_WEIGHTS } from "../catalog/schools";
import { generateGender, generatePersonName } from "./names";

const TOTAL_STUDENTS = 3624;
const CURRENT_YEAR = 2026;
const ENROLLMENT_YEAR_SPAN = 5; // 2022-2026

function clampCgpa(value: number): number {
  return Math.max(0, Math.min(4, Number(value.toFixed(2))));
}

export function generateStudentRoster(rng: SeededRandom, schools: School[]): Student[] {
  const students: Student[] = [];
  let counter = 1;

  const schoolWeights = schools.map((s) => ({
    item: s,
    weight: SCHOOL_ENROLLMENT_WEIGHTS[s.id] ?? 1,
  }));

  for (let i = 0; i < TOTAL_STUDENTS; i++) {
    const school = rng.weightedPick(schoolWeights);

    const programmeWeights = school.programmes.map((p) => ({
      item: p,
      weight: p.level === "undergraduate" ? 3 : 1,
    }));
    const programme = rng.weightedPick(programmeWeights);

    const gender = generateGender(rng);
    const name = generatePersonName(rng, gender);
    const semester = rng.bool(0.82) ? "Fall" : "Spring";
    const enrollmentYear = CURRENT_YEAR - rng.int(0, ENROLLMENT_YEAR_SPAN - 1);

    const statusRoll = rng.float(0, 1);
    const enrollmentStatus =
      statusRoll < 0.85 ? "Active" : statusRoll < 0.92 ? "Frozen" : statusRoll < 0.97 ? "Dormant" : "Struck Off";

    const cgpa = clampCgpa(rng.gaussian(3.1, 0.35));

    students.push({
      id: `BNU-ENR-${String(counter).padStart(5, "0")}`,
      name,
      gender,
      schoolId: school.id,
      programmeId: programme.id,
      semester,
      enrollmentYear,
      enrollmentStatus,
      cgpa,
    });
    counter++;
  }

  return students;
}
