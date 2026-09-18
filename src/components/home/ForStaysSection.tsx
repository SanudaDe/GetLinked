"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const ForStaysSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#FAF8F5] text-[#122026] overflow-hidden border-t border-[#E7E2DA]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#8A949C]">
                FOR STAYS
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl lg:text-5xl font-normal text-[#122026] leading-[1.15] mt-3 tracking-tight">
                Find creators who fit your world.
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#5E686F] leading-relaxed max-w-lg">
              Browse verified creators by travel dates, audience, niche and style. Connect with people who truly align with your property.
            </p>

            <div className="pt-2">
              <Link
                href="/creators"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#122026] hover:text-[#C4A67B] transition-colors group"
              >
                <span>EXPLORE CREATORS</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: Villa Terrace Lounge with Corner Text Overlay */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-warm-lg aspect-[4/3] sm:aspect-[16/11] bg-[#ECE6DC] group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=85"
                alt="Luxury outdoor lounge with cream cushions overlooking infinity pool and ocean cliffs"
                className="w-full h-full object-cover object-center transform group-hover:scale-102 transition-transform duration-700"
              />
              {/* Subtle Dark Vignette for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Bottom-right corner typography overlay */}
              <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 space-y-1 text-right text-white">
                <p className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase opacity-95">
                  AUTHENTIC PEOPLE
                </p>
                <p className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase opacity-95">
                  MEANINGFUL REACH
                </p>
                <p className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase opacity-95">
                  A BRIGHTER TOMORROW
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
