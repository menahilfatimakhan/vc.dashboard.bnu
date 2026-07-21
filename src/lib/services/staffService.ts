import { getCanonicalData } from "../data/store";
import type { PaginatedResult, Pagination, Staff } from "../data/types";
import { resolveDepartment, resolveDepartmentShort } from "../data/catalog/departments";
import { groupCount } from "./groupCount";
import { paginate } from "./paginate";
import { simulateDelay } from "./simulateDelay";

export interface StaffFilters {
  departmentId?: string;
}

function matches(filters: StaffFilters) {
  return (s: Staff) => !filters.departmentId || s.departmentId === filters.departmentId;
}

export interface StaffSummary {
  total: number;
  byDepartment: ReturnType<typeof groupCount>;
  byDesignation: ReturnType<typeof groupCount>;
}

export async function getStaffSummary(filters: StaffFilters): Promise<StaffSummary> {
  await simulateDelay();
  const { staff } = getCanonicalData();
  const rows = staff.filter(matches(filters));

  return {
    total: rows.length,
    byDepartment: groupCount(rows, (s) => s.departmentId, resolveDepartmentShort),
    byDesignation: groupCount(rows, (s) => s.designation),
  };
}

export async function getStaff(
  filters: StaffFilters,
  pagination: Pagination,
): Promise<PaginatedResult<Staff & { departmentName: string }>> {
  await simulateDelay();
  const { staff } = getCanonicalData();
  const rows = staff.filter(matches(filters)).map((s) => ({ ...s, departmentName: resolveDepartment(s.departmentId) }));
  return paginate(rows, pagination);
}
