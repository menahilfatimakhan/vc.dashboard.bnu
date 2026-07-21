import type { Department } from "../types";

// Real BNU administrative departments/centres (per bnu.edu.pk research).
// shortName is this build's own abbreviation, used for chart axis labels only —
// full name is always shown in tables, tooltips, breadcrumbs, and filter chips.
export const DEPARTMENTS: Department[] = [
  { id: "dept-vcs", name: "VC Secretariat", shortName: "VC Secretariat" },
  { id: "dept-registrar", name: "Registrar's Office", shortName: "Registrar" },
  { id: "dept-admissions", name: "Admissions Office", shortName: "Admissions" },
  { id: "dept-accounts", name: "Accounts & Finance", shortName: "Accounts & Finance" },
  { id: "dept-hr", name: "Human Resources", shortName: "HR" },
  { id: "dept-qac", name: "Quality Assurance Cell", shortName: "QAC" },
  { id: "dept-dsaer", name: "Directorate of Student Affairs & External Relations", shortName: "DSAER" },
  { id: "dept-orip", name: "Office of Research, Innovation & Partnerships", shortName: "ORIP" },
  { id: "dept-cdc", name: "Career Development Center", shortName: "CDC" },
  { id: "dept-itrc", name: "IT Resource Center", shortName: "ITRC" },
  { id: "dept-library", name: "Library", shortName: "Library" },
  { id: "dept-counseling", name: "Counseling & Health Center", shortName: "Counseling" },
];

export const DESIGNATIONS_BY_DEPARTMENT: Record<string, string[]> = {
  "dept-vcs": ["Executive Assistant", "Protocol Officer", "Secretariat Coordinator"],
  "dept-registrar": ["Deputy Registrar", "Assistant Registrar", "Records Officer", "Examination Coordinator"],
  "dept-admissions": ["Admissions Officer", "Admissions Coordinator", "Front Desk Executive"],
  "dept-accounts": ["Accounts Officer", "Finance Executive", "Payroll Officer", "Internal Auditor"],
  "dept-hr": ["HR Officer", "Recruitment Coordinator", "HR Generalist", "Benefits Administrator"],
  "dept-qac": ["QA Officer", "Accreditation Coordinator", "QA Analyst"],
  "dept-dsaer": ["Student Affairs Officer", "External Relations Coordinator", "Events Coordinator"],
  "dept-orip": ["Research Officer", "Grants Coordinator", "Partnerships Officer", "Innovation Associate"],
  "dept-cdc": ["Career Counselor", "Employer Relations Officer", "Placement Coordinator"],
  "dept-itrc": ["IT Support Officer", "Systems Administrator", "Network Engineer", "Helpdesk Executive"],
  "dept-library": ["Librarian", "Assistant Librarian", "Cataloguing Officer"],
  "dept-counseling": ["Counselor", "Health Center Nurse", "Wellness Coordinator"],
};

export function resolveDepartment(id: string | undefined): string {
  if (!id) return "BNU";
  return DEPARTMENTS.find((d) => d.id === id)?.name ?? id;
}

/** Short form for chart axis labels only — see catalog comment above. */
export function resolveDepartmentShort(id: string | undefined): string {
  if (!id) return "BNU";
  return DEPARTMENTS.find((d) => d.id === id)?.shortName ?? id;
}
