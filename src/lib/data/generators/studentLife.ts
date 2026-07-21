import type { SeededRandom } from "../prng";
import type { School, Society, Student, StudentEvent } from "../types";

// Speculative module — not specified in the SRS (see root CLAUDE.md). Built as a
// light module per direct product instruction: societies, events, participation.

const SOCIETY_TEMPLATES: { name: string; category: string; schoolId: string | null }[] = [
  { name: "Debating Society", category: "Literary & Debate", schoolId: null },
  { name: "Dramatics Club", category: "Performing Arts", schoolId: "sch-smc" },
  { name: "Photography Society", category: "Visual Arts", schoolId: "sch-mdsvad" },
  { name: "Entrepreneurship Society", category: "Business & Innovation", schoolId: "sch-sms" },
  { name: "Literary Circle", category: "Literary & Debate", schoolId: "sch-slass" },
  { name: "Environmental Society", category: "Community & Advocacy", schoolId: null },
  { name: "Sports Council", category: "Sports", schoolId: null },
  { name: "Design Guild", category: "Visual Arts", schoolId: "sch-rhsa" },
  { name: "Tech Society", category: "Business & Innovation", schoolId: "sch-scit" },
  { name: "Psychology Peer Circle", category: "Community & Advocacy", schoolId: "sch-ip" },
  { name: "Music Ensemble", category: "Performing Arts", schoolId: null },
  { name: "Education Outreach Society", category: "Community & Advocacy", schoolId: "sch-se" },
];

const EVENT_NAME_TEMPLATES = [
  "Annual Showcase", "Open Mic Night", "Inter-Society Championship", "Workshop Series",
  "Community Outreach Drive", "Talent Hunt", "Panel Discussion", "Cultural Festival",
  "Skills Bootcamp", "Charity Fundraiser",
];

const CURRENT_YEAR = 2026;
const CURRENT_MONTH = 7;
const CURRENT_DAY = 21;
const EVENTS_PER_SOCIETY = 5;

export function generateStudentLife(
  rng: SeededRandom,
  students: Student[],
  schools: School[],
): { societies: Society[]; studentEvents: StudentEvent[] } {
  const societies: Society[] = SOCIETY_TEMPLATES.map((t, i) => ({
    id: `BNU-STL-SOC-${String(i + 1).padStart(2, "0")}`,
    name: t.name,
    category: t.category,
    schoolId: t.schoolId,
  }));

  const studentEvents: StudentEvent[] = [];
  let counter = 1;
  const now = new Date(Date.UTC(CURRENT_YEAR, CURRENT_MONTH - 1, CURRENT_DAY));

  const schoolStudentCounts = new Map<string, number>();
  for (const s of schools) {
    schoolStudentCounts.set(s.id, students.filter((st) => st.schoolId === s.id).length);
  }

  for (const society of societies) {
    const ceiling = society.schoolId
      ? Math.max(40, Math.round((schoolStudentCounts.get(society.schoolId) ?? 200) * 0.3))
      : 400;

    for (let i = 0; i < EVENTS_PER_SOCIETY; i++) {
      const daysAgo = rng.int(0, 300);
      const date = new Date(now);
      date.setUTCDate(date.getUTCDate() - daysAgo);

      studentEvents.push({
        id: `BNU-STL-EVT-${String(counter).padStart(3, "0")}`,
        name: `${society.name} ${rng.pick(EVENT_NAME_TEMPLATES)}`,
        societyId: society.id,
        date: date.toISOString().slice(0, 10),
        participantCount: rng.int(Math.round(ceiling * 0.15), ceiling),
      });
      counter++;
    }
  }

  return { societies, studentEvents };
}
