"use client";

import Image from "next/image";
import { OVERVIEW_ITEM, NAV_GROUPS, FOOTER_ITEMS } from "@/config/nav";
import bnuLogo from "../../../assets/brand/favicon.jpg";
import { UserBlock } from "./UserBlock";
import { NavGroup } from "./NavGroup";
import { NavLink } from "./NavLink";

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-hairline bg-surface px-3 py-4 md:flex">
      <div className="flex items-center gap-2.5 px-2 pb-4">
        <Image src={bnuLogo} alt="BNU" className="h-10 w-10 shrink-0 rounded-md object-contain" priority />
        <h1 className="text-2xl font-bold tracking-tight text-ink">BNU Vitals</h1>
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
        {FOOTER_ITEMS.map((item) => (
          <NavLink key={item.href} href={item.href} icon={item.icon} label={item.label} />
        ))}
      </div>
    </aside>
  );
}
