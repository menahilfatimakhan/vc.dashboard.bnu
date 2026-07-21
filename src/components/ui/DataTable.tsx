import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SkeletonRow } from "./Skeleton";
import { EmptyState } from "./EmptyState";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  align?: "left" | "right";
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[] | undefined;
  total: number | undefined;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T extends object>({
  columns,
  rows,
  total,
  page,
  pageSize,
  onPageChange,
  loading,
  emptyMessage = "No records match the current filters.",
}: DataTableProps<T>) {
  const totalPages = total !== undefined ? Math.max(1, Math.ceil(total / pageSize)) : 1;
  const showEmpty = !loading && rows !== undefined && rows.length === 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-hairline">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-xs font-medium uppercase tracking-wide text-ink-muted ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading || rows === undefined
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} columns={columns.length} />)
              : rows.map((row, i) => (
                  <tr key={i} className="border-b border-hairline last:border-0 hover:bg-page/60">
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3 text-ink ${col.align === "right" ? "text-right tabular-nums" : ""}`}
                      >
                        {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {showEmpty && <EmptyState message={emptyMessage} />}

      {!showEmpty && (
        <div className="flex items-center justify-between border-t border-hairline px-4 py-3 text-xs text-ink-secondary">
          <span>{total !== undefined ? `${total} record${total === 1 ? "" : "s"}` : ""}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="rounded-lg border border-hairline p-1 disabled:opacity-30"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="rounded-lg border border-hairline p-1 disabled:opacity-30"
              aria-label="Next page"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
