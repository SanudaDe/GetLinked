"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useStore } from "@/data/store";
import {
  formatFollowerCount,
  formatDateRange,
  formatStorageUrl,
} from "@/utils/formatters";
import { calculateOverlapDays } from "@/utils/dateOverlap";
import { PhoneInputWithCountry } from "@/components/ui/PhoneInputWithCountry";
import { RateCreatorModal } from "@/components/creators/RateCreatorModal";
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
  ExternalLink,
  Check,
  Star,
  MessageSquare,
  Award,
} from "lucide-react";

export default function CreatorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { profiles, applications, submitCreatorRequest, getCreatorRatingStats } = useStore();

  const [formData, setFormData] = useState({
    accommodationName: "",
    requesterName: "",
    requesterWhatsApp: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<string | null>(null);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);

  // Find profile by ID or match by application_id
  const profile = profiles.find((p) => p.id === id || p.application_id === id);
  const application = applications.find(
    (a) => a.id === id || a.reference_code === id
  );

  const creator = profile || (application ? {
    id: application.id,
    application_id: application.id,
    display_name: application.full_name,
    niche: application.niche,
    city: application.city,
    visit_start: application.visit_start,
    visit_end: application.visit_end,
    follower_count: application.follower_count,
    social_url: application.social_url,
    avatar_url: application.avatar_url,
    trip_brief: application.trip_brief,
    is_active: application.status === "APPROVED",
    created_at: application.created_at,
  } : null);

  const ratingStats = getCreatorRatingStats(creator?.id || id);

  if (!creator) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] dark:bg-black text-[#152E30] dark:text-white flex items-center justify-center p-4 transition-colors">
        <div className="bg-white dark:bg-[#121212] rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8 sm:p-12 text-center max-w-md mx-auto space-y-5 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-[#D7400B]/10 text-[#D7400B] flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-wide text-neutral-900 dark:text-white">
            Creator Profile Not Found
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            The creator profile you are trying to view does not exist or may still be pending verification.
          </p>
          <Link
            href="/creators"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D7400B] text-white text-xs font-semibold uppercase tracking-widest hover:bg-[#BD3607] transition-all shadow-md"
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
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-black text-[#152E30] dark:text-neutral-100 transition-colors duration-200 pb-28">
      {/* Top Minimal Breadcrumb Navigation */}
      <div className="sticky top-0 z-30 border-b border-neutral-200/80 dark:border-neutral-900 bg-white/80 dark:bg-black/80 backdrop-blur-md py-3.5 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/creators"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 hover:text-[#D7400B] dark:hover:text-[#D7400B] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Creator Directory</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 hidden sm:inline uppercase tracking-widest">
              Verified Creator ID • {creator.id}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Creator Portfolio, Details, and Reviews */}
          <div className="lg:col-span-8 space-y-8">
            {/* Creator Hero Card (COMO Signature Editorial Frame) */}
            <div className="bg-white dark:bg-[#121212] rounded-3xl border border-neutral-200/80 dark:border-neutral-800 overflow-hidden shadow-xl dark:shadow-none transition-colors">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    formatStorageUrl(creator.avatar_url) ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={creator.display_name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                {/* Top Floating Badges */}
                <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold tracking-widest uppercase bg-black/60 dark:bg-black/80 text-white px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/20 shadow-sm">
                    {creator.niche}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ID Verified</span>
                  </span>
                </div>

                {/* Top Right Clickable Rating Pill */}
                <button
                  type="button"
                  onClick={() => setIsRateModalOpen(true)}
                  className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center gap-1.5 bg-[#D7400B] hover:bg-[#BD3607] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg border border-white/25 backdrop-blur-md transition-all hover:scale-105 cursor-pointer group/rate"
                  title="Click to view ratings or submit a review"
                >
                  <Star className="w-3.5 h-3.5 fill-white text-white" />
                  <span>
                    {ratingStats.meetsThreshold
                      ? `★ ${ratingStats.average.toFixed(1)} / 5.0 (${ratingStats.count})`
                      : ratingStats.count > 0
                      ? `${ratingStats.count}/3 Stays Verified`
                      : "Rate Creator"}
                  </span>
                </button>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 text-white space-y-3">
                  <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light uppercase tracking-[0.12em] text-white leading-tight">
                    {creator.display_name}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-neutral-200 font-light">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#D7400B] shrink-0" />
                      <span className="font-medium text-white">
                        {creator.city}, Sri Lanka
                      </span>
                    </div>
                    <span className="text-white/30">•</span>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="font-medium">
                        {formatDateRange(creator.visit_start, creator.visit_end)}
                      </span>
                    </div>
                    <span className="text-white/30">•</span>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#D7400B] shrink-0" />
                      <span className="font-medium text-white">
                        {formatFollowerCount(creator.follower_count)} Followers
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Specs Strip */}
              <div className="grid grid-cols-3 divide-x divide-neutral-200/80 dark:divide-neutral-800/80 bg-neutral-50/70 dark:bg-neutral-900/50 border-t border-neutral-200/80 dark:border-neutral-800 py-4 px-4 sm:px-6 text-center transition-colors">
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 font-bold">
                    Content Niche
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white mt-1 block">
                    {creator.niche}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 font-bold">
                    Scheduled Visit
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white mt-1 block">
                    {stayDays} Total Days
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 font-bold">
                    Authentication
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1 block">
                    Govt ID Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Trip Brief & Content Focus Section */}
            <div className="bg-white dark:bg-[#121212] rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-9 space-y-6 shadow-sm transition-colors">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#D7400B]/10 flex items-center justify-center text-[#D7400B]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-light uppercase tracking-wider text-neutral-900 dark:text-white">
                    Trip Brief & Content Focus
                  </h2>
                </div>
                <span className="text-[11px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-medium">
                  Verified Statement
                </span>
              </div>

              <p className="text-[18px] sm:text-[20px] lg:text-[22px] text-neutral-800 dark:text-neutral-200 leading-relaxed font-normal whitespace-pre-wrap">
                {creator.trip_brief}
              </p>

              {creator.social_url && (
                <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400 block">
                    Verified Social Channels
                  </span>
                  <div className="flex flex-wrap gap-2.5">
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
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 hover:bg-[#D7400B] dark:hover:bg-[#D7400B] text-neutral-800 dark:text-neutral-200 hover:text-white dark:hover:text-white text-xs font-semibold tracking-wide transition-all border border-neutral-200 dark:border-neutral-800"
                          >
                            <span>{platform} Profile</span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                          </a>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* Ratings & Community Reviews Section */}
            <div className="bg-white dark:bg-[#121212] rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-9 space-y-6 shadow-sm transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-light uppercase tracking-wider text-neutral-900 dark:text-white">
                      Host & Admin Ratings
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light mt-0.5">
                      Transparent evaluations from property hosts and the GetLinked curation team
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsRateModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D7400B] hover:bg-[#BD3607] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer self-start sm:self-auto"
                >
                  <Star className="w-3.5 h-3.5 fill-white text-white" />
                  <span>Rate This Creator</span>
                </button>
              </div>

              {/* Score Summary Banner */}
              {ratingStats.meetsThreshold ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800">
                  <div className="sm:border-r border-neutral-200 dark:border-neutral-800 sm:pr-4 text-center sm:text-left space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-bold block">
                      Verified Collaboration Score
                    </span>
                    <div className="flex items-baseline justify-center sm:justify-start gap-1.5">
                      <span className="font-serif text-3xl sm:text-4xl font-light text-neutral-900 dark:text-white">
                        {ratingStats.average.toFixed(1)}
                      </span>
                      <span className="text-xs text-neutral-400 font-medium">/ 5.0 ⭐</span>
                    </div>
                    <span className="text-[11px] text-[#D7400B] font-semibold block">
                      Earned across {ratingStats.count} verified collaborations
                    </span>
                  </div>

                  <div className="sm:border-r border-neutral-200 dark:border-neutral-800 sm:px-4 text-center sm:text-left space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-bold block">
                      Host Highlights
                    </span>
                    <div className="space-y-1 pt-1 text-xs text-neutral-700 dark:text-neutral-300">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500 text-[11px]">Reliability:</span>
                        <span className="font-bold text-teal-900 dark:text-teal-400">
                          {ratingStats.criteriaAverages["Reliability"] || ratingStats.average.toFixed(1)} ⭐
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500 text-[11px]">Content Quality:</span>
                        <span className="font-bold text-teal-900 dark:text-teal-400">
                          {ratingStats.criteriaAverages["Content Quality"] || ratingStats.average.toFixed(1)} ⭐
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500 text-[11px]">Showed as Agreed:</span>
                        <span className="font-bold text-teal-900 dark:text-teal-400">
                          {ratingStats.criteriaAverages["Showed up as agreed"] || "100%"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:pl-4 text-center sm:text-left space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-bold block">
                      Verification Standard
                    </span>
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                        Double-Blind Verified
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">
                      Both host and creator submit before reviews unlock
                    </span>
                  </div>
                </div>
              ) : (
                /* Credibility Threshold Banner (Score Withheld Until 3 Reviews) */
                <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/70 dark:bg-neutral-900/80 border border-amber-200 dark:border-neutral-800 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-bold tracking-widest text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
                          Credibility Threshold Active
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                          {ratingStats.count} / 3 Reviews Logged
                        </span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-teal-950 dark:text-white">
                        Public Score Hidden Until 3 Reviews Earned
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-2xl">
                    In accordance with Get Linked&apos;s <strong>&ldquo;no fake signals&rdquo;</strong> principle, aggregate scores are only published once a creator earns at least <strong>3 verified collaborations</strong>. Showing &ldquo;5.0 ⭐ (1 review)&rdquo; looks worse than showing nothing; withholding the score until it is earned ensures every rating on our platform is statistically credible.
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-1 max-w-md">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                      <span>Track Record Progress:</span>
                      <span>{ratingStats.count} of 3 completed ({3 - ratingStats.count} needed)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-sand-200 dark:bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-[#D7400B] transition-all duration-500 rounded-full"
                        style={{ width: `${Math.min(100, (ratingStats.count / 3) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews Feed */}
              {ratingStats.count > 0 ? (
                <div className="space-y-4 pt-2">
                  {/* 1. Revealed Post-Collab Reviews (Double-Blind Verified) */}
                  {ratingStats.revealedCollabs.map((collab) => (
                    <div
                      key={collab.id}
                      className="p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/40 space-y-2.5 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-serif text-base font-normal text-neutral-900 dark:text-white">
                              {collab.partner_name}
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-800">
                              Hosted Stay Collaboration
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span>Double-Blind Verified</span>
                            </span>
                          </div>
                        </div>

                        {/* Rating Score Badge */}
                        <div className="flex items-center gap-1 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-full text-xs font-bold shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{collab.score.toFixed(1)} / 5</span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-light">
                        &ldquo;{collab.feedback}&rdquo;
                      </p>

                      {collab.criteria && collab.criteria.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {collab.criteria.map((c) => (
                            <span
                              key={c}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-sand-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                            >
                              ✓ {c}
                            </span>
                          ))}
                        </div>
                      )}

                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block pt-1 font-mono">
                        {new Date(collab.submitted_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  ))}

                  {/* 2. Direct Community / Admin Verified Ratings */}
                  {ratingStats.ratings.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/40 space-y-2.5 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-serif text-base font-normal text-neutral-900 dark:text-white">
                              {rev.reviewer_name}
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-medium">
                              {rev.reviewer_role}
                            </span>
                            {rev.is_admin && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 border border-amber-500/20">
                                <ShieldCheck className="w-3 h-3 text-amber-500" />
                                <span>Platform Curation Review</span>
                              </span>
                            )}
                          </div>
                          {rev.property_name && (
                            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block font-light">
                              {rev.property_name}
                            </span>
                          )}
                        </div>

                        {/* Rating Score Badge */}
                        <div className="flex items-center gap-1 bg-[#D7400B]/10 dark:bg-[#D7400B]/20 text-[#D7400B] px-2.5 py-1 rounded-full text-xs font-bold shrink-0">
                          <Star className="w-3 h-3 fill-[#D7400B] text-[#D7400B]" />
                          <span>{rev.rating.toFixed(1)} / 5</span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-light">
                        &ldquo;{rev.comment}&rdquo;
                      </p>

                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block pt-1 font-mono">
                        {new Date(rev.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 space-y-3 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
                  <MessageSquare className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto" />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    No community reviews posted yet for this creator.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsRateModalOpen(true)}
                    className="text-xs font-bold text-[#D7400B] hover:underline cursor-pointer"
                  >
                    Click here to be the first to leave a rating
                  </button>
                </div>
              )}
            </div>

            {/* Air-Gapped Privacy & Safety Guarantee */}
            <div className="bg-[#152E30] dark:bg-[#111C1D] text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg border border-[#214749] dark:border-neutral-800">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400 shrink-0 border border-white/10">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-lg sm:text-xl font-light uppercase tracking-wider text-white">
                    Get Linked Air-Gapped Privacy Protection
                  </h3>
                  <p className="text-xs text-white/80 leading-relaxed font-light">
                    To prevent spam, unauthorized solicitations, and privacy violations, this creator&apos;s direct WhatsApp number and identity documents are strictly air-gapped and protected.
                  </p>
                  <p className="text-xs text-white/80 leading-relaxed font-light">
                    When you request this creator, our local concierge team reviews your property requirements, checks date compatibility, and curates a personalized WhatsApp introduction.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Request Card (COMO Luxury Booking Architecture) */}
          <div className="lg:col-span-4 sticky top-20 space-y-5">
            <div className="bg-white dark:bg-[#121212] rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-8 shadow-xl dark:shadow-none space-y-6 transition-colors">
              <div className="border-b border-neutral-100 dark:border-neutral-800 pb-4 space-y-1">
                <span className="text-[10px] font-bold text-[#D7400B] uppercase tracking-[0.25em] block">
                  Curated Collaboration
                </span>
                <h3 className="font-serif text-2xl font-light uppercase tracking-wide text-neutral-900 dark:text-white">
                  Request {creator.display_name}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">
                  Visiting {creator.city} ({formatDateRange(creator.visit_start, creator.visit_end)})
                </p>
              </div>

              {submittedSuccess ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-3.5">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-xl font-light text-neutral-900 dark:text-white">
                    Request Received!
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
                    {submittedSuccess}
                  </p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Our team will verify date overlap and initiate a WhatsApp concierge introduction shortly.
                  </p>
                  <button
                    onClick={() => setSubmittedSuccess(null)}
                    className="text-xs font-semibold text-[#D7400B] underline mt-2 block mx-auto cursor-pointer"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitRequest} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
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
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#D7400B] dark:focus:border-[#D7400B] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
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
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#D7400B] dark:focus:border-[#D7400B] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
                      Host WhatsApp Number *
                    </label>
                    <PhoneInputWithCountry
                      value={formData.requesterWhatsApp}
                      onChange={(phone) =>
                        setFormData({ ...formData, requesterWhatsApp: phone })
                      }
                      placeholder="e.g. 77 123 4567"
                      required
                    />
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1.5 block">
                      Used only for Get Linked concierge staff introductions.
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
                      Message & Proposed Stay Dates
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. We'd love to host you for 2 nights with full board in exchange for 1 Reel & 5 Stories."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#D7400B] dark:focus:border-[#D7400B] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-2xl bg-[#D7400B] hover:bg-[#BD3607] text-white text-xs font-semibold uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? "Submitting..." : "Send Request to Get Linked"}</span>
                  </button>
                </form>
              )}

              <div className="pt-2 text-center border-t border-neutral-100 dark:border-neutral-800">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold">
                  100% Free During Phase 1 Launch
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Rate Creator Modal */}
      <RateCreatorModal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        creatorId={creator.id}
        creatorName={creator.display_name}
      />
    </div>
  );
}
