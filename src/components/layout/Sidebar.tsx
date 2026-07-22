"use client";

import { Layers } from "lucide-react";
import { OVERVIEW_ITEM, NAV_GROUPS, FOOTER_ITEMS } from "@/config/nav";
import { UserBlock } from "./UserBlock";
import { NavGroup } from "./NavGroup";
import { NavLink } from "./NavLink";

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-hairline bg-surface px-3 py-4 md:flex">
      <div className="flex items-center gap-2 px-2 pb-4">
        <Layers className="h-6 w-6 text-accent-500" strokeWidth={2.2} />
        <span className="text-lg font-semibold text-ink">BNU Vitals</span>
      </div>

      <UserBlock />

      <nav className="minimal-scroll mt-2 flex-1 overflow-y-auto">
        <div className="mt-3">
          <NavLink href={OVERVIEW_ITEM.href} icon={OVERVIEW_ITEM.icon} label={OVERVIEW_ITEM.label} />
        </div>

        {NAV_GROUPS.map((group) => (
          <NavGroup key={group.category} group={group} />
        ))}
      </nav>

      <div className="mt-2 border-t border-hairline pt-2">
        {FOOTER_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <span
              key={item.href}
              className="flex cursor-not-allowed items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13.5px] text-ink-muted"
              title="Not interactive in this prototype"
            >
              <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} />
              {item.label}
            </span>
          );
        })}
      </div>
    </aside>
  );
}
