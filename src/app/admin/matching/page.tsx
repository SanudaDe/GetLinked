"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/data/store";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Badge } from "@/components/ui/Badge";
import { checkDateOverlap, calculateOverlapDays } from "@/utils/dateOverlap";
import { formatDateRange, formatFollowerCount } from "@/utils/formatters";
import {
  Sparkles,
  Building2,
  Users,
  Calendar,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Filter,
  Check,
} from "lucide-react";

export default function AdminMatchingPage() {
  const router = useRouter();
  const { accommodations, profiles, applications, createProactiveMatch } = useStore();

  const approvedAccommodations = accommodations.filter((a) => a.status === "APPROVED");
  const approvedProfiles = profiles.filter((p) => p.is_active);

  // Selected Accommodation for matching
  const [selectedAccId, setSelectedAccId] = useState<string>(
    approvedAccommodations[0]?.id || ""
  );

  // Matching Assistance Filters
  const [filterCityOnly, setFilterCityOnly] = useState(true);
  const [filterDateOverlapOnly, setFilterDateOverlapOnly] = useState(true);
  const [filterFollowersOnly, setFilterFollowersOnly] = useState(true);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>("");
  const [adminNotes, setAdminNotes] = useState("");

  const currentAcc = approvedAccommodations.find((a) => a.id === selectedAccId);

  // Filter available candidate creators for the selected accommodation
  const matchCandidates = useMemo(() => {
    if (!currentAcc) return [];

    return approvedProfiles.map((creator) => {
      // Check City Match
      const cityMatches =
        creator.city.toLowerCase() === currentAcc.city.toLowerCase();

      // Check Date Overlap
      const datesOverlap = checkDateOverlap(
        creator.visit_start,
        creator.visit_end,
        currentAcc.coverage_start,
        currentAcc.coverage_end
      );

      // Check Follower Tier
      const followersMatch =
        creator.follower_count >= currentAcc.minimum_followers;

      const overlapDays = datesOverlap
        ? calculateOverlapDays(
            creator.visit_start,
            creator.visit_end,
            currentAcc.coverage_start,
            currentAcc.coverage_end
          )
        : 0;

      const passesFilters =
        (!filterCityOnly || cityMatches) &&
        (!filterDateOverlapOnly || datesOverlap) &&
        (!filterFollowersOnly || followersMatch);

      return {
        creator,
        cityMatches,
        datesOverlap,
        followersMatch,
        overlapDays,
        passesFilters,
      };
    }).filter((candidate) => candidate.passesFilters);
  }, [
    currentAcc,
    approvedProfiles,
    filterCityOnly,
    filterDateOverlapOnly,
    filterFollowersOnly,
  ]);

  const handleCreateMatch = () => {
    if (!selectedAccId || !selectedCreatorId) return;

    const res = createProactiveMatch(
      selectedCreatorId,
      selectedAccId,
      adminNotes || "Proactive match created via Get Linked matching tool."
    );

    if (res.success) {
      router.push(`/admin/matches?matchId=${res.matchId}`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title="Proactive Matchmaking Workspace"
        subtitle="Human-assisted matching based on city destination, date overlap, and follower requirements."
      />

      <div className="px-6 space-y-6">
        {/* Two-Column Pairing Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Col 1: Select Accommodation (4 cols) */}
          <div className="lg:col-span-4 bg-sand-50 rounded-2xl border border-sand-300 p-6 shadow-warm space-y-4">
            <div className="flex items-center gap-2 border-b border-sand-200 pb-3">
              <Building2 className="w-5 h-5 text-teal-900" />
              <h2 className="font-serif text-lg font-bold text-teal-950">
                1. Select Accommodation
              </h2>
            </div>

            <div className="space-y-3">
              {approvedAccommodations.map((acc) => {
                const isSelected = acc.id === selectedAccId;
                return (
                  <button
                    key={acc.id}
                    onClick={() => {
                      setSelectedAccId(acc.id);
                      setSelectedCreatorId("");
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-teal-900 text-sand-50 border-teal-950 shadow-warm ring-2 ring-gold-400"
                        : "bg-sand-100/70 text-ink-900 border-sand-300 hover:bg-sand-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-sm">
                        {acc.accommodation_name}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                          isSelected
                            ? "bg-gold-500 text-ink-950"
                            : "bg-sand-300 text-ink-700"
                        }`}
                      >
                        {acc.property_type}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 opacity-90">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{acc.city}, Sri Lanka</span>
                      </div>
                      <div className="flex items-center gap-1.5 opacity-90">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {formatDateRange(acc.coverage_start, acc.coverage_end)}
                        </span>
                      </div>
                      <div className="pt-1 text-[11px] font-semibold text-gold-400">
                        Offering: {acc.offer_type} (Min: {formatFollowerCount(acc.minimum_followers)}+)
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Col 2: Match Candidates & Filter Assistance (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Assistance filter toggles */}
            <div className="bg-sand-50 rounded-2xl border border-sand-300 p-5 shadow-warm space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-teal-900" />
                  <span className="font-serif text-base font-bold text-teal-950">
                    2. Matching Assistance Rules for {currentAcc?.accommodation_name}
                  </span>
                </div>
                <span className="text-xs text-ink-500">
                  Transparent criteria • Human decision
                </span>
              </div>

              <div className="flex items-center gap-4 flex-wrap text-xs font-semibold text-ink-800 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterCityOnly}
                    onChange={(e) => setFilterCityOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-sand-400 text-teal-900 focus:ring-teal-900"
                  />
                  <span>Same City ({currentAcc?.city})</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterDateOverlapOnly}
                    onChange={(e) => setFilterDateOverlapOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-sand-400 text-teal-900 focus:ring-teal-900"
                  />
                  <span>Strict Date Overlap</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterFollowersOnly}
                    onChange={(e) => setFilterFollowersOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-sand-400 text-teal-900 focus:ring-teal-900"
                  />
                  <span>
                    Follower Requirement (&gt;={formatFollowerCount(currentAcc?.minimum_followers || 5000)})
                  </span>
                </label>
              </div>
            </div>

            {/* Candidate List */}
            <div className="bg-sand-50 rounded-2xl border border-sand-300 p-6 shadow-warm space-y-4">
              <div className="flex items-center justify-between border-b border-sand-200 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-900" />
                  <h3 className="font-serif text-lg font-bold text-teal-950">
                    Candidate Creators ({matchCandidates.length} Found)
                  </h3>
                </div>
                <span className="text-xs text-ink-500">
                  Select one creator to propose a verified match
                </span>
              </div>

              {matchCandidates.length === 0 ? (
                <div className="text-center py-12 text-xs text-ink-500 space-y-2">
                  <p>No creators meet all the checked criteria for this property.</p>
                  <p>Try relaxing the &ldquo;Same City&rdquo; or &ldquo;Follower Requirement&rdquo; checkboxes above.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {matchCandidates.map(({ creator, cityMatches, datesOverlap, followersMatch, overlapDays }) => {
                    const isSelected = creator.id === selectedCreatorId;
                    return (
                      <div
                        key={creator.id}
                        onClick={() => setSelectedCreatorId(creator.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "bg-teal-900 text-sand-50 border-teal-950 shadow-warm ring-2 ring-gold-400"
                            : "bg-sand-100/70 border-sand-300 hover:bg-sand-200 text-ink-900"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-serif font-bold text-base">
                              {creator.display_name}
                            </span>
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                                isSelected ? "bg-gold-500 text-ink-950" : "bg-teal-900 text-sand-50"
                              }`}
                            >
                              {creator.niche}
                            </span>
                          </div>

                          <div className="text-xs space-y-1 opacity-90">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-gold-400" />
                              <span>{creator.city}</span>
                              {cityMatches && (
                                <span className="text-[10px] text-emerald-400 font-bold">
                                  ✓ City Match
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-gold-400" />
                              <span>{formatDateRange(creator.visit_start, creator.visit_end)}</span>
                            </div>
                            {datesOverlap && (
                              <div className="text-[11px] text-emerald-400 font-bold">
                                ✓ {overlapDays} days overlapping stay window
                              </div>
                            )}
                            <div>
                              Audience: <strong>{formatFollowerCount(creator.follower_count)}</strong>
                              {followersMatch && (
                                <span className="text-[10px] text-emerald-400 font-bold ml-1.5">
                                  ✓ Meets Host Min
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-[11px] line-clamp-2 opacity-80 pt-1">
                            {creator.trip_brief}
                          </p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-sand-300/40 flex items-center justify-between">
                          <span className="text-xs font-semibold">
                            {isSelected ? "Selected Candidate" : "Click to Select"}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-gold-400" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Match Creation Action Bar */}
              {selectedCreatorId && currentAcc && (
                <div className="pt-4 border-t border-sand-200 space-y-3 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                      Concierge Notes for this Match
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Host agreed to complimentary stay + meals. Creator excited for central highlands content."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-sand-400 bg-sand-50 text-xs focus:outline-none focus:ring-2 focus:ring-teal-900"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-1">
                    <div className="text-xs text-ink-700">
                      Creating match between <strong>{approvedProfiles.find((p) => p.id === selectedCreatorId)?.display_name}</strong> and <strong>{currentAcc.accommodation_name}</strong>
                    </div>
                    <button
                      onClick={handleCreateMatch}
                      className="px-6 py-3 rounded-xl bg-teal-900 hover:bg-teal-800 text-sand-50 text-xs font-semibold uppercase tracking-wider shadow-warm transition-all flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-gold-400" />
                      <span>Confirm Pairing & Generate WhatsApp Links</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
