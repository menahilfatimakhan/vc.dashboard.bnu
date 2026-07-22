import { getCanonicalData } from "../data/store";
import { resolveSchool } from "../data/catalog/schools";
import { simulateDelay } from "./simulateDelay";

export async function getCyberParticipants() {
  await simulateDelay();
  const { cyberParticipants } = getCanonicalData();
  return cyberParticipants.map((c) => ({ ...c, schoolName: resolveSchool(c.schoolId) }));
}

export async function getIncubationVentures() {
  await simulateDelay();
  return getCanonicalData().incubationVentures;
}

export async function getRegisteredVentures() {
  await simulateDelay();
  const { registeredVentures } = getCanonicalData();
  return registeredVentures.map((v) => ({ ...v, schoolName: resolveSchool(v.schoolId) }));
}
