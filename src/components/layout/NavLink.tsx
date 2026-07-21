"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

export interface NavLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  speculative?: boolean;
}

export function NavLink({ href, icon: Icon, label, speculative }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13.5px] transition-colors duration-150 ${
        isActive ? "bg-accent-50 font-semibold text-accent-600" : "text-ink-secondary hover:bg-subtle hover:text-ink"
      }`}
    >
      {isActive && <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-accent-500" />}
      <Icon
        className={`h-[18px] w-[18px] shrink-0 transition-colors duration-150 ${
          isActive ? "text-accent-500" : "text-ink-muted group-hover:text-ink-secondary"
        }`}
        strokeWidth={1.5}
      />
      <span className="truncate">{label}</span>
      {speculative && (
        <span className="ml-auto shrink-0 rounded-full bg-accent-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-ink-muted">
          Spec.
        </span>
      )}
    </Link>
  );
}
