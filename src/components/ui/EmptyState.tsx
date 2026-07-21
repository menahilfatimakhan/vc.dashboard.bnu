import { Inbox, type LucideIcon } from "lucide-react";

export interface EmptyStateProps {
  message: string;
  icon?: LucideIcon;
}

export function EmptyState({ message, icon: Icon = Inbox }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-subtle">
        <Icon className="h-6 w-6 text-ink-muted" strokeWidth={1.5} />
      </span>
      <p className="text-sm text-ink-muted">{message}</p>
    </div>
  );
}
