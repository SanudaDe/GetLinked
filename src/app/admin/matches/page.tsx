"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/data/store";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  generateWhatsAppLink,
  createAccommodationIntroMessage,
  createCreatorIntroMessage,
} from "@/utils/whatsapp";
import { Match, MatchStatus } from "@/types";
import {
  CheckCircle2,
  Sparkles,
  MessageSquareShare,
  Clock,
  Send,
  Building2,
  UserCheck,
  Calendar,
  ExternalLink,
  MapPin,
} from "lucide-react";

export default function AdminMatchesPage() {
  const searchParams = useSearchParams();
  const highlightedMatchId = searchParams.get("matchId");

  const { matches, accommodations, applications, updateMatchStatus } = useStore();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(
    highlightedMatchId ? matches.find((m) => m.id === highlightedMatchId) || null : null
  );

  const handleMarkIntroduced = (matchId: string) => {
    updateMatchStatus(matchId, "INTRODUCED");
  };

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title="Confirmed Matches & WhatsApp Introductions"
        subtitle="Manage matched collaborations and launch pre-filled WhatsApp concierge introductions."
      />

      <div className="px-6 space-y-6">
        {/* Matches List */}
        <div className="bg-sand-50 rounded-2xl border border-sand-300 shadow-warm overflow-hidden">
          {matches.length === 0 ? (
            <div className="text-center py-12 text-xs text-ink-500">
              No matches confirmed yet. Use the Matching Tool to create pairings.
            </div>
          ) : (
            <div className="divide-y divide-sand-200">
              {matches.map((match) => {
                const acc = accommodations.find((a) => a.id === match.accommodation_id);
                const creatorApp = applications.find(
                  (a) => a.id === match.creator_id || a.full_name === match.creator_name
                );

                // Prepare pre-filled WhatsApp links
                const hostMsg = createAccommodationIntroMessage({
                  contactName: match.accommodation_contact || "Host",
                  accommodationName: match.accommodation_name,
                  creatorName: match.creator_name,
                  creatorNiche: match.creator_niche,
                  creatorFollowers: creatorApp?.follower_count || 50000,
                  city: match.accommodation_city,
                  visitStart: creatorApp?.visit_start || "Upcoming",
                  visitEnd: creatorApp?.visit_end || "Upcoming",
                  offerType: acc?.offer_type || "Complimentary stay",
                });

                const creatorMsg = createCreatorIntroMessage({
                  creatorName: match.creator_name,
                  accommodationName: match.accommodation_name,
                  contactPerson: match.accommodation_contact,
                  city: match.accommodation_city,
                  coverageStart: acc?.coverage_start || "Flexible",
                  coverageEnd: acc?.coverage_end || "Flexible",
                  offerType: acc?.offer_type || "Complimentary stay",
                });

                const hostWaLink = generateWhatsAppLink(
                  match.accommodation_whatsapp,
                  hostMsg
                );

                const creatorWaLink = generateWhatsAppLink(
                  match.creator_whatsapp,
                  creatorMsg
                );

                const isIntroduced = match.status === "INTRODUCED";

                return (
                  <div
                    key={match.id}
                    className={`p-6 transition-colors ${
                      match.id === highlightedMatchId
                        ? "bg-sand-100/90 border-l-4 border-l-gold-500"
                        : "hover:bg-sand-100/50"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Match Overview */}
                      <div className="space-y-3 flex-grow">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs uppercase font-bold tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            {match.match_source === "ADMIN" ? "Proactive Admin Match" : "Stay Requested"}
                          </span>
                          <Badge
                            variant={
                              match.status === "INTRODUCED"
                                ? "introduced"
                                : match.status === "CONFIRMED"
                                ? "approved"
                                : "pending"
                            }
                            size="sm"
                          >
                            {match.status}
                          </Badge>
                          <span className="text-xs text-ink-500">
                            ID: <span className="font-mono">{match.id}</span>
                          </span>
                        </div>

                        {/* Pairing Header */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                          {/* Stay Info */}
                          <div className="p-3 bg-sand-100 rounded-xl border border-sand-200 space-y-1">
                            <div className="flex items-center gap-1.5 text-xs text-ink-600 font-semibold">
                              <Building2 className="w-3.5 h-3.5 text-teal-800" />
                              <span>Accommodation Host</span>
                            </div>
                            <div className="font-serif font-bold text-base text-teal-950">
                              {match.accommodation_name}
                            </div>
                            <div className="text-xs text-ink-700">
                              Contact: {match.accommodation_contact} • {match.accommodation_city}
                            </div>
                            <div className="text-[11px] font-mono text-teal-900">
                              {match.accommodation_whatsapp}
                            </div>
                          </div>

                          {/* Creator Info */}
                          <div className="p-3 bg-sand-100 rounded-xl border border-sand-200 space-y-1">
                            <div className="flex items-center gap-1.5 text-xs text-ink-600 font-semibold">
                              <UserCheck className="w-3.5 h-3.5 text-gold-600" />
                              <span>Verified Creator</span>
                            </div>
                            <div className="font-serif font-bold text-base text-teal-950">
                              {match.creator_name}
                            </div>
                            <div className="text-xs text-ink-700">
                              Niche: {match.creator_niche}
                            </div>
                            <div className="text-[11px] font-mono text-teal-900">
                              {match.creator_whatsapp}
                            </div>
                          </div>
                        </div>

                        {match.admin_notes && (
                          <p className="text-xs text-ink-600 italic">
                            Notes: {match.admin_notes}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-[11px] text-ink-500 flex-wrap">
                          <span>Created: {new Date(match.created_at).toLocaleString()}</span>
                          {match.confirmed_at && (
                            <span>• Confirmed: {new Date(match.confirmed_at).toLocaleString()}</span>
                          )}
                          {match.introduced_at && (
                            <span className="text-sky-800 font-semibold">
                              • Introduced via WhatsApp: {new Date(match.introduced_at).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* WhatsApp Manual Action Center */}
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
                        {/* 1. Send Intro to Host */}
                        <a
                          href={hostWaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleMarkIntroduced(match.id)}
                          className="px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
                        >
                          <MessageSquareShare className="w-4 h-4" />
                          <span>Open WhatsApp: Host Intro</span>
                        </a>

                        {/* 2. Send Intro to Creator */}
                        <a
                          href={creatorWaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleMarkIntroduced(match.id)}
                          className="px-4 py-2.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-sand-50 text-xs font-semibold shadow-warm transition-colors flex items-center justify-center gap-2"
                        >
                          <MessageSquareShare className="w-4 h-4 text-gold-400" />
                          <span>Open WhatsApp: Creator Intro</span>
                        </a>

                        {!isIntroduced ? (
                          <button
                            onClick={() => handleMarkIntroduced(match.id)}
                            className="px-3 py-1.5 rounded text-[11px] font-medium text-ink-600 hover:text-ink-900 text-center"
                          >
                            Mark Introduced Manually
                          </button>
                        ) : (
                          <div className="text-[11px] text-emerald-800 font-semibold text-center flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Introductions Sent</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
