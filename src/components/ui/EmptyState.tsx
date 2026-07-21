import { Inbox, type LucideIcon } from "lucide-react";

export interface EmptyStateProps {
  message: string;
  icon?: LucideIcon;
}

export function EmptyState({ message, icon: Icon = Inbox }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <Icon className="h-8 w-8 text-ink-muted" strokeWidth={1.5} />
      <p className="text-sm text-ink-muted">{message}</p>
    </div>
  );
}
