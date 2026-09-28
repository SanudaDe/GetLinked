"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/data/store";
import { formatFollowerCount, formatDateRange, formatStorageUrl, SRI_LANKA_CITIES, CREATOR_NICHES } from "@/utils/formatters";
import { checkDateOverlap, calculateOverlapDays } from "@/utils/dateOverlap";
import { InfluencerProfile, NicheType } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { AdBanner } from "@/components/home/AdBanner";
import { PinContainer } from "@/components/ui/3d-pin";

function getSocialDisplay(url?: string, name?: string) {
  if (!url) return name ? `@${name.toLowerCase().replace(/\s+/g, "")}` : "instagram.com";
  try {
    const clean = url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
    if (clean.includes("instagram.com/")) {
      const handle = clean.split("instagram.com/")[1];
      return handle ? `@${handle}` : "instagram.com";
    }
    if (clean.includes("tiktok.com/@")) {
      const handle = clean.split("tiktok.com/@")[1];
      return handle ? `@${handle}` : "tiktok.com";
    }
    if (clean.includes("twitter.com/") || clean.includes("x.com/")) {
      const handle = clean.split(/twitter\.com\/|x\.com\//)[1];
      return handle ? `@${handle}` : "x.com";
    }
    return clean.slice(0, 24);
  } catch {
    return "Social Profile";
  }
}
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Users,
  Send,
  CheckCircle2,
  Sparkles,
  SlidersHorizontal,
  RotateCcw,
  ShieldCheck,
  Star,
  ArrowUpDown,
} from "lucide-react";

