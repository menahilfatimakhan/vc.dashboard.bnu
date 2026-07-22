import type { Semester } from "./types";

// Canonical semester periods spanning the generated data's year range (2022-2026).
// Chronological order within a year: Spring (Jan-Jun) before Fall (Aug-Dec).
export interface SemesterPeriod {
  value: string; // e.g. "2024-Spring"
  label: string; // e.g. "Spring 2024"
  year: number;
  semester: Semester;
  order: number;
}

const YEARS = [2022, 2023, 2024, 2025, 2026];

export const SEMESTER_PERIODS: SemesterPeriod[] = YEARS.flatMap((year, yearIndex) =>
  (["Spring", "Fall"] as Semester[]).map((semester, semesterIndex) => ({
    value: `${year}-${semester}`,
    label: `${semester} ${year}`,
    year,
    semester,
    order: yearIndex * 2 + semesterIndex,
  })),
);

export const CURRENT_SEMESTER_PERIOD = SEMESTER_PERIODS.find((p) => p.value === "2026-Fall")!;

export function periodOrder(value: string): number | undefined {
  return SEMESTER_PERIODS.find((p) => p.value === value)?.order;
}

export function orderOf(year: number, semester: Semester): number {
  const yearIndex = YEARS.indexOf(year);
  const semesterIndex = semester === "Spring" ? 0 : 1;
  return (yearIndex < 0 ? 0 : yearIndex) * 2 + semesterIndex;
}

/** Derive a semester from a calendar date — Jan-Jun = Spring, Jul-Dec = Fall. */
export function semesterOfDate(date: Date): { year: number; semester: Semester } {
  const month = date.getMonth(); // 0-indexed
  return month < 6 ? { year: date.getFullYear(), semester: "Spring" } : { year: date.getFullYear(), semester: "Fall" };
}

/**
 * Checks whether (year, semester) falls within [from, to] (inclusive), where from/to
 * are SEMESTER_PERIODS values. Either bound may be omitted (open-ended).
 */
export function inSemesterPeriodRange(
  year: number,
  semester: Semester,
  from?: string,
  to?: string,
): boolean {
  const order = orderOf(year, semester);
  if (from) {
    const fromOrder = periodOrder(from);
    if (fromOrder !== undefined && order < fromOrder) return false;
  }
  if (to) {
    const toOrder = periodOrder(to);
    if (toOrder !== undefined && order > toOrder) return false;
  }
  return true;
}

export function resolveSemesterPeriodLabel(value: string | undefined): string {
  if (!value) return "";
  return SEMESTER_PERIODS.find((p) => p.value === value)?.label ?? value;
}

export const SEMESTER_PERIOD_OPTIONS = SEMESTER_PERIODS.map((p) => ({ value: p.value, label: p.label }));
