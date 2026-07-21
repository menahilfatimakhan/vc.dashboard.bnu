import type { SeededRandom } from "../prng";
import type { School, Faculty } from "../types";
import { SCHOOL_ENROLLMENT_WEIGHTS } from "../catalog/schools";
import { generateGender, generatePersonName } from "./names";

const TOTAL_FACULTY = 287;

// Smaller/newer schools lean more on Visiting faculty than Full-Time.
const VISITING_WEIGHT_BY_SCHOOL: Record<string, number> = {
  "sch-mdsvad": 0.35,
  "sch-rhsa": 0.42,
  "sch-slass": 0.28,
  "sch-smc": 0.33,
  "sch-scit": 0.22,
  "sch-se": 0.3,
  "sch-sms": 0.25,
  "sch-ip": 0.38,
};

export function generateFacultyRoster(rng: SeededRandom, schools: School[]): Faculty[] {
  const faculty: Faculty[] = [];
  let counter = 1;

  // Roughly proportional to school size, but flatter than students (every school
  // needs a baseline teaching staff regardless of enrollment) — blend the
  // enrollment weight toward 1 via a square root.
  const schoolWeights = schools.map((s) => ({
    item: s,
    weight: Math.sqrt(SCHOOL_ENROLLMENT_WEIGHTS[s.id] ?? 1),
  }));

  for (let i = 0; i < TOTAL_FACULTY; i++) {
    const school = rng.weightedPick(schoolWeights);
    const gender = generateGender(rng);
    const name = generatePersonName(rng, gender);
    const visitingRate = VISITING_WEIGHT_BY_SCHOOL[school.id] ?? 0.3;
    const employmentType = rng.bool(visitingRate) ? "Visiting" : "Full-Time";

    faculty.push({
      id: `BNU-FAC-${String(counter).padStart(4, "0")}`,
      name,
      gender,
      schoolId: school.id,
      employmentType,
    });
    counter++;
  }

  return faculty;
}
