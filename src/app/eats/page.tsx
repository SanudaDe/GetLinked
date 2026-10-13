import React from "react";
import Link from "next/link";
import { ArrowRight, Utensils, Wine, Coffee, Sparkles, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Eats | Get Linked — Restaurants, Cafés & Bars in Sri Lanka",
  description:
    "Connect your restaurant, café, bar, or culinary venue with verified food & travel creators visiting Sri Lanka.",
};

export default function EatsPage() {
  return (
    <div className="py-24 sm:py-32 bg-white dark:bg-black text-[#1A3739] dark:text-white min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Editorial Header */}
        <div className="space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand-200/80 dark:bg-neutral-900 border border-sand-300 dark:border-neutral-800 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#D7400B]">
            <Utensils className="w-4 h-4" />
            <span>Sri Lanka&apos;s Culinary & Dining Collective</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl font-normal text-[#1A3739] dark:text-white tracking-tight leading-[1.08]">
            For places worth savoring.
          </h1>
          <p className="text-[20px] sm:text-[24px] lg:text-[26px] text-[#1A3739]/90 dark:text-neutral-200 leading-relaxed max-w-2xl mx-auto font-normal pt-2">
            From oceanfront cocktail bars to colonial courtyard bistros and specialty cafés. Connect with verified food and lifestyle creators visiting your city.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/list-property?category=eats"
              className="inline-flex items-center gap-3 px-9 py-4 rounded-full bg-[#D7400B] hover:bg-[#BD3607] text-white text-[17px] sm:text-[18px] font-sans font-semibold tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer group"
            >
              <span>List Your Eatery or Bar</span>
              <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/creators?niche=Food"
              className="inline-flex items-center gap-3 px-9 py-4 rounded-full bg-sand-100 dark:bg-neutral-900 hover:bg-sand-200 dark:hover:bg-neutral-800 text-[#1A3739] dark:text-neutral-200 text-[17px] sm:text-[18px] font-sans font-semibold tracking-wider border border-sand-300 dark:border-neutral-700 transition-all cursor-pointer"
            >
              <span>Browse Food Creators</span>
            </Link>
          </div>
        </div>

        {/* 3 Pillars for Eateries & Bars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 sm:p-7 rounded-2xl bg-sand-50 dark:bg-neutral-950 border border-sand-300 dark:border-neutral-800 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-[#D7400B] flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-teal-950 dark:text-white">
              Single-Visit Simplicity
            </h3>
            <p className="text-[16px] text-ink-600 dark:text-neutral-300 leading-relaxed">
              No need to manage multi-night stays. Offer a complimentary chef tasting, dinner for two, or signature cocktail round for a single visiting creator.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl bg-sand-50 dark:bg-neutral-950 border border-sand-300 dark:border-neutral-800 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-teal-100 dark:bg-teal-950/40 text-teal-800 dark:text-teal-400 flex items-center justify-center">
              <Wine className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-teal-950 dark:text-white">
              Targeted Culinary Creators
            </h3>
            <p className="text-[16px] text-ink-600 dark:text-neutral-300 leading-relaxed">
              We match you with creators whose aesthetic and audience align with culinary travel, food reviews, and hospitality storytelling.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl bg-sand-50 dark:bg-neutral-950 border border-sand-300 dark:border-neutral-800 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-teal-950 dark:text-white">
              Curated Introductions
            </h3>
            <p className="text-[16px] text-ink-600 dark:text-neutral-300 leading-relaxed">
              Every introduction is personally facilitated by our concierge over WhatsApp. You review their portfolio and travel dates before welcoming them.
            </p>
          </div>
        </div>

        {/* Quiet Info Box */}
        <div className="p-8 sm:p-10 rounded-2xl bg-sand-50 dark:bg-neutral-950 border border-sand-300 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-gold-700 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Eligible Venue Types</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1A3739] dark:text-white">
            Fine Dining, Artisan Cafés, Cocktail Lounges & Bistros
          </h2>
          <p className="text-[17px] sm:text-[18px] text-[#1A3739]/90 dark:text-neutral-200 leading-relaxed">
            Whether you operate an intimate espresso bar in Galle Fort, a cliffside sunset cocktail deck in Mirissa, or a modern seafood restaurant in Colombo, Get Linked brings you international and local travel creators looking for the best tables in Sri Lanka.
          </p>
          <div className="pt-2">
            <Link
              href="/list-property?category=eats"
              className="font-semibold text-[16px] text-[#D7400B] hover:underline inline-flex items-center gap-1.5"
            >
              <span>List your restaurant or café now for free (Phase 1)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
