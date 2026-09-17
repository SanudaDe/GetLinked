"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/data/store";
import { Building2, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, HeartHandshake } from "lucide-react";
import { OFFER_TYPES, PROPERTY_TYPES } from "@/utils/formatters";

export default function ForAccommodationsPage() {
  const { settings } = useStore();

  return (
    <div className="py-12 bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 text-teal-950 border border-gold-500/30 text-xs font-semibold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-gold-600" />
            Host Partnership Program
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-teal-950">
            Showcase Your Property to the Right Creators
          </h1>
          <p className="text-base sm:text-lg text-ink-700 leading-relaxed">
            Eliminate unsolicited inbox spam. Host verified social media creators with verified follower counts who are already scheduled to visit your Sri Lankan destination.
          </p>

          {/* Dynamic Platform Phase Pricing Notice */}
          <div className="p-3.5 bg-teal-900/10 border border-teal-900/20 rounded-xl max-w-xl mx-auto flex items-center justify-center gap-2 text-xs font-semibold text-teal-950">
            <Sparkles className="w-4 h-4 text-gold-500 shrink-0" />
            <span>
              {settings.platform_phase === "FREE"
                ? "Listing and collaboration matching is currently free."
                : "Fees may apply to confirmed collaborations."}
            </span>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/list-property"
              className="px-8 py-4 rounded-xl bg-teal-900 hover:bg-teal-800 text-sand-50 text-xs font-semibold uppercase tracking-wider shadow-warm transition-all"
            >
              List Your Property Now
            </Link>
            <Link
              href="/creators"
              className="px-8 py-4 rounded-xl bg-sand-200 hover:bg-sand-300 text-teal-950 text-xs font-semibold uppercase tracking-wider border border-sand-500/40 transition-colors"
            >
              Browse Active Creator Pool
            </Link>
          </div>
        </div>

        {/* 4 Offer Structures */}
        <div className="my-16 max-w-5xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-teal-950">
              Flexible Collaboration Formats
            </h2>
            <p className="text-xs sm:text-sm text-ink-600">
              You choose what arrangements suit your property occupancy and marketing budget.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {OFFER_TYPES.map((offer, idx) => (
              <div
                key={idx}
                className="bg-sand-50 rounded-xl p-6 border border-sand-300 shadow-warm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-teal-900/10 text-teal-900 flex items-center justify-center text-xs font-bold mb-3">
                    0{idx + 1}
                  </div>
                  <h3 className="font-serif text-base font-bold text-teal-950">
                    {offer}
                  </h3>
                  <p className="text-xs text-ink-600 mt-2 leading-relaxed">
                    {idx === 0 && "Provide a complimentary stay during creator's visit dates in exchange for agreed reels/photos."}
                    {idx === 1 && "Host creator with room and meals included for full resort or culinary exposure."}
                    {idx === 2 && "Compensate macro creators (50K+ followers) with direct sponsorship fees."}
                    {idx === 3 && "Discuss custom deliverables and dates based on mutual promotional value."}
                  </p>
                </div>
                <div className="pt-3 border-t border-sand-200 text-[11px] font-semibold text-teal-800">
                  Host Choice
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
