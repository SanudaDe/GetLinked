"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/data/store";
import {
  LayoutDashboard,
  Users,
  Building2,
  Inbox,
  Sparkles,
  CheckCircle2,
  Megaphone,
  BarChart3,
  History,
  Settings,
  LogOut,
  AlertTriangle,
  Layers,
} from "lucide-react";

export const AdminSubnav: React.FC = () => {
  const pathname = usePathname();
  const {
    applications,
    accommodations,
    requests,
    matches,
    settings,
    adminUser,
    logoutAdmin,
  } = useStore();

  const pendingCreators = applications.filter((a) => a.status === "PENDING").length;
  const pendingAccommodations = accommodations.filter((a) => a.status === "PENDING").length;
  const openRequests = requests.filter((r) => r.status === "PENDING").length;
  const activeProfiles = applications.filter((a) => a.status === "APPROVED").length;

  const poolLimit = settings.creator_pool_limit || 1000;
  const capacityPercent = Math.round((activeProfiles / poolLimit) * 100);
  const isNearLimit = capacityPercent >= 80;

  const navItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard, badge: null },
    {
      href: "/admin/creators",
      label: "Creator Queue",
      icon: Users,
      badge: pendingCreators > 0 ? pendingCreators : null,
      badgeColor: "bg-gold-500 text-ink-950",
    },
    {
      href: "/admin/accommodations",
      label: "Accommodations",
      icon: Building2,
      badge: pendingAccommodations > 0 ? pendingAccommodations : null,
      badgeColor: "bg-gold-500 text-ink-950",
    },
    {
      href: "/admin/requests",
      label: "Requests",
      icon: Inbox,
      badge: openRequests > 0 ? openRequests : null,
      badgeColor: "bg-amber-400 text-ink-950",
    },
    {
      href: "/admin/matching",
      label: "Matching Tool",
      icon: Sparkles,
      badge: null,
    },
    {
      href: "/admin/matches",
      label: "Matches",
      icon: CheckCircle2,
      badge: matches.length > 0 ? matches.length : null,
      badgeColor: "bg-teal-700 text-sand-50",
    },
    {
      href: "/admin/advertisements",
      label: "Advertisements",
      icon: Megaphone,
      badge: null,
    },
    {
      href: "/admin/analytics",
      label: "Analytics",
      icon: BarChart3,
      badge: null,
    },
    {
      href: "/admin/audit-logs",
      label: "Audit Logs",
      icon: History,
      badge: null,
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: Settings,
      badge: settings.platform_phase === "FREE" ? "P1" : "P2",
      badgeColor:
        settings.platform_phase === "FREE"
          ? "bg-emerald-800 text-emerald-100"
          : "bg-gold-500 text-ink-950",
    },
  ];

  return (
    <div className="bg-teal-950 text-sand-100 border-b border-teal-900 sticky top-20 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 border-b border-teal-900/60 text-xs flex-wrap gap-2">
          {/* Left: Admin Mode Badge & Pool Capacity Indicator */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/30 font-bold uppercase tracking-wider text-[10px]">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
              Staff Admin Workspace
            </span>
            <div className="hidden sm:flex items-center gap-2 text-sand-300 text-[11px]">
              <Layers className="w-3.5 h-3.5 text-gold-500" />
              <span>
                Creator Pool: <strong className="text-gold-400 font-mono">{activeProfiles}</strong> / {poolLimit} active
              </span>
              {isNearLimit && (
                <span className="text-amber-400 flex items-center gap-0.5 text-[10px] font-bold">
                  <AlertTriangle className="w-3 h-3" /> Near Limit
                </span>
              )}
            </div>
          </div>

          {/* Right: User & Actions */}
          <div className="flex items-center gap-3 text-xs">
            <span className="text-sand-400 hidden md:inline text-[11px]">
              Signed in as <strong className="text-sand-200">{adminUser?.email || "admin@getlinked.today"}</strong>
            </span>
            <button
              onClick={logoutAdmin}
              className="text-sand-400 hover:text-rose-400 transition-colors flex items-center gap-1 text-[11px] font-medium"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? "bg-gold-500 text-ink-950 shadow-sm font-bold"
                    : "text-sand-300 hover:bg-teal-900 hover:text-sand-50"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-ink-950" : "text-sand-400"}`} />
                <span>{item.label}</span>
                {item.badge !== null && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? "bg-teal-950 text-gold-400" : item.badgeColor || "bg-teal-900 text-sand-100"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
