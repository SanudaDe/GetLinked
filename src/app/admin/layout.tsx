"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/data/store";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import {
  ShieldCheck,
  Lock,
  Menu,
  X,
  Compass,
  LogOut,
  Bell,
  Search,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { adminUser, loginAdmin, logoutAdmin, settings, applications, accommodations } = useStore();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on login route, just show children
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // If not authenticated, render secure staff sign-in gateway
  if (!adminUser) {
    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      const ok = loginAdmin(password);
      if (ok) {
        setError(false);
      } else {
        setError(true);
      }
    };

    return (
      <div className="min-h-screen bg-sand-100/60 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-sand-300 p-8 sm:p-10 max-w-md w-full shadow-elevated space-y-6">
          <div className="text-center space-y-3">
            <Logo variant="dark" height={52} className="mx-auto" showSubtext subtext="Staff Workspace" />
            <p className="text-xs text-ink-600">
              Authorized team access for creator verification, property review, and curated WhatsApp introductions.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium text-center">
              Invalid credentials. Use demo password: <code className="font-mono font-bold">admin123</code>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                Admin Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-ink-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="Enter staff password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-sand-400 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                />
              </div>
              <span className="text-[11px] text-ink-500 mt-1.5 block">
                Instant prototype access: use <code className="font-mono text-teal-900 font-bold">admin123</code> or <code className="font-mono text-teal-900 font-bold">getlinked2026</code>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-sand-50 text-xs font-semibold uppercase tracking-wider shadow-warm transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>Sign In to Admin Workspace</span>
            </button>
          </form>

          <div className="text-center pt-2 border-t border-sand-200">
            <Link
              href="/"
              className="text-xs text-teal-900 hover:text-gold-600 font-medium"
            >
              ← Back to Get Linked Public Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const pendingCount =
    applications.filter((a) => a.status === "PENDING").length +
    accommodations.filter((a) => a.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-sand-100/50 flex flex-col md:flex-row">
      {/* Desktop Left Sidebar (Operational standard per Section M) */}
      <div className="hidden md:block shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Header Bar */}
      <div className="md:hidden bg-teal-950 text-sand-50 px-4 py-3 border-b border-teal-900 flex items-center justify-between sticky top-0 z-50">
        <Logo variant="light" height={34} href="/admin" showSubtext subtext="Staff" />

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="bg-gold-500 text-ink-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {pendingCount} Pending
            </span>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-sand-200 hover:bg-teal-900"
            aria-label="Toggle admin navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-teal-950 text-sand-100 border-b border-teal-900 p-4 space-y-2 z-40">
          <Link
            href="/admin/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm hover:bg-teal-900"
          >
            Dashboard Overview
          </Link>
          <Link
            href="/admin/creators"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm hover:bg-teal-900"
          >
            Creator Applications Queue
          </Link>
          <Link
            href="/admin/accommodations"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm hover:bg-teal-900"
          >
            Accommodations Queue
          </Link>
          <Link
            href="/admin/requests"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm hover:bg-teal-900"
          >
            Collaboration Requests
          </Link>
          <Link
            href="/admin/matching"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm hover:bg-teal-900"
          >
            Proactive Matching Tool
          </Link>
          <Link
            href="/admin/matches"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm hover:bg-teal-900"
          >
            Confirmed Matches & WhatsApp
          </Link>
          <Link
            href="/admin/advertising"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm hover:bg-teal-900"
          >
            Advertising Management
          </Link>
          <Link
            href="/admin/analytics"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm hover:bg-teal-900"
          >
            Marketplace Analytics
          </Link>
          <Link
            href="/admin/audit-logs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm hover:bg-teal-900"
          >
            Staff Audit Logs
          </Link>
          <Link
            href="/admin/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm hover:bg-teal-900"
          >
            Platform Settings
          </Link>
          <div className="pt-3 border-t border-teal-900 flex items-center justify-between">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-gold-400 hover:underline flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </Link>
            <button
              onClick={() => {
                logoutAdmin();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Admin Content Viewport */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Operations Header Bar */}
        <div className="hidden md:flex items-center justify-between bg-white border-b border-sand-300 px-8 py-3.5 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4 text-xs text-ink-600">
            <span className="font-semibold text-teal-950 uppercase tracking-wider font-mono">
              Get Linked Staff Portal
            </span>
            <span className="text-sand-400">•</span>
            <span className="bg-sand-100 text-teal-900 px-2 py-0.5 rounded font-mono border border-sand-300">
              {settings.platform_phase === "FREE" ? "Phase 1: FREE" : "Phase 2: PAID"}
            </span>
            {pendingCount > 0 && (
              <span className="bg-gold-500/20 text-gold-800 font-bold px-2 py-0.5 rounded border border-gold-400/40">
                {pendingCount} Pending Reviews
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="block text-xs font-bold text-teal-950">
                {adminUser.name}
              </span>
              <span className="block text-[10px] text-ink-500 font-mono">
                {adminUser.email}
              </span>
            </div>
            <Link
              href="/"
              target="_blank"
              className="text-xs text-teal-900 hover:text-gold-600 border border-sand-300 px-3 py-1.5 rounded-lg hover:bg-sand-50 transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </Link>
            <button
              onClick={logoutAdmin}
              className="p-1.5 text-ink-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 sm:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}
