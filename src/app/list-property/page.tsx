"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/data/store";
import { SRI_LANKA_CITIES, PROPERTY_TYPES, OFFER_TYPES } from "@/utils/formatters";
import { PropertyType, OfferType } from "@/types";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Users,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export default function ListPropertyPage() {
  const { settings, submitAccommodationApplication } = useStore();

  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    accommodationName: "",
    propertyType: "Villa" as PropertyType,
    contactPerson: "",
    whatsapp: "",
    email: "",
    city: "Galle",
    coverageStart: "",
    coverageEnd: "",
    offerType: "Free accommodation + meals" as OfferType,
    minimumFollowers: 30000,
    requirements: "",
    consentGiven: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.accommodationName.trim()) {
      setErrorMsg("Please enter your accommodation name.");
      return;
    }
    if (!formData.contactPerson.trim()) {
      setErrorMsg("Please provide the primary contact person's name.");
      return;
    }
    if (!formData.whatsapp.trim()) {
      setErrorMsg("Please enter a valid WhatsApp number with country code.");
      return;
    }
    if (!formData.coverageStart || !formData.coverageEnd) {
      setErrorMsg("Please specify your collaboration coverage date window.");
      return;
    }
    if (new Date(formData.coverageEnd) <= new Date(formData.coverageStart)) {
      setErrorMsg("Coverage end date must be after coverage start date.");
      return;
    }
    if (!formData.requirements.trim() || formData.requirements.length < 20) {
      setErrorMsg("Please specify what you are looking for from creators (at least 20 characters).");
      return;
    }
    if (!formData.consentGiven) {
      setErrorMsg("Please confirm host consent to submit your property for review.");
      return;
    }

    const res = submitAccommodationApplication({
      accommodation_name: formData.accommodationName,
      property_type: formData.propertyType,
      contact_person: formData.contactPerson,
      whatsapp: formData.whatsapp,
      email: formData.email,
      city: formData.city,
      coverage_start: formData.coverageStart,
      coverage_end: formData.coverageEnd,
      offer_type: formData.offerType,
      minimum_followers: formData.minimumFollowers,
      requirements: formData.requirements,
    });

    if (res.success) {
      setSubmittedCode(res.reference_code);
    }
  };

  if (submittedCode) {
    return (
      <div className="py-20 bg-sand-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-sand-50 rounded-2xl border border-sand-300 p-8 sm:p-12 text-center space-y-6 shadow-warm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-3xl font-bold text-teal-950">
                Property Listing Queued!
              </h1>
              <p className="text-sm text-ink-700 max-w-md mx-auto leading-relaxed">
                Thank you for listing <strong>{formData.accommodationName}</strong>. Our concierge team will review your property details and contact you via WhatsApp.
              </p>
            </div>

            <div className="p-4 bg-sand-200/60 rounded-xl border border-sand-300 max-w-sm mx-auto">
              <span className="text-xs uppercase font-semibold text-ink-600 block">
                Your Listing Reference:
              </span>
              <span className="font-mono text-2xl font-bold text-teal-900 tracking-wider">
                {submittedCode}
              </span>
              <p className="text-[11px] text-ink-500 mt-1">
                Keep this reference to check your listing and matching status.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/status"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-teal-900 text-sand-50 text-xs font-semibold uppercase tracking-wider hover:bg-teal-800 transition-colors"
              >
                Track Status
              </Link>
              <Link
                href="/creators"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-sand-200 text-ink-900 text-xs font-semibold uppercase tracking-wider hover:bg-sand-300 transition-colors"
              >
                Browse Creators Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-sand-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 text-teal-950 border border-gold-500/30 text-xs font-semibold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-gold-600" />
            Host Collaboration Listing
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-teal-950">
            List Your Sri Lankan Property
          </h1>
          <p className="text-xs sm:text-sm text-ink-700 max-w-lg mx-auto">
            Get matched with verified international and local travel creators visiting your destination.
          </p>

          {/* Dynamic Platform Phase Pricing Banner */}
          <div className="p-3 bg-teal-900/10 border border-teal-900/20 rounded-xl max-w-xl mx-auto flex items-center justify-center gap-2 text-xs font-semibold text-teal-950">
            <Sparkles className="w-4 h-4 text-gold-500 shrink-0" />
            <span>
              {settings.platform_phase === "FREE"
                ? "Listing and collaboration matching is currently free."
                : "Fees may apply to confirmed collaborations."}
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="bg-sand-50 rounded-2xl border border-sand-300 p-6 sm:p-10 shadow-warm space-y-6"
        >
          {/* Section 1: Property Info */}
          <div className="border-b border-sand-200 pb-4">
            <h2 className="font-serif text-xl font-bold text-teal-950">
              Property Details
            </h2>
            <p className="text-xs text-ink-600 mt-0.5">
              Tell us about your accommodation in Sri Lanka.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                Property / Business Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. The Dutch Fort Heritage Villa"
                value={formData.accommodationName}
                onChange={(e) => setFormData({ ...formData, accommodationName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                Property Type *
              </label>
              <select
                value={formData.propertyType}
                onChange={(e) =>
                  setFormData({ ...formData, propertyType: e.target.value as PropertyType })
                }
                className="w-full px-4 py-3 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                Primary Contact Person *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rohan De Silva"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                WhatsApp Number *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. +94771234567"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                City / Region in Sri Lanka *
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
              >
                {SRI_LANKA_CITIES.filter((c) => c !== "All Sri Lanka").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Collaboration Parameters */}
          <div className="border-b border-sand-200 pb-4 pt-4">
            <h2 className="font-serif text-xl font-bold text-teal-950">
              Collaboration Terms
            </h2>
            <p className="text-xs text-ink-600 mt-0.5">
              Define your availability window and what you can offer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                Coverage Window Start *
              </label>
              <input
                type="date"
                required
                value={formData.coverageStart}
                onChange={(e) => setFormData({ ...formData, coverageStart: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                Coverage Window End *
              </label>
              <input
                type="date"
                required
                value={formData.coverageEnd}
                onChange={(e) => setFormData({ ...formData, coverageEnd: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                What are you offering? *
              </label>
              <select
                value={formData.offerType}
                onChange={(e) =>
                  setFormData({ ...formData, offerType: e.target.value as OfferType })
                }
                className="w-full px-4 py-3 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
              >
                {OFFER_TYPES.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                Minimum Follower Count Wanted *
              </label>
              <select
                value={formData.minimumFollowers}
                onChange={(e) => setFormData({ ...formData, minimumFollowers: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
              >
                <option value={5000}>5,000+ Followers (Micro)</option>
                <option value={20000}>20,000+ Followers</option>
                <option value={50000}>50,000+ Followers (Mid-tier)</option>
                <option value={100000}>100,000+ Followers (Macro)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
              What are you looking for from the creator? *
            </label>
            <textarea
              rows={4}
              required
              placeholder="e.g. 1 High quality Instagram Reel showcasing our colonial plunge pool, 3 stories with location tag, and rights to use photos on our booking website..."
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
            />
          </div>

          {/* Host Consent */}
          <div className="p-4 rounded-xl bg-sand-200/50 border border-sand-300 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={formData.consentGiven}
                onChange={(e) => setFormData({ ...formData, consentGiven: e.target.checked })}
                className="w-5 h-5 rounded border-sand-400 text-teal-900 focus:ring-teal-900 mt-0.5 shrink-0"
              />
              <span className="text-xs text-ink-800 leading-relaxed">
                I confirm that I am authorized to represent this property and agree to Get Linked verifying our listing details. I understand Get Linked will curate and personally facilitate all creator introductions.
              </span>
            </label>
          </div>

          {/* Submit Action */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-sand-50 text-xs font-semibold uppercase tracking-wider shadow-warm transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-gold-400" />
              <span>Submit Property Listing</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
