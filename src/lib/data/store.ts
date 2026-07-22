import { DATA_SEED, seededRandom } from "./prng";
import type { CanonicalData } from "./types";

import { SCHOOLS } from "./catalog/schools";
import { DEPARTMENTS } from "./catalog/departments";
import { HOSTELS } from "./catalog/hostels";
import { SCHOLARSHIP_TYPES } from "./catalog/scholarshipTypes";

import { generateStudentRoster } from "./generators/students";
import { generateFacultyRoster } from "./generators/faculty";
import { generateStaffRoster } from "./generators/staff";
import { generateDCCases } from "./generators/dcCases";
import { generateScholarships } from "./generators/scholarships";
import { generateAdmissions } from "./generators/admissions";
import { generateHostelResidents } from "./generators/hostelResidents";
import { generateSessions, generateClasses } from "./generators/classes";
import { generateEPortalCases } from "./generators/ePortalCases";
import { generateGrants } from "./generators/grants";
import { generateStudentLife } from "./generators/studentLife";
import {
  generateFlagshipInitiatives,
  generatePartnerships,
  generatePublications,
  generateResearchGrantApplications,
} from "./generators/research";
import {
  generateCyberParticipants,
  generateIncubationVentures,
  generateRegisteredVentures,
} from "./generators/innovation";
import { generateSchoolCountApplicants, generateTuitionRevenue } from "./generators/overviewExtras";

// Each generator gets its own PRNG instance at DATA_SEED + <fixed offset>, so one
// generator's internal changes can never shift another generator's random draws.
// Keep these offsets stable — do not renumber.
const OFFSETS = {
  students: 1,
  faculty: 2,
  staff: 3,
  dcCases: 4,
  scholarships: 5,
  admissions: 6,
  hostelResidents: 7,
  classes: 8,
  ePortalCases: 9,
  grants: 10,
  studentLife: 11,
  publications: 12,
  researchGrants: 13,
  sessions: 14,
  cyber: 15,
  incubation: 16,
  ventures: 17,
  schoolCountApplicants: 18,
  tuitionRevenue: 19,
} as const;

let cache: CanonicalData | null = null;

export function getCanonicalData(): CanonicalData {
  if (cache) return cache;

  const schools = SCHOOLS;
  const departments = DEPARTMENTS;
  const hostels = HOSTELS;
  const scholarshipTypes = SCHOLARSHIP_TYPES;

  const students = generateStudentRoster(seededRandom(DATA_SEED + OFFSETS.students), schools);
  const faculty = generateFacultyRoster(seededRandom(DATA_SEED + OFFSETS.faculty), schools);
  const staff = generateStaffRoster(seededRandom(DATA_SEED + OFFSETS.staff), departments);

  const dcCases = generateDCCases(seededRandom(DATA_SEED + OFFSETS.dcCases), students);
  const scholarshipRecipients = generateScholarships(
    seededRandom(DATA_SEED + OFFSETS.scholarships),
    students,
    scholarshipTypes,
  );
  const applications = generateAdmissions(seededRandom(DATA_SEED + OFFSETS.admissions), schools, students);
  const hostelResidents = generateHostelResidents(
    seededRandom(DATA_SEED + OFFSETS.hostelResidents),
    students,
    hostels,
  );
  const sessions = generateSessions(seededRandom(DATA_SEED + OFFSETS.sessions), schools);
  const classSessions = generateClasses(seededRandom(DATA_SEED + OFFSETS.classes), schools, sessions);
  const ePortalCases = generateEPortalCases(seededRandom(DATA_SEED + OFFSETS.ePortalCases));
  const grants = generateGrants(seededRandom(DATA_SEED + OFFSETS.grants), schools, departments);

  const { societies, studentEvents } = generateStudentLife(
    seededRandom(DATA_SEED + OFFSETS.studentLife),
    students,
    schools,
  );

  const publications = generatePublications(
    seededRandom(DATA_SEED + OFFSETS.publications),
    schools,
    faculty,
  );
  const researchGrantApplications = generateResearchGrantApplications(
    seededRandom(DATA_SEED + OFFSETS.researchGrants),
    schools,
  );
  const partnerships = generatePartnerships();
  const flagshipInitiatives = generateFlagshipInitiatives();

  const cyberParticipants = generateCyberParticipants(seededRandom(DATA_SEED + OFFSETS.cyber), schools);
  const incubationVentures = generateIncubationVentures(seededRandom(DATA_SEED + OFFSETS.incubation));
  const registeredVentures = generateRegisteredVentures(seededRandom(DATA_SEED + OFFSETS.ventures), schools);

  const schoolCountApplicants = generateSchoolCountApplicants(
    seededRandom(DATA_SEED + OFFSETS.schoolCountApplicants),
  );
  const tuitionRevenue = generateTuitionRevenue(seededRandom(DATA_SEED + OFFSETS.tuitionRevenue));

  cache = {
    schools,
    departments,
    hostels,
    scholarshipTypes,
    students,
    faculty,
    staff,
    dcCases,
    scholarshipRecipients,
    applications,
    sessions,
    classSessions,
    ePortalCases,
    grants,
    hostelResidents,
    societies,
    studentEvents,
    publications,
    researchGrantApplications,
    partnerships,
    flagshipInitiatives,
    cyberParticipants,
    incubationVentures,
    registeredVentures,
    schoolCountApplicants,
    tuitionRevenue,
  };

  return cache;
}
