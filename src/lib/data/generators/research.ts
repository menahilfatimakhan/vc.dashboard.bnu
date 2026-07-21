import type { SeededRandom } from "../prng";
import type {
  Faculty,
  FlagshipInitiative,
  Partnership,
  Publication,
  ResearchGrantApplication,
  School,
} from "../types";

// Speculative module — not specified in the SRS (see root CLAUDE.md). Publications,
// research-grant applications, and MoUs are generated dummy data; the three flagship
// initiatives below are real, confirmed via bnu.edu.pk research (not invented).

const YEARS = [2022, 2023, 2024, 2025, 2026];

const PUB_TEMPLATES = [
  "A Study of {field} in the Pakistani Context",
  "Rethinking {field}: New Approaches",
  "{field} and Institutional Practice",
  "Toward Inclusive {field}",
  "Comparative Perspectives on {field}",
];

const FIELDS_BY_SCHOOL: Record<string, string[]> = {
  "sch-mdsvad": ["Textile Craft", "Visual Culture", "Design Pedagogy"],
  "sch-rhsa": ["Urban Heritage", "Sustainable Architecture", "Housing Policy"],
  "sch-slass": ["Political Discourse", "Social Policy", "Regional History"],
  "sch-smc": ["Media Ethics", "Digital Journalism", "Screen Studies"],
  "sch-scit": ["Applied Machine Learning", "Software Engineering Practice", "Human-Computer Interaction"],
  "sch-se": ["Teacher Education", "Curriculum Design", "Educational Leadership"],
  "sch-sms": ["Consumer Behaviour", "Development Economics", "Organizational Strategy"],
  "sch-ip": ["Clinical Intervention", "Child Psychology", "Community Mental Health"],
};

// Research-intensity weight per school (independent of enrollment size).
const RESEARCH_WEIGHT: Record<string, number> = {
  "sch-mdsvad": 0.7,
  "sch-rhsa": 0.6,
  "sch-slass": 1.1,
  "sch-smc": 0.8,
  "sch-scit": 1.3,
  "sch-se": 0.9,
  "sch-sms": 1.0,
  "sch-ip": 1.2,
};

function publicationsPerYear(schoolId: string, year: number, rng: SeededRandom): number {
  const weight = RESEARCH_WEIGHT[schoolId] ?? 1;
  const yearIndex = YEARS.indexOf(year);
  // Gentle upward trend over the 5-year window rather than pure noise.
  const trendFactor = 0.8 + yearIndex * 0.08;
  return Math.max(1, Math.round(weight * trendFactor * rng.float(3, 6)));
}

export function generatePublications(
  rng: SeededRandom,
  schools: School[],
  faculty: Faculty[],
): Publication[] {
  const publications: Publication[] = [];
  let counter = 1;

  for (const school of schools) {
    const schoolFaculty = faculty.filter((f) => f.schoolId === school.id);
    const fields = FIELDS_BY_SCHOOL[school.id] ?? ["Applied Research"];

    for (const year of YEARS) {
      const count = publicationsPerYear(school.id, year, rng);
      for (let i = 0; i < count; i++) {
        const author = schoolFaculty.length > 0 ? rng.pick(schoolFaculty) : undefined;
        const title = rng.pick(PUB_TEMPLATES).replace("{field}", rng.pick(fields));

        publications.push({
          id: `BNU-RES-PUB-${String(counter).padStart(4, "0")}`,
          title,
          schoolId: school.id,
          facultyId: author?.id ?? "",
          year,
        });
        counter++;
      }
    }
  }

  return publications;
}

export function generateResearchGrantApplications(
  rng: SeededRandom,
  schools: School[],
): ResearchGrantApplication[] {
  const applications: ResearchGrantApplication[] = [];
  let counter = 1;

  const TOPIC = ["Innovation Fund Application", "Faculty Research Award", "Seed Grant Proposal", "Collaborative Research Grant"];

  for (const school of schools) {
    for (const year of YEARS) {
      const count = Math.round((RESEARCH_WEIGHT[school.id] ?? 1) * rng.float(2, 4));
      for (let i = 0; i < count; i++) {
        const roll = rng.float(0, 1);
        const status = roll < 0.4 ? "Won" : roll < 0.75 ? "Rejected" : "Applied";

        applications.push({
          id: `BNU-RES-GRT-${String(counter).padStart(4, "0")}`,
          title: `${rng.pick(TOPIC)} — ${school.shortName}`,
          schoolId: school.id,
          year,
          status,
        });
        counter++;
      }
    }
  }

  return applications;
}

// Generic, non-specific partner names — intentionally not naming real external
// institutions, since no actual MoUs were confirmed during BNU site research.
export function generatePartnerships(): Partnership[] {
  return [
    { id: "BNU-RES-MOU-01", partnerName: "South Asian Policy Research Network", country: "Pakistan", focusArea: "Public Policy", signedYear: 2023 },
    { id: "BNU-RES-MOU-02", partnerName: "Global Design Exchange Consortium", country: "United Kingdom", focusArea: "Design Education", signedYear: 2024 },
    { id: "BNU-RES-MOU-03", partnerName: "Regional Tech Industry Council", country: "Pakistan", focusArea: "Applied Computing", signedYear: 2022 },
    { id: "BNU-RES-MOU-04", partnerName: "International Psychology Practitioners Alliance", country: "United States", focusArea: "Clinical Psychology", signedYear: 2025 },
    { id: "BNU-RES-MOU-05", partnerName: "Asia-Pacific Media Educators Forum", country: "Singapore", focusArea: "Media & Journalism", signedYear: 2023 },
    { id: "BNU-RES-MOU-06", partnerName: "Heritage Architecture Preservation Trust", country: "Pakistan", focusArea: "Architecture & Heritage", signedYear: 2024 },
  ];
}

// Real, confirmed via bnu.edu.pk — not invented.
export function generateFlagshipInitiatives(): FlagshipInitiative[] {
  return [
    {
      id: "BNU-RES-FLAG-UNESCO",
      name: "UNESCO Chair for Inclusion through Art",
      description:
        "Established February 2024 at the Mariam Dawood School of Visual Arts & Design, strengthening the BA (Hons) IEDA programme and building inclusive, interdisciplinary art practices addressing marginalized and vulnerable populations across Pakistan and South Asia.",
      leadName: "Professor Rashid Rana",
      leadRole: "Chairholder",
      established: "February 2024",
      relatedEntities: ["IEDA CELL (incubation center)", "IEDAs (annual journal)", "IEDA FEST (biannual festival)"],
    },
    {
      id: "BNU-RES-FLAG-BCPR",
      name: "BCPR — BNU Center for Policy Research",
      description:
        "BNU's policy-research hub, spanning all disciplines at the university. Houses a China Studies Chair supported by the Consulate General of China, focused on Pakistan-China relations (CPEC/BRI, diplomacy, technology, and education).",
      leadName: "Ambassador Mansoor Ahmad Khan",
      leadRole: "Director",
      established: "—",
      relatedEntities: ["China Studies Chair", "Dr. Zainab Ahmed (Deputy Director)"],
    },
    {
      id: "BNU-RES-FLAG-INNOVATRIUM",
      name: "Innovatrium",
      description:
        "BNU's startup incubation hub under ORIP, running Startup Fundamentals workshops, a semester-long Incubation Program, and BNU Connect — a cross-disciplinary platform requiring students from 2+ schools to collaborate.",
      leadName: "Uzair Shahid",
      leadRole: "Head of Innovation",
      established: "—",
      relatedEntities: ["Startup Fundamentals", "Incubation Program", "BNU Connect"],
    },
  ];
}
