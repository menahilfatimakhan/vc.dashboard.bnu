"use client";

import { useEffect, useState } from "react";
import { Moon, Sparkles, Mail, HandCoins } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Toggle } from "@/components/ui/Toggle";
import { useTheme } from "@/hooks/useTheme";
import { getReduceMotionOverride, setReduceMotionOverride } from "@/hooks/usePrefersReducedMotion";

function SettingRow({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-hairline py-4 last:border-0">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-500">
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">{label}</p>
          <p className="text-xs text-ink-muted">{description}</p>
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} disabled={disabled} label={label} />
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [emailDigest, setEmailDigest] = useState(false);
  const [grantAlerts, setGrantAlerts] = useState(true);

  useEffect(() => {
    // Intentional: localStorage is only readable after mount, so this can't move out of the effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduceMotion(getReduceMotionOverride());
  }, []);

  function handleReduceMotionChange(checked: boolean) {
    setReduceMotion(checked);
    setReduceMotionOverride(checked);
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Settings" showDate={false} />

      <div className="rounded-2xl border border-hairline bg-surface p-5 shadow-card">
        <h3 className="mb-1 text-[15px] font-semibold text-ink">Appearance</h3>
        <p className="mb-2 text-xs text-ink-muted">Applies immediately and is remembered on this device.</p>
        <SettingRow
          icon={Moon}
          label="Dark Mode"
          description="Switch the dashboard to a dark color scheme."
          checked={theme === "dark"}
          onChange={(checked) => setTheme(checked ? "dark" : "light")}
        />
        <SettingRow
          icon={Sparkles}
          label="Reduce Motion"
          description="Turn off chart entrance animations and counting-up numbers."
          checked={reduceMotion}
          onChange={handleReduceMotionChange}
        />
      </div>

      <div className="rounded-2xl border border-hairline bg-surface p-5 shadow-card">
        <h3 className="mb-1 text-[15px] font-semibold text-ink">Notifications</h3>
        <p className="mb-2 text-xs text-ink-muted">
          Not wired up in this prototype — there&apos;s no backend to send these yet, but this is what they&apos;ll
          look like once notifications are built.
        </p>
        <SettingRow
          icon={Mail}
          label="Email digest for open DC cases"
          description="A weekly summary of pending disciplinary committee cases."
          checked={emailDigest}
          onChange={setEmailDigest}
          disabled
        />
        <SettingRow
          icon={HandCoins}
          label="Grant expiry alerts"
          description="Notify when a grant is within 6 months of its end date."
          checked={grantAlerts}
          onChange={setGrantAlerts}
          disabled
        />
      </div>
    </div>
  );
}
