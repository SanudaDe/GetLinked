"use client";

import React from "react";
import { useStore } from "@/data/store";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin,
  PieChart,
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const { applications, accommodations, requests, matches } = useStore();

  const totalCreatorApps = applications.length;
  const approvedCreators = applications.filter((a) => a.status === "APPROVED").length;
  const creatorApprovalRate = totalCreatorApps > 0 ? Math.round((approvedCreators / totalCreatorApps) * 100) : 0;

  const totalAccApps = accommodations.length;
  const approvedAccs = accommodations.filter((a) => a.status === "APPROVED").length;
  const accApprovalRate = totalAccApps > 0 ? Math.round((approvedAccs / totalAccApps) * 100) : 0;

  // City breakdown of approved creators
  const cityCounts: Record<string, number> = {};
  applications.filter(a => a.status === "APPROVED").forEach((a) => {
    cityCounts[a.city] = (cityCounts[a.city] || 0) + 1;
  });

  // Niche breakdown
  const nicheCounts: Record<string, number> = {};
  applications.filter(a => a.status === "APPROVED").forEach((a) => {
    nicheCounts[a.niche] = (nicheCounts[a.niche] || 0) + 1;
  });

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title="Marketplace Operational Analytics"
        subtitle="Internal metrics to understand quality, approval turnaround, and matching performance."
      />

      <div className="px-6 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-sand-50 rounded-2xl p-5 border border-sand-300 shadow-warm space-y-2">
            <div className="flex items-center justify-between text-xs text-ink-600">
              <span>Creator Approval Rate</span>
              <Users className="w-4 h-4 text-teal-900" />
            </div>
            <div className="font-serif text-3xl font-bold text-teal-950">
              {creatorApprovalRate}%
            </div>
            <p className="text-[11px] text-ink-500">
              {approvedCreators} approved out of {totalCreatorApps} submitted
            </p>
          </div>

          <div className="bg-sand-50 rounded-2xl p-5 border border-sand-300 shadow-warm space-y-2">
            <div className="flex items-center justify-between text-xs text-ink-600">
              <span>Host Approval Rate</span>
              <Building2 className="w-4 h-4 text-teal-900" />
            </div>
            <div className="font-serif text-3xl font-bold text-teal-950">
              {accApprovalRate}%
            </div>
            <p className="text-[11px] text-ink-500">
              {approvedAccs} verified out of {totalAccApps} listings
            </p>
          </div>

          <div className="bg-sand-50 rounded-2xl p-5 border border-sand-300 shadow-warm space-y-2">
            <div className="flex items-center justify-between text-xs text-ink-600">
              <span>Match Conversion</span>
              <Sparkles className="w-4 h-4 text-gold-600" />
            </div>
            <div className="font-serif text-3xl font-bold text-teal-950">
              {matches.length}
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold">
              {matches.filter((m) => m.status === "INTRODUCED").length} WhatsApp intros delivered
            </p>
          </div>

          <div className="bg-sand-50 rounded-2xl p-5 border border-sand-300 shadow-warm space-y-2">
            <div className="flex items-center justify-between text-xs text-ink-600">
              <span>Avg Review Turnaround</span>
              <Clock className="w-4 h-4 text-teal-900" />
            </div>
            <div className="font-serif text-3xl font-bold text-teal-950">
              ~6.5 hrs
            </div>
            <p className="text-[11px] text-ink-500">
              100% human verification by team
            </p>
          </div>
        </div>

        {/* Breakdown Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* By City */}
          <div className="bg-sand-50 rounded-2xl border border-sand-300 p-6 shadow-warm space-y-4">
            <div className="flex items-center gap-2 border-b border-sand-200 pb-3">
              <MapPin className="w-4 h-4 text-teal-900" />
              <h3 className="font-serif text-base font-bold text-teal-950">
                Active Creator Destination Distribution
              </h3>
            </div>

            <div className="space-y-3">
              {Object.entries(cityCounts).map(([city, count]) => {
                const pct = Math.round((count / Math.max(1, approvedCreators)) * 100);
                return (
                  <div key={city} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between font-medium">
                      <span>{city}</span>
                      <span className="font-mono text-ink-600">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-sand-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-teal-900 h-full rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* By Niche */}
          <div className="bg-sand-50 rounded-2xl border border-sand-300 p-6 shadow-warm space-y-4">
            <div className="flex items-center gap-2 border-b border-sand-200 pb-3">
              <PieChart className="w-4 h-4 text-teal-900" />
              <h3 className="font-serif text-base font-bold text-teal-950">
                Verified Creator Niches
              </h3>
            </div>

            <div className="space-y-3">
              {Object.entries(nicheCounts).map(([niche, count]) => {
                const pct = Math.round((count / Math.max(1, approvedCreators)) * 100);
                return (
                  <div key={niche} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between font-medium">
                      <span>{niche}</span>
                      <span className="font-mono text-ink-600">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-sand-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gold-500 h-full rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
