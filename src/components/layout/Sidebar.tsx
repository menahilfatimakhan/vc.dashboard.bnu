"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers } from "lucide-react";
import { OVERVIEW_ITEM, NAV_GROUPS, FOOTER_ITEMS } from "@/config/nav";
import { UserBlock } from "./UserBlock";
import { NavGroup } from "./NavGroup";

export function Sidebar() {
  const pathname = usePathname();
  const OverviewIcon = OVERVIEW_ITEM.icon;

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col bg-brand-navy px-3 py-4 md:flex">
      <div className="flex items-center gap-2 px-2 pb-4">
        <Layers className="h-6 w-6 text-white" strokeWidth={2.2} />
        <span className="text-lg font-semibold text-white">BNU Dashboard</span>
      </div>

      <UserBlock />

      <nav className="mt-2 flex-1 overflow-y-auto">
        <Link
          href={OVERVIEW_ITEM.href}
          className={`mt-3 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
            pathname === OVERVIEW_ITEM.href
              ? "bg-brand-steel font-medium text-white"
              : "text-white/75 hover:bg-white/5 hover:text-white"
          }`}
        >
          <OverviewIcon className="h-4 w-4 shrink-0" strokeWidth={2} />
          {OVERVIEW_ITEM.label}
        </Link>

        {NAV_GROUPS.map((group) => (
          <NavGroup key={group.category} group={group} />
        ))}
      </nav>

      <div className="mt-2 border-t border-white/10 pt-2">
        {FOOTER_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <span
              key={item.href}
              className="flex cursor-not-allowed items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/40"
              title="Not interactive in this prototype"
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
              {item.label}
            </span>
          );
        })}
      </div>
    </aside>
  );
}
