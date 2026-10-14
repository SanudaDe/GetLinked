"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/data/store";
import {
  SRI_LANKA_CITIES,
  STAY_VENUE_TYPES,
  EATS_VENUE_TYPES,
  STAY_OFFER_TYPES,
  EATS_OFFER_TYPES,
  DEFAULT_ALLOWED_LOCATIONS,
  isEatVenue,
} from "@/utils/formatters";
import { PropertyType, OfferType, VenueCategory } from "@/types";
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
  Utensils,
  Coffee,
  Wine,
  Clock,
  Bed,
  Folder,
  Video as VideoIcon,
  ExternalLink,
} from "lucide-react";
import { GoogleDriveFolderPicker } from "@/components/common/GoogleDriveFolderPicker";
import { GoogleDrivePlayer } from "@/components/common/GoogleDrivePlayer";
import {
  extractGoogleDriveFileId,
  extractGoogleDriveFolderId,
  getGoogleDriveImageUrl,
  getGoogleDrivePreviewUrl,
  isGoogleDriveUrl,
  GETLINKED_DRIVE_FOLDER_URL,
} from "@/utils/googleDrive";
import { PhoneInputWithCountry } from "@/components/ui/PhoneInputWithCountry";

function ListPropertyContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get("category");
  const defaultCategory: VenueCategory =
    initialCategoryParam?.toLowerCase() === "eats" ? "EATS" : "STAYS";

  const { settings, submitAccommodationApplication } = useStore();
  const allowedVillaLocations = settings.allowed_villa_locations ?? DEFAULT_ALLOWED_LOCATIONS;

  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [category, setCategory] = useState<VenueCategory>(defaultCategory);
  const [visitScheduleMode, setVisitScheduleMode] = useState<"single" | "window">("single");

  const [formData, setFormData] = useState({
    accommodationName: "",
    propertyType: (defaultCategory === "EATS" ? "Restaurant" : "Villa") as PropertyType,
    contactPerson: "",
    whatsapp: "",
    email: "",
    city: "Galle",
    coverageStart: "",
    coverageEnd: "",
    offerType: (defaultCategory === "EATS" ? "Dinner for Two" : "Free accommodation + meals") as OfferType,
    minimumFollowers: 20000,
    requirements: "",
    videoUrl: "",
    driveFolderUrl: "",
    consentGiven: false,
  });

  // Images state: array of image URLs (or base64 data URLs)
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showDrivePicker, setShowDrivePicker] = useState(false);

  // Sync category changes to default venue and offer types
  const handleCategoryChange = (newCat: VenueCategory) => {
    setCategory(newCat);
    setErrorMsg(null);
    if (newCat === "EATS") {
      setFormData((prev) => ({
        ...prev,
        propertyType: isEatVenue(prev.propertyType) ? prev.propertyType : "Restaurant",
        offerType: (EATS_OFFER_TYPES.includes(prev.offerType as any)
          ? prev.offerType
          : "Dinner for Two") as OfferType,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        propertyType: !isEatVenue(prev.propertyType) ? prev.propertyType : "Villa",
        offerType: (STAY_OFFER_TYPES.includes(prev.offerType as any)
          ? prev.offerType
          : "Free accommodation + meals") as OfferType,
      }));
    }
  };

  // Ensure selected city is valid within currently allowed villa locations
  useEffect(() => {
    if (allowedVillaLocations.length > 0 && !allowedVillaLocations.includes(formData.city)) {
      setFormData((prev) => ({ ...prev, city: allowedVillaLocations[0] }));
    }
  }, [allowedVillaLocations, formData.city]);

  // Handle local file uploads (uploads directly to Supabase Storage bucket 'images')
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorMsg(null);
    setIsUploading(true);

    const fileList = Array.from(files);

    // Load local files directly as preview images (Media is saved to Google Drive)
    for (const file of fileList) {
      if (!file.type.startsWith("image/")) {
        setErrorMsg("Please upload valid image files (JPG, PNG, WebP).");
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg(`Image "${file.name}" exceeds the 10MB size limit.`);
        continue;
      }

      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const result = loadEvt.target?.result as string;
        if (result) {
          setImages((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    }

    setIsUploading(false);
    e.target.value = "";
  };

  // Handle adding direct image URL (supports standard image URLs and Google Drive links)
  const handleAddUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      setErrorMsg("Please enter a valid URL starting with https:// or http://");
      return;
    }

    // Check if user pasted a Google Drive folder link
    const folderId = extractGoogleDriveFolderId(trimmed);
    if (folderId) {
      setShowDrivePicker(true);
      setFormData((prev) => ({ ...prev, driveFolderUrl: trimmed }));
      setImageUrlInput("");
      setErrorMsg(null);
      return;
    }

    // Check if user pasted a Google Drive file link
    const driveFileId = extractGoogleDriveFileId(trimmed);
    if (driveFileId) {
      const cdnUrl = getGoogleDriveImageUrl(driveFileId, 1600);
      setImages((prev) => [...prev, cdnUrl]);
      setImageUrlInput("");
      setErrorMsg(null);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const isEats = category === "EATS";

    if (!formData.accommodationName.trim()) {
      setErrorMsg(
        isEats
          ? "Please enter your restaurant, café, or bar name."
          : "Please enter your property or stay name."
      );
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

    // Date validation
    let finalStartDate = formData.coverageStart;
    let finalEndDate = formData.coverageEnd;

    if (isEats) {
      if (visitScheduleMode === "single") {
        if (!finalStartDate) {
          setErrorMsg("Please specify the single visit date for creator collaboration.");
          return;
        }
        finalEndDate = finalStartDate; // Same-day for single visit
      } else {
        if (!finalStartDate || !finalEndDate) {
          setErrorMsg("Please specify the start and end dates of the available visit window.");
          return;
        }
        if (new Date(finalEndDate) < new Date(finalStartDate)) {
          setErrorMsg("Window end date cannot be earlier than window start date.");
          return;
        }
      }
    } else {
      // Stays
      if (!finalStartDate || !finalEndDate) {
        setErrorMsg("Please specify your stay coverage check-in and check-out window.");
        return;
      }
      if (new Date(finalEndDate) <= new Date(finalStartDate)) {
        setErrorMsg("Stay coverage end date must be after start date.");
        return;
      }
    }

    if (!formData.requirements.trim() || formData.requirements.length < 20) {
      setErrorMsg(
        isEats
          ? "Please specify what you are looking for from creators (e.g. 1 Reel featuring dishes + 3 stories) - at least 20 characters."
          : "Please specify what you are looking for from creators (at least 20 characters)."
      );
      return;
    }
    if (!formData.consentGiven) {
      setErrorMsg("Please confirm host authorization to submit your listing for review.");
      return;
    }

    if (allowedVillaLocations.length === 0) {
      setErrorMsg("Registrations are currently closed across all locations.");
      return;
    }
    if (!allowedVillaLocations.includes(formData.city)) {
      setErrorMsg(`Registration for ${formData.city} is currently closed. Please select an active location.`);
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
      coverage_start: finalStartDate,
      coverage_end: finalEndDate,
      offer_type: formData.offerType,
      minimum_followers: formData.minimumFollowers,
      requirements: formData.requirements,
      image_url: primaryImage,
      images: images.length > 0 ? images : undefined,
      video_url: formData.videoUrl.trim() || undefined,
      drive_folder_url: formData.driveFolderUrl.trim() || undefined,
    });

    if (res.success) {
      setSubmittedCode(res.reference_code);
    } else {
      setErrorMsg(res.message || "Failed to submit listing.");
    }
  };

  if (submittedCode) {
    const coverPhoto = images.length > 0 ? images[0] : null;
    const isEats = category === "EATS";

    return (
      <div className="py-20 bg-white dark:bg-black text-[#1A3739] dark:text-white min-h-screen transition-colors duration-300">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-sand-50 dark:bg-neutral-950 rounded-2xl border border-sand-300 dark:border-neutral-800 p-8 sm:p-12 text-center space-y-6 shadow-warm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-3xl font-bold text-teal-950 dark:text-white">
                {isEats ? "Eats Listing Queued!" : "Stay Listing Queued!"}
              </h1>
              <p className="text-sm text-ink-700 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
                Thank you for listing <strong>{formData.accommodationName}</strong> ({formData.propertyType}).
                Our concierge team will review your venue details, photos, and reach out via WhatsApp.
              </p>
            </div>

            {/* Photo preview on success screen */}
            {coverPhoto && (
              <div className="relative h-48 w-full max-w-md mx-auto rounded-xl overflow-hidden border border-sand-300 dark:border-neutral-800 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverPhoto}
                  alt={formData.accommodationName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-left text-white">
                  <span className="text-[10px] uppercase font-bold text-gold-400 block tracking-wider">
                    {category === "EATS" ? "Eats" : "Stay"} • {formData.propertyType} • {formData.city}
                  </span>
                  <span className="font-serif font-bold text-base block line-clamp-1">
                    {formData.accommodationName}
                  </span>
                </div>
              </div>
            )}

            <div className="p-4 bg-sand-200/60 dark:bg-neutral-900 rounded-xl border border-sand-300 dark:border-neutral-800 max-w-sm mx-auto">
              <span className="text-xs uppercase font-semibold text-ink-600 dark:text-neutral-400 block">
                Your Listing Reference:
              </span>
              <span className="font-mono text-2xl font-bold text-teal-900 dark:text-[#D7400B] tracking-wider">
                {submittedCode}
              </span>
              <p className="text-[11px] text-ink-500 dark:text-neutral-400 mt-1">
                Keep this reference to check your listing and creator matching status.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/status"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-teal-900 hover:bg-teal-800 dark:bg-[#D7400B] dark:hover:bg-[#BD3607] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Track Status
              </Link>
              <Link
                href="/creators"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-sand-200 dark:bg-neutral-800 text-ink-900 dark:text-white text-xs font-semibold uppercase tracking-wider hover:bg-sand-300 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                Browse Creators Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isEats = category === "EATS" || isEatVenue(formData.propertyType);
  const venueTypeOptions = isEats ? EATS_VENUE_TYPES : STAY_VENUE_TYPES;
  const offerTypeOptions = isEats ? EATS_OFFER_TYPES : STAY_OFFER_TYPES;

  return (
    <div className="py-16 bg-white dark:bg-black text-[#1A3739] dark:text-white min-h-screen transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <span className="text-[16px] uppercase font-bold tracking-widest text-[#D7400B] block">
            Stays • Eats • Creators
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-teal-950 dark:text-white tracking-tight leading-tight">
            List Your Sri Lankan Venue
          </h1>
          <p className="text-[19px] sm:text-[22px] lg:text-[24px] text-[#1A3739]/90 dark:text-neutral-200 max-w-xl mx-auto font-normal leading-relaxed pt-1">
            Get matched with verified travel & food creators visiting Sri Lanka.
          </p>

          {/* Dynamic Platform Phase Pricing Banner */}
          <div className="p-3.5 bg-teal-900/10 dark:bg-teal-950/40 border border-teal-900/20 dark:border-teal-800/40 rounded-xl max-w-xl mx-auto flex items-center justify-center gap-2 text-[15px] sm:text-[16px] font-semibold text-teal-950 dark:text-teal-200">
            <Sparkles className="w-4 h-4 text-gold-500 shrink-0" />
            <span>
              {settings.platform_phase === "FREE"
                ? "Listing and creator introductions are currently 100% free."
                : "Fees may apply to confirmed collaborations."}
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="bg-sand-50 dark:bg-neutral-950 rounded-2xl border border-sand-300 dark:border-neutral-800 p-6 sm:p-10 shadow-warm space-y-8"
        >
          {/* Top Category Switch: Stays vs Eats */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-ink-800 dark:text-neutral-300 uppercase tracking-wider">
              Listing Category *
            </label>
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-sand-200/80 dark:bg-neutral-900 rounded-xl border border-sand-300 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => handleCategoryChange("STAYS")}
                className={`py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  category === "STAYS"
                    ? "bg-teal-900 text-sand-50 shadow-sm"
                    : "text-ink-700 dark:text-neutral-400 hover:text-teal-950 dark:hover:text-white"
                }`}
              >
                <Bed className="w-4 h-4" />
                <span>Stays (Hotels & Villas)</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange("EATS")}
                className={`py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  category === "EATS"
                    ? "bg-[#D7400B] text-white shadow-sm"
                    : "text-ink-700 dark:text-neutral-400 hover:text-[#D7400B] dark:hover:text-white"
                }`}
              >
                <Utensils className="w-4 h-4" />
                <span>Eats (Restaurants & Cafés)</span>
              </button>
            </div>
            <p className="text-[11px] text-ink-500 dark:text-neutral-400">
              {isEats
                ? "Eats includes restaurants, cafés, bars, bistros, and beach clubs offering dining experiences."
                : "Stays includes boutique hotels, private villas, resorts, guesthouses, and eco lodges."}
            </p>
          </div>

          {/* Section 1: Venue Details */}
          <div className="border-b border-sand-200 dark:border-neutral-800 pb-4">
            <h2 className="font-serif text-xl font-bold text-teal-950 dark:text-white">
              1. Venue Details
            </h2>
            <p className="text-xs text-ink-600 dark:text-neutral-400 mt-0.5">
              {isEats
                ? "Tell us about your culinary spot, dining concepts, and location in Sri Lanka."
                : "Tell us about your accommodation and property in Sri Lanka."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">
                {isEats ? "Eatery / Venue Name *" : "Property / Stay Name *"}
              </label>
              <input
                type="text"
                required
                placeholder={
                  isEats
                    ? "e.g. Smoke & Bitters, Ministry of Crab, or Barefoot Garden Café"
                    : "e.g. The Dutch Fort Heritage Villa"
                }
                value={formData.accommodationName}
                onChange={(e) => setFormData({ ...formData, accommodationName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-sand-400 dark:border-neutral-700 bg-sand-50 dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900 dark:focus:ring-[#D7400B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">
                Venue Type *
              </label>
              <select
                value={formData.propertyType}
                onChange={(e) => {
                  const newType = e.target.value as PropertyType;
                  const isFood = isEatVenue(newType);
                  setCategory(isFood ? "EATS" : "STAYS");
                  setFormData((prev) => ({
                    ...prev,
                    propertyType: newType,
                    offerType: isFood
                      ? (EATS_OFFER_TYPES.includes(prev.offerType as any) ? prev.offerType : "Dinner for Two")
                      : (STAY_OFFER_TYPES.includes(prev.offerType as any) ? prev.offerType : "Free accommodation + meals"),
                  }));
                }}
                className="w-full px-4 py-3 rounded-lg border border-sand-400 dark:border-neutral-700 bg-sand-50 dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900 dark:focus:ring-[#D7400B]"
              >
                {venueTypeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">
                Primary Contact Person *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rohan De Silva"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-sand-400 dark:border-neutral-700 bg-sand-50 dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900 dark:focus:ring-[#D7400B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">
                WhatsApp Number *
              </label>
              <PhoneInputWithCountry
                value={formData.whatsapp}
                onChange={(val) => setFormData({ ...formData, whatsapp: val })}
                placeholder="e.g. 77 123 4567"
                defaultCountryCode="LK"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-ink-800 dark:text-neutral-300 uppercase tracking-wider">
                  City / Region in Sri Lanka *
                </label>
                <span className="text-[10px] text-teal-900 dark:text-[#D7400B] font-bold px-2 py-0.5 rounded-full bg-teal-100/80 dark:bg-neutral-800 border border-teal-200 dark:border-neutral-700 whitespace-nowrap">
                  {allowedVillaLocations.length}
                </span>
              </div>

              {allowedVillaLocations.length === 0 ? (
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-lg text-amber-900 dark:text-amber-200 text-xs font-medium">
                  Registrations are temporarily closed across all locations.
                </div>
              ) : (
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-sand-400 dark:border-neutral-700 bg-sand-50 dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900 dark:focus:ring-[#D7400B]"
                >
                  {allowedVillaLocations.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Section 2: Photos & Visuals */}
          <div className="border-t border-sand-200 dark:border-neutral-800 pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-teal-800 dark:text-[#D7400B]" />
                <h2 className="font-serif text-xl font-bold text-teal-950 dark:text-white">
                  2. {isEats ? "Dining & Venue Photos" : "Property Photos & Visuals"}
                </h2>
              </div>
              <span className="text-xs text-gold-700 dark:text-gold-400 font-semibold bg-gold-50 dark:bg-neutral-900 border border-gold-200 dark:border-neutral-800 px-2.5 py-0.5 rounded-full">
                {images.length} {images.length === 1 ? "photo" : "photos"} added
              </span>
            </div>
            <p className="text-xs text-ink-600 dark:text-neutral-400">
              {isEats
                ? "Upload high-quality imagery of your signature dishes, drinks, dining spaces, or outdoor patio."
                : "Upload photos of your rooms, pool, dining, or property views. High-quality imagery attracts more creators!"}
            </p>

            {/* Google Drive Primary Notice Banner */}
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-200">
                <Folder className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
                <span>
                  <strong>Google Drive Cloud Powered:</strong> High-resolution photos & video reels are stored and streamed via Google Drive for maximum quality and zero buffering.
                </span>
              </div>
              <a
                href={GETLINKED_DRIVE_FOLDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 font-bold text-amber-800 dark:text-gold-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Open Drive Folder</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Upload Controls Grid (Google Drive, Web Link, or Device) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Option A: Google Drive Media Cloud (Primary) */}
              <div className="p-5 rounded-xl border-2 border-amber-400 dark:border-amber-700 bg-amber-50/80 dark:bg-amber-950/30 flex flex-col justify-between space-y-3 shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 dark:text-amber-200">
                      <Folder className="w-4 h-4 text-amber-700 dark:text-gold-400" />
                      <span>Google Drive Cloud</span>
                    </div>
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-600 text-white">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300">
                    Connect directly to GetLinked_Media or your Drive folder.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowDrivePicker(!showDrivePicker)}
                    className="w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 dark:bg-gold-500 dark:hover:bg-gold-600 text-white dark:text-ink-950 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Folder className="w-3.5 h-3.5" />
                    <span>{showDrivePicker ? "Hide Drive Library" : "Browse Drive Library"}</span>
                  </button>
                  <a
                    href={GETLINKED_DRIVE_FOLDER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-center text-amber-900 dark:text-gold-400 hover:underline inline-flex items-center justify-center gap-1 font-semibold"
                  >
                    <span>Upload to Drive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Option B: Direct Image URL / Drive Link */}
              <div className="p-5 rounded-xl border border-sand-300 dark:border-neutral-800 bg-sand-100/50 dark:bg-neutral-900 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-teal-950 dark:text-white">
                    <LinkIcon className="w-3.5 h-3.5 text-teal-800 dark:text-[#D7400B]" />
                    <span>Paste Drive or Web Link</span>
                  </div>
                  <p className="text-[11px] text-ink-500 dark:text-neutral-400">
                    Paste any Google Drive share link or image URL.
                  </p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://drive.google.com/... or image link"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddUrl();
                      }
                    }}
                    className="flex-grow px-3 py-2 rounded-lg border border-sand-400 dark:border-neutral-700 bg-white dark:bg-black text-xs focus:outline-none focus:ring-2 focus:ring-teal-900 dark:focus:ring-[#D7400B]"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrl}
                    className="px-3 py-2 rounded-lg bg-teal-900 hover:bg-teal-800 dark:bg-[#D7400B] dark:hover:bg-[#BD3607] text-white text-xs font-semibold shrink-0 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Option C: Upload Files from Device (Local Preview) */}
              <label className="p-5 rounded-xl border-2 border-dashed border-sand-400 dark:border-neutral-700 hover:border-teal-700 dark:hover:border-[#D7400B] bg-sand-100/70 dark:bg-neutral-900 hover:bg-sand-100 transition-colors flex flex-col items-center justify-center text-center cursor-pointer group">
                <UploadCloud className="w-8 h-8 text-teal-900 dark:text-[#D7400B] group-hover:scale-110 transition-transform mb-2" />
                <span className="text-xs font-bold text-teal-950 dark:text-white block">
                  {isUploading ? "Processing Photos..." : "Upload from Device"}
                </span>
                <span className="text-[11px] text-ink-500 dark:text-neutral-400 mt-1 block">
                  PNG, JPG, or WebP up to 10MB each
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Live Google Drive Cloud Picker */}
            {showDrivePicker && (
              <div className="pt-2">
                <GoogleDriveFolderPicker
                  selectedUrls={images}
                  onSelectImage={(url) => {
                    if (!images.includes(url)) setImages((prev) => [...prev, url]);
                  }}
                  onSelectVideo={(videoUrl) => {
                    setFormData((prev) => ({ ...prev, videoUrl }));
                  }}
                  onImportAll={(urls) => {
                    setImages((prev) => Array.from(new Set([...prev, ...urls])));
                  }}
                  onClose={() => setShowDrivePicker(false)}
                />
              </div>
            )}


            {/* Gallery Preview Grid */}
            {images.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs text-ink-600 dark:text-neutral-400">
                  <span className="font-semibold">Selected Photos ({images.length}):</span>
                  <span className="text-[11px] text-ink-500 dark:text-neutral-500">
                    ★ First photo is your <strong>Cover Photo</strong> (click another to set as cover)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {images.map((imgUrl, index) => {
                    const isCover = index === 0;

                    return (
                      <div
                        key={index}
                        className={`relative group rounded-xl overflow-hidden border-2 bg-sand-200 dark:bg-neutral-900 aspect-video sm:aspect-square ${
                          isCover ? "border-gold-500 ring-2 ring-gold-400/40" : "border-sand-300 dark:border-neutral-800"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgUrl}
                          alt={`Venue photo ${index + 1}`}
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
                              className="text-[10px] bg-black/60 hover:bg-teal-900 text-white px-1.5 py-0.5 rounded backdrop-blur-xs transition-colors cursor-pointer"
                            >
                              Set as Cover
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="p-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-sm cursor-pointer"
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

            {/* Video Tour / Reel Link (Google Drive / MP4) */}
            <div className="pt-4 border-t border-sand-200 dark:border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-teal-950 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <VideoIcon className="w-4 h-4 text-[#D7400B]" />
                  <span>Video Tour or Reel Link (Optional - Google Drive or MP4)</span>
                </label>
                <span className="text-[11px] text-ink-500 dark:text-neutral-400">
                  Google Drive video links stream automatically
                </span>
              </div>
              <input
                type="url"
                placeholder="https://drive.google.com/file/d/.../view or direct video link"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand-400 dark:border-neutral-700 bg-white dark:bg-black text-xs text-teal-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-900 dark:focus:ring-[#D7400B]"
              />

              {formData.videoUrl && (
                <div className="pt-2 max-w-lg">
                  <span className="text-[11px] font-semibold text-teal-900 dark:text-gold-400 block mb-1.5">
                    Live Video Streaming Preview:
                  </span>
                  <GoogleDrivePlayer
                    url={formData.videoUrl}
                    title={`${formData.accommodationName || "Venue"} Video Reel`}
                    aspectRatio="16/9"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Collaboration Parameters */}
          <div className="border-t border-sand-200 dark:border-neutral-800 pt-6 space-y-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-teal-950 dark:text-white">
                3. Collaboration Terms
              </h2>
              <p className="text-xs text-ink-600 dark:text-neutral-400 mt-0.5">
                {isEats
                  ? "Define your dining offer and single-visit dates or booking window."
                  : "Define your stay availability window and what you can offer."}
              </p>
            </div>

            {/* Date Configuration: Single Visit vs Window for Eats, or Multi-Day for Stays */}
            {isEats ? (
              <div className="p-4 rounded-xl bg-sand-200/50 dark:bg-neutral-900 border border-sand-300 dark:border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-ink-800 dark:text-neutral-300 uppercase tracking-wider">
                    Visit Scheduling Mode *
                  </label>
                  <div className="inline-flex rounded-lg border border-sand-300 dark:border-neutral-700 p-0.5 bg-white dark:bg-black text-[11px]">
                    <button
                      type="button"
                      onClick={() => setVisitScheduleMode("single")}
                      className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                        visitScheduleMode === "single"
                          ? "bg-[#D7400B] text-white shadow-xs"
                          : "text-ink-600 dark:text-neutral-400 hover:text-ink-900"
                      }`}
                    >
                      Single Visit Date
                    </button>
                    <button
                      type="button"
                      onClick={() => setVisitScheduleMode("window")}
                      className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                        visitScheduleMode === "window"
                          ? "bg-[#D7400B] text-white shadow-xs"
                          : "text-ink-600 dark:text-neutral-400 hover:text-ink-900"
                      }`}
                    >
                      Available Window
                    </button>
                  </div>
                </div>

                {visitScheduleMode === "single" ? (
                  <div>
                    <label className="block text-xs font-semibold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">
                      Target Visit Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.coverageStart}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({
                          ...formData,
                          coverageStart: val,
                          coverageEnd: val,
                        });
                      }}
                      className="w-full px-4 py-3 rounded-lg border border-sand-400 dark:border-neutral-700 bg-white dark:bg-black text-sm focus:outline-none focus:ring-2 focus:ring-[#D7400B]"
                    />
                    <p className="text-[11px] text-ink-500 dark:text-neutral-400 mt-1">
                      The single lunch or dinner visit date for creator reservation and content creation.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">
                        Window Open From *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.coverageStart}
                        onChange={(e) => setFormData({ ...formData, coverageStart: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-sand-400 dark:border-neutral-700 bg-white dark:bg-black text-sm focus:outline-none focus:ring-2 focus:ring-[#D7400B]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">
                        Window Open Until *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.coverageEnd}
                        onChange={(e) => setFormData({ ...formData, coverageEnd: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-sand-400 dark:border-neutral-700 bg-white dark:bg-black text-sm focus:outline-none focus:ring-2 focus:ring-[#D7400B]"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">
                    Stay Check-In / Window Start *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.coverageStart}
                    onChange={(e) => setFormData({ ...formData, coverageStart: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-sand-400 dark:border-neutral-700 bg-sand-50 dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">
                    Stay Check-Out / Window End *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.coverageEnd}
                    onChange={(e) => setFormData({ ...formData, coverageEnd: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-sand-400 dark:border-neutral-700 bg-sand-50 dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">
                  What are you offering? *
                </label>
                <select
                  value={formData.offerType}
                  onChange={(e) =>
                    setFormData({ ...formData, offerType: e.target.value as OfferType })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-sand-400 dark:border-neutral-700 bg-sand-50 dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900 dark:focus:ring-[#D7400B]"
                >
                  {offerTypeOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">
                  Minimum Follower Count Wanted *
                </label>
                <select
                  value={formData.minimumFollowers}
                  onChange={(e) => setFormData({ ...formData, minimumFollowers: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg border border-sand-400 dark:border-neutral-700 bg-sand-50 dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900 dark:focus:ring-[#D7400B]"
                >
                  <option value={5000}>5,000+ Followers (Micro)</option>
                  <option value={20000}>20,000+ Followers</option>
                  <option value={50000}>50,000+ Followers (Mid-tier)</option>
                  <option value={100000}>100,000+ Followers (Macro)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">
                What are you looking for from the creator? *
              </label>
              <textarea
                rows={4}
                required
                placeholder={
                  isEats
                    ? "e.g. 1 High quality Instagram Reel featuring our signature seafood tasting menu & craft cocktails, 3 stories with location tag, and rights to use photos on our social channels..."
                    : "e.g. 1 High quality Instagram Reel showcasing our colonial plunge pool, 3 stories with location tag, and rights to use photos on our booking website..."
                }
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-sand-400 dark:border-neutral-700 bg-sand-50 dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900 dark:focus:ring-[#D7400B]"
              />
            </div>
          </div>

          {/* Host Consent */}
          <div className="p-4 rounded-xl bg-sand-200/50 dark:bg-neutral-900 border border-sand-300 dark:border-neutral-800 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={formData.consentGiven}
                onChange={(e) => setFormData({ ...formData, consentGiven: e.target.checked })}
                className="w-5 h-5 rounded border-sand-400 text-teal-900 focus:ring-teal-900 dark:focus:ring-[#D7400B] mt-0.5 shrink-0"
              />
              <span className="text-xs text-ink-800 dark:text-neutral-300 leading-relaxed">
                I confirm that I am authorized to represent this venue and agree to Get Linked verifying our listing details and imagery. I understand Get Linked will curate and personally facilitate all creator introductions.
              </span>
            </label>
          </div>

          {/* Submit Action */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-teal-900 hover:bg-teal-800 dark:bg-[#D7400B] dark:hover:bg-[#BD3607] text-white text-xs font-semibold uppercase tracking-wider shadow-warm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-gold-400" />
              <span>{isEats ? "Submit Eats Listing" : "Submit Stay Listing"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ListPropertyPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center">Loading listing form...</div>}>
      <ListPropertyContent />
    </Suspense>
  );
}
