"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Calendar,
  Gift,
  Users,
  CheckCircle2,
  ArrowRight,
  Star,
  Send,
} from "lucide-react";
import { useStore } from "@/data/store";
import { formatDateRange, formatFollowerCount } from "@/utils/formatters";
import { AccommodationApplication } from "@/types";
import { Modal } from "@/components/ui/Modal";

export const FeaturedAccommodations: React.FC = () => {
  const { accommodations } = useStore();
  const [selectedStay, setSelectedStay] = useState<AccommodationApplication | null>(null);

  // Property photos mapping for realistic travel visuals
  const stayPhotos: Record<string, string> = {
    "acc-201": "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80",
    "acc-202": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80",
    "acc-203": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
    "acc-204": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80",
  };

  const approvedStays = accommodations.filter((a) => a.status === "APPROVED").slice(0, 4);

  return (
    <section className="py-20 bg-sand-50 border-b border-sand-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 text-teal-950 border border-gold-500/30 text-xs font-semibold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-gold-600" />
              Verified Sri Lankan Hosts
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-teal-950">
              Featured Stays Seeking Creators
            </h2>
            <p className="text-sm sm:text-base text-ink-700 max-w-xl">
              Hand-selected boutique properties, colonial villas, and coastal eco-lodges offering hosted collaborations for upcoming travel dates.
            </p>
          </div>

          <Link
            href="/list-property"
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-900 hover:text-gold-600 transition-colors shrink-0"
          >
            <span>List Your Stay (Free in Phase 1) →</span>
          </Link>
        </div>

        {/* Accommodation Cards Grid (Trip.com Hotel Card style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {approvedStays.map((stay) => {
            const photoUrl =
              stayPhotos[stay.id] ||
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80";

            return (
              <div
                key={stay.id}
                className="bg-white rounded-2xl border border-sand-300 overflow-hidden shadow-sm hover:shadow-elevated transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo with badges */}
                  <div className="relative h-52 w-full bg-sand-200 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoUrl}
                      alt={stay.accommodation_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />

                    {/* Top Property Type Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="text-[11px] font-semibold bg-teal-900/90 text-sand-50 px-2.5 py-1 rounded-full backdrop-blur-sm border border-teal-700/50">
                        {stay.property_type}
                      </span>
                    </div>

                    {/* Verified Score Pill */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-sand-50 text-xs font-semibold">
                      <span className="bg-teal-600 text-white px-2 py-0.5 rounded-full font-bold text-[10px]">
                        9.9
                      </span>
                      <span>Verified Stay</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-lg font-bold text-teal-950 line-clamp-1 group-hover:text-teal-600 transition-colors">
                        {stay.accommodation_name}
                      </h3>
                      <span title="Verified by Get Linked">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-ink-700">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span className="font-medium text-teal-950">{stay.city}, Sri Lanka</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                        <span>{formatDateRange(stay.coverage_start, stay.coverage_end)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-900 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                        <Gift className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{stay.offer_type}</span>
                      </div>
                    </div>

                    <p className="text-xs text-ink-600 line-clamp-2 leading-relaxed pt-1">
                      {stay.requirements}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Min Follower & Action */}
                <div className="p-5 pt-0 space-y-3">
                  <div className="text-[11px] text-ink-500 flex items-center justify-between border-t border-sand-200 pt-3">
                    <span>Host Requirement:</span>
                    <strong className="text-teal-950">
                      {formatFollowerCount(stay.minimum_followers)}+ followers
                    </strong>
                  </div>

                  <button
                    onClick={() => setSelectedStay(stay)}
                    className="w-full py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-600 hover:text-white text-teal-700 text-xs font-bold uppercase tracking-wider transition-colors border border-teal-200 flex items-center justify-center gap-1.5"
                  >
                    <span>View Stay Specs</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stay Specs Modal */}
      {selectedStay && (
        <Modal
          isOpen={!!selectedStay}
          onClose={() => setSelectedStay(null)}
          title={selectedStay.accommodation_name}
          subtitle={`${selectedStay.property_type} in ${selectedStay.city}, Sri Lanka`}
        >
          <div className="space-y-4 text-xs text-ink-800">
            <div className="grid grid-cols-2 gap-3 p-4 bg-sand-100 rounded-xl border border-sand-300">
              <div>
                <span className="text-ink-500 block">Host Offering:</span>
                <strong className="text-emerald-800 text-sm font-bold">{selectedStay.offer_type}</strong>
              </div>
              <div>
                <span className="text-ink-500 block">Audience Wanted:</span>
                <strong className="text-teal-950 text-sm font-bold">
                  {selectedStay.minimum_followers.toLocaleString()}+ followers
                </strong>
              </div>
              <div>
                <span className="text-ink-500 block">Location:</span>
                <strong className="text-teal-950">{selectedStay.city}, Sri Lanka</strong>
              </div>
              <div>
                <span className="text-ink-500 block">Coverage Window:</span>
                <strong className="text-teal-950">
                  {selectedStay.coverage_start} to {selectedStay.coverage_end}
                </strong>
              </div>
            </div>

            <div>
              <span className="text-ink-700 font-semibold block mb-1">
                What the Host is Looking For:
              </span>
              <p className="p-3 bg-sand-100 rounded-lg border border-sand-200 text-xs leading-relaxed text-ink-800">
                {selectedStay.requirements}
              </p>
            </div>

            <div className="p-3 bg-teal-900/10 rounded-xl border border-teal-900/20 text-xs text-ink-700 leading-relaxed">
              <strong className="text-teal-950 block mb-1">How Introductions Work:</strong>
              Apply as a creator with your planned visit dates. If approved, our concierge matches you with {selectedStay.accommodation_name} and coordinates the stay via WhatsApp.
            </div>

            <div className="pt-3 border-t border-sand-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedStay(null)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink-600 hover:text-ink-900"
              >
                Close
              </button>
              <Link
                href="/apply"
                className="px-6 py-2.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-sand-50 text-xs font-semibold uppercase tracking-wider shadow-warm"
              >
                Apply as Creator (18+, 5K+)
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};
