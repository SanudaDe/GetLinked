"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/data/store";
import { SRI_LANKA_CITIES, PROPERTY_TYPES, OFFER_TYPES } from "@/utils/formatters";
import { PropertyType, OfferType } from "@/types";
import { supabaseService } from "@/services/supabaseService";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Users,
  Sparkles,
  AlertCircle,
  Camera,
  UploadCloud,
  Trash2,
  Star,
  Plus,
  Link as LinkIcon,
  Image as ImageIcon,
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

  // Images state: array of image URLs (or base64 data URLs)
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Handle local file uploads (uploads directly to Supabase Storage bucket 'images')
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorMsg(null);
    setIsUploading(true);

    const fileList = Array.from(files);

    for (const file of fileList) {
      if (!file.type.startsWith("image/")) {
        setErrorMsg("Please upload valid image files (JPG, PNG, WebP).");
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg(`Image "${file.name}" exceeds the 10MB size limit.`);
        continue;
      }

      // Upload directly to Supabase Storage 'images' bucket
      const uploadRes = await supabaseService.uploadPropertyImage(file);
      if (uploadRes.url) {
        setImages((prev) => [...prev, uploadRes.url!]);
      } else {
        // Fallback to local Data URL so user is never blocked
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          const result = loadEvt.target?.result as string;
          if (result) {
            setImages((prev) => [...prev, result]);
          }
        };
        reader.readAsDataURL(file);
      }
    }

    setIsUploading(false);
    e.target.value = "";
  };

  // Handle adding direct image URL
  const handleAddUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      setErrorMsg("Please enter a valid URL starting with https:// or http://");
      return;
    }

    setImages((prev) => [...prev, trimmed]);
    setImageUrlInput("");
    setErrorMsg(null);
  };

  // Remove image
  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Set an image as the primary cover photo (move to index 0)
  const handleSetAsCover = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const selected = prev[index];
      const others = prev.filter((_, idx) => idx !== index);
      return [selected, ...others];
    });
  };

  // Quick sample photo presets for hoteliers or testing
  const samplePhotoPresets = [
    {
      name: "Luxury Villa Pool",
      url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Colonial Tea Estate",
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Coastal Surf Hotel",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Highland Eco Lodge",
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const handleAddPreset = (url: string) => {
    if (!images.includes(url)) {
      setImages((prev) => [...prev, url]);
    }
  };

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

    const primaryImage = images.length > 0 ? images[0] : undefined;

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
      image_url: primaryImage,
      images: images.length > 0 ? images : undefined,
    });

    if (res.success) {
      setSubmittedCode(res.reference_code);
    }
  };

  if (submittedCode) {
    const coverPhoto = images.length > 0 ? images[0] : null;

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
                Thank you for listing <strong>{formData.accommodationName}</strong>. Our concierge team will review your property details, photos, and contact you via WhatsApp.
              </p>
            </div>

            {/* Photo preview on success screen */}
            {coverPhoto && (
              <div className="relative h-48 w-full max-w-md mx-auto rounded-xl overflow-hidden border border-sand-300 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverPhoto}
                  alt={formData.accommodationName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-left text-white">
                  <span className="text-[10px] uppercase font-bold text-gold-400 block tracking-wider">
                    {formData.propertyType} • {formData.city}
                  </span>
                  <span className="font-serif font-bold text-base block line-clamp-1">
                    {formData.accommodationName}
                  </span>
                </div>
              </div>
            )}

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
    <div className="py-16 bg-sand-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-gold-600 block">
            For Stays & Hospitality Hosts
          </span>
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
          className="bg-sand-50 rounded-2xl border border-sand-300 p-6 sm:p-10 shadow-warm space-y-8"
        >
          {/* Section 1: Property Info */}
          <div className="border-b border-sand-200 pb-4">
            <h2 className="font-serif text-xl font-bold text-teal-950">
              1. Property Details
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

          {/* Section 2: Property Photos & Visuals (NEW) */}
          <div className="border-t border-sand-200 pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-teal-800" />
                <h2 className="font-serif text-xl font-bold text-teal-950">
                  2. Property Photos & Visuals
                </h2>
              </div>
              <span className="text-xs text-gold-700 font-semibold bg-gold-50 border border-gold-200 px-2.5 py-0.5 rounded-full">
                {images.length} {images.length === 1 ? "photo" : "photos"} added
              </span>
            </div>
            <p className="text-xs text-ink-600">
              Upload photos of your rooms, pool, dining, or property views. High-quality imagery attracts more creator proposals!
            </p>

            {/* Upload Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option A: Upload Files from Device */}
              <label className="p-5 rounded-xl border-2 border-dashed border-sand-400 hover:border-teal-700 bg-sand-100/70 hover:bg-sand-100 transition-colors flex flex-col items-center justify-center text-center cursor-pointer group">
                <UploadCloud className="w-8 h-8 text-teal-900 group-hover:scale-110 transition-transform mb-2" />
                <span className="text-xs font-bold text-teal-950 block">
                  {isUploading ? "Processing Photos..." : "Upload from Device"}
                </span>
                <span className="text-[11px] text-ink-500 mt-1 block">
                  PNG, JPG, or WebP up to 8MB each (Select multiple)
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Option B: Direct Image URL Link */}
              <div className="p-5 rounded-xl border border-sand-300 bg-sand-100/50 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-teal-950">
                    <LinkIcon className="w-3.5 h-3.5 text-teal-800" />
                    <span>Paste Image Web Link</span>
                  </div>
                  <p className="text-[11px] text-ink-500">
                    From your official website, Booking.com, or cloud storage.
                  </p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://yourhotel.com/photos/pool.jpg"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddUrl();
                      }
                    }}
                    className="flex-grow px-3 py-2 rounded-lg border border-sand-400 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrl}
                    className="px-3 py-2 rounded-lg bg-teal-900 hover:bg-teal-800 text-sand-50 text-xs font-semibold shrink-0 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Sample Photos for Testing */}
            <div className="pt-1">
              <span className="text-[11px] text-ink-500 mr-2">Or try a sample luxury photo:</span>
              <div className="inline-flex flex-wrap gap-1.5 mt-1">
                {samplePhotoPresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleAddPreset(preset.url)}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-sand-200 hover:bg-teal-900 hover:text-sand-50 text-teal-950 border border-sand-300 transition-colors"
                  >
                    + {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Gallery Preview Grid */}
            {images.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs text-ink-600">
                  <span className="font-semibold">Selected Property Photos ({images.length}):</span>
                  <span className="text-[11px] text-ink-500">
                    ★ First photo is your <strong>Cover Photo</strong> (click another to set as cover)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {images.map((imgUrl, index) => {
                    const isCover = index === 0;

                    return (
                      <div
                        key={index}
                        className={`relative group rounded-xl overflow-hidden border-2 bg-sand-200 aspect-video sm:aspect-square ${
                          isCover ? "border-gold-500 ring-2 ring-gold-400/40" : "border-sand-300"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgUrl}
                          alt={`Property photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between">
                          {isCover ? (
                            <span className="inline-flex items-center gap-1 bg-gold-500 text-ink-950 font-bold text-[10px] px-2 py-0.5 rounded shadow-sm">
                              <Star className="w-2.5 h-2.5 fill-ink-950" />
                              Cover Photo
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetAsCover(index)}
                              className="text-[10px] bg-black/60 hover:bg-teal-900 text-white px-1.5 py-0.5 rounded backdrop-blur-xs transition-colors"
                            >
                              Set as Cover
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="p-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-sm"
                            title="Remove Photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Collaboration Parameters */}
          <div className="border-t border-sand-200 pt-6 space-y-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-teal-950">
                3. Collaboration Terms
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
                I confirm that I am authorized to represent this property and agree to Get Linked verifying our listing details and imagery. I understand Get Linked will curate and personally facilitate all creator introductions.
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
