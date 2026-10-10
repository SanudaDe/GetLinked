"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Calendar,
  Users,
  Search,
  Building2,
  Sparkles,
  Clock,
  Compass,
  CheckCircle2,
  Gift,
  ArrowRight,
} from "lucide-react";
import { SRI_LANKA_CITIES, CREATOR_NICHES, PROPERTY_TYPES, OFFER_TYPES } from "@/utils/formatters";
import { useStore } from "@/data/store";
import { DateRangeCalendarPicker } from "@/components/ui/DateRangeCalendarPicker";

export const HeroSearchWidget: React.FC = () => {
  const router = useRouter();
  const { lookupStatus } = useStore();

  const [activeTab, setActiveTab] = useState<"creators" | "stays" | "status">("creators");

  // Tab 1: Creator Search Form State
  const [creatorCity, setCreatorCity] = useState("All Sri Lanka");
  const [creatorNiche, setCreatorNiche] = useState("All Niches");
  const [creatorFollowers, setCreatorFollowers] = useState("5000");
  const [creatorStartDate, setCreatorStartDate] = useState("");
  const [creatorEndDate, setCreatorEndDate] = useState("");

  // Tab 2: Stay Search Form State
  const [stayCity, setStayCity] = useState("All Sri Lanka");
  const [stayType, setStayType] = useState("All Types");
  const [stayOffer, setStayOffer] = useState("All Offers");

  // Tab 3: Track Status State
  const [statusPhone, setStatusPhone] = useState("");
  const [statusRefCode, setStatusRefCode] = useState("");
  const [statusResult, setStatusResult] = useState<{
    searched: boolean;
    found: boolean;
    name?: string;
    status?: string;
    type?: string;
  }>({ searched: false, found: false });

  // Handle Creator Search
  const handleCreatorSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (creatorCity !== "All Sri Lanka") params.set("city", creatorCity);
    if (creatorNiche !== "All Niches") params.set("niche", creatorNiche);
    if (creatorFollowers !== "5000") params.set("minFollowers", creatorFollowers);
    if (creatorStartDate) params.set("start", creatorStartDate);
    if (creatorEndDate) params.set("end", creatorEndDate);

    router.push(`/creators?${params.toString()}`);
  };

  // Handle Stay Search
  const handleStaySearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/for-accommodations`);
  };

  // Handle Status Lookup
  const handleStatusCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusPhone || !statusRefCode) return;
    const res = lookupStatus(statusPhone, statusRefCode);
    setStatusResult({
      searched: true,
      found: res.found,
      name: res.name,
      status: res.status,
      type: res.type,
    });
  };

  // Calculate days difference if both dates chosen
  const calculateDays = () => {
    if (!creatorStartDate || !creatorEndDate) return null;
    const s = new Date(creatorStartDate).getTime();
    const e = new Date(creatorEndDate).getTime();
    if (isNaN(s) || isNaN(e) || e < s) return null;
    return Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
  };

  const daysCount = calculateDays();

  return (
    <div className="w-full max-w-5xl mx-auto -mt-6 sm:-mt-10 relative z-30 px-4 sm:px-0">
      {/* Container with Trip.com elevation and rounded card styling */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-elevated border border-sand-300">
        {/* Top Tab Bar (Trip.com Style) */}
        <div className="flex items-center border-b border-sand-300 bg-sand-100/70 overflow-x-auto scrollbar-none rounded-t-2xl sm:rounded-t-3xl">
          <button
            onClick={() => setActiveTab("creators")}
            className={`flex items-center gap-2 px-6 py-4 text-xs sm:text-sm font-bold tracking-wide transition-all border-b-2 whitespace-nowrap ${
              activeTab === "creators"
                ? "text-teal-600 border-teal-600 bg-white shadow-xs"
                : "text-ink-600 border-transparent hover:text-teal-600 hover:bg-white/50"
            }`}
          >
            <Compass className="w-4 h-4 text-teal-600" />
            <span>Find Verified Creators</span>
            <span className="text-[10px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-mono font-bold">
              1,000 Pool
            </span>
          </button>

          <button
            onClick={() => setActiveTab("stays")}
            className={`flex items-center gap-2 px-6 py-4 text-xs sm:text-sm font-bold tracking-wide transition-all border-b-2 whitespace-nowrap ${
              activeTab === "stays"
                ? "text-teal-600 border-teal-600 bg-white shadow-xs"
                : "text-ink-600 border-transparent hover:text-teal-600 hover:bg-white/50"
            }`}
          >
            <Building2 className="w-4 h-4 text-teal-600" />
            <span>Stays & Eats Seeking Creators</span>
            <span className="text-[10px] bg-gold-100 text-gold-600 px-2 py-0.5 rounded-full font-bold">
              Free Phase
            </span>
          </button>

          <button
            onClick={() => setActiveTab("status")}
            className={`flex items-center gap-2 px-6 py-4 text-xs sm:text-sm font-bold tracking-wide transition-all border-b-2 whitespace-nowrap ${
              activeTab === "status"
                ? "text-teal-600 border-teal-600 bg-white shadow-xs"
                : "text-ink-600 border-transparent hover:text-teal-600 hover:bg-white/50"
            }`}
          >
            <Clock className="w-4 h-4 text-teal-600" />
            <span>Check Application Status</span>
          </button>
        </div>

        {/* Tab 1: Find Creators (Trip.com Search Form) */}
        {activeTab === "creators" && (
          <form onSubmit={handleCreatorSearch} className="p-5 sm:p-7 space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4">
              {/* Field 1: Destination City */}
              <div className="lg:col-span-3 bg-sand-100/70 p-3 rounded-xl border border-sand-300 hover:border-teal-800 transition-colors focus-within:ring-2 focus-within:ring-teal-900">
                <label className="block text-[10px] font-bold text-ink-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-teal-800" />
                  <span>Destination / City</span>
                </label>
                <select
                  value={creatorCity}
                  onChange={(e) => setCreatorCity(e.target.value)}
                  className="w-full bg-transparent font-serif font-bold text-teal-950 text-sm focus:outline-none cursor-pointer"
                >
                  {SRI_LANKA_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c === "All Sri Lanka" ? "🌴 All Sri Lanka" : `📍 ${c}`}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-ink-500 block truncate mt-0.5">
                  Galle, Ella, Weligama, Colombo...
                </span>
              </div>

              {/* Field 2: Travel Window (Interactive Calendar Picker) */}
              <div className="lg:col-span-4 bg-sand-100/70 p-2.5 rounded-xl border border-sand-300 hover:border-teal-800 transition-colors focus-within:ring-2 focus-within:ring-teal-900 flex flex-col justify-center">
                <DateRangeCalendarPicker
                  startDate={creatorStartDate}
                  endDate={creatorEndDate}
                  onChange={(start, end) => {
                    setCreatorStartDate(start);
                    setCreatorEndDate(end);
                  }}
                  placeholder="Select Stay Dates (Calendar)"
                />
              </div>

              {/* Field 3: Niche */}
              <div className="lg:col-span-3 bg-sand-100/70 p-3 rounded-xl border border-sand-300 hover:border-teal-800 transition-colors focus-within:ring-2 focus-within:ring-teal-900">
                <label className="block text-[10px] font-bold text-ink-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-gold-600" />
                  <span>Creator Niche</span>
                </label>
                <select
                  value={creatorNiche}
                  onChange={(e) => setCreatorNiche(e.target.value)}
                  className="w-full bg-transparent font-serif font-bold text-teal-950 text-sm focus:outline-none cursor-pointer"
                >
                  <option value="All Niches">✨ All Niches</option>
                  {CREATOR_NICHES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-ink-500 block truncate mt-0.5">
                  Travel, Food, Lifestyle, Fashion...
                </span>
              </div>

              {/* Field 4: Search Action Button (Trip.com Royal Blue button) */}
              <div className="lg:col-span-2 flex items-stretch">
                <button
                  type="submit"
                  className="w-full min-h-[56px] px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <Search className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  <span>Search</span>
                </button>
              </div>
            </div>

            {/* Quick Popular Sri Lankan Filters / Suggestions Strip */}
            <div className="flex items-center gap-2 flex-wrap pt-2 text-xs text-ink-600 border-t border-sand-200/60">
              <span className="font-semibold text-teal-950 text-[11px] uppercase tracking-wider">
                Popular Stays:
              </span>
              {["Galle Fort", "Ella", "Weligama", "Colombo", "Sigiriya", "Mirissa"].map((city) => (
                <button
                  type="button"
                  key={city}
                  onClick={() => {
                    setCreatorCity(city);
                    router.push(`/creators?city=${encodeURIComponent(city)}`);
                  }}
                  className="px-2.5 py-1 rounded-full bg-sand-200 hover:bg-teal-900 hover:text-sand-50 transition-colors text-[11px] font-medium border border-sand-300"
                >
                  📍 {city}
                </button>
              ))}
              <span className="ml-auto text-[11px] text-emerald-800 font-semibold hidden sm:inline">
                ✓ 100% ID Verified Creators
              </span>
            </div>
          </form>
        )}

        {/* Tab 2: Stays Seeking Creators */}
        {activeTab === "stays" && (
          <form onSubmit={handleStaySearch} className="p-5 sm:p-7 space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4">
              <div className="lg:col-span-4 bg-sand-100/70 p-3 rounded-xl border border-sand-300">
                <label className="block text-[10px] font-bold text-ink-500 uppercase tracking-wider mb-1">
                  Destination City
                </label>
                <select
                  value={stayCity}
                  onChange={(e) => setStayCity(e.target.value)}
                  className="w-full bg-transparent font-serif font-bold text-teal-950 text-sm focus:outline-none"
                >
                  {SRI_LANKA_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-3 bg-sand-100/70 p-3 rounded-xl border border-sand-300">
                <label className="block text-[10px] font-bold text-ink-500 uppercase tracking-wider mb-1">
                  Venue Type
                </label>
                <select
                  value={stayType}
                  onChange={(e) => setStayType(e.target.value)}
                  className="w-full bg-transparent font-serif font-bold text-teal-950 text-sm focus:outline-none"
                >
                  <option value="All Types">All Stays & Eats</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-3 bg-sand-100/70 p-3 rounded-xl border border-sand-300">
                <label className="block text-[10px] font-bold text-ink-500 uppercase tracking-wider mb-1">
                  Host Offering
                </label>
                <select
                  value={stayOffer}
                  onChange={(e) => setStayOffer(e.target.value)}
                  className="w-full bg-transparent font-serif font-bold text-teal-950 text-sm focus:outline-none"
                >
                  <option value="All Offers">All Offer Arrangements</option>
                  {OFFER_TYPES.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-2 flex items-stretch">
                <button
                  type="submit"
                  className="w-full min-h-[56px] px-6 py-3 rounded-xl bg-teal-900 hover:bg-teal-800 text-sand-50 font-bold text-sm uppercase tracking-wider shadow-warm transition-all flex items-center justify-center gap-2"
                >
                  <span>Explore Stays & Eats</span>
                  <ArrowRight className="w-4 h-4 text-gold-400" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-ink-600 border-t border-sand-200/60 pt-2">
              <span>Looking to list your hotel, villa, café, or restaurant?</span>
              <button
                type="button"
                onClick={() => router.push("/list-property")}
                className="font-bold text-teal-900 hover:text-gold-600 underline"
              >
                List Stays or Eats for Free (Phase 1) →
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Quick Status Lookup */}
        {activeTab === "status" && (
          <form onSubmit={handleStatusCheck} className="p-5 sm:p-7 space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4">
              <div className="sm:col-span-5 bg-sand-100/70 p-3 rounded-xl border border-sand-300">
                <label className="block text-[10px] font-bold text-ink-500 uppercase tracking-wider mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +447911123456 or +94771234567"
                  value={statusPhone}
                  onChange={(e) => setStatusPhone(e.target.value)}
                  className="w-full bg-transparent font-medium text-teal-950 text-sm focus:outline-none"
                />
              </div>

              <div className="sm:col-span-4 bg-sand-100/70 p-3 rounded-xl border border-sand-300">
                <label className="block text-[10px] font-bold text-ink-500 uppercase tracking-wider mb-1">
                  Reference Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GL-C-XXXX"
                  value={statusRefCode}
                  onChange={(e) => setStatusRefCode(e.target.value)}
                  className="w-full bg-transparent font-mono font-bold text-teal-950 text-sm focus:outline-none uppercase"
                />
              </div>

              <div className="sm:col-span-3 flex items-stretch">
                <button
                  type="submit"
                  className="w-full min-h-[56px] px-6 py-3 rounded-xl bg-teal-900 hover:bg-teal-800 text-sand-50 font-bold text-sm uppercase tracking-wider shadow-warm transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4 text-gold-400" />
                  <span>Check</span>
                </button>
              </div>
            </div>

            {/* Inline Quick Result */}
            {statusResult.searched && (
              <div className="p-4 rounded-xl bg-sand-100 border border-sand-300 flex items-center justify-between text-xs animate-in fade-in">
                {statusResult.found ? (
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold text-teal-950">{statusResult.name}</span>{" "}
                      <span className="text-ink-600">({statusResult.type})</span>:{" "}
                      <strong className="text-emerald-800 uppercase ml-1">
                        Status: {statusResult.status}
                      </strong>
                    </div>
                  </div>
                ) : (
                  <span className="text-amber-800 font-medium">
                    No application found matching that WhatsApp and reference code.
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => router.push("/status")}
                  className="text-teal-900 hover:text-gold-600 font-semibold underline shrink-0 ml-2"
                >
                  Detailed Page →
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
