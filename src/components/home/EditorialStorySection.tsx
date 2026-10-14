"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const EditorialStorySection: React.FC = () => {
  return (
    <section id="our-story" className="py-16 sm:py-32 bg-white dark:bg-black text-[#1A3739] dark:text-white overflow-hidden border-t border-gray-200 dark:border-neutral-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Editorial Headline & Ethos */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6">
            <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#336467] dark:text-white tracking-tight leading-[1.08]">
              People.
              <br />
              Places.
              <br />
              Possibilities.
            </h2>

            <p className="text-[22px] sm:text-[26px] lg:text-[28px] text-[#1A3739] dark:text-neutral-100 font-normal leading-relaxed max-w-xl pt-1 sm:pt-3">
              Travel collaborations should begin with the right fit. Get Linked brings verified creators and distinctive places together, making it easier to discover, connect and create something worth sharing.
            </p>

            <div className="pt-2 sm:pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2.5 text-[16px] sm:text-[18px] font-sans font-semibold uppercase tracking-[0.2em] text-[#336467] dark:text-neutral-200 hover:text-[#D7400B] dark:hover:text-[#D7400B] transition-colors group min-h-[44px] py-2"
              >
                <span>OUR STORY</span>
                <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: High-End Villa Bedroom Image with Script Accent */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-warm-lg dark:shadow-none aspect-[4/3] sm:aspect-[16/10] bg-neutral-100 dark:bg-neutral-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85"
                alt="Sunlit tropical resort bedroom looking out at palm trees and the sea"
                className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
              />
              {/* Subtle inner shadow / warmth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
