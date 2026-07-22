"use client";

import { useState } from "react";
import { Cpu, Rocket, Building2, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAsync } from "@/hooks/useAsync";
import { getCyberParticipants, getIncubationVentures, getRegisteredVentures } from "@/lib/services/innovationService";

const TABS = ["Cyber", "Incubation", "Venture", "SkillToEarn"] as const;
type Tab = (typeof TABS)[number];

export default function InnovationIncubationPage() {
  const [tab, setTab] = useState<Tab>("Cyber");

  const cyber = useAsync(() => getCyberParticipants(), []);
  const incubation = useAsync(() => getIncubationVentures(), []);
  const ventures = useAsync(() => getRegisteredVentures(), []);

  const cyberColumns: Column<{ id: string; name: string; email: string; schoolName: string }>[] = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "schoolName", header: "School" },
  ];

  const incubationColumns: Column<{ id: string; ventureName: string; founderName: string; founderContact: string; description: string }>[] = [
    { key: "ventureName", header: "Venture" },
    { key: "founderName", header: "Founder" },
    { key: "founderContact", header: "Contact" },
    { key: "description", header: "Description" },
  ];

  const ventureColumns: Column<{ id: string; registrationNumber: string; ventureName: string; schoolName: string; description: string }>[] = [
    { key: "registrationNumber", header: "Registration #" },
    { key: "ventureName", header: "Venture" },
    { key: "schoolName", header: "School" },
    { key: "description", header: "Description" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Innovation & Incubation" speculative />

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <SummaryCard label="Cyber Enrolled" value={cyber.data?.length} loading={cyber.loading} icon={Cpu} />
        <SummaryCard label="Active Ventures (Incubation)" value={incubation.data?.length} loading={incubation.loading} icon={Rocket} />
        <SummaryCard label="Registered Ventures" value={ventures.data?.length} loading={ventures.loading} icon={Building2} />
        <SummaryCard label="SkillToEarn" value="—" loading={false} icon={Sparkles} />
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

      {tab === "Cyber" && (
        <DataTable
          columns={cyberColumns}
          rows={cyber.data}
          total={cyber.data?.length}
          page={1}
          pageSize={cyber.data?.length ?? 20}
          onPageChange={() => {}}
          loading={cyber.loading}
          emptyMessage="No Cyber participants."
        />
      )}

      {tab === "Incubation" && (
        <DataTable
          columns={incubationColumns}
          rows={incubation.data}
          total={incubation.data?.length}
          page={1}
          pageSize={incubation.data?.length ?? 20}
          onPageChange={() => {}}
          loading={incubation.loading}
          emptyMessage="No active incubation ventures."
        />
      )}

      {tab === "Venture" && (
        <DataTable
          columns={ventureColumns}
          rows={ventures.data}
          total={ventures.data?.length}
          page={1}
          pageSize={ventures.data?.length ?? 20}
          onPageChange={() => {}}
          loading={ventures.loading}
          emptyMessage="No registered ventures."
        />
      )}

      {tab === "SkillToEarn" && (
        <div className="rounded-2xl border border-hairline bg-surface p-5 shadow-card">
          <EmptyState message="SkillToEarn — no details yet. Pending specification." />
        </div>
      )}
    </div>
  );
}
