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
import { DateRangeCalendarPicker } from "@/components/ui/DateRangeCalendarPicker";


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
  ChevronDown,
  X,
} from "lucide-react";

function CreatorDirectoryContent() {
  const searchParams = useSearchParams();
  const { profiles, submitCreatorRequest, getCreatorRatingStats } = useStore();

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

  const hasActiveFilters = Boolean(
    selectedCity !== "All Sri Lanka" ||
    selectedNiche !== "All Niches" ||
    minFollowers !== 5000 ||
    filterStartDate ||
    filterEndDate ||
    searchQuery.trim()
  );

  return (
    <div className="py-10 bg-white dark:bg-black text-[#1A3739] dark:text-white min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Top Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-6 border-b border-sand-300 dark:border-neutral-800 mb-8 text-xs">
          <div className="flex items-center gap-2 text-ink-600 dark:text-neutral-400">
            <Link href="/" className="hover:text-teal-900 dark:hover:text-white font-medium">Home</Link>
            <span>/</span>
            <span className="text-teal-950 dark:text-white font-bold">Creator Directory</span>
            <span>/</span>
            <span className="text-gold-600 font-medium">Sri Lanka</span>
          </div>
        </div>

        {/* Header */}
        <div className="space-y-4 mb-10">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-teal-950 dark:text-white tracking-tight leading-tight">
            Verified Creators Visiting Sri Lanka
          </h1>
          <p className="text-[19px] sm:text-[22px] lg:text-[24px] text-[#1A3739]/90 dark:text-neutral-200 leading-relaxed max-w-3xl font-normal pt-1">
            Search 100% ID-verified travel and lifestyle influencers with confirmed travel dates across Sri Lanka.
          </p>
        </div>

        {/* Luxury Modern Filter & Search Hub */}
        <div className="relative z-30 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-sand-300 dark:border-neutral-800 shadow-warm-lg p-4 sm:p-6 mb-8 space-y-4 transition-all">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5">
            {/* Search Input */}
            <div className="lg:col-span-4">
              <label className="block text-[10px] font-bold text-ink-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Search className="w-3 h-3 text-sinopia" />
                <span>Search Creator or City</span>
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-ink-400 dark:text-neutral-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Elena, Galle, Surfing, Luxury..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-sand-300 dark:border-neutral-800 bg-sand-50/60 dark:bg-neutral-900 hover:bg-white dark:hover:bg-neutral-900 focus:bg-white dark:focus:bg-neutral-900 text-xs text-teal-950 dark:text-white placeholder:text-ink-400 dark:placeholder:text-neutral-500 font-medium focus:outline-none focus:ring-2 focus:ring-teal-900/20 focus:border-teal-900 dark:focus:border-neutral-700 transition-all shadow-xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-2.5 p-0.5 rounded-full text-ink-400 dark:text-neutral-400 hover:text-sinopia hover:bg-sand-200/60 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* City Dropdown */}
            <div className="lg:col-span-3">
              <label className="block text-[10px] font-bold text-ink-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-sinopia" />
                <span>Destination City</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-sinopia absolute left-3 top-3 pointer-events-none" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full appearance-none pl-9 pr-8 py-2.5 rounded-xl border border-sand-300 dark:border-neutral-800 bg-sand-50/60 dark:bg-neutral-900 hover:bg-white dark:hover:bg-neutral-900 focus:bg-white dark:focus:bg-neutral-900 text-xs text-teal-950 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-teal-900/20 focus:border-teal-900 dark:focus:border-neutral-700 cursor-pointer transition-all shadow-xs"
                >
                  {SRI_LANKA_CITIES.map((c) => (
                    <option key={c} value={c} className="dark:bg-neutral-900 dark:text-white">
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-ink-400 dark:text-neutral-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Niche Dropdown */}
            <div className="lg:col-span-3">
              <label className="block text-[10px] font-bold text-ink-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-sinopia" />
                <span>Creative Niche</span>
              </label>
              <div className="relative">
                <Sparkles className="w-4 h-4 text-amber-500 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={selectedNiche}
                  onChange={(e) => setSelectedNiche(e.target.value)}
                  className="w-full appearance-none pl-9 pr-8 py-2.5 rounded-xl border border-sand-300 dark:border-neutral-800 bg-sand-50/60 dark:bg-neutral-900 hover:bg-white dark:hover:bg-neutral-900 focus:bg-white dark:focus:bg-neutral-900 text-xs text-teal-950 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-teal-900/20 focus:border-teal-900 dark:focus:border-neutral-700 cursor-pointer transition-all shadow-xs"
                >
                  <option value="All Niches" className="dark:bg-neutral-900 dark:text-white">All Niches</option>
                  {CREATOR_NICHES.map((n) => (
                    <option key={n} value={n} className="dark:bg-neutral-900 dark:text-white">
                      {n}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-ink-400 dark:text-neutral-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Follower Tier */}
            <div className="lg:col-span-2">
              <label className="block text-[10px] font-bold text-ink-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Users className="w-3 h-3 text-sinopia" />
                <span>Audience Tier</span>
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-teal-800 dark:text-teal-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={minFollowers}
                  onChange={(e) => setMinFollowers(Number(e.target.value))}
                  className="w-full appearance-none pl-9 pr-8 py-2.5 rounded-xl border border-sand-300 dark:border-neutral-800 bg-sand-50/60 dark:bg-neutral-900 hover:bg-white dark:hover:bg-neutral-900 focus:bg-white dark:focus:bg-neutral-900 text-xs text-teal-950 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-teal-900/20 focus:border-teal-900 dark:focus:border-neutral-700 cursor-pointer transition-all shadow-xs"
                >
                  <option value={5000} className="dark:bg-neutral-900 dark:text-white">5K+ Followers</option>
                  <option value={20000} className="dark:bg-neutral-900 dark:text-white">20K+ Followers</option>
                  <option value={50000} className="dark:bg-neutral-900 dark:text-white">50K+ Followers</option>
                  <option value={100000} className="dark:bg-neutral-900 dark:text-white">100K+ Followers</option>
                </select>
                <ChevronDown className="w-4 h-4 text-ink-400 dark:text-neutral-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Secondary Controls Bar: Interactive Date Range Calendar & Sort Options */}
          <div className="pt-3 border-t border-sand-200 dark:border-neutral-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Interactive Calendar Picker (No dd/mm/yyyy typing!) */}
            <div className="flex-1 max-w-xl">
              <DateRangeCalendarPicker
                startDate={filterStartDate}
                endDate={filterEndDate}
                onChange={(start, end) => {
                  setFilterStartDate(start);
                  setFilterEndDate(end);
                }}
                placeholder="Click to pick stay dates on calendar"
              />
            </div>

            {/* Right Controls: Sort & Reset */}
            <div className="flex items-center gap-2.5 justify-between md:justify-end shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500 dark:text-neutral-400 whitespace-nowrap hidden sm:inline">
                  Sort by:
                </span>
                <div className="relative">
                  <ArrowUpDown className="w-3.5 h-3.5 text-sinopia absolute left-3 top-3 pointer-events-none" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "recommended" | "followers" | "dates")}
                    className="appearance-none pl-8 pr-7 py-2 rounded-xl border border-sand-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-bold text-teal-950 dark:text-white hover:border-teal-800 dark:hover:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-teal-900/20 transition-all cursor-pointer shadow-xs"
                  >
                    <option value="recommended" className="dark:bg-neutral-900 dark:text-white">⭐ Recommended</option>
                    <option value="followers" className="dark:bg-neutral-900 dark:text-white">🔥 Highest Followers</option>
                    <option value="dates" className="dark:bg-neutral-900 dark:text-white">🗓️ Earliest Travel Date</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-ink-400 dark:text-neutral-500 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Reset Button */}
              <button
                type="button"
                onClick={handleResetFilters}
                disabled={!hasActiveFilters}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  hasActiveFilters
                    ? "bg-sand-100 dark:bg-neutral-900 hover:bg-sand-200 dark:hover:bg-neutral-800 text-teal-950 dark:text-white border-sand-400 dark:border-neutral-700 hover:border-teal-900 shadow-xs cursor-pointer"
                    : "opacity-40 text-ink-400 dark:text-neutral-500 border-sand-300 dark:border-neutral-800 cursor-not-allowed bg-transparent"
                }`}
                title="Reset all filters"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${hasActiveFilters ? "text-sinopia hover:rotate-180 transition-transform duration-500" : ""}`} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Active Filter Chips Strip */}
          {hasActiveFilters && (
            <div className="pt-3 border-t border-sand-200 dark:border-neutral-800 flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500 dark:text-neutral-400">
                Active:
              </span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sand-100 dark:bg-neutral-900 text-teal-950 dark:text-white text-[11px] font-semibold border border-sand-300 dark:border-neutral-700">
                  <span>&ldquo;{searchQuery}&rdquo;</span>
                  <button onClick={() => setSearchQuery("")} className="hover:text-sinopia ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCity !== "All Sri Lanka" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sand-100 dark:bg-neutral-900 text-teal-950 dark:text-white text-[11px] font-semibold border border-sand-300 dark:border-neutral-700">
                  <MapPin className="w-3 h-3 text-sinopia" />
                  <span>{selectedCity}</span>
                  <button onClick={() => setSelectedCity("All Sri Lanka")} className="hover:text-sinopia ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedNiche !== "All Niches" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sand-100 dark:bg-neutral-900 text-teal-950 dark:text-white text-[11px] font-semibold border border-sand-300 dark:border-neutral-700">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>{selectedNiche}</span>
                  <button onClick={() => setSelectedNiche("All Niches")} className="hover:text-sinopia ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {minFollowers > 5000 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sand-100 dark:bg-neutral-900 text-teal-950 dark:text-white text-[11px] font-semibold border border-sand-300 dark:border-neutral-700">
                  <Users className="w-3 h-3 text-teal-800 dark:text-teal-400" />
                  <span>{minFollowers / 1000}K+ Followers</span>
                  <button onClick={() => setMinFollowers(5000)} className="hover:text-sinopia ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {(filterStartDate || filterEndDate) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sinopia/10 text-sinopia text-[11px] font-semibold border border-sinopia/30">
                  <Calendar className="w-3 h-3 text-sinopia" />
                  <span>{formatDateRange(filterStartDate, filterEndDate)}</span>
                  <button
                    onClick={() => {
                      setFilterStartDate("");
                      setFilterEndDate("");
                    }}
                    className="hover:text-sinopia-dark ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-sinopia hover:underline ml-auto cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Counter & Verification Assurance */}
        <div className="flex items-center justify-between text-xs text-ink-600 dark:text-neutral-400 mb-6 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span>
              Showing <strong className="text-teal-950 dark:text-white font-bold">{filteredProfiles.length}</strong> verified creators scheduled in Sri Lanka
            </span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>ID & passport verification active</span>
          </span>
        </div>

        {/* Creator Cards Grid (Trip.com Travel Card Aesthetic) */}
        {filteredProfiles.length === 0 ? (
          <div className="bg-sand-50 dark:bg-neutral-900 rounded-2xl border border-sand-300 dark:border-neutral-800 p-12 text-center space-y-4 max-w-lg mx-auto my-12 shadow-warm">
            <div className="w-12 h-12 rounded-full bg-sand-200 dark:bg-neutral-800 text-ink-600 dark:text-neutral-300 flex items-center justify-center mx-auto">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-teal-950 dark:text-white">
              No Creators Match These Filters
            </h3>
            <p className="text-xs sm:text-sm text-ink-700 dark:text-neutral-400 leading-relaxed">
              Try adjusting your city filter or date window. New verified creators submit travel plans weekly.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2 rounded-lg bg-teal-900 dark:bg-teal-700 text-sand-50 text-xs font-semibold uppercase tracking-wider hover:bg-teal-800 dark:hover:bg-teal-600 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProfiles.map((creator) => {
              const stayDays = calculateOverlapDays(
                creator.visit_start,
                creator.visit_end,
                creator.visit_start,
                creator.visit_end
              );
              const cStats = getCreatorRatingStats(creator.id);

              return (
                <div
                  key={creator.id}
                  className="bg-[#152E30] dark:bg-neutral-900 rounded-2xl p-4 sm:p-5 border border-[#336467]/50 dark:border-neutral-800 shadow-warm hover:shadow-xl hover:border-[#D7400B]/60 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-3.5">
                    {/* Image Frame (Clickable to Creator Profile) */}
                    <Link
                      href={`/creators/${creator.id}`}
                      className="block relative h-56 w-full rounded-xl overflow-hidden bg-[#1A3739] cursor-pointer group/cardImg"
                      title={`View ${creator.display_name}'s profile`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          formatStorageUrl(creator.avatar_url) ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                        }
                        alt={creator.display_name}
                        className="w-full h-full object-cover group-hover/cardImg:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#152E30] via-black/20 to-transparent pointer-events-none" />

                      {/* Top Niche Pill */}
                      <div className="absolute top-2.5 left-2.5">
                        <span className="text-[11px] font-bold tracking-wider uppercase bg-[#1A3739]/90 text-white px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10 shadow-sm">
                          {creator.niche}
                        </span>
                      </div>

                      {/* Rating / Verified Status Pill (3+ Credibility Threshold Enforced) */}
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-[#D7400B] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md backdrop-blur-md">
                        <Star className="w-3 h-3 fill-white text-white" />
                        <span>
                          {cStats.meetsThreshold
                            ? `★ ${cStats.average.toFixed(1)} (${cStats.count})`
                            : cStats.count > 0
                            ? `${cStats.count}/3 Stays`
                            : "Verified"}
                        </span>
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
                    </Link>

                    {/* Card Body */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <Link href={`/creators/${creator.id}`} className="truncate">
                          <h3 className="font-serif text-xl font-medium text-white hover:text-[#D7400B] transition-colors truncate">
                            {creator.display_name}
                          </h3>
                        </Link>
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
                          <span className="text-white/75 font-sans font-medium">{formatDateRange(creator.visit_start, creator.visit_end)}</span>
                        </div>
                      </div>

                      <p className="text-xs text-white/70 line-clamp-2 leading-relaxed pt-0.5 font-light">
                        {creator.trip_brief}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 grid grid-cols-2 gap-2 mt-auto">
                    <Link
                      href={`/creators/${creator.id}`}
                      className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider border border-white/15 text-center transition-all flex items-center justify-center cursor-pointer"
                    >
                      View Profile
                    </Link>
                    <button
                      type="button"
                      onClick={() => setSelectedCreator(creator)}
                      className="py-2.5 px-3 rounded-xl bg-[#D7400B] hover:bg-[#BD3607] text-white text-xs font-semibold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>Request</span>
                    </button>
                  </div>
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
              <div className="p-3 bg-sand-200/50 dark:bg-neutral-900 rounded-lg text-xs text-ink-700 dark:text-neutral-300 leading-relaxed border border-sand-300 dark:border-neutral-800">
                <span className="font-semibold text-teal-900 dark:text-teal-400">Privacy Notice:</span> Contact details are never exposed. Your request is reviewed by Get Linked staff. Once confirmed, we introduce both parties directly on WhatsApp.
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">
                  Accommodation / Property Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Dutch Fort Heritage Villa"
                  value={formData.accommodationName}
                  onChange={(e) => setFormData({ ...formData, accommodationName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-sand-400 dark:border-neutral-700 bg-sand-50 dark:bg-neutral-900 text-teal-950 dark:text-white placeholder:text-ink-400 dark:placeholder:text-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohan De Silva"
                    value={formData.requesterName}
                    onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-sand-400 dark:border-neutral-700 bg-sand-50 dark:bg-neutral-900 text-teal-950 dark:text-white placeholder:text-ink-400 dark:placeholder:text-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">
                    Your WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +94771234567"
                    value={formData.requesterWhatsApp}
                    onChange={(e) => setFormData({ ...formData, requesterWhatsApp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-sand-400 dark:border-neutral-700 bg-sand-50 dark:bg-neutral-900 text-teal-950 dark:text-white placeholder:text-ink-400 dark:placeholder:text-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">
                  Message / Proposed Offer (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. We would love to host you for 3 nights with private pool villa and breakfast in exchange for 2 Instagram Reels."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-sand-400 dark:border-neutral-700 bg-sand-50 dark:bg-neutral-900 text-teal-950 dark:text-white placeholder:text-ink-400 dark:placeholder:text-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCreator(null)}
                  className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-neutral-400 hover:text-ink-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-teal-900 hover:bg-teal-800 dark:bg-[#D7400B] dark:hover:bg-[#BD3607] text-sand-50 text-xs font-semibold uppercase tracking-wider shadow-warm transition-all"
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
