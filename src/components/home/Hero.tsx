"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Sparkles, MapPin, ArrowRight, CheckCircle2, Star } from "lucide-react";
import { useStore } from "@/data/store";
import { HeroSearchWidget } from "./HeroSearchWidget";
import { TrustBannerStrip } from "./TrustBannerStrip";

export const Hero: React.FC = () => {
  const { settings, profiles, accommodations } = useStore();

  return (
    <div>
      {/* Top Scenic Travel Hero Banner */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-16 lg:pb-32 bg-gradient-to-b from-teal-950 via-teal-900 to-teal-950 text-sand-50">
        {/* Scenic Background Photography with Overlay */}
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-overlay">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1920&q=80"
            alt="Sri Lanka Coast"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-950/70 to-transparent z-0" />

        {/* Hero Copy */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-400 text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Sri Lanka Curated Collaboration Marketplace</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-sand-50 tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Connecting verified creators with{" "}
            <span className="italic font-normal text-gold-400 underline decoration-gold-500 decoration-wavy decoration-2">
              verified stays
            </span>{" "}
            across Sri Lanka.
          </h1>

          <p className="text-sm sm:text-lg text-sand-200 max-w-2xl mx-auto leading-relaxed font-normal">
            No cold Instagram DMs. No fake follower promises. Get Linked manually authenticates influencers and boutique hotels — curating genuine media collaborations.
          </p>

          {/* Travel Platform CTAs (Trip.com Styling) */}
          <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
            <Link
              href="/creators"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
            >
              <span>Find Creators</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-sand-100 text-teal-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
            >
              <span>Apply as a Creator</span>
            </Link>
            <Link
              href="/list-property"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider border border-white/25 backdrop-blur-sm transition-colors"
            >
              <span>List Your Property</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Trip.com-Style Floating Multi-Tab Search Box */}
      <HeroSearchWidget />

      {/* Trip.com 4-Pillar Guarantee Ribbon */}
      <TrustBannerStrip />
    </div>
  );
};
