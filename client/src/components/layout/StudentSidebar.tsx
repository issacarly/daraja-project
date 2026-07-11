"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  CalendarDays,
  Inbox,
  TrendingUp,
  HelpCircle,
  UserCircle2,
} from "lucide-react";

/**
 * Daraja — Student Vertical Sidebar
 *
 * Format reference: icon-on-top / label-below, stacked vertically down
 * a colored rail (as in the uploaded LMS screenshot), re-skinned onto
 * Daraja's existing design tokens:
 *   - rail bg: white, active item bg: sky-600 -> blue-700 gradient
 *   - gold accent (#fbbf24) reserved for the small "rung" indicator that
 *     echoes the competency ladder motif used elsewhere on the dashboard
 *   - unread badges in gold instead of the reference's blue circle
 *
 * Usage:
 *   <StudentSidebar />  — drop into a flex layout, e.g.:
 *   <div className="flex min-h-screen">
 *     <StudentSidebar />
 *     <main className="flex-1">{children}</main>
 *   </div>
 */

type NavItem = {
  label: string;
  href: string;
  icon: any;
  badge?: number;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Subjects", href: "/dashboard/subjects", icon: BookOpen },
  { label: "Assessments", href: "/dashboard/assessments", icon: ClipboardCheck },
  { label: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
  { label: "Messages", href: "/dashboard/messages", icon: Inbox, badge: 3 },
  { label: "Progress", href: "/dashboard/progress", icon: TrendingUp },
];

const NAV_ITEMS_FOOTER: NavItem[] = [
  { label: "Help", href: "/dashboard/help", icon: HelpCircle },
  { label: "Account", href: "/dashboard/account", icon: UserCircle2 },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

function SidebarButton({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className="relative w-full flex flex-col items-center gap-1.5 px-2 py-3 rounded-2xl transition-all duration-200 group"
      style={{
        backgroundColor: active ? undefined : "transparent",
        backgroundImage: active
          ? "linear-gradient(135deg, #0ea5e9, #1d4ed8)"
          : undefined,
      }}
    >
      {/* competency-ladder style active rung, echoes dashboard motif */}
      <span
        className="absolute left-1 top-1/2 -translate-y-1/2 w-1 rounded-full transition-all duration-200"
        style={{
          height: active ? 20 : 0,
          backgroundColor: "#fbbf24",
        }}
      />

      <div
        className={`h-9 w-9 rounded-xl flex items-center justify-center transition-colors ${
          active
            ? "text-white"
            : "text-slate-400 group-hover:text-sky-600 group-hover:bg-sky-50"
        }`}
      >
        <Icon size={20} strokeWidth={active ? 2.25 : 2} />
      </div>

      <span
        className={`text-[10.5px] font-semibold leading-none text-center ${
          active ? "text-white" : "text-slate-500 group-hover:text-sky-600"
        }`}
      >
        {item.label}
      </span>

      {item.badge ? (
        <span
          className="absolute top-1.5 right-2 min-w-[16px] h-4 px-1 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
          style={{ backgroundColor: "#fbbf24" }}
        >
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}

export default function StudentSidebar() {
  const pathname = usePathname();

  return (
    <nav
      className="hidden md:flex flex-col items-center w-[84px] shrink-0 py-6 gap-1.5 border-r border-slate-100"
      style={{ backgroundColor: "#ffffff" }}
      aria-label="Student navigation"
    >
      {/* Logo mark */}
      <Link href="/dashboard" className="mb-4 flex items-center justify-center">
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-black text-sm"
          style={{ backgroundImage: "linear-gradient(135deg, #0ea5e9, #1d4ed8)" }}
        >
          D
        </div>
      </Link>

      <div className="flex flex-col gap-1.5 w-full px-2">
        {NAV_ITEMS.map((item) => (
          <SidebarButton
            key={item.href}
            item={item}
            active={isActivePath(pathname, item.href)}
          />
        ))}
      </div>

      <div className="flex-1" />

      <div className="flex flex-col gap-1.5 w-full px-2 pt-3 border-t border-slate-100">
        {NAV_ITEMS_FOOTER.map((item) => (
          <SidebarButton
            key={item.href}
            item={item}
            active={isActivePath(pathname, item.href)}
          />
        ))}
      </div>
    </nav>
  );
}
