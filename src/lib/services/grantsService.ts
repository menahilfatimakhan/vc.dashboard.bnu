import { getCanonicalData } from "../data/store";
import type { Grant, GrantStatus, PaginatedResult, Pagination } from "../data/types";
import { resolveSchool, resolveSchoolShort, SCHOOLS } from "../data/catalog/schools";
import { resolveDepartment, resolveDepartmentShort } from "../data/catalog/departments";
import { isGrantEndingSoon } from "./businessRules";
import { groupCount } from "./groupCount";
import { paginate } from "./paginate";
import { simulateDelay } from "./simulateDelay";

export function resolveGrantOwner(grant: Grant): string {
  return grant.ownerType === "school" ? resolveSchool(grant.ownerId) : resolveDepartment(grant.ownerId);
}

/** Grants are owned by either a school or a department — resolve by ID alone (for breadcrumb labels). */
export function resolveOwnerById(id: string | undefined): string {
  if (!id) return "BNU";
  const school = SCHOOLS.find((s) => s.id === id);
  if (school) return school.name;
  return resolveDepartment(id);
}

/** Short form for chart axis labels only — see catalog comments in schools.ts/departments.ts. */
function resolveOwnerShortById(id: string): string {
  const school = SCHOOLS.find((s) => s.id === id);
  if (school) return resolveSchoolShort(id);
  return resolveDepartmentShort(id);
}

export interface GrantFilters {
  ownerId?: string;
  status?: GrantStatus;
}

function matches(filters: GrantFilters) {
  return (g: Grant) =>
    (!filters.ownerId || g.ownerId === filters.ownerId) && (!filters.status || g.status === filters.status);
}

export interface GrantsSummary {
  total: number;
  completed: number;
  underway: number;
  endingSoon: number;
  byStatus: ReturnType<typeof groupCount>;
  byOwner: ReturnType<typeof groupCount>;
}

export async function getGrantsSummary(filters: GrantFilters): Promise<GrantsSummary> {
  await simulateDelay();
  const { grants } = getCanonicalData();
  const rows = grants.filter(matches(filters));

  return {
    total: rows.length,
    completed: rows.filter((g) => g.status === "Completed").length,
    underway: rows.filter((g) => g.status === "Underway").length,
    endingSoon: rows.filter((g) => isGrantEndingSoon(g)).length,
    byStatus: groupCount(rows, (g) => g.status),
    byOwner: groupCount(rows, (g) => g.ownerId, resolveOwnerShortById),
  };
}

export async function getGrants(
  filters: GrantFilters,
  pagination: Pagination,
): Promise<PaginatedResult<Grant & { ownerName: string; endingSoon: boolean }>> {
  await simulateDelay();
  const { grants } = getCanonicalData();
  const rows = grants
    .filter(matches(filters))
    .map((g) => ({ ...g, ownerName: resolveGrantOwner(g), endingSoon: isGrantEndingSoon(g) }))
    .sort((a, b) => (a.endingSoon === b.endingSoon ? 0 : a.endingSoon ? -1 : 1));
  return paginate(rows, pagination);
}
