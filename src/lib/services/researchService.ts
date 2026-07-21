import { getCanonicalData } from "../data/store";
import type { PaginatedResult, Pagination, Publication } from "../data/types";
import { resolveSchool, resolveSchoolShort } from "../data/catalog/schools";
import { groupCount } from "./groupCount";
import { paginate } from "./paginate";
import { simulateDelay } from "./simulateDelay";
import { yearInRange } from "./dateRangeFilter";

export interface ResearchFilters {
  schoolId?: string;
  dateFrom?: string;
  dateTo?: string;
}

function matchesPub(filters: ResearchFilters) {
  return (p: Publication) =>
    (!filters.schoolId || p.schoolId === filters.schoolId) && yearInRange(p.year, filters.dateFrom, filters.dateTo);
}

export interface ResearchSummary {
  totalPublications: number;
  publicationTrend: { year: number; count: number }[];
  publicationsBySchool: ReturnType<typeof groupCount>;
  grantsApplied: number;
  grantsWon: number;
  grantsRejected: number;
  grantsByStatus: ReturnType<typeof groupCount>;
  partnerships: ReturnType<typeof getCanonicalData>["partnerships"];
  flagshipInitiatives: ReturnType<typeof getCanonicalData>["flagshipInitiatives"];
}

export async function getResearchSummary(filters: ResearchFilters): Promise<ResearchSummary> {
  await simulateDelay();
  const { publications, researchGrantApplications, partnerships, flagshipInitiatives } = getCanonicalData();
  const pubRows = publications.filter(matchesPub(filters));

  const years = Array.from(new Set(publications.map((p) => p.year))).sort();
  const publicationTrend = years.map((year) => ({
    year,
    count: pubRows.filter((p) => p.year === year).length,
  }));

  const grantRows = researchGrantApplications.filter(
    (g) => (!filters.schoolId || g.schoolId === filters.schoolId) && yearInRange(g.year, filters.dateFrom, filters.dateTo),
  );

  return {
    totalPublications: pubRows.length,
    publicationTrend,
    publicationsBySchool: groupCount(pubRows, (p) => p.schoolId, resolveSchoolShort),
    grantsApplied: grantRows.filter((g) => g.status === "Applied").length,
    grantsWon: grantRows.filter((g) => g.status === "Won").length,
    grantsRejected: grantRows.filter((g) => g.status === "Rejected").length,
    grantsByStatus: groupCount(grantRows, (g) => g.status),
    partnerships,
    flagshipInitiatives,
  };
}

export async function getPublications(
  filters: ResearchFilters,
  pagination: Pagination,
): Promise<PaginatedResult<Publication & { schoolName: string }>> {
  await simulateDelay();
  const { publications } = getCanonicalData();
  const rows = publications.filter(matchesPub(filters)).map((p) => ({ ...p, schoolName: resolveSchool(p.schoolId) }));
  return paginate(rows, pagination);
}
