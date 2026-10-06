"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import {
  Compass,
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
  ShieldCheck,
  AlertTriangle,
  MapPin,
} from "lucide-react";
import { useStore } from "@/data/store";

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { applications, accommodations, requests, matches, settings, logoutAdmin } = useStore();

  const pendingCreators = applications.filter((a) => a.status === "PENDING").length;
  const pendingAccommodations = accommodations.filter((a) => a.status === "PENDING").length;
  const openRequests = requests.filter((r) => r.status === "PENDING").length;
  const activeProfiles = applications.filter((a) => a.status === "APPROVED").length;

  // Capacity alert threshold (>= 80%)
  const poolLimit = settings.creator_pool_limit || 1000;
  const capacityPercent = Math.round((activeProfiles / poolLimit) * 100);
  const isNearLimit = capacityPercent >= 80;

  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
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
      label: "Creator Requests",
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
      label: "Confirmed Matches",
      icon: CheckCircle2,
      badge: matches.length > 0 ? matches.length : null,
      badgeColor: "bg-teal-700 text-sand-50",
    },
    {
      href: "/admin/advertising",
      label: "Advertising",
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
      href: "/admin/locations",
      label: "Location Switch",
      icon: MapPin,
      badge: `${settings.allowed_creator_locations?.length ?? 18} Active`,
      badgeColor: "bg-teal-700 text-sand-50",
    },
    {
      href: "/admin/settings",
      label: "Platform Settings",
      icon: Settings,
      badge: settings.platform_phase === "FREE" ? "Phase 1" : "Phase 2",
      badgeColor: settings.platform_phase === "FREE" ? "bg-emerald-800 text-emerald-100" : "bg-gold-500 text-ink-950",
    },
  ];

  return (
    <aside className="w-64 bg-teal-950 text-sand-100 border-r border-teal-900 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div>
        {/* Logo */}
        <div className="p-4 border-b border-teal-900/80 flex items-center justify-between">
          <Logo variant="light" height={26} href="/admin" showSubtext subtext="Staff" />
          <span className="text-[10px] bg-teal-900 text-gold-400 px-2 py-0.5 rounded font-mono border border-teal-800">
            Admin
          </span>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-230px)]">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href === "/admin/dashboard" && pathname === "/admin") ||
              (link.href === "/admin/advertising" && pathname === "/admin/advertisements");
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-teal-900 text-gold-400 font-semibold shadow-sm"
                    : "text-sand-300 hover:bg-teal-900/60 hover:text-sand-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-gold-400" : "text-sand-400"}`} />
                  <span>{link.label}</span>
                </div>
                {link.badge !== null && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      link.badgeColor || "bg-teal-800 text-sand-200"
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer: Creator Pool Capacity Meter & Logout */}
      <div className="p-4 border-t border-teal-900/80 space-y-3 bg-teal-950">
        {/* Capacity Meter */}
        <div className="bg-teal-900/60 rounded-lg p-2.5 border border-teal-800/60 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-sand-300 flex items-center gap-1">
              {isNearLimit && <AlertTriangle className="w-3 h-3 text-amber-400" />}
              <span>Creator Pool Limit</span>
            </span>
            <span className="font-mono text-gold-400 font-bold">
              {activeProfiles} / {poolLimit}
            </span>
          </div>
          <div className="w-full bg-teal-950 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                isNearLimit ? "bg-amber-400" : "bg-gold-500"
              }`}
              style={{ width: `${Math.min(100, capacityPercent)}%` }}
            />
          </div>
          {isNearLimit && (
            <p className="text-[10px] text-amber-300 font-medium leading-tight">
              Approaching 1,000 limit threshold.
            </p>
          )}
        </div>

        {/* Public site link & Logout */}
        <div className="flex items-center justify-between pt-1">
          <Link
            href="/"
            target="_blank"
            className="text-[11px] text-sand-400 hover:text-gold-400 transition-colors"
          >
            ↗ Public Website
          </Link>
          <button
            onClick={logoutAdmin}
            className="text-[11px] text-sand-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
          >
            <LogOut className="w-3 h-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
