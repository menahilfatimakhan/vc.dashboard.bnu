import { X } from "lucide-react";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterFieldConfig {
  key: string;
  label: string;
  kind: "select" | "date";
  options?: FilterOption[];
}

export interface FilterBarProps {
  filters: object;
  config: FilterFieldConfig[];
  onChange: (key: string, value: string | undefined) => void;
  onClearAll: () => void;
}

function resolveOptionLabel(config: FilterFieldConfig, value: string): string {
  return config.options?.find((o) => o.value === value)?.label ?? value;
}

export function FilterBar({ filters: filtersProp, config, onChange, onClearAll }: FilterBarProps) {
  const filters = filtersProp as Record<string, string | undefined>;
  const activeChips = config.filter((f) => filters[f.key]);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-surface p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        {config.map((field) => {
          if (field.kind === "date") {
            return (
              <label key={field.key} className="flex items-center gap-1.5 text-xs text-ink-secondary">
                {field.label}
                <input
                  type="date"
                  value={filters[field.key] ?? ""}
                  onChange={(e) => onChange(field.key, e.target.value || undefined)}
                  className="rounded-lg border border-hairline bg-surface px-2 py-1.5 text-sm text-ink outline-none focus:border-brand-steel"
                />
              </label>
            );
          }
          return (
            <select
              key={field.key}
              value={filters[field.key] ?? ""}
              onChange={(e) => onChange(field.key, e.target.value || undefined)}
              className="rounded-lg border border-hairline bg-surface px-2.5 py-1.5 text-sm text-ink outline-none focus:border-brand-steel"
            >
              <option value="">{field.label}</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          );
        })}
        {activeChips.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="ml-auto text-xs font-medium text-brand-steel hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeChips.map((field) => (
            <FilterChip
              key={field.key}
              label={`${field.label}: ${resolveOptionLabel(field, filters[field.key]!)}`}
              onRemove={() => onChange(field.key, undefined)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-steel/10 px-3 py-1 text-xs font-medium text-brand-navy">
      {label}
      <button type="button" onClick={onRemove} aria-label={`Remove ${label} filter`}>
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
