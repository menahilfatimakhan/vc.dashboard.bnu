export type StatusTone = "success" | "warning" | "danger" | "neutral";

const SUCCESS_WORDS = ["active", "resolved", "admitted", "attended", "completed", "won"];
const DANGER_WORDS = ["struck off", "rejected", "escalated"];
const WARNING_WORDS = ["pending", "frozen", "dormant", "not attended", "applied"];

/**
 * Maps an existing status string (unchanged wording) to a display tone for
 * pill styling. Keyword-based rather than per-module, so it generalizes
 * across every status/attendance/enrollment vocabulary in the app without
 * hard-coding a mapping per module.
 */
export function statusTone(status: string): StatusTone {
  const s = status.toLowerCase();
  if (SUCCESS_WORDS.some((w) => s.includes(w))) return "success";
  if (DANGER_WORDS.some((w) => s.includes(w))) return "danger";
  if (WARNING_WORDS.some((w) => s.includes(w))) return "warning";
  return "neutral";
}
