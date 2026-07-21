import { ChevronDown, X } from "lucide-react";

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
    <div className="flex flex-col gap-3 rounded-2xl border border-hairline bg-surface p-4 shadow-card">
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
                  className="rounded-lg border border-hairline bg-surface px-2 py-1.5 text-sm text-ink outline-none transition-colors duration-150 focus:border-accent-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500/40"
                />
              </label>
            );
          }
          return (
            <div key={field.key} className="relative">
              <select
                value={filters[field.key] ?? ""}
                onChange={(e) => onChange(field.key, e.target.value || undefined)}
                className="appearance-none rounded-lg border border-hairline bg-surface py-1.5 pr-8 pl-2.5 text-sm text-ink outline-none transition-colors duration-150 focus:border-accent-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500/40"
              >
                <option value="">{field.label}</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" strokeWidth={1.5} />
            </div>
          );
        })}
        {activeChips.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="ml-auto rounded-lg px-2 py-1 text-xs font-medium text-accent-600 transition-colors duration-150 hover:bg-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500/40"
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
    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1 text-xs font-medium text-accent-600">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="rounded-full transition-colors duration-150 hover:text-accent-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500/40"
      >
        <X className="h-3 w-3" strokeWidth={1.5} />
      </button>
    </span>
  );
}
