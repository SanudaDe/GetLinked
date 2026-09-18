"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const DestinationsGrid: React.FC = () => {
  const destinations = [
    {
      city: "Galle",
      line: "Colonial ramparts, coastal villas, salt air at dusk.",
      imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
    },
    {
      city: "Ella",
      line: "Mist over tea hills, a train winding through cloud.",
      imageUrl: "https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80",
    },
    {
      city: "Weligama",
      line: "Long boards, longer mornings, the sea setting the pace.",
      imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
    },
    {
      city: "Colombo",
      line: "Rooftop light, old spice markets, a city in motion.",
      imageUrl: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80",
    },
    {
      city: "Sigiriya",
      line: "A fifth-century rock rising from the jungle canopy.",
      imageUrl: "https://images.unsplash.com/photo-1609137144822-261f855d6482?auto=format&fit=crop&w=800&q=80",
    },
    {
      city: "Kandy",
      line: "Temple bells, lake mist, gardens older than memory.",
      imageUrl: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#FAF8F5] text-[#122026] border-t border-[#E7E2DA]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16 space-y-3">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#8A949C] block">
            Where To Begin
          </span>

          <h2 className="font-serif italic text-3xl sm:text-5xl font-normal text-[#122026] tracking-tight leading-[1.15]">
            Six places, each holding its own quiet.
          </h2>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest) => (
            <Link
              key={dest.city}
              href={`/creators?city=${encodeURIComponent(dest.city)}`}
              className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-warm hover:shadow-warm-lg transition-all duration-500 flex flex-col justify-end p-6 sm:p-7 bg-[#ECE6DC]"
            >
              {/* Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dest.imageUrl}
                alt={dest.city}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

              {/* Sensory Card Content */}
              <div className="relative z-10 space-y-2 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white">
                    {dest.city}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
                </div>

                <p className="text-xs sm:text-sm text-white/85 font-normal leading-relaxed">
                  {dest.line}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
