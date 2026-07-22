"use client";

import { BookOpen, Award, Globe2, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { useAsync } from "@/hooks/useAsync";
import { getResearchSummary } from "@/lib/services/researchService";

export default function ResearchPublicationsPage() {
  const research = useAsync(() => getResearchSummary({}), []);

  const unesco = research.data?.flagshipInitiatives.find((f) => f.id === "BNU-RES-FLAG-UNESCO");

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Research & Publications" speculative />

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <SummaryCard label="Publications" value={research.data?.totalPublications} loading={research.loading} icon={BookOpen} />
        <SummaryCard label="Grants Applied" value={research.data?.grantsApplied} loading={research.loading} icon={Award} />
        <SummaryCard label="Grants Won" value={research.data?.grantsWon} loading={research.loading} icon={Award} />
        <SummaryCard label="Active Partnerships" value={research.data?.partnerships.length} loading={research.loading} icon={Globe2} />
      </div>

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
  );
}