function CreatorDirectoryContent() {
  const searchParams = useSearchParams();
  const { profiles, submitCreatorRequest } = useStore();

  // Read URL query params from homepage search widget
  const paramCity = searchParams.get("city") || "All Sri Lanka";
  const paramNiche = searchParams.get("niche") || "All Niches";
  const paramFollowers = searchParams.get("minFollowers") ? Number(searchParams.get("minFollowers")) : 5000;
  const paramStart = searchParams.get("start") || "";
  const paramEnd = searchParams.get("end") || "";

  // Filter States
  const [selectedCity, setSelectedCity] = useState<string>(paramCity);
  const [selectedNiche, setSelectedNiche] = useState<string>(paramNiche);
  const [minFollowers, setMinFollowers] = useState<number>(paramFollowers);
  const [filterStartDate, setFilterStartDate] = useState<string>(paramStart);
  const [filterEndDate, setFilterEndDate] = useState<string>(paramEnd);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"recommended" | "followers" | "dates">("recommended");

  // Request Modal State
  const [selectedCreator, setSelectedCreator] = useState<InfluencerProfile | null>(null);
  const [formData, setFormData] = useState({
    accommodationName: "",
    requesterName: "",
    requesterWhatsApp: "",
    message: "",
  });
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  // Filter & Sort Logic
  const filteredProfiles = useMemo(() => {
    const list = profiles.filter((p) => {
      // Must be active
      if (!p.is_active) return false;

      // City filter
      if (selectedCity !== "All Sri Lanka" && p.city !== selectedCity) {
        return false;
      }

      // Niche filter
      if (selectedNiche !== "All Niches" && p.niche !== selectedNiche) {
        return false;
      }

      // Follower count filter
      if (p.follower_count < minFollowers) {
        return false;
      }

      // Date overlap filter
      if (filterStartDate && filterEndDate) {
        const overlaps = checkDateOverlap(
          p.visit_start,
          p.visit_end,
          filterStartDate,
          filterEndDate
        );
        if (!overlaps) return false;
      }

      // Text query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = p.display_name.toLowerCase().includes(query);
        const matchCity = p.city.toLowerCase().includes(query);
        const matchNiche = p.niche.toLowerCase().includes(query);
        const matchBrief = p.trip_brief.toLowerCase().includes(query);
        if (!matchName && !matchCity && !matchNiche && !matchBrief) return false;
      }

      return true;
    });

    // Sort options
    return list.sort((a, b) => {
      if (sortBy === "followers") {
        return b.follower_count - a.follower_count;
      }
      if (sortBy === "dates") {
        return new Date(a.visit_start).getTime() - new Date(b.visit_start).getTime();
      }
      return 0; // recommended default
    });
  }, [
    profiles,
    selectedCity,
    selectedNiche,
    minFollowers,
    filterStartDate,
    filterEndDate,
    searchQuery,
    sortBy,
  ]);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCreator) return;

    const res = submitCreatorRequest({
      creator_id: selectedCreator.id,
      creator_name: selectedCreator.display_name,
      creator_niche: selectedCreator.niche,
      creator_city: selectedCreator.city,
      accommodation_name: formData.accommodationName,
      requester_name: formData.requesterName,
      requester_whatsapp: formData.requesterWhatsApp,
      message: formData.message,
    });

    if (res.success) {
      setSubmittedMessage(res.message);
      setTimeout(() => {
        setSubmittedMessage(null);
        setSelectedCreator(null);
        setFormData({
          accommodationName: "",
          requesterName: "",
          requesterWhatsApp: "",
          message: "",
        });
      }, 2500);
    }
  };

  const handleResetFilters = () => {
    setSelectedCity("All Sri Lanka");
    setSelectedNiche("All Niches");
    setMinFollowers(5000);
    setFilterStartDate("");
    setFilterEndDate("");
    setSearchQuery("");
    setSortBy("recommended");
  };

  return (
    <div className="py-10 bg-sand-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Top Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-6 border-b border-sand-300 mb-8 text-xs">
          <div className="flex items-center gap-2 text-ink-600">
            <Link href="/" className="hover:text-teal-900 font-medium">Home</Link>
            <span>/</span>
            <span className="text-teal-950 font-bold">Creator Directory</span>
            <span>/</span>
            <span className="text-gold-600 font-medium">Sri Lanka</span>
          </div>
          <Link
            href="/admin/matching"
            className="text-xs font-semibold text-teal-950 bg-sand-200 hover:bg-sand-300 border border-sand-400 px-3 py-1 rounded-full flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-800" />
            <span>Admin: Open Matching Workspace →</span>
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-3 mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-teal-950">
            Verified Creators Visiting Sri Lanka
          </h1>
          <p className="text-xs sm:text-sm text-ink-700 max-w-2xl">
            Search 100% ID-verified travel and lifestyle influencers with confirmed travel dates across Sri Lanka.
          </p>
        </div>

        {/* Trip.com-Style Horizontal Filter Bar */}
        <div className="bg-sand-50 rounded-2xl border border-sand-300 p-5 shadow-warm mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-3">
              <label className="block text-[10px] font-bold text-ink-600 uppercase tracking-wider mb-1">
                Search Keyword / Name
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-ink-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Elena, Galle, Surf..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-sand-400 bg-sand-50 text-xs focus:outline-none focus:ring-2 focus:ring-teal-900"
                />
              </div>
            </div>

            {/* City Dropdown */}
            <div className="lg:col-span-3">
              <label className="block text-[10px] font-bold text-ink-600 uppercase tracking-wider mb-1">
                Destination City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-sand-400 bg-sand-50 text-xs focus:outline-none focus:ring-2 focus:ring-teal-900 cursor-pointer font-medium"
              >
                {SRI_LANKA_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Niche Dropdown */}
            <div className="lg:col-span-2">
              <label className="block text-[10px] font-bold text-ink-600 uppercase tracking-wider mb-1">
                Niche
              </label>
              <select
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-sand-400 bg-sand-50 text-xs focus:outline-none focus:ring-2 focus:ring-teal-900 cursor-pointer"
              >
                <option value="All Niches">All Niches</option>
                {CREATOR_NICHES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Follower Tier */}
            <div className="lg:col-span-2">
              <label className="block text-[10px] font-bold text-ink-600 uppercase tracking-wider mb-1">
                Audience Tier
              </label>
              <select
                value={minFollowers}
                onChange={(e) => setMinFollowers(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-sand-400 bg-sand-50 text-xs focus:outline-none focus:ring-2 focus:ring-teal-900 cursor-pointer"
              >
                <option value={5000}>5K+ Followers</option>
                <option value={20000}>20K+ Followers</option>
                <option value={50000}>50K+ Followers</option>
                <option value={100000}>100K+ Followers</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="lg:col-span-2 flex items-end">
              <button
                onClick={handleResetFilters}
                className="w-full py-2 px-3 rounded-lg bg-sand-200 hover:bg-sand-300 text-ink-800 text-xs font-semibold border border-sand-400 flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Date Overlap Strip */}
          <div className="pt-3 border-t border-sand-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-gold-600 shrink-0" />
              <span className="font-semibold text-teal-950">Overlapping Stay Window:</span>
              <input
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="px-2 py-1 rounded border border-sand-400 bg-sand-50 text-xs focus:outline-none"
              />
              <span className="text-ink-400">to</span>
              <input
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className="px-2 py-1 rounded border border-sand-400 bg-sand-50 text-xs focus:outline-none"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 ml-auto">
              <ArrowUpDown className="w-3.5 h-3.5 text-ink-500" />
              <span className="font-medium text-ink-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "recommended" | "followers" | "dates")}
                className="px-2 py-1 rounded border border-sand-400 bg-sand-50 text-xs font-semibold focus:outline-none"
              >
                <option value="recommended">⭐ Recommended</option>
                <option value="followers">🔥 Highest Followers</option>
                <option value="dates">🗓️ Earliest Travel Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter & Privacy Assurance */}
        <div className="flex items-center justify-between text-xs text-ink-600 mb-6">
          <span>
            Showing <strong className="text-teal-950 font-bold">{filteredProfiles.length}</strong> verified creators scheduled in Sri Lanka
          </span>
          <span className="hidden sm:inline text-emerald-800 font-medium">
            🔒 WhatsApp numbers & ID documents protected by Get Linked
          </span>
        </div>

        {/* Creator Cards Grid (Trip.com Travel Card Aesthetic) */}
        {filteredProfiles.length === 0 ? (
          <div className="bg-sand-50 rounded-2xl border border-sand-300 p-12 text-center space-y-4 max-w-lg mx-auto my-12 shadow-warm">
            <div className="w-12 h-12 rounded-full bg-sand-200 text-ink-600 flex items-center justify-center mx-auto">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-teal-950">
              No Creators Match These Filters
            </h3>
            <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">
              Try adjusting your city filter or date window. New verified creators submit travel plans weekly.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2 rounded-lg bg-teal-900 text-sand-50 text-xs font-semibold uppercase tracking-wider hover:bg-teal-800 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
            {filteredProfiles.map((creator) => {
              const stayDays = calculateOverlapDays(
                creator.visit_start,
                creator.visit_end,
                creator.visit_start,
                creator.visit_end
              );
              const socialTitle = getSocialDisplay(creator.social_url, creator.display_name);

              return (
                <div
                  key={creator.id}
                  className="h-[36rem] w-full flex items-center justify-center py-4"
                >
                  <PinContainer
                    title={socialTitle}
                    href={creator.social_url || "https://instagram.com"}
                    containerClassName="w-full h-full flex items-center justify-center"
                    className="w-[20rem] sm:w-[22rem] flex flex-col justify-between"
                  >
                    <div className="space-y-3.5">
                      {/* Futuristic Image Frame */}
                      <div className="relative h-56 w-full rounded-xl overflow-hidden bg-[#1A3739]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            formatStorageUrl(creator.avatar_url) ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                          }
                          alt={creator.display_name}
                          className="w-full h-full object-cover group-hover/pin:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#152E30] via-black/20 to-transparent pointer-events-none" />

                        {/* Top Niche Pill */}
                        <div className="absolute top-2.5 left-2.5">
                          <span className="text-[11px] font-bold tracking-wider uppercase bg-[#1A3739]/90 text-white px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10 shadow-sm">
                            {creator.niche}
                          </span>
                        </div>

                        {/* Rating Pill */}
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-[#D7400B] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md">
                          <Star className="w-3 h-3 fill-white text-white" />
                          <span>9.9</span>
                        </div>

                        {/* Follower Metric Pill */}
                        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 text-white text-xs font-semibold bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                          <Users className="w-3.5 h-3.5 text-[#D7400B]" />
                          <span>{formatFollowerCount(creator.follower_count)} Followers</span>
                        </div>

                        {/* Duration Tag */}
                        <div className="absolute bottom-2.5 right-2.5 text-[10px] font-semibold tracking-wider uppercase text-white/90 bg-[#152E30]/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                          {stayDays} Days Visit
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-serif text-xl font-medium text-white group-hover/pin:text-[#D7400B] transition-colors truncate">
                            {creator.display_name}
                          </h3>
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>ID Verified</span>
                          </span>
                        </div>

                        <div className="space-y-1 text-xs text-white/80">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#D7400B] shrink-0" />
                            <span className="font-medium text-white">{creator.city}, Sri Lanka</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="text-white/75">{formatDateRange(creator.visit_start, creator.visit_end)}</span>
                          </div>
                        </div>

                        <p className="text-xs text-white/70 line-clamp-2 leading-relaxed pt-0.5 font-light">
                          {creator.trip_brief}
                        </p>
                      </div>
                    </div>

                    {/* Futuristic Action Buttons */}
                    <div className="pt-4 grid grid-cols-2 gap-2 relative z-50">
                      <Link
                        href={`/creators/${creator.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider border border-white/15 text-center transition-all flex items-center justify-center cursor-pointer"
                      >
                        View Profile
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCreator(creator);
                        }}
                        className="py-2.5 px-3 rounded-xl bg-[#D7400B] hover:bg-[#BD3607] text-white text-xs font-semibold uppercase tracking-wider shadow-md hover:shadow-[0_0_15px_rgba(215,64,11,0.5)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Request</span>
                      </button>
                    </div>
                  </PinContainer>
                </div>
              );
            })}
          </div>
        )}

        {/* Sponsor Placement */}
        <div className="mt-16">
          <AdBanner placement="ACCOMMODATION_PAGES" />
        </div>
      </div>

      {/* Request Modal */}
      {selectedCreator && (
        <Modal
          isOpen={!!selectedCreator}
          onClose={() => setSelectedCreator(null)}
          title={`Request Collaboration: ${selectedCreator.display_name}`}
          subtitle={`Visiting ${selectedCreator.city} (${formatDateRange(selectedCreator.visit_start, selectedCreator.visit_end)})`}
        >
          {submittedMessage ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-xl font-bold text-teal-900">
                Collaboration Request Logged!
              </h4>
              <p className="text-sm text-ink-700 max-w-sm mx-auto">
                {submittedMessage}
              </p>
            </div>
          ) : (
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div className="p-3 bg-sand-200/50 rounded-lg text-xs text-ink-700 leading-relaxed border border-sand-300">
                <span className="font-semibold text-teal-900">Privacy Notice:</span> Contact details are never exposed. Your request is reviewed by Get Linked staff. Once confirmed, we introduce both parties directly on WhatsApp.
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                  Accommodation / Property Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Dutch Fort Heritage Villa"
                  value={formData.accommodationName}
                  onChange={(e) => setFormData({ ...formData, accommodationName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohan De Silva"
                    value={formData.requesterName}
                    onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                    Your WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +94771234567"
                    value={formData.requesterWhatsApp}
                    onChange={(e) => setFormData({ ...formData, requesterWhatsApp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                  Message / Proposed Offer (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. We would love to host you for 3 nights with private pool villa and breakfast in exchange for 2 Instagram Reels."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCreator(null)}
                  className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-ink-600 hover:text-ink-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-sand-50 text-xs font-semibold uppercase tracking-wider shadow-warm transition-all"
                >
                  Submit Request
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}

export default function CreatorDirectoryPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-ink-500">Loading directory...</div>}>
      <CreatorDirectoryContent />
    </Suspense>
  );
}
