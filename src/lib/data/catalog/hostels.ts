import type { Hostel } from "../types";

// Hostel names per the SRS's own data model (Bedian, Safari, BNU Hostel) — BNU's
// public site only names generic "Boys Hostel"/"Girls Hostel," so these three names
// are the working spec, per the SRS being the internal requirements source.
// On/off-campus assignment and capacities are this build's own assumption (not
// stated in the SRS), documented here and in root CLAUDE.md.
export const HOSTELS: Hostel[] = [
  { id: "hst-bnu", name: "BNU Hostel", type: "On-campus", capacity: 420 },
  { id: "hst-bedian", name: "Bedian", type: "Off-campus", capacity: 260 },
  { id: "hst-safari", name: "Safari", type: "Off-campus", capacity: 190 },
];

export function resolveHostel(id: string | undefined): string {
  if (!id) return "BNU";
  return HOSTELS.find((h) => h.id === id)?.name ?? id;
}
