import type { SeededRandom } from "../prng";
import type { CyberParticipant, IncubationVenture, RegisteredVenture, School } from "../types";
import { generateGender, generatePersonName } from "./names";

// Speculative — not specified in the SRS or confirmed from any real roster (see
// root CLAUDE.md). Placeholder data generated the same way as the rest of the
// dashboard's dummy data, pending real Cyber/Incubation/Venture rosters.

const CYBER_COUNT = 71;
const INCUBATION_COUNT = 20;
const VENTURE_COUNT = 14;

function slugifyEmail(name: string, index: number): string {
  const base = name.toLowerCase().replace(/[^a-z\s]/g, "").trim().split(/\s+/).join(".");
  return `${base}${index}@bnu.edu.pk`;
}

export function generateCyberParticipants(rng: SeededRandom, schools: School[]): CyberParticipant[] {
  const participants: CyberParticipant[] = [];
  for (let i = 0; i < CYBER_COUNT; i++) {
    const gender = generateGender(rng);
    const name = generatePersonName(rng, gender);
    participants.push({
      id: `BNU-CYB-${String(i + 1).padStart(3, "0")}`,
      name,
      email: slugifyEmail(name, i + 1),
      schoolId: rng.pick(schools).id,
    });
  }
  return participants;
}

const VENTURE_SECTORS = [
  "EdTech", "FinTech", "AgriTech", "HealthTech", "E-Commerce", "Sustainable Design",
  "Creative Media", "Logistics", "Social Impact", "Consumer Products",
];

const VENTURE_NAME_PREFIXES = [
  "Nexa", "Roshni", "Sabaq", "Kissan", "Waseela", "Tarteeb", "Zariya", "Rasta",
  "Hunar", "Mehnat", "Sada", "Bunyad", "Rango", "Fikr",
];

function generateVentureName(rng: SeededRandom): string {
  return `${rng.pick(VENTURE_NAME_PREFIXES)}${rng.pick(["Labs", "Works", "Hub", "Co", "Studio", ""])}`.trim();
}

export function generateIncubationVentures(rng: SeededRandom): IncubationVenture[] {
  const ventures: IncubationVenture[] = [];
  for (let i = 0; i < INCUBATION_COUNT; i++) {
    const gender = generateGender(rng);
    const founderName = generatePersonName(rng, gender);
    const sector = rng.pick(VENTURE_SECTORS);
    ventures.push({
      id: `BNU-INC-${String(i + 1).padStart(2, "0")}`,
      ventureName: generateVentureName(rng),
      founderName,
      founderContact: slugifyEmail(founderName, i + 1),
      description: `Early-stage ${sector} venture in the Innovatrium incubation cohort`,
    });
  }
  return ventures;
}

export function generateRegisteredVentures(rng: SeededRandom, schools: School[]): RegisteredVenture[] {
  const ventures: RegisteredVenture[] = [];
  for (let i = 0; i < VENTURE_COUNT; i++) {
    const sector = rng.pick(VENTURE_SECTORS);
    const school = rng.pick(schools);
    ventures.push({
      id: `BNU-VNT-${String(i + 1).padStart(2, "0")}`,
      registrationNumber: `BNU-REG-${2022 + rng.int(0, 4)}-${String(rng.int(100, 999))}`,
      ventureName: generateVentureName(rng),
      schoolId: school.id,
      description: `Registered ${sector} venture affiliated with ${school.shortName}`,
    });
  }
  return ventures;
}
