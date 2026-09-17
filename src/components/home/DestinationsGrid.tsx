"use client";

import React from "react";
import Link from "next/link";
import { MapPin, ArrowRight, Sparkles, Building2, Users } from "lucide-react";
import { useStore } from "@/data/store";

export const DestinationsGrid: React.FC = () => {
  const { profiles, accommodations } = useStore();

  const destinations = [
    {
      city: "Galle",
      tagline: "Historic colonial fort, Thalpe coastal villas & ocean ramparts",
      imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
      region: "Southern Province",
      badge: "Popular Stays",
    },
    {
      city: "Ella",
      tagline: "Nine Arches Viaduct, mist-wrapped tea hills & scenic train journey",
      imageUrl: "https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80",
      region: "Central Highlands",
      badge: "Trending Creators",
    },
    {
      city: "Weligama",
      tagline: "World-class surf breaks, beachfront boutique resorts & yoga sanctuaries",
      imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
      region: "South Coast",
      badge: "Surf & Wellness",
    },
    {
      city: "Colombo",
      tagline: "Cosmopolitan Ceylon gastronomy, rooftop pools & urban lifestyle",
      imageUrl: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80",
      region: "Western Province",
      badge: "Food & Luxury",
    },
    {
      city: "Sigiriya",
      tagline: "Ancient 5th-century rock fortress, eco-lodges & Minneriya safaris",
      imageUrl: "https://images.unsplash.com/photo-1609137144822-261f855d6482?auto=format&fit=crop&w=800&q=80",
      region: "Cultural Triangle",
      badge: "Eco & Heritage",
    },
    {
      city: "Kandy",
      tagline: "Sacred Temple of the Tooth, mist lake & lush Peradeniya gardens",
      imageUrl: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80",
      region: "Central Province",
      badge: "Culture & Nature",
    },
  ];

  return (
    <section className="py-16 bg-sand-100/50 border-b border-sand-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-900/10 text-teal-900 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              Sri Lankan Destinations
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-teal-950">
              Explore Collaborations by Destination
            </h2>
            <p className="text-xs sm:text-sm text-ink-700 max-w-xl">
              From colonial heritage villas in Galle to misty tea bungalows in Ella, discover verified stays and creators scheduled in each region.
            </p>
          </div>

          <Link
            href="/creators"
            className="text-xs sm:text-sm font-semibold text-teal-900 hover:text-gold-600 flex items-center gap-1.5 transition-colors shrink-0"
          >
            <span>Browse All Sri Lanka →</span>
          </Link>
        </div>

        {/* Destination Cards (Trip.com Visual Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => {
            const creatorsCount = profiles.filter((p) => p.city === dest.city).length;
            const staysCount = accommodations.filter(
              (a) => a.city === dest.city && a.status === "APPROVED"
            ).length;

            return (
              <Link
                key={dest.city}
                href={`/creators?city=${encodeURIComponent(dest.city)}`}
                className="group relative h-72 rounded-2xl overflow-hidden shadow-warm hover:shadow-elevated transition-all duration-300 flex flex-col justify-end p-6 border border-sand-300"
              >
                {/* Background Photography */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dest.imageUrl}
                  alt={dest.city}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-950/95 via-teal-950/50 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gold-500 text-ink-950 shadow-sm">
                    {dest.badge}
                  </span>
                  <span className="text-[10px] font-medium text-sand-100 bg-teal-900/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-teal-700">
                    {dest.region}
                  </span>
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-2 text-sand-50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-2xl font-bold text-sand-50 group-hover:text-gold-400 transition-colors flex items-center gap-1.5">
                      <span>{dest.city}</span>
                    </h3>
                    <ArrowRight className="w-5 h-5 text-gold-400 group-hover:translate-x-1 transition-transform" />
                  </div>

                  <p className="text-xs text-sand-200 line-clamp-2 leading-relaxed">
                    {dest.tagline}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] pt-1 text-sand-300 border-t border-sand-50/20 font-medium">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-gold-400" />
                      {creatorsCount} Creators Scheduled
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-gold-400" />
                      {staysCount} Stays Listed
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
