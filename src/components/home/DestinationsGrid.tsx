"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const DestinationsGrid: React.FC = () => {
  const destinations = [
    {
      city: "Galle",
      line: "Colonial ramparts, coastal villas, salt air at dusk.",
      imageUrl: "/images/galle.jpg",
    },
    {
      city: "Ella",
      line: "Mist over tea hills, a train winding through cloud.",
      imageUrl: "/images/ella.jpg",
    },
    {
      city: "Weligama",
      line: "Long boards, longer mornings, the sea setting the pace.",
      imageUrl: "/images/weligama.jpg",
    },
    {
      city: "Colombo",
      line: "Rooftop light, old spice markets, a city in motion.",
      imageUrl: "/images/colombo.jpg",
    },
    {
      city: "Sigiriya",
      line: "A fifth-century rock rising from the jungle canopy.",
      imageUrl: "/images/sigiriya.jpg",
    },
    {
      city: "Kandy",
      line: "Temple bells, lake mist, gardens older than memory.",
      imageUrl: "/images/kandy.jpg",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-black text-[#1A3739] dark:text-white border-t border-gray-200 dark:border-neutral-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16 space-y-3">
          <span className="text-[16px] font-semibold uppercase tracking-[0.22em] text-[#D7400B] block">
            Where To Begin
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#336467] dark:text-white tracking-tight leading-[1.15]">
            Six places, each holding its own quiet.
          </h2>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest) => (
            <Link
              key={dest.city}
              href={`/creators?city=${encodeURIComponent(dest.city)}`}
              className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-warm hover:shadow-warm-lg dark:shadow-none transition-all duration-500 flex flex-col justify-end p-6 sm:p-7 bg-neutral-100 dark:bg-neutral-900 border border-transparent dark:border-neutral-800"
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

                <p className="text-[16px] text-white/85 font-normal leading-relaxed">
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
