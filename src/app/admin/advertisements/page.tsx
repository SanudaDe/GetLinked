"use client";

import React, { useState } from "react";
import { useStore } from "@/data/store";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { AdPlacement, Advertisement } from "@/types";
import {
  Megaphone,
  Plus,
  ExternalLink,
  Calendar,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
} from "lucide-react";

export default function AdminAdvertisementsPage() {
  const { ads, addAdvertisement, toggleAdStatus } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    sponsor_name: "",
    image_url: "",
    destination_url: "",
    placement: "HOME" as AdPlacement,
    start_date: "2026-09-01",
    end_date: "2026-12-31",
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAdvertisement({
      ...formData,
      is_active: true,
    });
    setShowAddModal(false);
    setFormData({
      title: "",
      sponsor_name: "",
      image_url: "",
      destination_url: "",
      placement: "HOME",
      start_date: "2026-09-01",
      end_date: "2026-12-31",
    });
  };

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title="Phase 1 Advertising Management"
        subtitle="Manage sponsored partner banner placements for Home and Accommodation directory pages."
        action={
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg bg-teal-900 hover:bg-teal-800 text-sand-50 text-xs font-semibold uppercase tracking-wider shadow-warm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-gold-400" />
            <span>New Ad Campaign</span>
          </button>
        }
      />

      <div className="px-6 space-y-6">
        {/* Ads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="bg-sand-50 rounded-2xl border border-sand-300 overflow-hidden shadow-warm space-y-4"
            >
              {/* Banner Preview */}
              <div className="relative h-44 w-full bg-teal-950 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ad.image_url}
                  alt={ad.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gold-500 text-ink-950 uppercase">
                    {ad.placement}
                  </span>
                  <Badge variant={ad.is_active ? "approved" : "neutral"} size="sm">
                    {ad.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-sand-50">
                  <div className="text-xs text-gold-400 font-semibold">{ad.sponsor_name}</div>
                  <h4 className="font-serif text-base font-bold line-clamp-1">{ad.title}</h4>
                </div>
              </div>

              {/* Details & Controls */}
              <div className="p-5 pt-0 space-y-3">
                <div className="text-xs text-ink-600 flex items-center justify-between border-b border-sand-200 pb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gold-600" />
                    <span>
                      {ad.start_date} to {ad.end_date}
                    </span>
                  </div>
                  <a
                    href={ad.destination_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-teal-900 hover:text-gold-600 font-medium"
                  >
                    <span>Target URL</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-ink-700 font-medium">Display Campaign:</span>
                  <button
                    onClick={() => toggleAdStatus(ad.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-sand-300 hover:bg-sand-200 transition-colors"
                  >
                    {ad.is_active ? (
                      <>
                        <ToggleRight className="w-5 h-5 text-emerald-600" />
                        <span className="text-emerald-900">Active</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5 h-5 text-ink-400" />
                        <span className="text-ink-500">Paused</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Ad Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Create New Sponsor Advertisement"
          subtitle="Configure sponsored banners for Phase 1 marketplace revenue."
        >
          <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-ink-800 uppercase tracking-wider mb-1">
                Campaign Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ceylon Artisan Stays & Safaris"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-ink-800 uppercase tracking-wider mb-1">
                  Sponsor Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SriLankan Airlines"
                  value={formData.sponsor_name}
                  onChange={(e) => setFormData({ ...formData, sponsor_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-ink-800 uppercase tracking-wider mb-1">
                  Placement Slot *
                </label>
                <select
                  value={formData.placement}
                  onChange={(e) => setFormData({ ...formData, placement: e.target.value as AdPlacement })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                >
                  <option value="HOME">Home Page Banner</option>
                  <option value="ACCOMMODATION_PAGES">Accommodation Directory Banner</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-ink-800 uppercase tracking-wider mb-1">
                Destination URL *
              </label>
              <input
                type="url"
                required
                placeholder="https://sponsor.com"
                value={formData.destination_url}
                onChange={(e) => setFormData({ ...formData, destination_url: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-ink-800 uppercase tracking-wider mb-1">
                Banner Image URL *
              </label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-ink-800 uppercase tracking-wider mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-400 bg-sand-50 text-xs focus:outline-none focus:ring-2 focus:ring-teal-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-ink-800 uppercase tracking-wider mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-400 bg-sand-50 text-xs focus:outline-none focus:ring-2 focus:ring-teal-900"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-sand-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-ink-600 hover:text-ink-900 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-teal-900 text-sand-50 font-semibold uppercase tracking-wider shadow-warm"
              >
                Save Campaign
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
