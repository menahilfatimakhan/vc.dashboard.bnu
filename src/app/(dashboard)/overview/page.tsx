"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Users, UserCog, Briefcase, ShieldAlert, Inbox, HandCoins, GraduationCap, FileText } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/ui/PageHeader";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { LineChartInner } from "@/components/ui/charts/LineChartInner";
import { useAsync } from "@/hooks/useAsync";
import { getOverviewSummary } from "@/lib/services/overviewService";
import { formatCurrencyPKR, formatCompactPKR } from "@/lib/utils/format";
import { ACCENT, INK, TOOLTIP } from "@/config/theme";

const TILE_LINKS: Record<string, string> = {
  totalEnrolled: "/academics/enrolled-students",
  faculty: "/employees/faculty",
  staff: "/employees/staff",
  scholarshipSpend: "/academics/scholarships",
  openDCCases: "/conduct/dc-cases",
  escalatedEPortalCases: "/conduct/e-portal-cases",
  grantsEndingSoon: "/research/grants",
  applicationPool: "/academics/admissions",
};

function LinkedTile({
  href,
  label,
  value,
  loading,
  icon: Icon,
  accent,
}: {
  href: string;
  label: string;
  value: string | number | undefined;
  loading: boolean;
  icon: LucideIcon;
  accent?: "default" | "danger";
}) {
  if (loading || value === undefined) {
    return <SummaryCard label={label} value={value} loading={loading} icon={Icon} accent={accent} />;
  }

  const chipClasses = accent === "danger" ? "bg-status-critical-50 text-status-critical" : "bg-accent-50 text-accent-500";

  return (
    <Link
      href={href}
      className="group block w-full rounded-2xl border border-hairline bg-surface p-5 text-left shadow-card transition-all duration-150 hover:-translate-y-px hover:border-hairline-hover hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.04em] text-ink-muted">{label}</span>
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${chipClasses}`}>
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </span>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <span className="text-[30px] leading-none font-bold tracking-[-0.02em] text-ink tabular-nums">{value}</span>
        <ArrowRight className="h-4 w-4 shrink-0 text-ink-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-accent-500" strokeWidth={1.75} />
      </div>
    </Link>
  );
}

export default function OverviewPage() {
  const overview = useAsync(() => getOverviewSummary(), []);

  const schoolCountData = (overview.data?.schoolCountApplicants ?? []).map((d) => ({
    schools: `${d.schoolsAppliedTo}`,
    "This Year": d.thisYear,
    "Last Year": d.lastYear,
  }));

  const tuitionData = (overview.data?.tuitionRevenue ?? []).map((t) => ({ x: t.label, y: t.revenue }));

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="VC Dashboard" />

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <LinkedTile
          href={TILE_LINKS.totalEnrolled}
          label="Total Enrolled"
          value={overview.data?.totalEnrolled}
          loading={overview.loading}
          icon={Users}
        />
        <LinkedTile
          href={TILE_LINKS.faculty}
          label="Faculty"
          value={overview.data?.facultyHeadcount}
          loading={overview.loading}
          icon={UserCog}
        />
        <LinkedTile
          href={TILE_LINKS.staff}
          label="Staff"
          value={overview.data?.staffHeadcount}
          loading={overview.loading}
          icon={Briefcase}
        />
        <LinkedTile
          href={TILE_LINKS.applicationPool}
          label={overview.data ? `Application Pool — ${overview.data.upcomingSemesterLabel}` : "Application Pool"}
          value={overview.data?.applicationPoolUpcoming}
          loading={overview.loading}
          icon={FileText}
        />
        <LinkedTile
          href={TILE_LINKS.scholarshipSpend}
          label="Scholarship Spend"
          value={overview.data ? formatCurrencyPKR(overview.data.scholarshipSpend) : undefined}
          loading={overview.loading}
          icon={GraduationCap}
        />
        <LinkedTile
          href={TILE_LINKS.openDCCases}
          label="Open DC Cases"
          value={overview.data?.openDCCases}
          loading={overview.loading}
          icon={ShieldAlert}
          accent={overview.data && overview.data.openDCCases > 0 ? "danger" : "default"}
        />
        <LinkedTile
          href={TILE_LINKS.escalatedEPortalCases}
          label="Escalated E-Portal Cases"
          value={overview.data?.escalatedEPortalCases}
          loading={overview.loading}
          icon={Inbox}
          accent={overview.data && overview.data.escalatedEPortalCases > 0 ? "danger" : "default"}
        />
        <LinkedTile
          href={TILE_LINKS.grantsEndingSoon}
          label="Grants Ending Soon"
          value={overview.data?.grantsEndingSoon}
          loading={overview.loading}
          icon={HandCoins}
          accent={overview.data && overview.data.grantsEndingSoon > 0 ? "danger" : "default"}
        />
      </div>

      <SummaryCard
        label="Avg. Active CGPA"
        value={overview.data ? overview.data.cgpaAverage.toFixed(2) : undefined}
        loading={overview.loading}
        icon={GraduationCap}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard
          title="Applicant Pool Breadth"
          subtitle="Number of schools applied to per applicant — this year vs last year"
          loading={overview.loading}
          height={300}
        >
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={schoolCountData} margin={{ top: 8, right: 8, bottom: 4, left: 4 }}>
              <CartesianGrid vertical={false} stroke={INK.grid} />
              <XAxis dataKey="schools" tick={{ fontSize: 11, fill: INK.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: INK.muted }} axisLine={false} tickLine={false} width={40} />
              <Tooltip
                cursor={{ fill: INK.subtle }}
                contentStyle={TOOLTIP.contentStyle}
                itemStyle={TOOLTIP.itemStyle}
                labelStyle={TOOLTIP.labelStyle}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: INK.muted }} iconType="circle" iconSize={8} />
              <Bar dataKey="This Year" fill={ACCENT[500]} radius={[6, 6, 0, 0]} maxBarSize={28} />
              <Line type="monotone" dataKey="Last Year" stroke={ACCENT[600]} strokeWidth={2} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Financial Pulse"
          subtitle="Tuition revenue trend by semester (Overview-only, Finance stays out of scope)"
          loading={overview.loading}
          height={300}
        >
          <LineChartInner data={tuitionData} height={300} yTickFormatter={formatCompactPKR} />
        </ChartCard>
      </div>
    </div>
  );
}
