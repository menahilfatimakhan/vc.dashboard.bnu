"use client";

import { Users, UserCog, Briefcase, ShieldAlert, Inbox, HandCoins, GraduationCap, AlertTriangle, CircleAlert } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { useAsync } from "@/hooks/useAsync";
import { getOverviewSummary } from "@/lib/services/overviewService";
import { formatCurrencyPKR } from "@/lib/utils/format";

const KIND_STYLES = {
  critical: { icon: CircleAlert, className: "text-status-critical" },
  warning: { icon: AlertTriangle, className: "text-status-warning" },
  good: { icon: AlertTriangle, className: "text-status-good" },
} as const;

export default function OverviewPage() {
  const overview = useAsync(() => getOverviewSummary(), []);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Overview" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard label="Total Enrolled" value={overview.data?.totalEnrolled} loading={overview.loading} icon={Users} />
        <SummaryCard label="Faculty" value={overview.data?.facultyHeadcount} loading={overview.loading} icon={UserCog} />
        <SummaryCard label="Staff" value={overview.data?.staffHeadcount} loading={overview.loading} icon={Briefcase} />
        <SummaryCard
          label="Scholarship Spend"
          value={overview.data ? formatCurrencyPKR(overview.data.scholarshipSpend) : undefined}
          loading={overview.loading}
          icon={GraduationCap}
        />
        <SummaryCard
          label="Open DC Cases"
          value={overview.data?.openDCCases}
          loading={overview.loading}
          icon={ShieldAlert}
          accent={overview.data && overview.data.openDCCases > 0 ? "danger" : "default"}
        />
        <SummaryCard
          label="Escalated E-Portal Cases"
          value={overview.data?.escalatedEPortalCases}
          loading={overview.loading}
          icon={Inbox}
          accent={overview.data && overview.data.escalatedEPortalCases > 0 ? "danger" : "default"}
        />
        <SummaryCard
          label="Grants Ending Soon"
          value={overview.data?.grantsEndingSoon}
          loading={overview.loading}
          icon={HandCoins}
          accent={overview.data && overview.data.grantsEndingSoon > 0 ? "danger" : "default"}
        />
        <SummaryCard
          label="Avg. Active CGPA"
          value={overview.data ? overview.data.cgpaAverage.toFixed(2) : undefined}
          loading={overview.loading}
          icon={GraduationCap}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard
            title="Enrollment by School"
            subtitle="Active students, university-wide"
            variant="bar"
            data={overview.data?.enrollmentBySchool}
            loading={overview.loading}
            height={300}
          />
        </div>

        <div className="rounded-2xl border border-black/5 bg-surface p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-ink">Attention Needed</h3>
          {overview.loading || !overview.data ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-lg bg-black/[0.06]" />
              ))}
            </div>
          ) : overview.data.activityFeed.length === 0 ? (
            <p className="text-sm text-ink-muted">Nothing flagged right now.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {overview.data.activityFeed.map((item) => {
                const style = KIND_STYLES[item.kind];
                const Icon = style.icon;
                return (
                  <li key={item.id} className="flex items-start gap-2.5">
                    <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${style.className}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">{item.title}</p>
                      <p className="truncate text-xs text-ink-muted">{item.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
