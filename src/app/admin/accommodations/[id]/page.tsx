"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/data/store";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Badge } from "@/components/ui/Badge";
import { formatFollowerCount, formatDateRange } from "@/utils/formatters";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  Calendar,
  MapPin,
  Users,
  Gift,
  Phone,
  FileText,
  Clock,
  Sparkles,
} from "lucide-react";

export default function AdminAccommodationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const { accommodations, approveAccommodation, rejectAccommodation } = useStore();

  const stay = accommodations.find(
    (a) => a.id === id || a.reference_code === id
  );

  const [notes, setNotes] = useState(stay?.admin_notes || "");
  const [actionDone, setActionDone] = useState<string | null>(null);

  if (!stay) {
    return (
      <div className="space-y-6">
        <AdminHeader title="Stay Listing Not Found" />
        <div className="bg-white rounded-2xl border border-sand-300 p-10 text-center max-w-md mx-auto space-y-4 shadow-warm">
          <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
          <h2 className="font-serif text-xl font-bold text-teal-950">
            Accommodation Not Found
          </h2>
          <p className="text-xs text-ink-600">
            No stay listing exists with ID or reference &ldquo;{id}&rdquo;.
          </p>
          <Link
            href="/admin/accommodations"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-900 text-sand-50 text-xs font-semibold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Queue</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleApprove = () => {
    approveAccommodation(stay.id, notes);
    setActionDone("Stay Approved and eligible for matching!");
    setTimeout(() => {
      router.push("/admin/accommodations");
    }, 1500);
  };

  const handleReject = () => {
    if (!notes.trim()) {
      alert("Please provide internal admin notes explaining the rejection reason.");
      return;
    }
    rejectAccommodation(stay.id, notes);
    setActionDone("Stay Rejected and archived.");
    setTimeout(() => {
      router.push("/admin/accommodations");
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-16">
      <AdminHeader
        title={`Review: ${stay.accommodation_name}`}
        subtitle={`Reference: ${stay.reference_code} • ${stay.property_type} in ${stay.city}`}
        action={
          <Link
            href="/admin/accommodations"
            className="inline-flex items-center gap-2 text-xs font-semibold text-teal-900 hover:text-gold-600 border border-sand-300 px-3 py-1.5 rounded-lg bg-white shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Accommodations Queue</span>
          </Link>
        }
      />

      {actionDone && (
        <div className="mx-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{actionDone}</span>
        </div>
      )}

      <div className="px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Property Specs & Contact */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-sand-300 p-6 sm:p-8 space-y-6 shadow-warm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-200 pb-5">
              <div>
                <span className="text-[11px] font-mono font-bold text-gold-700 uppercase tracking-wider block">
                  {stay.reference_code}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-teal-950 mt-1">
                  {stay.accommodation_name}
                </h2>
                <div className="flex items-center gap-3 text-xs text-ink-600 mt-1">
                  <span className="font-semibold text-teal-950">{stay.property_type}</span>
                  <span>•</span>
                  <span>{stay.city}, Sri Lanka</span>
                </div>
              </div>

              <div>
                <Badge
                  variant={
                    stay.status === "APPROVED"
                      ? "approved"
                      : stay.status === "REJECTED"
                      ? "rejected"
                      : "pending"
                  }
                  size="md"
                >
                  {stay.status}
                </Badge>
              </div>
            </div>

            {/* Metrics & Collaboration Requirements */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200">
                <span className="text-[10px] uppercase tracking-wider text-ink-500 font-bold block">
                  Offer Format
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1 inline-block">
                  {stay.offer_type}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200">
                <span className="text-[10px] uppercase tracking-wider text-ink-500 font-bold block">
                  Min Followers
                </span>
                <span className="text-base font-bold text-teal-950 font-mono mt-0.5 block">
                  {formatFollowerCount(stay.minimum_followers)}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200">
                <span className="text-[10px] uppercase tracking-wider text-ink-500 font-bold block">
                  Coverage Window
                </span>
                <span className="text-xs font-bold text-teal-950 mt-1 block">
                  {formatDateRange(stay.coverage_start, stay.coverage_end)}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200">
                <span className="text-[10px] uppercase tracking-wider text-ink-500 font-bold block">
                  Host Contact
                </span>
                <span className="text-xs font-bold text-teal-950 mt-1 block">
                  {stay.contact_person}
                </span>
              </div>
            </div>

            {/* Host Private WhatsApp */}
            <div className="p-4 rounded-xl bg-teal-950 text-sand-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold-400" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gold-400 font-bold block">
                    Host Private WhatsApp (Staff Only)
                  </span>
                  <span className="text-sm font-mono font-bold text-sand-50">
                    {stay.whatsapp}
                  </span>
                </div>
              </div>
              <a
                href={`https://wa.me/${stay.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-gold-400 text-xs font-bold border border-teal-700 transition-colors"
              >
                Open WhatsApp
              </a>
            </div>

            {/* Collaboration Specs */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-teal-950 uppercase tracking-wider block">
                Collaboration Requirements & Host Expectations
              </label>
              <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 text-xs text-ink-800 leading-relaxed whitespace-pre-wrap">
                {stay.requirements}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Staff Decision Panel */}
        <div className="lg:col-span-4 sticky top-24 space-y-5">
          <div className="bg-white rounded-2xl border border-sand-300 p-6 sm:p-7 shadow-elevated space-y-5">
            <h3 className="font-serif text-lg font-bold text-teal-950 border-b border-sand-200 pb-3">
              Staff Review Decision
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-bold text-teal-950 uppercase tracking-wider block">
                Internal Admin Notes
              </label>
              <textarea
                rows={4}
                placeholder="Log notes about property license check, room availability, or reasons for rejection..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-sand-400 bg-sand-50 text-xs focus:outline-none focus:ring-2 focus:ring-teal-900"
              />
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleApprove}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider shadow-warm transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Accommodation</span>
              </button>

              <button
                onClick={handleReject}
                className="w-full py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Listing</span>
              </button>
            </div>

            <div className="pt-4 border-t border-sand-200 text-[11px] text-ink-500 space-y-1">
              <div className="flex justify-between">
                <span>Submitted:</span>
                <span className="font-mono">
                  {new Date(stay.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>City:</span>
                <span className="font-semibold text-teal-950">{stay.city}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
