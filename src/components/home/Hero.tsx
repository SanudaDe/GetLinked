"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const Hero: React.FC = () => {

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between overflow-hidden bg-white dark:bg-black transition-colors duration-200">
      {/* Background Video (Web BG Video.mp4) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center transition-opacity duration-1000 dark:opacity-40"
          style={{ filter: "brightness(0.95)" }}
        >
          <source src="/videos/web-bg-video.mp4" type="video/mp4" />
          <source src="/videos/Web BG Video.mp4" type="video/mp4" />
        </video>

        {/* Horizontal Linear Shader: Smooth Left-to-Right Editorial Wash */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 via-45% to-transparent dark:from-black dark:via-black/90 pointer-events-none" />
      </div>

      {/* Top Spacer for Fixed Transparent Navbar */}
      <div className="h-24 sm:h-28 relative z-10" />

      {/* Center Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-12">
        <div className="max-w-2xl">
          {/* Kicker / Tag */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.28em] text-[#D7400B] drop-shadow-xs">
              REAL CREATORS. VERIFIED STAYS.
            </span>
          </div>

          {/* Editorial Display Headline (Upright serif matching Weligama card typography) */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-[68px] font-normal tracking-tight text-[#1A3739] dark:text-white leading-[1.14]">
            An island tells its story best through the people who stay.
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-[#1A3739] dark:text-neutral-200 max-w-xl font-medium leading-relaxed">
            We bring Sri Lanka&apos;s finest stays together with the voices worth trusting with them.
          </p>

          {/* Dual CTAs (Functional — keep plain, not italic) */}
          <div className="flex items-center gap-4 mt-8 flex-wrap">
            <Link
              href="/creators"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#D7400B] hover:bg-[#BD3607] text-white text-xs sm:text-sm font-semibold tracking-wider shadow-md hover:shadow-lg transition-all duration-200 group"
            >
              <span>Find Creators</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/list-property"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#1A3739] dark:bg-neutral-800 hover:bg-[#152E30] dark:hover:bg-neutral-700 text-white text-xs sm:text-sm font-semibold tracking-wider border border-[#1A3739] dark:border-neutral-700 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <span>List Your Stay</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Trust Line */}
          <p className="mt-8 text-xs sm:text-sm text-[#1A3739]/90 dark:text-neutral-300 tracking-wide font-medium">
            Every introduction made by hand. Nothing rushed, nothing automated.
          </p>
        </div>
      </div>

      {/* Bottom Slogan */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 pt-4 flex items-end justify-end text-xs text-[#1A3739] dark:text-neutral-400">
        <div className="text-right">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#1A3739] dark:text-neutral-400">
            A BRIGHTER WAY TO TRAVEL TOGETHER
          </span>
        </div>
      </div>
    </section>
  );
};
