import { statusTone, type StatusTone } from "@/lib/utils/color";

const TONE_STYLES: Record<StatusTone, string> = {
  success: "bg-status-good-50 text-status-good",
  warning: "bg-status-warning-50 text-status-warning",
  danger: "bg-status-critical-50 text-status-critical",
  neutral: "bg-accent-50 text-accent-600",
};

const DOT_STYLES: Record<StatusTone, string> = {
  success: "bg-status-good",
  warning: "bg-status-warning",
  danger: "bg-status-critical",
  neutral: "bg-accent-500",
};

export function StatusPill({ status }: { status: string }) {
  const tone = statusTone(status);

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium whitespace-nowrap ${TONE_STYLES[tone]}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOT_STYLES[tone]}`} />
      {status}
    </span>
  );
}
