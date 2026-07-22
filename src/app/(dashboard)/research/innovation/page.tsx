"use client";

import { useState } from "react";
import { Cpu, Rocket, Building2, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { useAsync } from "@/hooks/useAsync";
import { getCyberParticipants, getIncubationVentures, getRegisteredVentures } from "@/lib/services/innovationService";

const TABS = ["Cyber", "Incubation", "Venture Den", "SkillToEarn"] as const;
type Tab = (typeof TABS)[number];

function InfoBanner({ title, description, stats }: { title: string; description: string; stats: { label: string; value: string | number }[] }) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface p-5 shadow-card">
      <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-xs text-ink-secondary">{description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {stats.map((s) => (
          <span key={s.label} className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1 text-xs font-medium text-accent-600">
            {s.label}: <span className="tabular-nums">{s.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

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
        <SummaryCard label="SkillToEarn" value="Upcoming" loading={false} icon={Sparkles} />
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
        <div className="flex flex-col gap-4">
          <InfoBanner
            title="BNU Cyber"
            description="A hands-on cybersecurity training track open to students across schools, covering foundational security practice through to applied labs and certification prep."
            stats={[
              { label: "Enrolled", value: cyber.data?.length ?? "—" },
              { label: "Trained", value: 54 },
            ]}
          />
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
        </div>
      )}

      {tab === "Incubation" && (
        <div className="flex flex-col gap-4">
          <InfoBanner
            title="Incubation Program"
            description="Runs under Innovatrium, BNU's startup incubation hub — taking student founders from early-stage idea validation through a semester-long incubation track and, for the most promising ventures, formal registration with the National Incubation Center (NIC)."
            stats={[
              { label: "Startups Launched", value: 32 },
              { label: "NIC-Registered Startups", value: 3 },
              { label: "Currently Active", value: incubation.data?.length ?? "—" },
            ]}
          />
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
        </div>
      )}

      {tab === "Venture Den" && (
        <div className="flex flex-col gap-4">
          <InfoBanner
            title="Venture Den"
            description="The registry of student-run ventures formally recognized by the university — spanning products, services, and social enterprises operating out of BNU's schools."
            stats={[
              { label: "Ventures", value: 12 },
              { label: "Registered", value: ventures.data?.length ?? "—" },
            ]}
          />
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
        </div>
      )}

      {tab === "SkillToEarn" && (
        <InfoBanner
          title="SkillToEarn"
          description="A planned initiative connecting students' trained skills with paid, real-world project work. Not yet launched — scope and rollout timeline are still being finalized."
          stats={[{ label: "Status", value: "To be launched" }]}
        />
      )}
    </div>
  );
}
