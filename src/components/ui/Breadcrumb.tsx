import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  level: string;
  id: string | null;
  label: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onJump: (index: number) => void;
}

export function Breadcrumb({ items, onJump }: BreadcrumbProps) {
  const key = items.map((i) => i.id ?? "root").join(">");

  return (
    <nav key={key} className="breadcrumb-slide-in flex flex-wrap items-center gap-1 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.level}-${item.id ?? "root"}`} className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onJump(index)}
              disabled={isLast}
              className={
                isLast
                  ? "font-semibold text-ink"
                  : "rounded-lg px-1 py-0.5 text-ink-secondary transition-colors duration-150 hover:bg-subtle hover:text-accent-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500/40"
              }
            >
              {item.label}
            </button>
            {!isLast && <ChevronRight className="h-3.5 w-3.5 text-ink-muted" strokeWidth={1.5} />}
          </span>
        );
      })}
    </nav>
  );
}
