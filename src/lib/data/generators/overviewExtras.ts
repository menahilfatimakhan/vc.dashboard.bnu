import type { SeededRandom } from "../prng";
import type { SchoolCountApplicantsDatum, TuitionRevenuePoint } from "../types";
import { SEMESTER_PERIODS } from "../semesters";

// How many distinct schools a single applicant applied to (1-8) — most apply to
// just one, a rapidly shrinking few apply to several. Not tied to individual
// Application records (which don't model applicant identity); this is a
// standalone illustrative aggregate for the Overview combo chart.
export function generateSchoolCountApplicants(rng: SeededRandom): SchoolCountApplicantsDatum[] {
  const DECAY = 0.42;
  const buckets = Array.from({ length: 8 }, (_, i) => i + 1);

  function distribute(totalApplicants: number): number[] {
    const weights = buckets.map((k) => Math.pow(DECAY, k - 1));
    const weightSum = weights.reduce((a, b) => a + b, 0);
    return weights.map((w) => Math.round((w / weightSum) * totalApplicants));
  }

  const thisYearTotal = 2860;
  const lastYearTotal = Math.round(thisYearTotal * rng.float(0.88, 0.96)); // modest YoY growth

  const thisYear = distribute(thisYearTotal);
  const lastYear = distribute(lastYearTotal);

  return buckets.map((k, i) => ({
    schoolsAppliedTo: k,
    thisYear: thisYear[i],
    lastYear: lastYear[i],
  }));
}

// Illustrative tuition-revenue trend only — a one-off Overview exception to the
// Finance out-of-scope guardrail (see root CLAUDE.md). No other financial data
// exists anywhere in the app.
export function generateTuitionRevenue(rng: SeededRandom): TuitionRevenuePoint[] {
  const BASE_REVENUE_CRORE = 42; // starting point, 2022 Spring, in PKR crore
  const GROWTH_PER_PERIOD = 0.028; // gentle upward trend period over period

  return SEMESTER_PERIODS.map((period) => {
    const trend = BASE_REVENUE_CRORE * Math.pow(1 + GROWTH_PER_PERIOD, period.order);
    const seasonal = period.semester === "Fall" ? 1.08 : 0.95; // Fall intake is larger
    const noise = rng.float(0.96, 1.04);
    const revenue = Math.round(trend * seasonal * noise * 100) / 100;

    return { period: period.value, label: period.label, revenue };
  });
}
