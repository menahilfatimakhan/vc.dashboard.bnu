import type { ScholarshipType } from "../types";

export const SCHOLARSHIP_TYPES: ScholarshipType[] = [
  {
    id: "sch-type-need",
    name: "Need-Based Scholarship",
    awardingCriteria: "Demonstrated financial need, verified via household income documentation",
    amountPerAward: 185000,
  },
  {
    id: "sch-type-merit",
    name: "Merit Scholarship",
    awardingCriteria: "CGPA of 3.5 or above in the preceding semester",
    amountPerAward: 120000,
  },
  {
    id: "sch-type-need-merit",
    name: "Need-cum-Merit Scholarship",
    awardingCriteria: "Combined assessment of financial need and academic standing",
    amountPerAward: 150000,
  },
  {
    id: "sch-type-sports",
    name: "Sports Scholarship",
    awardingCriteria: "Representation of BNU at inter-university or national-level sporting events",
    amountPerAward: 95000,
  },
];

export function resolveScholarshipType(id: string | undefined): string {
  if (!id) return "";
  return SCHOLARSHIP_TYPES.find((s) => s.id === id)?.name ?? id;
}
