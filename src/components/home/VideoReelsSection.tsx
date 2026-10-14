"use client";

import React from "react";

interface ReelItem {
  id: string;
  src: string;
  driveUrl: string;
  driveId: string;
  poster: string;
}

export const VideoReelsSection: React.FC = () => {
  const reels: ReelItem[] = [
    {
      id: "reel-1",
      src: "/videos/reel-1.mp4",
      driveUrl: "https://drive.google.com/file/d/1slXg9JqTjf6U_bpFwyiUCqp9Pn0n3PAc/view?usp=drive_link",
      driveId: "1slXg9JqTjf6U_bpFwyiUCqp9Pn0n3PAc",
      poster: "/images/reel-1-thumb.jpg",
    },
    {
      id: "reel-2",
      src: "/videos/reel-2.mp4",
      driveUrl: "https://drive.google.com/file/d/1CFSnaRrPgJZP_LKkhcjB_5dvUGe1i0W2/view?usp=drive_link",
      driveId: "1CFSnaRrPgJZP_LKkhcjB_5dvUGe1i0W2",
      poster: "/images/reel-2-thumb.jpg",
    },
  ];

  return (
    <section className="py-16 sm:py-28 bg-white dark:bg-black text-[#1A3739] dark:text-white overflow-hidden border-t border-gray-200 dark:border-neutral-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-18 space-y-3 sm:space-y-4">
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#1A3739] dark:text-white tracking-tight leading-tight">
            Real stays through the creator&apos;s lens.
          </h2>

          <p className="text-[22px] sm:text-[26px] lg:text-[28px] text-[#1A3739] dark:text-neutral-100 leading-relaxed font-normal pt-1">
            Watch recent visual collaborations captured by verified creators at distinctive boutique villas across Sri Lanka.
          </p>
        </div>

        {/* 2-Column Luxury Video Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {reels.map((reel) => (
            <div
              key={reel.id}
              className="bg-gray-50 dark:bg-neutral-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-800 shadow-warm hover:shadow-warm-lg dark:shadow-none transition-all duration-300"
            >
              {/* Video Player Frame */}
              <div className="relative aspect-[16/9] bg-[#1A3739] dark:bg-black overflow-hidden">
                <video
                  ref={(el) => {
                    if (el) {
                      el.defaultMuted = true;
                      el.muted = true;
                    }
                  }}
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={reel.poster}
                  className="w-full h-full object-cover"
                  aria-label="GetLinked promotional video"
                >
                  <source src={reel.src} type="video/mp4" />
                  <source src={`/api/drive/stream?id=${reel.driveId}`} type="video/mp4" />
                  <source src={`https://drive.google.com/uc?export=download&id=${reel.driveId}`} type="video/mp4" />
                </video>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
