import type { CountEntry } from "../data/types";

/** Groups rows by a key, returning stable-ordered { key, label, value } counts. */
export function groupCount<T>(
  rows: T[],
  keyFn: (row: T) => string,
  labelFn: (key: string) => string = (k) => k,
): CountEntry[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const key = keyFn(row);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([key, value]) => ({ key, label: labelFn(key), value }))
    .sort((a, b) => b.value - a.value);
}
