import { daysBetween, monthsBetween, parseISODate } from "../utils/date";
import type { Grant } from "../data/types";

// Single source of truth for the three SRS business rules (BR-PERF-01, BR-EP-01,
// BR-GRT-01). Nothing downstream stores these as precomputed fields — every value
// is derived here, at call time, from the underlying date/number.

export type CgpaTier = "Unclassified" | "Tier 1" | "Tier 2" | "Tier 3";

/**
 * BR-PERF-01, relabeled per product direction: Tier 1 (top): 3.50-4.00 ·
 * Tier 2: 3.00-3.49 · Tier 3: 2.00-2.99. The SRS defines no bucket below 2.00 —
 * that range maps to "Unclassified" (a documented assumption, see root CLAUDE.md).
 * Note the numbering inverts the SRS's own "Division 1/2/3" order (which ran
 * low-to-high) — Tier 1 is intentionally the top band here.
 */
export function getCgpaTier(cgpa: number): CgpaTier {
  if (cgpa >= 3.5) return "Tier 1";
  if (cgpa >= 3.0) return "Tier 2";
  if (cgpa >= 2.0) return "Tier 3";
  return "Unclassified";
}

export type EPortalStatus = "In-Process" | "Escalated";

/** BR-EP-01: unresolved for more than 7 days -> auto-escalated. */
export function getDaysOpen(dateRaised: string, now: Date = new Date()): number {
  return daysBetween(parseISODate(dateRaised), now);
}

export function getEPortalStatus(dateRaised: string, now: Date = new Date()): EPortalStatus {
  return getDaysOpen(dateRaised, now) > 7 ? "Escalated" : "In-Process";
}

/** BR-GRT-01: an Underway grant is flagged when its end date falls within 6 months of now. */
export function isGrantEndingSoon(grant: Grant, now: Date = new Date()): boolean {
  if (grant.status !== "Underway") return false;
  const months = monthsBetween(now, parseISODate(grant.endDate));
  return months >= 0 && months <= 6;
}
