"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const EditorialStorySection: React.FC = () => {
  return (
    <section id="our-story" className="py-20 sm:py-32 bg-[#FAF8F5] text-[#122026] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Headline & Ethos */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal text-[#122026] tracking-tight leading-[1.05]">
              People.
              <br />
              Places.
              <br />
              Possibilities.
            </h2>

            <p className="text-sm sm:text-base text-[#5E686F] leading-relaxed max-w-md pt-2">
              Travel collaborations should begin with the right fit. Get Linked brings verified creators and distinctive stays together, making it easier to discover, connect and create something worth sharing.
            </p>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#122026] hover:text-[#C4A67B] transition-colors group"
              >
                <span>OUR STORY</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: High-End Villa Bedroom Image with Script Accent */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-warm-lg aspect-[4/3] sm:aspect-[16/10] bg-[#ECE6DC]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85"
                alt="Sunlit tropical resort bedroom looking out at palm trees and the sea"
                className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
              />
              {/* Subtle inner shadow / warmth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Handwritten Script Note: "More than just a stay" */}
            <div className="absolute -bottom-6 right-4 sm:-bottom-8 sm:right-8 bg-[#FAF8F5]/90 backdrop-blur-md px-6 py-3 rounded-xl border border-[#E7E2DA] shadow-sm transform rotate-2">
              <span className="font-script text-2xl sm:text-3xl text-[#7D7266] tracking-wide block">
                More than just a stay
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
