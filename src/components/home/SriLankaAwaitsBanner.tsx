"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { WaitlistModal } from "./WaitlistModal";

export const SriLankaAwaitsBanner: React.FC = () => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-[70vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#1A3739] text-white">
        {/* Full-Bleed Hill Country Sanctuary Photography */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/sri-lanka-awaits.jpg"
            alt="Luxury boutique glamping tent overlooking lush Sri Lankan tea country hills and misty mountains at sunrise"
            className="w-full h-full object-cover object-center"
          />
          {/* Rich Contrast Overlays for optimal text visibility without losing sunrise glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/60" />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        {/* Center Editorial Typography */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7 py-20 sm:py-28">
          <div className="flex justify-center">
            <span className="inline-block px-5 py-2 rounded-full bg-black/50 backdrop-blur-md text-[13px] sm:text-[15px] font-semibold uppercase tracking-[0.28em] text-white/95 border border-white/25 shadow-lg drop-shadow-md">
              SRI LANKA AWAITS
            </span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-white tracking-tight leading-[1.12] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] [text-shadow:_0_2px_20px_rgba(0,0,0,0.95)]">
            Extraordinary stays.
            <br />
            Incredible stories.
          </h2>

          <div className="pt-2 flex justify-center">
            <button
              onClick={() => setWaitlistOpen(true)}
              className="inline-flex items-center gap-3 px-8 py-3.5 sm:py-4 rounded-full bg-white hover:bg-[#D7400B] text-[#1A3739] hover:text-white text-[15px] sm:text-[16px] font-bold uppercase tracking-[0.2em] shadow-2xl hover:shadow-warm-lg hover:scale-105 transition-all duration-300 group cursor-pointer border border-white/40"
            >
              <span>JOIN GET LINKED</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
            </button>
          </div>
        </div>
      </section>

      <WaitlistModal isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </>
  );
};
