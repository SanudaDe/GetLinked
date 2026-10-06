"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/data/store";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Badge } from "@/components/ui/Badge";
import { formatFollowerCount, formatDateRange } from "@/utils/formatters";
import {
  Users,
  Building2,
  Inbox,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Send,
  Eye,
  MapPin,
} from "lucide-react";

export default function AdminDashboardPage() {
  const {
    applications,
    accommodations,
    requests,
    matches,
    settings,
  } = useStore();

  const pendingCreators = applications.filter((a) => a.status === "PENDING");
  const approvedCreators = applications.filter((a) => a.status === "APPROVED");
  const pendingAccommodations = accommodations.filter((a) => a.status === "PENDING");
  const approvedAccommodations = accommodations.filter((a) => a.status === "APPROVED");
  const openRequests = requests.filter((r) => r.status === "PENDING");
  const confirmedMatches = matches.filter((m) => m.status === "CONFIRMED" || m.status === "INTRODUCED");

  const poolLimit = settings.creator_pool_limit || 1000;
  const capacityPercent = Math.round((approvedCreators.length / poolLimit) * 100);
  const isNearLimit = capacityPercent >= 80;

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title="Operations Dashboard"
        subtitle="Platform status, review queues, and marketplace capacity overview."
      />

      <div className="px-6 space-y-6">
        {/* Capacity Warning Banner if near 1,000 creator cap */}
        {isNearLimit && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <strong className="font-bold">Creator Pool Limit Warning:</strong> You have reached{" "}
              <strong>{approvedCreators.length}</strong> active approved creators ({capacityPercent}% of the{" "}
              {poolLimit} limit). Manage active pool limit in Settings.
            </div>
          </div>
        )}

        {/* 6 Metric KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Link
            href="/admin/creators?tab=PENDING"
            className="bg-sand-50 rounded-xl p-4 border border-sand-300 shadow-warm hover:border-gold-500 transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-ink-600 font-medium">
              <span>Pending Creators</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="font-serif text-3xl font-bold text-teal-950 mt-2">
              {pendingCreators.length}
            </div>
            <span className="text-[10px] text-amber-700 font-semibold block mt-1">
              Requires human check
            </span>
          </Link>

          <Link
            href="/admin/accommodations?tab=PENDING"
            className="bg-sand-50 rounded-xl p-4 border border-sand-300 shadow-warm hover:border-gold-500 transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-ink-600 font-medium">
              <span>Pending Stays</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="font-serif text-3xl font-bold text-teal-950 mt-2">
              {pendingAccommodations.length}
            </div>
            <span className="text-[10px] text-amber-700 font-semibold block mt-1">
              Requires verification
            </span>
          </Link>

          <Link
            href="/admin/requests"
            className="bg-sand-50 rounded-xl p-4 border border-sand-300 shadow-warm hover:border-gold-500 transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-ink-600 font-medium">
              <span>Open Requests</span>
              <Inbox className="w-4 h-4 text-teal-800" />
            </div>
            <div className="font-serif text-3xl font-bold text-teal-950 mt-2">
              {openRequests.length}
            </div>
            <span className="text-[10px] text-teal-800 font-semibold block mt-1">
              Incoming from stays
            </span>
          </Link>

          <Link
            href="/admin/matches"
            className="bg-sand-50 rounded-xl p-4 border border-sand-300 shadow-warm hover:border-gold-500 transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-ink-600 font-medium">
              <span>Active Matches</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-serif text-3xl font-bold text-teal-950 mt-2">
              {confirmedMatches.length}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
              WhatsApp intro ready
            </span>
          </Link>

          <Link
            href="/admin/creators?tab=APPROVED"
            className="bg-sand-50 rounded-xl p-4 border border-sand-300 shadow-warm hover:border-gold-500 transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-ink-600 font-medium">
              <span>Approved Pool</span>
              <Users className="w-4 h-4 text-teal-800" />
            </div>
            <div className="font-serif text-3xl font-bold text-teal-950 mt-2">
              {approvedCreators.length}
            </div>
            <span className="text-[10px] text-ink-500 block mt-1">
              Cap: {poolLimit} max
            </span>
          </Link>

          <Link
            href="/admin/accommodations?tab=APPROVED"
            className="bg-sand-50 rounded-xl p-4 border border-sand-300 shadow-warm hover:border-gold-500 transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-ink-600 font-medium">
              <span>Approved Stays</span>
              <Building2 className="w-4 h-4 text-teal-800" />
            </div>
            <div className="font-serif text-3xl font-bold text-teal-950 mt-2">
              {approvedAccommodations.length}
            </div>
            <span className="text-[10px] text-ink-500 block mt-1">
              Across Sri Lanka
            </span>
          </Link>
        </div>

        {/* Proactive Matching Banner */}
        <div className="bg-teal-900 text-sand-50 rounded-2xl p-6 shadow-warm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-400" />
              <h3 className="font-serif text-xl font-bold text-sand-50">
                Proactive Matchmaking Tool
              </h3>
            </div>
            <p className="text-xs text-sand-300 max-w-xl">
              Pair approved stays with verified creators based on Sri Lankan destination cities, overlapping travel dates, and follower thresholds.
            </p>
          </div>
          <Link
            href="/admin/matching"
            className="px-5 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-ink-950 text-xs font-semibold uppercase tracking-wider shadow-warm transition-colors shrink-0 flex items-center gap-1.5"
          >
            <span>Open Matching Tool</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Location Switch Status Banner */}
        <div className="bg-sand-50 rounded-2xl border border-sand-300 p-5 shadow-warm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-900 text-gold-400 flex items-center justify-center shrink-0 shadow-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-teal-950 flex items-center gap-2">
                <span>Location Registration Controls</span>
                <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-200">
                  {settings.allowed_creator_locations?.length ?? 18} Creator / {settings.allowed_villa_locations?.length ?? 18} Villa Open
                </span>
              </h4>
              <p className="text-xs text-ink-600 mt-0.5">
                Admin switches determine which Sri Lankan destinations are active for creators and villas to select during registration.
              </p>
            </div>
          </div>
          <Link
            href="/admin/locations"
            className="px-4 py-2 rounded-lg bg-teal-900 hover:bg-teal-800 text-sand-50 text-xs font-semibold uppercase tracking-wider shadow-warm transition-colors shrink-0 flex items-center gap-1.5"
          >
            <span>Manage Locations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Two-Column Queue Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Pending Creators awaiting review */}
          <div className="bg-sand-50 rounded-2xl border border-sand-300 p-6 shadow-warm space-y-4">
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-900" />
                <h3 className="font-serif text-lg font-bold text-teal-950">
                  Creators Awaiting Verification ({pendingCreators.length})
                </h3>
              </div>
              <Link
                href="/admin/creators"
                className="text-xs font-semibold text-teal-900 hover:text-gold-600"
              >
                View All Queue →
              </Link>
            </div>

            {pendingCreators.length === 0 ? (
              <div className="text-center py-8 text-xs text-ink-500">
                All creator applications have been reviewed!
              </div>
            ) : (
              <div className="space-y-3">
                {pendingCreators.slice(0, 4).map((app) => (
                  <div
                    key={app.id}
                    className="p-3 bg-sand-100/70 rounded-xl border border-sand-200 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-teal-950">
                          {app.full_name}
                        </span>
                        <span className="text-[10px] font-mono text-ink-500">
                          {app.reference_code}
                        </span>
                        {app.is_duplicate && (
                          <Badge variant="duplicate" size="sm">
                            Possible Duplicate
                          </Badge>
                        )}
                      </div>
                      <div className="text-[11px] text-ink-600 mt-0.5">
                        {app.niche} • {formatFollowerCount(app.follower_count)} followers • Visiting {app.city} ({formatDateRange(app.visit_start, app.visit_end)})
                      </div>
                    </div>
                    <Link
                      href={`/admin/creators?id=${app.id}`}
                      className="px-3 py-1.5 rounded-lg bg-sand-200 hover:bg-teal-900 hover:text-sand-50 text-xs font-semibold text-teal-950 transition-colors shrink-0 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Open Creator Requests */}
          <div className="bg-sand-50 rounded-2xl border border-sand-300 p-6 shadow-warm space-y-4">
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <div className="flex items-center gap-2">
                <Inbox className="w-4 h-4 text-teal-900" />
                <h3 className="font-serif text-lg font-bold text-teal-950">
                  Stay Collaboration Requests ({openRequests.length})
                </h3>
              </div>
              <Link
                href="/admin/requests"
                className="text-xs font-semibold text-teal-900 hover:text-gold-600"
              >
                View Requests →
              </Link>
            </div>

            {openRequests.length === 0 ? (
              <div className="text-center py-8 text-xs text-ink-500">
                No open collaboration requests at the moment.
              </div>
            ) : (
              <div className="space-y-3">
                {openRequests.slice(0, 4).map((req) => (
                  <div
                    key={req.id}
                    className="p-3 bg-sand-100/70 rounded-xl border border-sand-200 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-teal-950">
                          {req.accommodation_name}
                        </span>
                        <span className="text-[11px] text-ink-500">→</span>
                        <span className="font-semibold text-xs text-gold-700">
                          {req.creator_name}
                        </span>
                      </div>
                      <div className="text-[11px] text-ink-600 mt-0.5 line-clamp-1">
                        Contact: {req.requester_name} • {req.creator_city}
                      </div>
                    </div>
                    <Link
                      href="/admin/requests"
                      className="px-3 py-1.5 rounded-lg bg-teal-900 text-sand-50 text-xs font-semibold hover:bg-teal-800 transition-colors shrink-0 flex items-center gap-1"
                    >
                      <Send className="w-3 h-3 text-gold-400" />
                      <span>Handle</span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
