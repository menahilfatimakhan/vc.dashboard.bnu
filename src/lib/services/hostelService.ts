import { getCanonicalData } from "../data/store";
import type { HostelResident, HostelType, PaginatedResult, Pagination } from "../data/types";
import { paginate } from "./paginate";
import { simulateDelay } from "./simulateDelay";

export interface HostelFilters {
  hostelId?: string;
  hostelType?: HostelType;
}

function matches(filters: HostelFilters) {
  const { hostels } = getCanonicalData();
  return (r: HostelResident) => {
    if (filters.hostelId && r.hostelId !== filters.hostelId) return false;
    if (filters.hostelType) {
      const hostel = hostels.find((h) => h.id === r.hostelId);
      if (hostel?.type !== filters.hostelType) return false;
    }
    return true;
  };
}

export interface HostelSummary {
  totalResidents: number;
  byType: { key: string; label: string; value: number }[];
  byHostel: { id: string; name: string; type: HostelType; capacity: number; occupied: number; occupancyRate: number }[];
}

export async function getHostelSummary(filters: HostelFilters): Promise<HostelSummary> {
  await simulateDelay();
  const { hostels, hostelResidents } = getCanonicalData();
  const rows = hostelResidents.filter(matches(filters));

  const relevantHostels = filters.hostelId ? hostels.filter((h) => h.id === filters.hostelId) : hostels;

  const byType = (["On-campus", "Off-campus"] as const).map((type) => ({
    key: type,
    label: type,
    value: rows.filter((r) => {
      const h = hostels.find((h) => h.id === r.hostelId);
      return h?.type === type;
    }).length,
  }));

  const byHostel = relevantHostels
    .filter((h) => !filters.hostelType || h.type === filters.hostelType)
    .map((h) => {
      const occupied = rows.filter((r) => r.hostelId === h.id).length;
      return {
        id: h.id,
        name: h.name,
        type: h.type,
        capacity: h.capacity,
        occupied,
        occupancyRate: h.capacity > 0 ? (occupied / h.capacity) * 100 : 0,
      };
    });

  return { totalResidents: rows.length, byType, byHostel };
}

export async function getHostelResidents(
  filters: HostelFilters,
  pagination: Pagination,
): Promise<PaginatedResult<HostelResident>> {
  await simulateDelay();
  const { hostelResidents } = getCanonicalData();
  return paginate(hostelResidents.filter(matches(filters)), pagination);
}
