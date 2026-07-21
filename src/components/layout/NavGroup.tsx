"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavGroup as NavGroupData } from "@/config/nav";

export function NavGroup({ group }: { group: NavGroupData }) {
  const pathname = usePathname();

  return (
    <div className="mb-1">
      <p className="px-3 pb-1.5 pt-4 text-[11px] font-semibold uppercase tracking-wider text-white/40">
        {group.category}
      </p>
      <ul className="flex flex-col gap-0.5">
        {group.items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-brand-steel text-white font-medium"
                    : "text-white/75 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                <span className="truncate">{item.label}</span>
                {item.speculative && (
                  <span className="ml-auto shrink-0 text-[9px] font-semibold uppercase tracking-wide text-white/40">
                    Spec.
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
