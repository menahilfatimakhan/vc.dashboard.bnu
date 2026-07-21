export interface PageHeaderProps {
  title: string;
  showDate?: boolean;
  speculative?: boolean;
}

const CURRENT_DATE_LABEL = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
});

export function PageHeader({ title, showDate = true, speculative }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-ink">{title}</h1>
        {showDate && <p className="text-sm text-ink-muted">{CURRENT_DATE_LABEL}</p>}
      </div>
      {speculative && (
        <span className="rounded-full bg-status-warning/15 px-3 py-1 text-xs font-medium text-status-warning">
          Speculative content — pending specification
        </span>
      )}
    </div>
  );
}
