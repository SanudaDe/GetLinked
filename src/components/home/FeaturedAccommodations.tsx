"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, X, CheckCircle2 } from "lucide-react";
import { useStore } from "@/data/store";
import { AccommodationApplication } from "@/types";

export const FeaturedAccommodations: React.FC = () => {
  const { accommodations } = useStore();
  const [selectedStay, setSelectedStay] = useState<AccommodationApplication | null>(null);

  const stayPhotos: Record<string, string> = {
    "acc-201": "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    "acc-202": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    "acc-203": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    "acc-204": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
  };

  const sensoryMap: Record<string, { line: string; offer: string }> = {
    "acc-201": {
      line: "A restored Dutch courtyard, a private chef, low light in every room.",
      offer: "Complimentary Stay",
    },
    "acc-202": {
      line: "Century-old timber, valley mist, Ceylon tea by the stone fireplace.",
      offer: "Complimentary Stay & Dining",
    },
    "acc-203": {
      line: "Open-air pavilions, saltwater plunge, first wave at daybreak.",
      offer: "Complimentary Stay",
    },
    "acc-204": {
      line: "Riverfront gardens, barefoot dining beneath palms, silence after dark.",
      offer: "Collaborative Residency",
    },
  };

  const approvedStays = accommodations.filter((a) => a.status === "APPROVED").slice(0, 4);

  return (
    <section className="py-20 sm:py-28 bg-[#E0DDAE] text-[#336467] border-t border-[#C8C488]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#D7400B] block">
              Places Worth The Story
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#336467] tracking-tight leading-[1.15]">
              Stays chosen with the same care as the work they inspire.
            </h2>
          </div>

          <Link
            href="/list-property"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#336467] hover:text-[#D7400B] transition-colors shrink-0 group"
          >
            <span>List your stay, free during launch</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Accommodation Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {approvedStays.map((stay) => {
            const photoUrl =
              stay.image_url ||
              (stay.images && stay.images.length > 0 ? stay.images[0] : null) ||
              stayPhotos[stay.id] ||
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80";

            const sensory = sensoryMap[stay.id] || {
              line: stay.requirements || "Private verandahs, coastal breezes, and thoughtful hospitality.",
              offer: stay.offer_type || "Complimentary Stay",
            };

            return (
              <div
                key={stay.id}
                className="bg-[#ECE9C4] rounded-2xl border border-[#C8C488] overflow-hidden shadow-warm hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Frame */}
                  <div className="relative h-64 w-full bg-[#D0CD96] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoUrl}
                      alt={stay.accommodation_name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  </div>

                  {/* Editorial Card Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="font-serif text-xl font-normal text-[#336467]">
                      {stay.accommodation_name}
                    </h3>

                    <p className="text-xs text-[#336467]/75 tracking-wide">
                      {stay.city} — {stay.property_type}
                    </p>

                    <p className="text-xs sm:text-sm text-[#336467]/85 leading-relaxed">
                      {sensory.line}
                    </p>

                    {/* Offer Type in Plain Text Underneath */}
                    <p className="text-xs text-[#D7400B] pt-1 font-semibold">
                      {sensory.offer}
                    </p>
                  </div>
                </div>

                {/* Card Action */}
                <div className="px-6 pb-6 pt-2">
                  <Link
                    href="/apply"
                    className="block text-center py-2.5 px-4 rounded-full bg-[#E0DDAE] hover:bg-[#D7400B] text-[#336467] hover:text-white border border-[#C8C488] hover:border-[#D7400B] text-xs font-semibold tracking-wide transition-all"
                  >
                    Propose Collaboration
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 text-center md:hidden">
          <Link
            href="/list-property"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#336467] hover:text-[#D7400B]"
          >
            <span>List your stay, free during launch →</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
