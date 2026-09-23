"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const Hero: React.FC = () => {

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between overflow-hidden bg-[#336467]">
      {/* Background Video (Web BG Video.mp4) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center transition-opacity duration-1000"
          style={{ filter: "brightness(0.95)" }}
        >
          <source src="/videos/web-bg-video.mp4" type="video/mp4" />
          <source src="/videos/Web BG Video.mp4" type="video/mp4" />
        </video>

        {/* Editorial Lighting Overlays for Text Legibility & Film Mood */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#E0DDAE]/95 via-[#E0DDAE]/65 to-transparent sm:max-w-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
      </div>

      {/* Top Spacer for Fixed Transparent Navbar */}
      <div className="h-24 sm:h-28 relative z-10" />

      {/* Center Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-12">
        <div className="max-w-2xl">
          {/* Kicker / Tag */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#D7400B]">
              SRI LANKA. REAL CONNECTIONS.
            </span>
          </div>

          {/* Editorial Display Headline */}
          <h1 className="font-serif italic text-4xl sm:text-6xl lg:text-[66px] font-normal tracking-tight text-[#336467] leading-[1.12]">
            An island tells its story best through the people who stay.
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-sm sm:text-base text-[#336467]/85 max-w-xl font-normal leading-relaxed">
            We bring Sri Lanka&apos;s finest stays together with the voices worth trusting with them.
          </p>

          {/* Dual CTAs (Functional — keep plain, not italic) */}
          <div className="flex items-center gap-4 mt-8 flex-wrap">
            <Link
              href="/creators"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#D7400B] hover:bg-[#BD3607] text-white text-xs font-medium tracking-wider shadow-md hover:shadow-lg transition-all duration-200 group"
            >
              <span>Find Creators</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/list-property"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#336467] hover:bg-[#254F52] text-white text-xs font-medium tracking-wider border border-[#336467] shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <span>List Your Stay</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Trust Line */}
          <p className="mt-8 text-xs sm:text-sm text-[#336467]/80 tracking-wide font-normal">
            Every introduction made by hand. Nothing rushed, nothing automated.
          </p>
        </div>
      </div>

      {/* Bottom Slogan */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 pt-4 flex items-end justify-end text-xs text-[#336467]">
        <div className="text-right">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-[#336467]">
            A BRIGHTER WAY TO TRAVEL TOGETHER
          </span>
        </div>
      </div>
    </section>
  );
};
