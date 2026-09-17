"use client";

import React from "react";
import { useStore } from "@/data/store";
import { ExternalLink, Sparkles } from "lucide-react";
import { AdPlacement } from "@/types";

interface AdBannerProps {
  placement: AdPlacement;
}

export const AdBanner: React.FC<AdBannerProps> = ({ placement }) => {
  const { ads, settings } = useStore();

  // Find active ads for this placement within date range
  const today = new Date().toISOString().split("T")[0];
  const activeAds = ads.filter(
    (ad) =>
      ad.is_active &&
      ad.placement === placement &&
      (!ad.start_date || ad.start_date <= today) &&
      (!ad.end_date || ad.end_date >= today)
  );

  if (activeAds.length === 0) return null;

  const currentAd = activeAds[0];

  return (
    <aside
      aria-label="Sponsored Partner"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10"
    >
      <div className="relative rounded-2xl overflow-hidden border border-sand-400/80 shadow-warm bg-sand-200/60 p-1">
        <a
          href={currentAd.destination_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block relative rounded-xl overflow-hidden"
        >
          <div className="relative h-32 sm:h-44 w-full bg-teal-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentAd.image_url}
              alt={currentAd.title}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-teal-950/90 via-teal-950/60 to-transparent" />

            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gold-500 text-ink-950">
                  Featured Partner
                </span>
                <span className="text-xs text-sand-200 font-medium">
                  {currentAd.sponsor_name}
                </span>
              </div>

              <div className="flex items-end justify-between gap-4">
                <div>
                  <h4 className="font-serif text-lg sm:text-2xl font-bold text-sand-50 max-w-xl group-hover:text-gold-400 transition-colors">
                    {currentAd.title}
                  </h4>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sand-50/10 hover:bg-sand-50/20 text-sand-100 text-xs font-semibold backdrop-blur-sm transition-colors shrink-0">
                  <span>Visit Partner</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </a>
        <div className="px-3 py-1 text-[10px] text-ink-600 flex items-center justify-between">
          <span>Official Get Linked Partner • Sri Lanka Travel Ecosystem</span>
          <span>Sponsored Placement</span>
        </div>
      </div>
    </aside>
  );
};
