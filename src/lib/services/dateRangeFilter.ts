export function inDateRange(dateISO: string, dateFrom?: string, dateTo?: string): boolean {
  if (dateFrom && dateISO < dateFrom) return false;
  if (dateTo && dateISO > dateTo) return false;
  return true;
}

export function yearInRange(year: number, dateFrom?: string, dateTo?: string): boolean {
  if (dateFrom && year < new Date(dateFrom).getFullYear()) return false;
  if (dateTo && year > new Date(dateTo).getFullYear()) return false;
  return true;
}
