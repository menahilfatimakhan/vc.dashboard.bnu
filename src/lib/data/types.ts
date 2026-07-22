// Shared types for the dummy-data layer. Module ID prefixes (ENR, EP, GRT, ...)
// match the root CLAUDE.md module index.

export type DegreeLevel = "undergraduate" | "graduate";
export type Semester = "Fall" | "Spring";
export type Gender = "Male" | "Female";

export interface Programme {
  id: string;
  name: string;
  level: DegreeLevel;
  schoolId: string;
}

export interface School {
  id: string;
  name: string;
  shortName: string;
  programmes: Programme[];
}

export interface Department {
  id: string;
  name: string;
  shortName: string;
}

export type HostelType = "On-campus" | "Off-campus";

export interface Hostel {
  id: string;
  name: string;
  type: HostelType;
  capacity: number;
}

export interface ScholarshipType {
  id: string;
  name: string;
  awardingCriteria: string;
  amountPerAward: number;
}

// ---- Canonical rosters ----

export type EnrollmentStatus = "Active" | "Frozen" | "Dormant" | "Struck Off";

export interface Student {
  id: string;
  name: string;
  gender: Gender;
  schoolId: string;
  programmeId: string;
  semester: Semester;
  enrollmentYear: number;
  enrollmentStatus: EnrollmentStatus;
  cgpa: number;
}

export type EmploymentType = "Full-Time" | "Visiting";

export interface Faculty {
  id: string;
  name: string;
  gender: Gender;
  schoolId: string;
  employmentType: EmploymentType;
}

export interface Staff {
  id: string;
  name: string;
  gender: Gender;
  departmentId: string;
  designation: string;
}

// ---- Derived, per-module records ----

export type DCCaseStatus = "Pending" | "Resolved";

export interface DCCase {
  id: string;
  studentId: string;
  studentName: string;
  schoolId: string;
  programmeId: string;
  dateRaised: string; // ISO date
  year: number;
  semester: Semester;
  violationType: string;
  status: DCCaseStatus;
}

export interface ScholarshipRecipient {
  id: string;
  studentId: string;
  studentName: string;
  schoolId: string;
  programmeId: string;
  scholarshipTypeId: string;
  awardYear: number;
  awardSemester: Semester;
  amount: number;
}

export type ApplicationStatus = "Received" | "Admitted" | "Rejected";

export interface Application {
  id: string;
  schoolId: string;
  programmeId: string;
  semester: Semester;
  year: number;
  status: ApplicationStatus;
  feePaid: boolean; // processing-fee payment, precedes the admit decision
}

export type AttendanceStatus = "Attended" | "Not Attended";

// A Session is a recurring course/lecture slot (e.g. "BSCS - Data Structures - A");
// each ClassSession row is one individual weekly occurrence of that Session.
export interface Session {
  id: string;
  schoolId: string;
  name: string;
}

export interface ClassSession {
  id: string;
  schoolId: string;
  sessionId: string;
  scheduledAt: string; // ISO datetime
  year: number;
  semester: Semester;
  attendanceStatus: AttendanceStatus;
}

export interface EPortalCase {
  id: string;
  dateRaised: string; // ISO date — status/daysOpen are always derived, never stored
  category: string;
}

export type GrantStatus = "Completed" | "Underway";
export type GrantOwnerType = "school" | "department";

export interface Grant {
  id: string;
  title: string;
  ownerType: GrantOwnerType;
  ownerId: string;
  status: GrantStatus;
  startDate: string; // ISO date
  endDate: string; // ISO date
}

export interface HostelResident {
  id: string;
  studentId: string;
  studentName: string;
  schoolId: string;
  hostelId: string;
}

export interface Society {
  id: string;
  name: string;
  category: string;
  schoolId: string | null; // null = university-wide society
}

export interface StudentEvent {
  id: string;
  name: string;
  societyId: string;
  date: string; // ISO date
  participantCount: number;
}

export interface Publication {
  id: string;
  title: string;
  schoolId: string;
  facultyId: string;
  year: number;
}

export type ResearchGrantStatus = "Applied" | "Won" | "Rejected";

export interface ResearchGrantApplication {
  id: string;
  title: string;
  schoolId: string;
  year: number;
  status: ResearchGrantStatus;
}

export interface Partnership {
  id: string;
  partnerName: string;
  country: string;
  focusArea: string;
  signedYear: number;
}

export interface FlagshipInitiative {
  id: string;
  name: string;
  description: string;
  leadName: string;
  leadRole: string;
  established: string;
  relatedEntities: string[];
}

// ---- Innovation & Incubation (speculative — see root CLAUDE.md) ----

export interface CyberParticipant {
  id: string;
  name: string;
  email: string;
  schoolId: string;
}

export interface IncubationVenture {
  id: string;
  ventureName: string;
  founderName: string;
  founderContact: string;
  description: string;
}

export interface RegisteredVenture {
  id: string;
  registrationNumber: string;
  ventureName: string;
  schoolId: string;
  description: string;
}

// ---- Overview-specific aggregates ----

export interface SchoolCountApplicantsDatum {
  schoolsAppliedTo: number; // 1-8
  thisYear: number;
  lastYear: number;
}

export interface TuitionRevenuePoint {
  period: string; // semester period value, e.g. "2025-Fall"
  label: string;
  revenue: number;
}

// ---- Canonical data bundle ----

export interface CanonicalData {
  schools: School[];
  departments: Department[];
  hostels: Hostel[];
  scholarshipTypes: ScholarshipType[];

  students: Student[];
  faculty: Faculty[];
  staff: Staff[];

  dcCases: DCCase[];
  scholarshipRecipients: ScholarshipRecipient[];
  applications: Application[];
  sessions: Session[];
  classSessions: ClassSession[];
  ePortalCases: EPortalCase[];
  grants: Grant[];
  hostelResidents: HostelResident[];

  societies: Society[];
  studentEvents: StudentEvent[];

  publications: Publication[];
  researchGrantApplications: ResearchGrantApplication[];
  partnerships: Partnership[];
  flagshipInitiatives: FlagshipInitiative[];

  cyberParticipants: CyberParticipant[];
  incubationVentures: IncubationVenture[];
  registeredVentures: RegisteredVenture[];

  schoolCountApplicants: SchoolCountApplicantsDatum[];
  tuitionRevenue: TuitionRevenuePoint[];
}

// ---- Generic service-layer helpers ----

export interface Pagination {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CountEntry {
  key: string;
  label: string;
  value: number;
}
