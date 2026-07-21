import { getCanonicalData } from "../data/store";
import type { EPortalCase, PaginatedResult, Pagination } from "../data/types";
import { getDaysOpen, getEPortalStatus, type EPortalStatus } from "./businessRules";
import { groupCount } from "./groupCount";
import { paginate } from "./paginate";
import { simulateDelay } from "./simulateDelay";
import { inDateRange } from "./dateRangeFilter";

export interface EPortalFilters {
  category?: string;
  status?: EPortalStatus;
  dateFrom?: string;
  dateTo?: string;
}

function matches(filters: EPortalFilters) {
  return (c: EPortalCase) =>
    (!filters.category || c.category === filters.category) &&
    (!filters.status || getEPortalStatus(c.dateRaised) === filters.status) &&
    inDateRange(c.dateRaised, filters.dateFrom, filters.dateTo);
}

export interface EPortalSummary {
  total: number;
  inProcess: number;
  escalated: number;
  byStatus: ReturnType<typeof groupCount>;
  byCategory: ReturnType<typeof groupCount>;
}

export async function getEPortalSummary(filters: EPortalFilters): Promise<EPortalSummary> {
  await simulateDelay();
  const { ePortalCases } = getCanonicalData();
  const rows = ePortalCases.filter(matches(filters));
  const withStatus = rows.map((c) => ({ ...c, status: getEPortalStatus(c.dateRaised) }));

  return {
    total: rows.length,
    inProcess: withStatus.filter((c) => c.status === "In-Process").length,
    escalated: withStatus.filter((c) => c.status === "Escalated").length,
    byStatus: groupCount(withStatus, (c) => c.status),
    byCategory: groupCount(rows, (c) => c.category),
  };
}

export async function getEPortalCases(
  filters: EPortalFilters,
  pagination: Pagination,
): Promise<PaginatedResult<EPortalCase & { status: EPortalStatus; daysOpen: number }>> {
  await simulateDelay();
  const { ePortalCases } = getCanonicalData();
  const rows = ePortalCases
    .filter(matches(filters))
    .map((c) => ({ ...c, status: getEPortalStatus(c.dateRaised), daysOpen: getDaysOpen(c.dateRaised) }))
    .sort((a, b) => b.daysOpen - a.daysOpen);
  return paginate(rows, pagination);
}
