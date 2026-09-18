"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const ForCreatorsSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#FAF8F5] text-[#122026] overflow-hidden border-t border-[#E7E2DA]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Creator Image with Corner Text Overlay */}
          <div className="lg:col-span-6 relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-warm-lg aspect-[4/3] sm:aspect-[16/11] bg-[#ECE6DC] group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1600&q=85"
                alt="Travel creator taking photos at sunset along the tropical Sri Lankan coast"
                className="w-full h-full object-cover object-center transform group-hover:scale-102 transition-transform duration-700"
              />
              {/* Subtle Dark Vignette for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Bottom-left corner typography overlay */}
              <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 space-y-1 text-white">
                <p className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase opacity-95">
                  NEW PLACES
                </p>
                <p className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase opacity-95">
                  REAL STORIES
                </p>
                <p className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase opacity-95">
                  LASTING CONNECTIONS
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy */}
          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <div>
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#8A949C]">
                FOR CREATORS
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl lg:text-5xl font-normal text-[#122026] leading-[1.15] mt-3 tracking-tight">
                Be discovered by places worth telling stories about.
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#5E686F] leading-relaxed max-w-lg">
              Create your profile, share your travel dates and let selected stays find you.
            </p>

            <div className="pt-2">
              <Link
                href="/for-creators"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#122026] hover:text-[#C4A67B] transition-colors group"
              >
                <span>DISCOVER GET LINKED</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
