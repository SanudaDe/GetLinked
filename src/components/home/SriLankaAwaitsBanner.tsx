"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { WaitlistModal } from "./WaitlistModal";

export const SriLankaAwaitsBanner: React.FC = () => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#336467] text-white">
        {/* Full-Bleed Aerial Coastal Photography */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2400&q=85"
            alt="Aerial panoramic view of Sri Lanka tropical coastline with turquoise waves and lush coconut palm forests"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle Contrast Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/35 to-black/50" />
        </div>

        {/* Center Editorial Typography */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 py-20">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-white/90">
            SRI LANKA AWAITS
          </span>

          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-white tracking-tight leading-[1.08]">
            Extraordinary stays.
            <br />
            Incredible stories.
          </h2>

          <div className="pt-4">
            <button
              onClick={() => setWaitlistOpen(true)}
              className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-white hover:text-white/90 underline underline-offset-8 decoration-white/40 hover:decoration-white transition-all group cursor-pointer"
            >
              <span>JOIN GET LINKED</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      <WaitlistModal isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </>
  );
};
