"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Calendar, Users, ArrowRight, CheckCircle2, Send, Star } from "lucide-react";
import { useStore } from "@/data/store";
import { formatFollowerCount, formatDateRange } from "@/utils/formatters";
import { InfluencerProfile } from "@/types";
import { Modal } from "@/components/ui/Modal";

export const FeaturedCreators: React.FC = () => {
  const { profiles, submitCreatorRequest } = useStore();
  const [selectedCreator, setSelectedCreator] = useState<InfluencerProfile | null>(null);
  const [formData, setFormData] = useState({
    accommodationName: "",
    requesterName: "",
    requesterWhatsApp: "",
    message: "",
  });
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCreator) return;

    const res = submitCreatorRequest({
      creator_id: selectedCreator.id,
      creator_name: selectedCreator.display_name,
      creator_niche: selectedCreator.niche,
      creator_city: selectedCreator.city,
      accommodation_name: formData.accommodationName,
      requester_name: formData.requesterName,
      requester_whatsapp: formData.requesterWhatsApp,
      message: formData.message,
    });

    if (res.success) {
      setSubmittedMessage(res.message);
      setTimeout(() => {
        setSubmittedMessage(null);
        setSelectedCreator(null);
        setFormData({
          accommodationName: "",
          requesterName: "",
          requesterWhatsApp: "",
          message: "",
        });
      }, 2500);
    }
  };

  const featured = profiles.slice(0, 4);

  return (
    <section className="py-20 bg-sand-50 border-b border-sand-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-widest text-gold-600 font-bold">
              Curated Talent
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-teal-950">
              Verified Creators Visiting Sri Lanka
            </h2>
            <p className="text-sm sm:text-base text-ink-700 max-w-xl">
              Every creator below has been verified with government ID and has 5,000+ verified followers with scheduled travel dates.
            </p>
          </div>
          <Link
            href="/creators"
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-900 hover:text-gold-600 transition-colors shrink-0"
          >
            <span>View All ({profiles.length}) Creators</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Creator Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((creator) => (
            <div
              key={creator.id}
              className="bg-white rounded-2xl border border-sand-300 overflow-hidden shadow-sm hover:shadow-elevated transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Photo / Avatar Header */}
                <div className="relative h-48 w-full bg-sand-200 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={creator.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                    alt={creator.display_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
                  
                  {/* Niche Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[11px] font-semibold bg-teal-900/90 text-sand-50 px-2.5 py-1 rounded-full backdrop-blur-sm border border-teal-700/50">
                      {creator.niche}
                    </span>
                  </div>

                  {/* Trip.com 9.9 Score Pill */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-teal-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                    <Star className="w-3 h-3 fill-white text-white" />
                    <span>9.9</span>
                  </div>

                  {/* Follower Count */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-sand-50 text-xs font-semibold">
                    <Users className="w-3.5 h-3.5 text-gold-400" />
                    <span>{formatFollowerCount(creator.follower_count)} Followers</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif text-lg font-bold text-teal-950 group-hover:text-teal-600 transition-colors">
                      {creator.display_name}
                    </h3>
                    <span title="Identity & metrics verified by Get Linked">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-ink-700">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="font-medium text-teal-950">{creator.city}, Sri Lanka</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                      <span>{formatDateRange(creator.visit_start, creator.visit_end)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-ink-600 line-clamp-2 leading-relaxed pt-1">
                    {creator.trip_brief}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                <Link
                  href={`/creators/${creator.id}`}
                  className="py-2.5 px-3 rounded-xl bg-sand-100 hover:bg-sand-200 text-teal-950 text-xs font-bold uppercase tracking-wider border border-sand-300 text-center transition-colors flex items-center justify-center"
                >
                  Profile
                </Link>
                <button
                  onClick={() => setSelectedCreator(creator)}
                  className="py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3 h-3 text-white" />
                  <span>Request</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Request Modal */}
      {selectedCreator && (
        <Modal
          isOpen={!!selectedCreator}
          onClose={() => setSelectedCreator(null)}
          title={`Request ${selectedCreator.display_name}`}
          subtitle={`Verified ${selectedCreator.niche} creator visiting ${selectedCreator.city} (${formatDateRange(selectedCreator.visit_start, selectedCreator.visit_end)})`}
        >
          {submittedMessage ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-xl font-bold text-teal-900">
                Collaboration Request Logged!
              </h4>
              <p className="text-sm text-ink-700 max-w-sm mx-auto">
                {submittedMessage}
              </p>
            </div>
          ) : (
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div className="p-3 bg-sand-200/50 rounded-lg text-xs text-ink-700 leading-relaxed border border-sand-300">
                <span className="font-semibold text-teal-900">Privacy Notice:</span> Contact details are never exposed. Your request is sent directly to the Get Linked team. Once approved, we personally facilitate the WhatsApp introduction.
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                  Accommodation / Property Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunset Surf Villa Weligama"
                  value={formData.accommodationName}
                  onChange={(e) => setFormData({ ...formData, accommodationName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Malik Fernando"
                    value={formData.requesterName}
                    onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                    Your WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +94771234567"
                    value={formData.requesterWhatsApp}
                    onChange={(e) => setFormData({ ...formData, requesterWhatsApp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                  Message / Proposed Offer (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. We'd love to host you for 2 nights complimentary with breakfast in exchange for 1 Instagram Reel and 3 stories."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCreator(null)}
                  className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-ink-600 hover:text-ink-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-sand-50 text-xs font-semibold uppercase tracking-wider shadow-warm transition-all"
                >
                  Submit Request
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </section>
  );
};
