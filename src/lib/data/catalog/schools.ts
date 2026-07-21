import type { School } from "../types";

// Real BNU schools and their real confirmed programmes (per bnu.edu.pk research).
// No unlisted programme names are invented.
export const SCHOOLS: School[] = [
  {
    id: "sch-mdsvad",
    name: "Mariam Dawood School of Visual Arts & Design",
    shortName: "MDSVAD",
    programmes: [
      { id: "mdsvad-bfa-va", name: "BFA Visual Arts", level: "undergraduate", schoolId: "sch-mdsvad" },
      { id: "mdsvad-bdes-tfa", name: "BDes Textile, Fashion & Accessories Design", level: "undergraduate", schoolId: "sch-mdsvad" },
      { id: "mdsvad-bdes-vcd", name: "BDes Visual Communication Design", level: "undergraduate", schoolId: "sch-mdsvad" },
      { id: "mdsvad-ba-ieda", name: "BA (Hons) IEDA", level: "undergraduate", schoolId: "sch-mdsvad" },
      { id: "mdsvad-ma-ads", name: "MA ADS", level: "graduate", schoolId: "sch-mdsvad" },
      { id: "mdsvad-ma-ae", name: "MA AE", level: "graduate", schoolId: "sch-mdsvad" },
    ],
  },
  {
    id: "sch-rhsa",
    name: "Razia Hassan School of Architecture",
    shortName: "RHSA",
    programmes: [
      { id: "rhsa-barch", name: "B.Arch", level: "undergraduate", schoolId: "sch-rhsa" },
      { id: "rhsa-bid", name: "BID (Bachelor in Interior Design)", level: "undergraduate", schoolId: "sch-rhsa" },
    ],
  },
  {
    id: "sch-slass",
    name: "Seeta Majeed School of Liberal Arts & Social Sciences",
    shortName: "SLASS",
    programmes: [
      { id: "slass-bs-lass", name: "BS Liberal Arts & Social Sciences", level: "undergraduate", schoolId: "sch-slass" },
      { id: "slass-bs-ps", name: "BS Political Science", level: "undergraduate", schoolId: "sch-slass" },
      { id: "slass-bs-ps-ir", name: "BS Political Science (Specialization in International Relations)", level: "undergraduate", schoolId: "sch-slass" },
    ],
  },
  {
    id: "sch-smc",
    name: "School of Media and Mass Communication",
    shortName: "SMC",
    programmes: [
      { id: "smc-bs-tftv", name: "BS Theatre, Film & TV", level: "undergraduate", schoolId: "sch-smc" },
      { id: "smc-bs-jms", name: "BS Journalism & Media Studies", level: "undergraduate", schoolId: "sch-smc" },
      { id: "smc-bs-im", name: "BS Immersive Media", level: "undergraduate", schoolId: "sch-smc" },
      { id: "smc-ms-fd", name: "MS Film Direction", level: "graduate", schoolId: "sch-smc" },
      { id: "smc-ms-pra", name: "MS Public Relations & Advertising", level: "graduate", schoolId: "sch-smc" },
    ],
  },
  {
    id: "sch-scit",
    name: "School of Computer & IT",
    shortName: "SCIT",
    programmes: [
      { id: "scit-bscs", name: "BS Computer Science", level: "undergraduate", schoolId: "sch-scit" },
      { id: "scit-bsse", name: "BS Software Engineering", level: "undergraduate", schoolId: "sch-scit" },
      { id: "scit-bsai", name: "BS Artificial Intelligence", level: "undergraduate", schoolId: "sch-scit" },
      { id: "scit-bsmbc", name: "BS Management & Business Computing", level: "undergraduate", schoolId: "sch-scit" },
      { id: "scit-mscs-weekend", name: "MS Computer Science (Weekend Track)", level: "graduate", schoolId: "sch-scit" },
    ],
  },
  {
    id: "sch-se",
    name: "School of Education",
    shortName: "SE",
    programmes: [
      { id: "se-bed", name: "B.Ed", level: "undergraduate", schoolId: "sch-se" },
      { id: "se-mphil-elm", name: "MPhil Educational Leadership and Management (Regular)", level: "graduate", schoolId: "sch-se" },
      { id: "se-mphil-elm-weekend", name: "MPhil Educational Leadership and Management (Weekend)", level: "graduate", schoolId: "sch-se" },
      { id: "se-mphil-ling", name: "MPhil Linguistics and TESOL", level: "graduate", schoolId: "sch-se" },
    ],
  },
  {
    id: "sch-sms",
    name: "School of Management Sciences",
    shortName: "SMS",
    programmes: [
      { id: "sms-bba", name: "BBA (Hons.)", level: "undergraduate", schoolId: "sch-sms" },
      { id: "sms-bs-bia", name: "BS Business Intelligence and Analytics", level: "undergraduate", schoolId: "sch-sms" },
      { id: "sms-bs-hm", name: "BS Hospitality Management", level: "undergraduate", schoolId: "sch-sms" },
      { id: "sms-bs-econ", name: "BS Economics", level: "undergraduate", schoolId: "sch-sms" },
      { id: "sms-bs-econ-fin", name: "BS Economics and Finance", level: "undergraduate", schoolId: "sch-sms" },
      { id: "sms-bs-econ-da", name: "BS Economics with Minor in Data Analytics", level: "undergraduate", schoolId: "sch-sms" },
    ],
  },
  {
    id: "sch-ip",
    name: "Institute of Psychology",
    shortName: "IP",
    programmes: [
      { id: "ip-bs-ap", name: "BS Applied Psychology", level: "undergraduate", schoolId: "sch-ip" },
      { id: "ip-ms-ccp", name: "MS Clinical and Counseling Psychology", level: "graduate", schoolId: "sch-ip" },
      { id: "ip-mphil-ap", name: "MPhil Applied Psychology", level: "graduate", schoolId: "sch-ip" },
      { id: "ip-phd-ap", name: "PhD in Applied Psychology", level: "graduate", schoolId: "sch-ip" },
    ],
  },
];

// Relative enrollment-share weight per school — Management Sciences and Computer & IT
// larger, Architecture and Psychology smaller, per the brief's scale guidance.
export const SCHOOL_ENROLLMENT_WEIGHTS: Record<string, number> = {
  "sch-mdsvad": 0.9,
  "sch-rhsa": 0.55,
  "sch-slass": 0.85,
  "sch-smc": 1.0,
  "sch-scit": 2.1,
  "sch-se": 0.7,
  "sch-sms": 2.3,
  "sch-ip": 0.6,
};

export function resolveSchool(id: string | undefined): string {
  if (!id) return "BNU";
  return SCHOOLS.find((s) => s.id === id)?.name ?? id;
}

/** Short form (shortName) for chart axis labels only — full name elsewhere (tables, breadcrumbs, filter chips). */
export function resolveSchoolShort(id: string | undefined): string {
  if (!id) return "BNU";
  return SCHOOLS.find((s) => s.id === id)?.shortName ?? id;
}

export function resolveProgramme(id: string | undefined): string {
  if (!id) return "";
  for (const school of SCHOOLS) {
    const p = school.programmes.find((p) => p.id === id);
    if (p) return p.name;
  }
  return id;
}

export function schoolOfProgramme(programmeId: string): School | undefined {
  return SCHOOLS.find((s) => s.programmes.some((p) => p.id === programmeId));
}
