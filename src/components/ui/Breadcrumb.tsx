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
  return (
    <nav className="flex flex-wrap items-center gap-1 text-sm">
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
                  ? "font-medium text-ink"
                  : "text-ink-secondary hover:text-brand-steel hover:underline"
              }
            >
              {item.label}
            </button>
            {!isLast && <ChevronRight className="h-3.5 w-3.5 text-ink-muted" />}
          </span>
        );
      })}
    </nav>
  );
}
