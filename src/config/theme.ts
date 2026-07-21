// Design tokens for chart code (Recharts needs raw hex, not Tailwind classes).
// Kept in sync by hand with src/app/globals.css's @theme block — see that file's
// comment. All categorical/ordinal/status values below were run through the
// dataviz skill's validate_palette.js and pass every check (see build notes).
// Restyle pass: surface/ink/accent/status hex values below match the tokens in
// globals.css exactly — this file exists only because Recharts can't consume
// CSS custom properties.

export const BRAND = {
  steel: "#357694", // accent-500
  navy: "#204b66", // accent-600
} as const;

export const ACCENT = {
  50: "#f3f7f9",
  100: "#e3ecf0",
  500: "#357694",
  600: "#204b66",
} as const;

export const INK = {
  primary: "#101828",
  secondary: "#475467",
  muted: "#98a2b3",
  hairline: "#eceef1",
  hairlineHover: "#dde1e6",
  subtle: "#f4f6f8",
  surface: "#ffffff",
  page: "#fbfcfd",
  grid: "#f1f3f5",
} as const;

// Shared Recharts <Tooltip> styling — dark pill per the restyle spec, reused
// by every chart-inner component so tooltips read as one system.
export const TOOLTIP = {
  contentStyle: {
    backgroundColor: INK.primary,
    border: "none",
    borderRadius: 8,
    padding: "10px 12px",
    boxShadow: "0 8px 24px rgba(16, 24, 40, 0.18)",
    fontSize: 12,
  },
  itemStyle: { color: "#ffffff" },
  labelStyle: { color: "#ffffff", fontWeight: 600, marginBottom: 4 },
};

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
  critical: "#f04438",
  criticalTint: "#fef3f2",
  good: "#12b76a",
  goodTint: "#ecfdf3",
  warning: "#f79009",
  warningTint: "#fffaeb",
} as const;

// Ordinal ramp (light -> dark, single hue) for the Admissions funnel — order
// carries meaning (Received -> Admitted -> Enrolled), validated with --ordinal.
// Left as its own validated step (not accent-100) because the funnel's white
// data-labels need more contrast than a 50/100 chip tint provides.
export const ORDINAL_FUNNEL = ["#7fb0c4", BRAND.steel, BRAND.navy] as const;

// Gauge/meter: fill carries the value, track is the subtle-fill token.
export const METER = {
  fill: BRAND.steel,
  track: INK.subtle,
} as const;
