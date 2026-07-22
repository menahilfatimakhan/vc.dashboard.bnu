"use client";

import { Sparkles, Landmark } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { useAsync } from "@/hooks/useAsync";
import { getResearchSummary } from "@/lib/services/researchService";

export default function BCPRPage() {
  const research = useAsync(() => getResearchSummary({}), []);

  const bcpr = research.data?.flagshipInitiatives.find((f) => f.id === "BNU-RES-FLAG-BCPR");

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="BCPR" speculative />

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <SummaryCard label="Director" value={bcpr?.leadName} loading={research.loading} icon={Landmark} />
      </div>

      {bcpr && (
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
