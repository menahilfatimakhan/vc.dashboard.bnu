import type { SeededRandom } from "../prng";
import type { Department, Grant, School } from "../types";

const GRANT_COUNT = 74;
const CURRENT_YEAR = 2026;
const CURRENT_MONTH = 7;
const CURRENT_DAY = 21;

const TOPIC_TEMPLATES = [
  "Community-Centered Research on {field}",
  "Innovation Grant for {field} Studies",
  "Applied Research in {field}",
  "Capacity Building Initiative in {field}",
  "Cross-Disciplinary Study of {field}",
  "Policy Research Grant on {field}",
  "Field Study Programme in {field}",
];

const FIELDS = [
  "Sustainable Design", "Digital Media Ethics", "Urban Housing", "Inclusive Education",
  "Applied AI", "Clinical Psychology", "Textile Innovation", "Public Policy",
  "Political Economy", "Interior Ecology", "Software Reliability", "Consumer Behaviour",
  "Journalism Practice", "Architectural Heritage", "Data Analytics", "Teacher Training",
];

function randomDate(rng: SeededRandom, monthsFromNow: number): string {
  const d = new Date(Date.UTC(CURRENT_YEAR, CURRENT_MONTH - 1, CURRENT_DAY));
  d.setUTCMonth(d.getUTCMonth() + monthsFromNow);
  d.setUTCDate(rng.int(1, 28));
  return d.toISOString().slice(0, 10);
}

export function generateGrants(
  rng: SeededRandom,
  schools: School[],
  departments: Department[],
): Grant[] {
  const grants: Grant[] = [];

  for (let i = 0; i < GRANT_COUNT; i++) {
    const ownerType = rng.bool(0.7) ? "school" : "department";
    const ownerId =
      ownerType === "school" ? rng.pick(schools).id : rng.pick(departments).id;

    const title = rng.pick(TOPIC_TEMPLATES).replace("{field}", rng.pick(FIELDS));
    const status: "Completed" | "Underway" = rng.bool(0.42) ? "Completed" : "Underway";

    let startDate: string;
    let endDate: string;

    if (status === "Completed") {
      // Ended sometime in the past 3 years.
      const endMonthsAgo = -rng.int(1, 36);
      endDate = randomDate(rng, endMonthsAgo);
      startDate = randomDate(rng, endMonthsAgo - rng.int(12, 30));
    } else {
      // Underway: spread end dates across the next ~2.5 years so a believable
      // minority (not all) fall within the 6-month flagging window.
      const endMonthsAhead = rng.int(1, 30);
      endDate = randomDate(rng, endMonthsAhead);
      startDate = randomDate(rng, -rng.int(3, 24));
    }

    grants.push({
      id: `BNU-GRT-${String(i + 1).padStart(3, "0")}`,
      title,
      ownerType,
      ownerId,
      status,
      startDate,
      endDate,
    });
  }

  return grants;
}
