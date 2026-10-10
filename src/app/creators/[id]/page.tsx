"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useStore } from "@/data/store";
import { formatFollowerCount, formatDateRange, formatStorageUrl } from "@/utils/formatters";
import { calculateOverlapDays } from "@/utils/dateOverlap";
import {
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Send,
  ArrowLeft,
  Lock,
  Instagram,
  Video,
  Clock,
  Building2,
  Check,
  ExternalLink,
} from "lucide-react";

export default function CreatorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { profiles, submitCreatorRequest } = useStore();

  // Match by profile id (prof-...) or application id (app-...)
  const creator = profiles.find(
    (p) => p.id === id || p.application_id === id
  );

  const [formData, setFormData] = useState({
    accommodationName: "",
    requesterName: "",
    requesterWhatsApp: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<string | null>(null);

  if (!creator) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-sand-50">
        <div className="max-w-md w-full text-center space-y-4 bg-white p-8 rounded-2xl border border-sand-300 shadow-warm">
          <ShieldCheck className="w-12 h-12 text-teal-900 mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-teal-950">
            Creator Profile Not Found
          </h2>
          <p className="text-xs text-ink-600">
            This creator profile is either pending review, not currently active, or the link has expired.
          </p>
          <Link
            href="/creators"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-900 text-sand-50 text-xs font-semibold uppercase tracking-wider hover:bg-teal-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  const stayDays = calculateOverlapDays(
    creator.visit_start,
    creator.visit_end,
    creator.visit_start,
    creator.visit_end
  );

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = submitCreatorRequest({
      creator_id: creator.application_id || creator.id,
      creator_name: creator.display_name,
      creator_niche: creator.niche,
      creator_city: creator.city,
      accommodation_name: formData.accommodationName,
      requester_name: formData.requesterName,
      requester_whatsapp: formData.requesterWhatsApp,
      message: formData.message,
    });

    setIsSubmitting(false);
    if (result.success) {
      setSubmittedSuccess(result.message);
    }
  };

  return (
    <div className="bg-sand-50 min-h-screen pb-24">
      {/* Top Breadcrumb Navigation */}
      <div className="bg-white border-b border-sand-300 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/creators"
            className="inline-flex items-center gap-2 text-xs font-semibold text-teal-900 hover:text-gold-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Creator Directory</span>
          </Link>

          <span className="text-[11px] font-mono text-ink-500 hidden sm:inline">
            Verified Profile • {creator.id}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Creator Information & Trip Details */}
          <div className="lg:col-span-8 space-y-6">
            {/* Creator Header Profile Card */}
            <div className="bg-white rounded-2xl border border-sand-300 overflow-hidden shadow-warm">
              <div className="relative h-72 sm:h-96 w-full bg-sand-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    formatStorageUrl(creator.avatar_url) ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={creator.display_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3.5 py-1 rounded-full bg-teal-900/90 text-sand-50 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-teal-700/60 shadow-sm">
                    {creator.niche}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-900/90 text-emerald-100 text-xs font-bold backdrop-blur-md border border-emerald-700/60 flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ID Verified</span>
                  </span>
                </div>

                {/* Trip.com-Style Score Badge */}
                <div className="absolute top-4 right-4 bg-teal-950/80 backdrop-blur-md text-white border border-white/20 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                  <span>Verified Creator</span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-6 left-6 right-6 text-sand-50 space-y-2">
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
                    {creator.display_name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-sand-200">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                      <span className="font-semibold text-white">
                        {creator.city}, Sri Lanka
                      </span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gold-400 shrink-0" />
                      <span>{formatDateRange(creator.visit_start, creator.visit_end)}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-gold-400 shrink-0" />
                      <span className="font-bold text-gold-400">
                        {formatFollowerCount(creator.follower_count)} Followers
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Specs Strip */}
              <div className="grid grid-cols-3 divide-x divide-sand-200 bg-sand-100/60 border-t border-sand-300 py-3.5 px-4 text-center">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-ink-500 font-bold">
                    Content Niche
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-teal-950 mt-0.5 block">
                    {creator.niche}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-ink-500 font-bold">
                    Scheduled Visit
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-teal-950 mt-0.5 block">
                    {stayDays} Total Days
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-ink-500 font-bold">
                    Verification
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-800 mt-0.5 block">
                    Govt ID Authenticated
                  </span>
                </div>
              </div>
            </div>

            {/* About / Trip Brief Section */}
            <div className="bg-white rounded-2xl border border-sand-300 p-6 sm:p-8 space-y-4 shadow-warm">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-teal-950 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-500" />
                <span>Trip Brief & Content Focus</span>
              </h2>
              <p className="text-sm text-ink-800 leading-relaxed whitespace-pre-wrap">
                {creator.trip_brief}
              </p>

              {creator.social_url && (
                <div className="pt-4 border-t border-sand-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500 block">
                    Verified Social Channels
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {creator.social_url
                      .split(/[,|\n]+/)
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .map((link, idx) => {
                        const isIg = link.includes("instagram.com");
                        const isTt = link.includes("tiktok.com");
                        const isFb = link.includes("facebook.com") || link.includes("fb.com");
                        const platform = isIg ? "Instagram" : isTt ? "TikTok" : isFb ? "Facebook" : "Channel";

                        return (
                          <a
                            key={idx}
                            href={link.startsWith("http") ? link : `https://${link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sand-100 hover:bg-teal-900 text-teal-950 hover:text-white text-xs font-semibold transition-colors border border-sand-200"
                          >
                            <span>{platform} Profile</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </a>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* Air-Gapped Privacy & Safety Guarantee */}
            <div className="bg-teal-950 text-sand-50 rounded-2xl p-6 sm:p-8 space-y-4 shadow-warm border border-teal-900">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-900 flex items-center justify-center text-gold-400 shrink-0 border border-teal-800">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-serif text-lg font-bold text-sand-50">
                    Get Linked Air-Gapped Privacy Protection
                  </h3>
                  <p className="text-xs text-sand-300 leading-relaxed">
                    To prevent spam, unauthorized solicitations, and privacy violations, this creator&apos;s direct WhatsApp number and identity documents are strictly air-gapped and protected.
                  </p>
                  <p className="text-xs text-sand-300 leading-relaxed">
                    When you request this creator, our local team reviews your property requirements, checks date compatibility, and curates a mutual WhatsApp concierge introduction.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Action Card (Trip.com Booking Pattern) */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white rounded-2xl border border-sand-300 p-6 sm:p-7 shadow-elevated space-y-5">
              <div className="border-b border-sand-200 pb-4">
                <span className="text-[11px] font-bold text-gold-700 uppercase tracking-wider block">
                  Curated Collaboration
                </span>
                <h3 className="font-serif text-xl font-bold text-teal-950 mt-1">
                  Request {creator.display_name}
                </h3>
                <p className="text-xs text-ink-600 mt-1">
                  Visiting {creator.city} ({formatDateRange(creator.visit_start, creator.visit_end)})
                </p>
              </div>

              {submittedSuccess ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-5 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
                    <Check className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-emerald-950">
                    Request Received!
                  </h4>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    {submittedSuccess}
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Our team will verify date overlap and initiate a WhatsApp concierge introduction shortly.
                  </p>
                  <button
                    onClick={() => setSubmittedSuccess(null)}
                    className="text-xs font-semibold text-emerald-900 underline mt-2"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitRequest} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-teal-950 uppercase tracking-wider mb-1">
                      Your Property / Stay Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dutch Galle Villa"
                      value={formData.accommodationName}
                      onChange={(e) =>
                        setFormData({ ...formData, accommodationName: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-sand-400 bg-sand-50 text-xs focus:outline-none focus:ring-2 focus:ring-teal-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-teal-950 uppercase tracking-wider mb-1">
                      Contact Person Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sunimal Silva"
                      value={formData.requesterName}
                      onChange={(e) =>
                        setFormData({ ...formData, requesterName: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-sand-400 bg-sand-50 text-xs focus:outline-none focus:ring-2 focus:ring-teal-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-teal-950 uppercase tracking-wider mb-1">
                      Host WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 077 123 4567"
                      value={formData.requesterWhatsApp}
                      onChange={(e) =>
                        setFormData({ ...formData, requesterWhatsApp: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-sand-400 bg-sand-50 text-xs focus:outline-none focus:ring-2 focus:ring-teal-900"
                    />
                    <span className="text-[10px] text-ink-500 mt-1 block">
                      Used only for Get Linked concierge staff introductions.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-teal-950 uppercase tracking-wider mb-1">
                      Message & Proposed Stay Dates
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. We'd love to host you for 2 nights with full board in exchange for 1 Reel & 5 Stories."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-sand-400 bg-sand-50 text-xs focus:outline-none focus:ring-2 focus:ring-teal-900"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl bg-teal-900 hover:bg-teal-800 text-sand-50 text-xs font-bold uppercase tracking-wider shadow-warm transition-all flex items-center justify-center gap-2 hover:bg-gold-500 hover:text-ink-950"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? "Submitting..." : "Send Request to Get Linked"}</span>
                  </button>
                </form>
              )}

              <div className="pt-3 border-t border-sand-200 text-center">
                <span className="text-[11px] text-ink-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-900" />
                  <span>100% Free during Phase 1 Launch</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
