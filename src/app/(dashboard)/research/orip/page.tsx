"use client";

import { useState } from "react";
import Link from "next/link";
import { HandCoins, CheckCircle2, Clock, AlertTriangle, BookOpen, Award, Globe2, Sparkles, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { useAsync } from "@/hooks/useAsync";
import { getGrantsSummary } from "@/lib/services/grantsService";
import { getResearchSummary } from "@/lib/services/researchService";

const TABS = ["Grants", "Publications", "Innovation", "BCPR"] as const;
type Tab = (typeof TABS)[number];

export default function ORIPPage() {
  const [tab, setTab] = useState<Tab>("Grants");

  const grants = useAsync(() => getGrantsSummary({}), []);
  const research = useAsync(() => getResearchSummary({}), []);

  const innovatrium = research.data?.flagshipInitiatives.find((f) => f.id === "BNU-RES-FLAG-INNOVATRIUM");
  const bcpr = research.data?.flagshipInitiatives.find((f) => f.id === "BNU-RES-FLAG-BCPR");
  const unesco = research.data?.flagshipInitiatives.find((f) => f.id === "BNU-RES-FLAG-UNESCO");

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="ORIP — Office of Research, Innovation & Partnerships" speculative />

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <SummaryCard label="Total Grants" value={grants.data?.total} loading={grants.loading} icon={HandCoins} />
        <SummaryCard label="Publications" value={research.data?.totalPublications} loading={research.loading} icon={BookOpen} />
        <SummaryCard label="Research Grants Won" value={research.data?.grantsWon} loading={research.loading} icon={Award} />
        <SummaryCard label="Active Partnerships" value={research.data?.partnerships.length} loading={research.loading} icon={Globe2} />
      </div>

      <div className="flex gap-1 rounded-xl border border-hairline bg-surface p-1">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
              tab === t ? "bg-accent-500 text-white" : "text-ink-secondary hover:bg-subtle"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Grants" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            <SummaryCard label="Completed" value={grants.data?.completed} loading={grants.loading} icon={CheckCircle2} />
            <SummaryCard label="Underway" value={grants.data?.underway} loading={grants.loading} icon={Clock} />
            <SummaryCard
              label="Ending Within 6 Months"
              value={grants.data?.endingSoon}
              loading={grants.loading}
              icon={AlertTriangle}
              accent={grants.data && grants.data.endingSoon > 0 ? "danger" : "default"}
            />
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <ChartCard title="Completed vs Underway" variant="donut" data={grants.data?.byStatus} loading={grants.loading} />
            <ChartCard title="By Owning Unit" variant="bar" data={grants.data?.byOwner} loading={grants.loading} />
          </div>
        </div>
      )}

      {tab === "Publications" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <ChartCard
              title="Publications — 5-Year Trend"
              variant="line"
              trend={research.data?.publicationTrend.map((t) => ({ x: t.year, y: t.count }))}
              loading={research.loading}
            />
            <ChartCard
              title="Publications by School"
              variant="bar"
              data={research.data?.publicationsBySchool}
              loading={research.loading}
            />
            <ChartCard
              title="Research Grants: Applied vs Won vs Rejected"
              variant="donut"
              data={research.data?.grantsByStatus}
              loading={research.loading}
            />
          </div>

          <div className="rounded-2xl border border-hairline bg-surface p-5 shadow-card">
            <h3 className="mb-3 text-[15px] font-semibold text-ink">Active MoUs & Partnerships</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr className="border-b border-hairline bg-canvas text-left text-[11px] font-semibold tracking-[0.04em] text-ink-muted uppercase">
                    <th className="px-3 py-2">Partner</th>
                    <th className="px-3 py-2">Country</th>
                    <th className="px-3 py-2">Focus Area</th>
                    <th className="px-3 py-2 text-right">Signed</th>
                  </tr>
                </thead>
                <tbody>
                  {research.data?.partnerships.map((p) => (
                    <tr key={p.id} className="border-b border-hairline last:border-0 hover:bg-subtle">
                      <td className="px-3 py-2 font-medium text-ink">{p.partnerName}</td>
                      <td className="px-3 py-2 text-ink-secondary">{p.country}</td>
                      <td className="px-3 py-2 text-ink-secondary">{p.focusArea}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-ink">{p.signedYear}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {unesco && (
            <div className="rounded-2xl border border-hairline bg-surface p-5 shadow-card">
              <h3 className="mb-1 flex items-center gap-2 text-[15px] font-semibold text-ink">
                <Sparkles className="h-4 w-4 text-accent-500" strokeWidth={1.5} /> {unesco.name}
              </h3>
              <p className="mt-1 text-xs text-ink-secondary">{unesco.description}</p>
              <p className="mt-2 text-xs text-ink-muted">
                {unesco.leadRole}: {unesco.leadName}
              </p>
            </div>
          )}
        </div>
      )}

      {tab === "Innovation" && (
        <div className="flex flex-col gap-4">
          {innovatrium && (
            <div className="rounded-2xl border border-hairline bg-surface p-5 shadow-card">
              <h3 className="mb-1 flex items-center gap-2 text-[15px] font-semibold text-ink">
                <Sparkles className="h-4 w-4 text-accent-500" strokeWidth={1.5} /> {innovatrium.name}
              </h3>
              <p className="mt-1 text-xs text-ink-secondary">{innovatrium.description}</p>
              <p className="mt-2 text-xs text-ink-muted">
                {innovatrium.leadRole}: {innovatrium.leadName}
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {innovatrium.relatedEntities.map((e) => (
                  <li key={e} className="rounded-full bg-accent-50 px-2 py-0.5 text-[10px] font-medium text-accent-600">
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Link
            href="/research/innovation"
            className="group flex items-center justify-between rounded-2xl border border-hairline bg-surface p-5 shadow-card transition-all duration-150 hover:-translate-y-px hover:border-hairline-hover hover:shadow-card-hover"
          >
            <div>
              <p className="text-sm font-semibold text-ink">Innovation & Incubation module</p>
              <p className="mt-1 text-xs text-ink-muted">Cyber, Incubation, Venture, and SkillToEarn rosters</p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-ink-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-accent-500" strokeWidth={1.75} />
          </Link>
        </div>
      )}

      {tab === "BCPR" && bcpr && (
        <div className="rounded-2xl border border-hairline bg-surface p-5 shadow-card">
          <h3 className="mb-1 flex items-center gap-2 text-[15px] font-semibold text-ink">
            <Sparkles className="h-4 w-4 text-accent-500" strokeWidth={1.5} /> {bcpr.name}
          </h3>
          <p className="mt-1 text-xs text-ink-secondary">{bcpr.description}</p>
          <p className="mt-2 text-xs text-ink-muted">
            {bcpr.leadRole}: {bcpr.leadName}
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {bcpr.relatedEntities.map((e) => (
              <li key={e} className="rounded-full bg-accent-50 px-2 py-0.5 text-[10px] font-medium text-accent-600">
                {e}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
