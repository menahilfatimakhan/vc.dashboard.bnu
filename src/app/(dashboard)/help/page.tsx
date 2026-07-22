import { HelpCircle, Mail } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

const FAQS = [
  {
    q: "Where does the data on this dashboard come from?",
    a: "This is a Phase 1a prototype — every number, chart, and record is generated sample data, not a live feed from BNU's systems. It's built to show what the dashboard will look like once it's connected to real data.",
  },
  {
    q: "Can I drill into a specific school or programme?",
    a: "Yes. Most modules let you click a bar, slice, or filter to narrow down from university-wide to a specific school or programme. Use the breadcrumb at the top of a page to jump back up a level.",
  },
  {
    q: "Why does Finance just say \"Coming Soon\"?",
    a: "Finance isn't in scope for this phase of the build. It's kept in the sidebar so the menu structure is complete, but there's no financial data behind it yet.",
  },
  {
    q: "Can I export or download data from a page?",
    a: "Not yet — export/download isn't built in this prototype.",
  },
];

export default function HelpPage() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Help" showDate={false} />

      <div className="rounded-2xl border border-hairline bg-surface p-5 shadow-card">
        <h3 className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-ink">
          <HelpCircle className="h-4 w-4 text-accent-500" strokeWidth={1.5} /> Frequently asked questions
        </h3>
        <div className="flex flex-col">
          {FAQS.map((item) => (
            <div key={item.q} className="border-b border-hairline py-4 first:pt-0 last:border-0 last:pb-0">
              <p className="text-sm font-semibold text-ink">{item.q}</p>
              <p className="mt-1 text-sm text-ink-secondary">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-hairline bg-surface p-5 shadow-card">
        <h3 className="mb-1 flex items-center gap-2 text-[15px] font-semibold text-ink">
          <Mail className="h-4 w-4 text-accent-500" strokeWidth={1.5} /> Still need help?
        </h3>
        <p className="text-sm text-ink-muted">
          This prototype doesn&apos;t have a live support channel yet. Once it does, this is where you&apos;ll be
          able to reach the team behind the dashboard.
        </p>
      </div>
    </div>
  );
}
