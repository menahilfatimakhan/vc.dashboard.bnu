import type { NavGroup as NavGroupData } from "@/config/nav";
import { NavLink } from "./NavLink";

export function NavGroup({ group }: { group: NavGroupData }) {
  return (
    <div className="mb-1">
      <p className="px-3 pt-6 pb-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-ink-muted">
        {group.category}
      </p>
      <ul className="flex flex-col gap-0.5">
        {group.items.map((item) => (
          <li key={item.href}>
            <NavLink href={item.href} icon={item.icon} label={item.label} speculative={item.speculative} />
          </li>
        ))}
      </ul>
    </div>
  );
}
