import type { SeededRandom } from "../prng";
import type { EPortalCase } from "../types";

const CATEGORIES = [
  "Fee Payment Issue",
  "Transcript Request",
  "Course Registration",
  "Hostel Complaint",
  "IT / Portal Access",
  "Certificate Request",
  "Grade Dispute",
  "Leave Application",
];

const CASE_COUNT = 214;
const MAX_DAYS_OPEN = 26;
const CURRENT_YEAR = 2026;
const CURRENT_MONTH = 7;
const CURRENT_DAY = 21;

export function generateEPortalCases(rng: SeededRandom): EPortalCase[] {
  const cases: EPortalCase[] = [];
  const now = new Date(Date.UTC(CURRENT_YEAR, CURRENT_MONTH - 1, CURRENT_DAY));

  for (let i = 0; i < CASE_COUNT; i++) {
    // Power-curve bias toward recently-raised cases, so most sit under the 7-day
    // escalation threshold while a believable minority run older (Escalated).
    const daysOpen = Math.floor(Math.pow(rng.float(0, 1), 1.8) * MAX_DAYS_OPEN);
    const dateRaised = new Date(now);
    dateRaised.setUTCDate(dateRaised.getUTCDate() - daysOpen);

    cases.push({
      id: `BNU-EP-${String(i + 1).padStart(4, "0")}`,
      dateRaised: dateRaised.toISOString().slice(0, 10),
      category: rng.pick(CATEGORIES),
    });
  }

  return cases;
}
