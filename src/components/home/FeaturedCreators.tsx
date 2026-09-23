"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, X, CheckCircle2 } from "lucide-react";
import { useStore } from "@/data/store";
import { InfluencerProfile } from "@/types";

interface CreatorSensoryItem {
  profile: InfluencerProfile;
  sensoryLine: string;
  formattedDates: string;
}

export const FeaturedCreators: React.FC = () => {
  const { profiles, submitCreatorRequest } = useStore();
  const [selectedCreator, setSelectedCreator] = useState<InfluencerProfile | null>(null);
  const [formData, setFormData] = useState({
    accommodationName: "",
    requesterName: "",
    requesterWhatsApp: "",
    message: "",
  });
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

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

  // Curated sensory lines per copy deck instructions
  const sensoryMap: Record<string, { line: string; dates: string }> = {
    "prof-101": {
      dates: "5–20 October",
      line: "Cinematic stories from heritage courtyards and coastal villas.",
    },
    "prof-102": {
      dates: "10–25 October",
      line: "Salt-weathered surf, coastal light, mornings in the barrel.",
    },
    "prof-103": {
      dates: "2–16 November",
      line: "Quiet tea estate mornings, mountain mist, slow travel essays.",
    },
    "prof-104": {
      dates: "15–28 October",
      line: "Architectural details, street spice light, urban Ceylon stories.",
    },
  };

  const featured = profiles.slice(0, 4);

  return (
    <section className="py-20 sm:py-28 bg-[#E0DDAE] text-[#336467] border-t border-[#C8C488]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#D7400B] block">
              Currently Travelling
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#336467] tracking-tight leading-[1.15]">
              A few of the voices heading to Sri Lanka this season.
            </h2>
          </div>

          <Link
            href="/creators"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#336467] hover:text-[#D7400B] transition-colors shrink-0 group"
          >
            <span>See who else is travelling</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Creator Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((creator) => {
            const sensory = sensoryMap[creator.id] || {
              dates: "Upcoming dates",
              line: "Visual narratives exploring heritage architecture and coastal Sri Lanka.",
            };

            return (
              <div
                key={creator.id}
                className="bg-[#ECE9C4] rounded-2xl border border-[#C8C488] overflow-hidden shadow-warm hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Frame */}
                  <div className="relative h-64 w-full bg-[#D0CD96] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={creator.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                      alt={creator.display_name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>

                  {/* Editorial Card Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="font-serif text-xl font-normal text-[#336467]">
                      {creator.display_name}
                    </h3>

                    <p className="text-xs text-[#336467]/75 tracking-wide">
                      {creator.city} — {sensory.dates}
                    </p>

                    <p className="text-xs sm:text-sm text-[#336467]/85 leading-relaxed">
                      {sensory.line}
                    </p>

                    {/* Follower Count: Small, secondary, never bolded as a badge */}
                    <p className="text-[11px] text-[#336467]/70 pt-1">
                      {(creator.follower_count / 1000).toFixed(1)}k followers
                    </p>
                  </div>
                </div>

                {/* Card Action */}
                <div className="px-6 pb-6 pt-2">
                  <button
                    onClick={() => setSelectedCreator(creator)}
                    className="w-full py-2.5 px-4 rounded-full bg-[#E0DDAE] hover:bg-[#D7400B] text-[#336467] hover:text-white border border-[#C8C488] hover:border-[#D7400B] text-xs font-semibold tracking-wide transition-all cursor-pointer"
                  >
                    Request an Introduction
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 text-center md:hidden">
          <Link
            href="/creators"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#336467] hover:text-[#D7400B]"
          >
            <span>See who else is travelling →</span>
          </Link>
        </div>
      </div>

      {/* Introduction Request Modal */}
      {selectedCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedCreator(null)}
          />

          <div className="relative bg-[#E0DDAE] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#C8C488] z-10 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedCreator(null)}
              className="absolute top-5 right-5 p-2 text-[#336467]/70 hover:text-[#336467] rounded-full cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {!submittedMessage ? (
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D7400B]">
                    Direct Introduction
                  </span>
                  <h3 className="font-serif text-2xl text-[#336467] mt-1">
                    Connect with {selectedCreator.display_name}
                  </h3>
                  <p className="text-xs text-[#336467]/80 mt-1">
                    In {selectedCreator.city} during upcoming season. Every introduction is reviewed by hand.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#336467] mb-1">
                      Your Property Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.accommodationName}
                      onChange={(e) =>
                        setFormData({ ...formData, accommodationName: e.target.value })
                      }
                      placeholder="e.g. Fort Heritage Villa"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#C8C488] text-xs text-[#336467] focus:border-[#D7400B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#336467] mb-1">
                      Host Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.requesterName}
                      onChange={(e) =>
                        setFormData({ ...formData, requesterName: e.target.value })
                      }
                      placeholder="Your name"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#C8C488] text-xs text-[#336467] focus:border-[#D7400B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#336467] mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.requesterWhatsApp}
                      onChange={(e) =>
                        setFormData({ ...formData, requesterWhatsApp: e.target.value })
                      }
                      placeholder="+94 77 123 4567"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#C8C488] text-xs text-[#336467] focus:border-[#D7400B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#336467] mb-1">
                      Collaboration Note
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="A few lines about your property and proposed dates..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#C8C488] text-xs text-[#336467] focus:border-[#D7400B] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#D7400B] hover:bg-[#BD3607] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Send Introduction Request
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#D7400B] mx-auto" />
                <h4 className="font-serif text-xl text-[#336467]">Request received</h4>
                <p className="text-xs text-[#336467]/80 leading-relaxed">
                  Our team reviews each request by hand and will reach out to you directly on WhatsApp.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
