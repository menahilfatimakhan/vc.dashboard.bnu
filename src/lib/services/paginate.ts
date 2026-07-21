import type { PaginatedResult, Pagination } from "../data/types";

export function paginate<T>(rows: T[], pagination: Pagination): PaginatedResult<T> {
  const { page, pageSize } = pagination;
  const start = (page - 1) * pageSize;
  return {
    rows: rows.slice(start, start + pageSize),
    total: rows.length,
    page,
    pageSize,
  };
}
