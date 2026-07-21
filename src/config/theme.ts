// BNU color tokens for chart code (Recharts needs raw hex, not Tailwind classes).
// Kept in sync by hand with src/app/globals.css's @theme block — see that file's
// comment. All categorical/ordinal/status values below were run through the
// dataviz skill's validate_palette.js and pass every check (see build notes).

export const BRAND = {
  steel: "#357694",
  navy: "#204b66",
} as const;

export const INK = {
  primary: "#121212",
  secondary: "#5b5b5b",
  muted: "#8a8a8a",
  hairline: "#e5e5e5",
  surface: "#ffffff",
  page: "#f7f8f9",
} as const;

// Fixed hue order — assign by position, never cycle/reassign per filter state.
// The literal brand blue (#357694) measures below the categorical chroma floor
// (OKLCH C=0.081 < 0.10 floor), so series 1 uses a higher-chroma step of the same
// blue family instead; validated via validate_palette.js (all 7 checks PASS,
// contrast WARN on 3 mid-lightness hues — mitigated by the DataTable every module
// page ships beneath its charts, serving as the required relief/table view).
export const CATEGORICAL = [
  "#127b9e", // blue (BNU family)
  "#eb6834", // orange
  "#1baf7a", // green
  "#eda100", // amber
  "#e87ba4", // pink
  "#008300", // dark green
  "#4a3aa7", // purple
] as const;

// Reserved for state; never reused as a categorical series.
export const STATUS = {
  critical: "#d2232a", // BNU's own red
  good: "#0ca30c",
  warning: "#fab219",
} as const;

// Ordinal ramp (light -> dark, single hue) for the Admissions funnel — order
// carries meaning (Received -> Admitted -> Enrolled), validated with --ordinal.
export const ORDINAL_FUNNEL = ["#7fb0c4", BRAND.steel, BRAND.navy] as const;

// Gauge/meter: fill carries the value, track is a lighter step of the same ramp.
export const METER = {
  fill: BRAND.steel,
  track: "#e1e0d9",
} as const;
