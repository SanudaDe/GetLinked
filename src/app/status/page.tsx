"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useStore } from "@/data/store";
import { Badge } from "@/components/ui/Badge";
import {
  Search,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Camera,
  Loader2,
  ExternalLink,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Building2,
  Utensils,
  LogOut,
  ArrowRight,
  Check,
} from "lucide-react";
import { formatStorageUrl, formatFollowerCount, formatDateRange, isEatVenue } from "@/utils/formatters";
import { supabaseService } from "@/services/supabaseService";

export default function StatusLookupPage() {
  const {
    lookupStatus,
    authUser,
    signOutUser,
    applications,
    accommodations,
    profiles,
    updateUserProfilePhoto,
  } = useStore();

  const [whatsapp, setWhatsapp] = useState("");
  const [refCode, setRefCode] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoUpdateMsg, setPhotoUpdateMsg] = useState<string | null>(null);
  const [photoUpdateError, setPhotoUpdateError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [savedRefCode, setSavedRefCode] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("getlinked_my_active_ref") || null;
    }
    return null;
  });

  const [result, setResult] = useState<{
    found: boolean;
    type?: "CREATOR" | "ACCOMMODATION";
    name?: string;
    status?: "PENDING" | "APPROVED" | "REJECTED";
    submittedAt?: string;
  } | null>(null);

  // 1. Find matching Creator Application
  const creatorApp = useMemo(() => {
    if (!authUser && !savedRefCode) return null;
    if (savedRefCode) {
      const match = applications.find(
        (a) => a.reference_code.toUpperCase() === savedRefCode.toUpperCase()
      );
      if (match) return match;
    }
    if (authUser) {
      const nameMatch = applications.find(
        (a) => a.full_name.toLowerCase().trim() === authUser.name.toLowerCase().trim()
      );
      if (nameMatch) return nameMatch;
    }
    return null;
  }, [authUser, applications, savedRefCode]);

  // 2. Find matching Accommodation Application (Stays or Eats)
  const accApp = useMemo(() => {
    if (!authUser && !savedRefCode) return null;
    if (savedRefCode) {
      const match = accommodations.find(
        (a) => a.reference_code.toUpperCase() === savedRefCode.toUpperCase()
      );
      if (match) return match;
    }
    if (authUser && authUser.email) {
      const emailMatch = accommodations.find(
        (a) => a.email && a.email.toLowerCase().trim() === authUser.email.toLowerCase().trim()
      );
      if (emailMatch) return emailMatch;
    }
    return null;
  }, [authUser, accommodations, savedRefCode]);

  // 3. Corresponding Public Creator Profile (if approved)
  const creatorProfile = useMemo(() => {
    if (!creatorApp) return null;
    return profiles.find(
      (p) =>
        p.application_id === creatorApp.id ||
        p.display_name.toLowerCase().trim() === creatorApp.full_name.toLowerCase().trim()
    );
  }, [creatorApp, profiles]);

  // Handle uploading and changing profile photo via Google Drive
  const handleProfilePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoUpdateError("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setPhotoUpdateError("Profile image must be under 10MB.");
      return;
    }

    setIsUploadingPhoto(true);
    setPhotoUpdateMsg(null);
    setPhotoUpdateError(null);

    try {
      const res = await supabaseService.uploadAvatar(file, authUser?.name || "user");
      if (res.error || !res.url) {
        throw new Error(res.error || "Failed to upload photo to Google Drive.");
      }

      await updateUserProfilePhoto(res.url);
      setPhotoUpdateMsg("Profile photo updated & saved to Google Drive!");
      setTimeout(() => setPhotoUpdateMsg(null), 5000);
    } catch (err: any) {
      setPhotoUpdateError(err.message || "Failed to change profile photo.");
      setTimeout(() => setPhotoUpdateError(null), 5000);
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = "";
    }
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsapp.trim() || !refCode.trim()) return;

    const res = lookupStatus(whatsapp, refCode);
    setResult(res);
    setHasSearched(true);

    if (res.found) {
      const upper = refCode.trim().toUpperCase();
      setSavedRefCode(upper);
      if (typeof window !== "undefined") {
        localStorage.setItem("getlinked_my_active_ref", upper);
      }
    }
  };

  return (
    <div className="py-16 bg-white dark:bg-black text-[#1A3739] dark:text-white min-h-screen transition-colors duration-300">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-900/10 dark:bg-teal-950/40 text-teal-900 dark:text-teal-300 text-xs font-semibold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-gold-500" />
            Application Tracker & Profile
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-teal-950 dark:text-white">
            My Account & Status
          </h1>
          <p className="text-xs sm:text-sm text-ink-700 dark:text-neutral-400 leading-relaxed">
            Manage your GetLinked profile, update your profile picture, and view live verification status.
          </p>
        </div>

        {/* ============================================================== */}
        {/* LOGGED-IN USER PROFILE & APPLICATION CARD                     */}
        {/* ============================================================== */}
        {authUser && (
          <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 sm:p-7 mb-8 shadow-sm space-y-5 animate-in fade-in">
            {/* Top row: Avatar + Name + Change Photo trigger */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-neutral-800 pb-5">
              <div className="flex items-center gap-4 text-left">
                {/* Interactive Avatar with Google Drive Upload Trigger */}
                <div className="relative group shrink-0">
                  {authUser.avatar_url ? (
                    <img
                      src={formatStorageUrl(authUser.avatar_url)}
                      alt={authUser.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-teal-900 dark:border-teal-600 shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-teal-900 text-white flex items-center justify-center font-serif font-bold text-2xl shadow-sm">
                      {authUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Hover / tap overlay to change photo */}
                  <label
                    className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white text-[10px] font-bold"
                    title="Click to change profile picture"
                  >
                    {isUploadingPhoto ? (
                      <Loader2 className="w-5 h-5 animate-spin text-gold-400" />
                    ) : (
                      <>
                        <Camera className="w-4 h-4 text-gold-400 mb-0.5" />
                        <span>Change</span>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={isUploadingPhoto}
                      onChange={handleProfilePhotoChange}
                      className="hidden"
                    />
                  </label>

                  {/* Corner camera badge icon */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-teal-900 hover:bg-teal-800 text-gold-400 flex items-center justify-center shadow-md border-2 border-white dark:border-neutral-900 cursor-pointer transition-transform hover:scale-110"
                    title="Upload new profile picture"
                  >
                    {isUploadingPhoto ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Camera className="w-3 h-3" />
                    )}
                  </button>
                </div>

                {/* Identity info */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {creatorApp?.status === "APPROVED" ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>Verified Creator</span>
                      </span>
                    ) : accApp?.status === "APPROVED" ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>Verified {isEatVenue(accApp.property_type) ? "Eats" : "Stay"} Partner</span>
                      </span>
                    ) : creatorApp?.status === "PENDING" || accApp?.status === "PENDING" ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        <span>Under Verification</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sand-200 dark:bg-neutral-800 text-ink-700 dark:text-neutral-300">
                        Authenticated
                      </span>
                    )}

                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  </div>

                  <h3 className="font-serif text-xl font-bold text-teal-950 dark:text-white mt-1 truncate">
                    {authUser.name}
                  </h3>
                  <p className="text-xs text-ink-600 dark:text-neutral-400 font-mono truncate">
                    {authUser.email}
                  </p>
                </div>
              </div>

              {/* Top right quick actions */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 hover:bg-sand-100 dark:hover:bg-neutral-900 text-teal-950 dark:text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-gold-500" />
                  <span>{isUploadingPhoto ? "Saving..." : "Change Photo"}</span>
                </button>
                <button
                  onClick={signOutUser}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/70 text-rose-700 dark:text-rose-400 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out</span>
                </button>
              </div>
            </div>

            {/* Live photo update feedback alert */}
            {photoUpdateMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{photoUpdateMsg}</span>
              </div>
            )}
            {photoUpdateError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>{photoUpdateError}</span>
              </div>
            )}

            {/* ============================================================== */}
            {/* SUB-SECTION A: APPROVED CREATOR PROFILE VIEW                   */}
            {/* ============================================================== */}
            {creatorApp && creatorApp.status === "APPROVED" && (
              <div className="p-4 sm:p-5 rounded-xl bg-sand-50 dark:bg-neutral-900/70 border border-sand-300 dark:border-neutral-800 space-y-4">
                <div className="flex items-center justify-between border-b border-sand-200 dark:border-neutral-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold-500" />
                    <span className="font-serif text-sm font-bold text-teal-950 dark:text-white">
                      Creator Profile Details
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-teal-900 dark:text-teal-400 bg-teal-100 dark:bg-teal-950/80 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                    {creatorApp.reference_code}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-950 border border-sand-200 dark:border-neutral-800">
                    <span className="text-ink-500 dark:text-neutral-400 text-[10px] uppercase font-bold block">
                      Content Niche
                    </span>
                    <strong className="text-teal-950 dark:text-white mt-0.5 block">
                      {creatorApp.niche}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-950 border border-sand-200 dark:border-neutral-800">
                    <span className="text-ink-500 dark:text-neutral-400 text-[10px] uppercase font-bold block">
                      Destination City
                    </span>
                    <strong className="text-teal-950 dark:text-white mt-0.5 block flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-teal-700" />
                      {creatorApp.city}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-950 border border-sand-200 dark:border-neutral-800">
                    <span className="text-ink-500 dark:text-neutral-400 text-[10px] uppercase font-bold block">
                      Follower Reach
                    </span>
                    <strong className="text-teal-950 dark:text-white mt-0.5 block font-mono">
                      {formatFollowerCount(creatorApp.follower_count)}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-950 border border-sand-200 dark:border-neutral-800">
                    <span className="text-ink-500 dark:text-neutral-400 text-[10px] uppercase font-bold block">
                      Travel Dates
                    </span>
                    <strong className="text-teal-950 dark:text-white mt-0.5 block text-[11px]">
                      {formatDateRange(creatorApp.visit_start, creatorApp.visit_end)}
                    </strong>
                  </div>
                </div>

                {creatorApp.trip_brief && (
                  <div className="p-3 rounded-lg bg-white dark:bg-neutral-950 border border-sand-200 dark:border-neutral-800 text-xs text-ink-700 dark:text-neutral-300">
                    <span className="font-bold text-teal-950 dark:text-white block mb-0.5">
                      Your Collaboration Pitch:
                    </span>
                    <p className="line-clamp-2 leading-relaxed">{creatorApp.trip_brief}</p>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <span className="text-xs text-emerald-800 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Active in Public Directory</span>
                  </span>

                  <div className="flex items-center gap-2">
                    {creatorProfile && (
                      <Link
                        href={`/creators/${creatorProfile.id}`}
                        className="px-3.5 py-2 rounded-xl bg-teal-900 hover:bg-teal-800 text-sand-50 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
                        <span>View Directory Profile</span>
                      </Link>
                    )}
                    <Link
                      href="/creators"
                      className="px-3.5 py-2 rounded-xl bg-[#D7400B] hover:bg-[#bd3607] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <span>Explore Stays & Eats</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SUB-SECTION B: APPROVED STAY OR EATS PROPERTY VIEW             */}
            {/* ============================================================== */}
            {accApp && accApp.status === "APPROVED" && (
              <div className="p-4 sm:p-5 rounded-xl bg-sand-50 dark:bg-neutral-900/70 border border-sand-300 dark:border-neutral-800 space-y-4">
                <div className="flex items-center justify-between border-b border-sand-200 dark:border-neutral-800 pb-3">
                  <div className="flex items-center gap-2">
                    {isEatVenue(accApp.property_type) ? (
                      <Utensils className="w-4 h-4 text-gold-600" />
                    ) : (
                      <Building2 className="w-4 h-4 text-teal-800" />
                    )}
                    <span className="font-serif text-sm font-bold text-teal-950 dark:text-white">
                      {accApp.accommodation_name}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-teal-900 dark:text-teal-400 bg-teal-100 dark:bg-teal-950/80 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                    {accApp.reference_code}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-950 border border-sand-200 dark:border-neutral-800">
                    <span className="text-ink-500 dark:text-neutral-400 text-[10px] uppercase font-bold block">
                      Venue Type
                    </span>
                    <strong className="text-teal-950 dark:text-white mt-0.5 block">
                      {accApp.property_type}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-950 border border-sand-200 dark:border-neutral-800">
                    <span className="text-ink-500 dark:text-neutral-400 text-[10px] uppercase font-bold block">
                      Location
                    </span>
                    <strong className="text-teal-950 dark:text-white mt-0.5 block flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-teal-700" />
                      {accApp.city}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-950 border border-sand-200 dark:border-neutral-800 col-span-2">
                    <span className="text-ink-500 dark:text-neutral-400 text-[10px] uppercase font-bold block">
                      Collaboration Offer
                    </span>
                    <strong className="text-teal-950 dark:text-white mt-0.5 block truncate">
                      {accApp.offer_type}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-emerald-800 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Verified Accommodation Partner</span>
                  </span>

                  <Link
                    href="/creators"
                    className="px-4 py-2 rounded-xl bg-[#D7400B] hover:bg-[#bd3607] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>Browse Creators</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SUB-SECTION C: APPLICATION PENDING VERIFICATION               */}
            {/* ============================================================== */}
            {(creatorApp?.status === "PENDING" || accApp?.status === "PENDING") && (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-950 dark:text-amber-100">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Application Under Verification</span>
                  <span className="font-mono text-xs bg-amber-200/80 dark:bg-amber-900/60 text-amber-950 dark:text-amber-200 px-2 py-0.5 rounded ml-auto">
                    {creatorApp?.reference_code || accApp?.reference_code}
                  </span>
                </div>
                <p className="leading-relaxed text-amber-900/90 dark:text-amber-200/90">
                  Your application details and identity documents are safely received and currently queued for human verification. A GetLinked concierge will notify you on WhatsApp once approved!
                </p>
              </div>
            )}

            {/* ============================================================== */}
            {/* SUB-SECTION D: USER NOT APPLIED YET                           */}
            {/* ============================================================== */}
            {!creatorApp && !accApp && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-sand-50 dark:bg-neutral-900 border border-sand-300 dark:border-neutral-800">
                <p className="text-xs text-ink-600 dark:text-neutral-400">
                  You are signed in! Choose how you would like to join the GetLinked network:
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/apply"
                    className="px-3.5 py-2 rounded-xl bg-[#1A3739] dark:bg-neutral-800 hover:bg-[#132A2B] dark:hover:bg-neutral-700 text-white text-xs font-semibold transition-colors"
                  >
                    Apply as Creator
                  </Link>
                  <Link
                    href="/list-property"
                    className="px-3.5 py-2 rounded-xl bg-[#D7400B] hover:bg-[#bd3607] text-white text-xs font-semibold transition-colors"
                  >
                    List Property
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* MANUAL APPLICATION TRACKER LOOKUP FORM                         */}
        {/* ============================================================== */}
        <form
          onSubmit={handleLookup}
          className="bg-sand-50 dark:bg-neutral-950 rounded-2xl border border-sand-300 dark:border-neutral-800 p-6 sm:p-8 shadow-warm space-y-5"
        >
          <div className="border-b border-sand-200 dark:border-neutral-800 pb-3">
            <h3 className="font-serif text-lg font-bold text-teal-950 dark:text-white">
              Lookup by WhatsApp & Code
            </h3>
            <p className="text-xs text-ink-600 dark:text-neutral-400 mt-0.5">
              Enter your WhatsApp number and reference code to verify status and link to this device.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">
              Your WhatsApp Number *
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. +94 77 123 4567 or international format"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-sand-400 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-teal-950 dark:text-white placeholder:text-ink-400 dark:placeholder:text-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900 dark:focus:ring-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">
              Secure Reference Code *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. GL-C-XXXX or GL-A-XXXX"
              value={refCode}
              onChange={(e) => setRefCode(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-sand-400 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-teal-950 dark:text-white placeholder:text-ink-400 dark:placeholder:text-neutral-500 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-900 dark:focus:ring-white uppercase"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-lg bg-teal-900 hover:bg-teal-800 dark:bg-[#D7400B] dark:hover:bg-[#BD3607] text-white text-xs font-semibold uppercase tracking-wider shadow-warm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4 text-gold-400" />
            <span>Lookup Status</span>
          </button>
        </form>

        {/* Result Container for manual search */}
        {hasSearched && (
          <div className="mt-8 animate-in fade-in">
            {result?.found ? (
              <div className="bg-sand-50 dark:bg-neutral-950 rounded-2xl border border-sand-300 dark:border-neutral-800 p-6 shadow-warm space-y-4">
                <div className="flex items-center justify-between border-b border-sand-200 dark:border-neutral-800 pb-3">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-ink-500 dark:text-neutral-400 block">
                      {result.type === "CREATOR" ? "Creator Application" : "Stay Listing"}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-teal-950 dark:text-white">
                      {result.name}
                    </h3>
                  </div>
                  <div>
                    {result.status === "PENDING" && (
                      <Badge variant="pending" size="md">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Under Verification</span>
                      </Badge>
                    )}
                    {result.status === "APPROVED" && (
                      <Badge variant="approved" size="md">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified & Approved</span>
                      </Badge>
                    )}
                    {result.status === "REJECTED" && (
                      <Badge variant="rejected" size="md">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Not Accepted</span>
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-xs text-ink-700 dark:text-neutral-300 space-y-2 leading-relaxed">
                  {result.status === "PENDING" && (
                    <p>
                      Your submission is currently in the manual review queue. A Get Linked concierge is reviewing your credentials. You will receive an introduction notification via WhatsApp upon completion.
                    </p>
                  )}
                  {result.status === "APPROVED" && (
                    <p className="text-emerald-900 dark:text-emerald-400 font-medium">
                      Congratulations! Your profile has been verified and is active for collaboration matching across Sri Lanka.
                    </p>
                  )}
                  {result.status === "REJECTED" && (
                    <p className="text-ink-600 dark:text-neutral-400">
                      Thank you for your interest. Regrettably, this application did not meet our verification or audience criteria at this time.
                    </p>
                  )}
                </div>

                {result.submittedAt && (
                  <div className="text-[11px] text-ink-400 dark:text-neutral-500 border-t border-sand-200 dark:border-neutral-800 pt-2">
                    Submitted on: {new Date(result.submittedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-sand-50 dark:bg-neutral-950 rounded-2xl border border-sand-300 dark:border-neutral-800 p-6 text-center shadow-warm space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-teal-950 dark:text-white">
                  No Record Found
                </h4>
                <p className="text-xs text-ink-600 dark:text-neutral-400 max-w-sm mx-auto">
                  We could not find an application matching that WhatsApp number and reference code. Please verify the spelling and try again.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
