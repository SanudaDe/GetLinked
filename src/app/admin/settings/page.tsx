"use client";

import React, { useState } from "react";
import { useStore } from "@/data/store";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { PlatformPhase, BillingMode, DirectoryVisibility } from "@/types";
import {
  Settings,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileClock,
  Coins,
  Layers,
  Database,
  RefreshCw,
  ExternalLink,
  MapPin,
} from "lucide-react";
import { LocationSwitchManager } from "@/components/admin/LocationSwitchManager";

export default function AdminSettingsPage() {
  const {
    settings,
    updateSettings,
    applications,
    isConnectedToSupabase,
    isLoadingSupabase,
    refreshData,
  } = useStore();

  const [phase, setPhase] = useState<PlatformPhase>(settings.platform_phase);
  const [billingMode, setBillingMode] = useState<BillingMode>(settings.billing_mode);
  const [poolLimit, setPoolLimit] = useState<number>(settings.creator_pool_limit);
  const [directoryVisibility, setDirectoryVisibility] = useState<DirectoryVisibility>(
    settings.directory_visibility
  );
  const [retentionDays, setRetentionDays] = useState<number>(
    settings.document_retention_days
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const activeCreatorsCount = applications.filter((a) => a.status === "APPROVED").length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      platform_phase: phase,
      billing_mode: billingMode,
      creator_pool_limit: poolLimit,
      directory_visibility: directoryVisibility,
      document_retention_days: retentionDays,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title="Platform & Marketplace Settings"
        subtitle="Manage business phase, billing modes, creator pool cap, and PDPA document retention rules."
      />

      <div className="px-6 max-w-4xl space-y-6">
        {savedSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Settings saved successfully! Platform messaging and rules updated.</span>
          </div>
        )}

        <form
          onSubmit={handleSave}
          className="bg-sand-50 rounded-2xl border border-sand-300 p-8 shadow-warm space-y-8"
        >
          {/* Setting 1: Platform Phase Control */}
          <div className="space-y-4 border-b border-sand-200 pb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-600" />
              <h2 className="font-serif text-lg font-bold text-teal-950">
                1. Platform Phase Control
              </h2>
            </div>
            <p className="text-xs text-ink-600 leading-relaxed">
              Toggling between Free and Paid updates public-facing accommodation messaging automatically across all listing pages.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <label
                onClick={() => {
                  setPhase("FREE");
                  setBillingMode("none");
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  phase === "FREE"
                    ? "bg-teal-900 text-sand-50 border-teal-950 shadow-warm ring-2 ring-gold-400"
                    : "bg-sand-100 border-sand-300 hover:bg-sand-200 text-ink-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-base">Phase 1: Free / Launch</span>
                  <input
                    type="radio"
                    name="phase"
                    checked={phase === "FREE"}
                    onChange={() => {}}
                    className="accent-gold-500"
                  />
                </div>
                <p className="text-xs mt-2 opacity-90 leading-relaxed">
                  Listing & matchmaking is 100% free for Sri Lankan properties. Revenue is generated via sponsor advertisements.
                </p>
                <div className="mt-3 text-[11px] font-mono opacity-80">
                  Public notice: &ldquo;Listing and collaboration matching is currently free.&rdquo;
                </div>
              </label>

              <label
                onClick={() => setPhase("PAID")}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  phase === "PAID"
                    ? "bg-teal-900 text-sand-50 border-teal-950 shadow-warm ring-2 ring-gold-400"
                    : "bg-sand-100 border-sand-300 hover:bg-sand-200 text-ink-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-base">Phase 2: Paid Model</span>
                  <input
                    type="radio"
                    name="phase"
                    checked={phase === "PAID"}
                    onChange={() => {}}
                    className="accent-gold-500"
                  />
                </div>
                <p className="text-xs mt-2 opacity-90 leading-relaxed">
                  Influencers remain FREE. Accommodations pay per collaboration or monthly subscription as configured.
                </p>
                <div className="mt-3 text-[11px] font-mono opacity-80">
                  Public notice: &ldquo;Fees may apply to confirmed collaborations.&rdquo;
                </div>
              </label>
            </div>
          </div>

          {/* Setting 2: Future Billing Mode */}
          <div className="space-y-4 border-b border-sand-200 pb-6">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-gold-600" />
              <h2 className="font-serif text-lg font-bold text-teal-950">
                2. Accommodation Billing Mode (Phase 2 Architecture)
              </h2>
            </div>
            <p className="text-xs text-ink-600">
              The business model can be configured between per-collaboration fees and subscriptions without code rewrite.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { val: "none", label: "None (Free Phase)", desc: "Zero fees charged" },
                { val: "per_match", label: "Per-Collaboration Fee", desc: "Pay on confirmed match" },
                { val: "subscription", label: "Monthly Subscription", desc: "Tiered access model" },
              ].map((m) => (
                <label
                  key={m.val}
                  onClick={() => setBillingMode(m.val as BillingMode)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer ${
                    billingMode === m.val
                      ? "bg-teal-900 text-sand-50 border-teal-950 font-semibold"
                      : "bg-sand-100 border-sand-300 text-ink-800"
                  }`}
                >
                  <div className="font-bold">{m.label}</div>
                  <div className="text-[11px] opacity-80 mt-0.5">{m.desc}</div>
                </label>
              ))}
            </div>
          </div>

          {/* Setting 3: Creator Pool Limit (1,000 cap) */}
          <div className="space-y-4 border-b border-sand-200 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-teal-900" />
                <h2 className="font-serif text-lg font-bold text-teal-950">
                  3. Creator Pool Capacity Cap
                </h2>
              </div>
              <span className="font-mono text-xs font-bold text-teal-950">
                Current Active: {activeCreatorsCount}
              </span>
            </div>
            <p className="text-xs text-ink-600">
              Target operational limit is 1,000 active verified creators. Approaching 80% triggers admin dashboard warnings.
            </p>

            <div className="max-w-xs">
              <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                Active Creator Limit
              </label>
              <input
                type="number"
                min={100}
                max={10000}
                step={100}
                value={poolLimit}
                onChange={(e) => setPoolLimit(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900 font-mono"
              />
            </div>
          </div>

          {/* Setting 4: Sri Lanka PDPA Document Retention */}
          <div className="space-y-4 border-b border-sand-200 pb-6">
            <div className="flex items-center gap-2">
              <FileClock className="w-5 h-5 text-gold-600" />
              <h2 className="font-serif text-lg font-bold text-teal-950">
                4. ID Document Retention Policy (Sri Lanka PDPA)
              </h2>
            </div>
            <p className="text-xs text-ink-600">
              Government passports/IDs are not retained permanently. Define how many days after verification documents should be scheduled for secure destruction.
            </p>

            <div className="max-w-xs">
              <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                Document Retention Window (Days)
              </label>
              <select
                value={retentionDays}
                onChange={(e) => setRetentionDays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
              >
                <option value={30}>30 Days post-review</option>
                <option value={60}>60 Days post-review</option>
                <option value={90}>90 Days post-review (Recommended)</option>
                <option value={180}>180 Days post-review</option>
              </select>
            </div>
          </div>

          {/* Setting 5: Supabase Cloud PostgreSQL Database */}
          <div className="space-y-4 border-b border-sand-200 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-teal-800" />
                <h2 className="font-serif text-lg font-bold text-teal-950">
                  5. Supabase PostgreSQL Cloud Database
                </h2>
              </div>
              {isConnectedToSupabase ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                  Awaiting Schema Execution
                </span>
              )}
            </div>

            <p className="text-xs text-ink-600 leading-relaxed">
              All platform applications, directory profiles, stays, concierge requests, matches, ads, and audit logs are synchronized live with your Supabase PostgreSQL cluster.
            </p>

            <div className="p-4 bg-sand-100 rounded-xl border border-sand-300 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-ink-500 block">Supabase Endpoint:</span>
                  <span className="font-mono text-[11px] text-teal-950 font-semibold truncate block">
                    https://gpkljpnbgnylcekrcluy.supabase.co
                  </span>
                </div>
                <div>
                  <span className="text-ink-500 block">SQL Schema Location:</span>
                  <span className="font-mono text-[11px] text-teal-950 font-semibold truncate block">
                    supabase/schema.sql
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-sand-200/80 flex flex-wrap items-center gap-3">
                <a
                  href="https://supabase.com/dashboard/project/gpkljpnbgnylcekrcluy/sql/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-teal-900 hover:bg-teal-800 text-sand-50 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Supabase SQL Editor</span>
                </a>

                <button
                  type="button"
                  onClick={() => refreshData()}
                  disabled={isLoadingSupabase}
                  className="px-3.5 py-2 rounded-lg bg-sand-200 hover:bg-sand-300 text-teal-950 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-sand-300 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSupabase ? "animate-spin" : ""}`} />
                  <span>Test Connection & Sync</span>
                </button>
              </div>

              {!isConnectedToSupabase && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px] space-y-1">
                  <strong>One-Time Setup:</strong>
                  <p>
                    Open the Supabase SQL editor link above, paste the contents of{" "}
                    <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">supabase/schema.sql</code>,
                    and click <strong>Run</strong>. Tables, indexes, and initial data will be created instantly.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-8 py-3 rounded-lg bg-teal-900 hover:bg-teal-800 text-sand-50 text-xs font-semibold uppercase tracking-wider shadow-warm transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-gold-400" />
              <span>Save Platform Settings</span>
            </button>
          </div>
        </form>

        {/* Section 6: Registration Location Switch */}
        <div id="locations" className="pt-2">
          <LocationSwitchManager embedded={true} />
        </div>
      </div>
    </div>
  );
}
