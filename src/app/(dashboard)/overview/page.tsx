"use client";

import { Users, UserCog, Briefcase, ShieldAlert, Inbox, HandCoins, GraduationCap, AlertTriangle, CircleAlert } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { useAsync } from "@/hooks/useAsync";
import { getOverviewSummary } from "@/lib/services/overviewService";
import { formatCurrencyPKR } from "@/lib/utils/format";

const KIND_STYLES = {
  critical: { icon: CircleAlert, chip: "bg-status-critical-50 text-status-critical" },
  warning: { icon: AlertTriangle, chip: "bg-status-warning-50 text-status-warning" },
  good: { icon: AlertTriangle, chip: "bg-status-good-50 text-status-good" },
} as const;

export default function OverviewPage() {
  const overview = useAsync(() => getOverviewSummary(), []);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Overview" />

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
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

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
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

        <div className="flex min-h-[320px] flex-col rounded-2xl border border-hairline bg-surface p-5 shadow-card transition-all duration-150 hover:-translate-y-px hover:border-hairline-hover hover:shadow-card-hover">
          <h3 className="mb-1 text-[15px] font-semibold text-ink">Attention Needed</h3>
          {overview.loading || !overview.data ? (
            <div className="mt-2 space-y-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton-shimmer h-14 rounded-lg" />
              ))}
            </div>
          ) : overview.data.activityFeed.length === 0 ? (
            <p className="mt-3 text-sm text-ink-muted">Nothing flagged right now.</p>
          ) : (
            <ul className="mt-2 flex flex-1 flex-col">
              {overview.data.activityFeed.map((item) => {
                const style = KIND_STYLES[item.kind];
                const Icon = style.icon;
                return (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 border-b border-hairline py-3 transition-colors duration-150 last:border-0 hover:bg-subtle"
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.chip}`}>
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-ink">{item.title}</p>
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
