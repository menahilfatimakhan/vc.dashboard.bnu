import type { SeededRandom } from "../prng";
import type { Department, Staff } from "../types";
import { DESIGNATIONS_BY_DEPARTMENT } from "../catalog/departments";
import { generateGender, generatePersonName } from "./names";

const TOTAL_STAFF = 231;

// Larger administrative footprint in these departments.
const DEPARTMENT_WEIGHTS: Record<string, number> = {
  "dept-vcs": 0.6,
  "dept-registrar": 1.4,
  "dept-admissions": 1.1,
  "dept-accounts": 1.3,
  "dept-hr": 0.9,
  "dept-qac": 0.5,
  "dept-dsaer": 1.0,
  "dept-orip": 0.8,
  "dept-cdc": 0.6,
  "dept-itrc": 1.2,
  "dept-library": 0.9,
  "dept-counseling": 0.6,
};

export function generateStaffRoster(rng: SeededRandom, departments: Department[]): Staff[] {
  const staff: Staff[] = [];
  let counter = 1;

  const departmentWeights = departments.map((d) => ({
    item: d,
    weight: DEPARTMENT_WEIGHTS[d.id] ?? 1,
  }));

  for (let i = 0; i < TOTAL_STAFF; i++) {
    const department = rng.weightedPick(departmentWeights);
    const gender = generateGender(rng);
    const name = generatePersonName(rng, gender);
    const designations = DESIGNATIONS_BY_DEPARTMENT[department.id] ?? ["Staff Officer"];
    const designation = rng.pick(designations);

    staff.push({
      id: `BNU-STF-${String(counter).padStart(4, "0")}`,
      name,
      gender,
      departmentId: department.id,
      designation,
    });
    counter++;
  }

  return staff;
}
