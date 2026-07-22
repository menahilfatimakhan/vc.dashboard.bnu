import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  GraduationCap,
  FileText,
  Users,
  CalendarDays,
  TrendingUp,
  PartyPopper,
  ShieldAlert,
  Inbox,
  Building2,
  UserCog,
  Briefcase,
  Wallet,
  HandCoins,
  BookOpen,
  Landmark,
  Rocket,
  Settings,
  HelpCircle,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  speculative?: boolean;
}

export interface NavGroup {
  category: string;
  items: NavItem[];
}

export const OVERVIEW_ITEM: NavItem = {
  label: "Overview",
  href: "/overview",
  icon: LayoutDashboard,
};

export const NAV_GROUPS: NavGroup[] = [
  {
    category: "Academics",
    items: [
      { label: "Scholarships", href: "/academics/scholarships", icon: GraduationCap },
      { label: "Admissions & Applications", href: "/academics/admissions", icon: FileText },
      { label: "Enrolled Students", href: "/academics/enrolled-students", icon: Users },
      { label: "Classes", href: "/academics/classes", icon: CalendarDays },
      { label: "Student Performance", href: "/academics/student-performance", icon: TrendingUp },
      { label: "Student Life", href: "/academics/student-life", icon: PartyPopper, speculative: true },
    ],
  },
  {
    category: "Conduct & Support",
    items: [
      { label: "DC Cases", href: "/conduct/dc-cases", icon: ShieldAlert },
      { label: "E-Portal Cases", href: "/conduct/e-portal-cases", icon: Inbox },
    ],
  },
  {
    category: "Operations",
    items: [{ label: "Hostel Accommodation", href: "/operations/hostel", icon: Building2 }],
  },
  {
    category: "Employees",
    items: [
      { label: "Faculty", href: "/employees/faculty", icon: UserCog },
      { label: "Staff", href: "/employees/staff", icon: Briefcase },
    ],
  },
  {
    category: "Finance",
    items: [{ label: "Finance", href: "/finance", icon: Wallet }],
  },
  {
    category: "ORIP",
    items: [
      { label: "Grants", href: "/research/grants", icon: HandCoins },
      { label: "Research & Publications", href: "/research/publications", icon: BookOpen, speculative: true },
      { label: "BCPR", href: "/research/bcpr", icon: Landmark, speculative: true },
      { label: "Innovation & Incubation", href: "/research/innovation", icon: Rocket, speculative: true },
    ],
  },
];

export const FOOTER_ITEMS: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Help", href: "/help", icon: HelpCircle },
];
