"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/data/store";
import { SRI_LANKA_CITIES, CREATOR_NICHES, DEFAULT_ALLOWED_LOCATIONS } from "@/utils/formatters";
import { DocumentType, NicheType } from "@/types";
import {
  User,
  Share2,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  Lock,
  AlertCircle,
  FileCheck,
  Camera,
  UploadCloud,
  X,
  Loader2,
  Sparkles,
  Instagram,
  Facebook,
} from "lucide-react";
import { supabaseService } from "@/services/supabaseService";
import { extractGoogleDriveFileId, getGoogleDriveImageUrl } from "@/utils/googleDrive";
import { PhoneInputWithCountry } from "@/components/ui/PhoneInputWithCountry";

function TikTokIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.86-4.49v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.86-.09z" />
    </svg>
  );
}

function normalizeSocialLink(raw: string, platform: "instagram" | "tiktok" | "facebook"): string {
  const val = raw.trim();
  if (!val) return "";
  if (val.startsWith("http://") || val.startsWith("https://")) return val;
  const cleanHandle = val.replace(/^@/, "");
  if (platform === "instagram") return `https://instagram.com/${cleanHandle}`;
  if (platform === "tiktok") return `https://tiktok.com/@${cleanHandle}`;
  if (platform === "facebook") return `https://facebook.com/${cleanHandle}`;
  return val;
}

export default function ApplyPage() {
  const { submitCreatorApplication, authUser, settings, applications } = useStore();
  const allowedCreatorLocations = settings.allowed_creator_locations ?? DEFAULT_ALLOWED_LOCATIONS;

  const existingApprovedApp = React.useMemo(() => {
    if (!authUser) return null;
    return applications.find(
      (a) =>
        a.full_name.toLowerCase().trim() === authUser.name.toLowerCase().trim() &&
        a.status === "APPROVED"
    );
  }, [authUser, applications]);

  const [step, setStep] = useState<number>(1);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [driveAvatarInput, setDriveAvatarInput] = useState("");
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: About You
    fullName: "",
    age: 24,
    whatsapp: "",
    country: "United Kingdom",
    // Step 2: Social
    instagramUrl: "",
    tiktokUrl: "",
    facebookUrl: "",
    socialUrl: "",
    avatarUrl: "",
    followerCount: 15000,
    niche: "Travel" as NicheType,
    // Step 3: Travel
    city: "Galle",
    visitStart: "",
    visitEnd: "",
    tripBrief: "",
    // Step 4: Verification
    documentType: "PASSPORT" as DocumentType,
    documentReference: "",
    documentFileName: "",
    documentSize: "",
    documentUrl: "",
    // Step 5: Consent
    consentGiven: false,
  });

  // Automatically pre-fill name and avatar from authenticated Google / Supabase user
  useEffect(() => {
    if (authUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || authUser.name || "",
        avatarUrl: prev.avatarUrl || authUser.avatar_url || "",
      }));
    }
  }, [authUser]);

  // Ensure selected city is valid within currently allowed creator locations
  useEffect(() => {
    if (allowedCreatorLocations.length > 0 && !allowedCreatorLocations.includes(formData.city)) {
      setFormData((prev) => ({ ...prev, city: allowedCreatorLocations[0] }));
    }
  }, [allowedCreatorLocations, formData.city]);

  // Step validation
  const validateStep = (currentStep: number): boolean => {
    setErrorMsg(null);

    if (currentStep === 1) {
      if (!formData.fullName.trim()) {
        setErrorMsg("Please enter your full legal name.");
        return false;
      }
      if (formData.age < 18) {
        setErrorMsg("You must be at least 18 years old to join Get Linked.");
        return false;
      }
      if (!formData.whatsapp.trim()) {
        setErrorMsg("Please enter a valid WhatsApp number for verification.");
        return false;
      }
      if (!formData.country.trim()) {
        setErrorMsg("Please provide your country of residence.");
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      const ig = formData.instagramUrl.trim();
      const tt = formData.tiktokUrl.trim();
      const fb = formData.facebookUrl.trim();

      if (!ig && !tt && !fb) {
        setErrorMsg("Please add at least one social media profile (Instagram, TikTok, or Facebook) to proceed.");
        return false;
      }
      if (formData.followerCount < 5000) {
        setErrorMsg("A minimum of 5,000 verified followers is required to join Get Linked.");
        return false;
      }
      return true;
    }

    if (currentStep === 3) {
      if (allowedCreatorLocations.length === 0) {
        setErrorMsg("Creator registration is currently paused across all destinations. Please check back later.");
        return false;
      }
      if (!formData.city || !allowedCreatorLocations.includes(formData.city)) {
        setErrorMsg("Please select an active Sri Lankan destination currently accepting creators.");
        return false;
      }
      if (!formData.visitStart || !formData.visitEnd) {
        setErrorMsg("Please select both your travel start and departure dates.");
        return false;
      }
      if (new Date(formData.visitEnd) <= new Date(formData.visitStart)) {
        setErrorMsg("Departure date must be after your arrival date.");
        return false;
      }
      if (!formData.tripBrief.trim() || formData.tripBrief.length < 20) {
        setErrorMsg("Please provide a brief description of your planned trip content (at least 20 characters).");
        return false;
      }
      return true;
    }

    if (currentStep === 4) {
      if (!formData.documentReference.trim()) {
        setErrorMsg("Please enter your passport or national ID number.");
        return false;
      }
      if (!formData.documentFileName) {
        setErrorMsg("Please upload a scan or photo of your government ID/passport.");
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload a valid image file (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Profile photo must be under 10MB.");
      return;
    }

    setIsUploadingAvatar(true);
    setErrorMsg(null);

    try {
      const res = await supabaseService.uploadAvatar(file, formData.fullName || "creator");
      if (res.error || !res.url) {
        setErrorMsg(res.error || "Failed to upload profile photo to Google Drive.");
      } else {
        setFormData((prev) => ({ ...prev, avatarUrl: res.url || "" }));
      }
    } catch (uploadErr: any) {
      setErrorMsg(uploadErr.message || "Failed to upload photo to Google Drive.");
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg("File size must be under 25MB.");
      return;
    }

    setIsUploadingDoc(true);
    setErrorMsg(null);

    try {
      const res = await supabaseService.uploadDocument(
        file,
        formData.documentType,
        formData.fullName || "creator"
      );
      if (res.error || !res.url) {
        setErrorMsg(res.error || "Failed to upload verification document to Google Drive.");
      } else {
        setFormData((prev) => ({
          ...prev,
          documentFileName: res.fileName || file.name,
          documentSize: res.fileSize || `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          documentUrl: res.url || "",
        }));
      }
    } catch (uploadErr: any) {
      setErrorMsg(uploadErr.message || "Failed to upload document to Google Drive.");
    } finally {
      setIsUploadingDoc(false);
      e.target.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consentGiven) {
      setErrorMsg("You must consent to the identity verification and privacy terms to submit.");
      return;
    }

    if (allowedCreatorLocations.length === 0) {
      setErrorMsg("Creator registration is currently paused across all destinations.");
      return;
    }
    if (!allowedCreatorLocations.includes(formData.city)) {
      setErrorMsg(`Registration for ${formData.city} is currently closed. Please select an active destination.`);
      return;
    }

    const igLink = normalizeSocialLink(formData.instagramUrl, "instagram");
    const ttLink = normalizeSocialLink(formData.tiktokUrl, "tiktok");
    const fbLink = normalizeSocialLink(formData.facebookUrl, "facebook");
    const activeLinks = [igLink, ttLink, fbLink].filter(Boolean);
    const combinedSocialUrl = activeLinks.join(", ") || formData.socialUrl;

    const res = submitCreatorApplication({
      full_name: formData.fullName,
      age: formData.age,
      whatsapp: formData.whatsapp,
      country: formData.country,
      document_type: formData.documentType,
      document_reference: formData.documentReference,
      document_url: formData.documentUrl || undefined,
      document_filename: formData.documentFileName,
      document_size: formData.documentSize,
      social_url: combinedSocialUrl,
      avatar_url: formData.avatarUrl || undefined,
      follower_count: formData.followerCount,
      niche: formData.niche,
      city: formData.city,
      visit_start: formData.visitStart,
      visit_end: formData.visitEnd,
      trip_brief: formData.tripBrief,
    });

    if (res.success) {
      setSubmittedCode(res.reference_code);
      if (typeof window !== "undefined") {
        localStorage.setItem("getlinked_my_active_ref", res.reference_code);
      }
    } else {
      setErrorMsg(res.message || "Failed to submit application.");
    }
  };

  const stepsMeta = [
    { num: 1, title: "About You", icon: User },
    { num: 2, title: "Social", icon: Share2 },
    { num: 3, title: "Travel", icon: Calendar },
    { num: 4, title: "Verify ID", icon: ShieldCheck },
    { num: 5, title: "Review", icon: FileCheck },
  ];

  if (submittedCode) {
    return (
      <div className="py-20 bg-white dark:bg-black text-[#1A3739] dark:text-white min-h-screen transition-colors duration-300">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-sand-50 dark:bg-neutral-950 rounded-2xl border border-sand-300 dark:border-neutral-800 p-8 sm:p-12 text-center space-y-6 shadow-warm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-3xl font-bold text-teal-950 dark:text-white">
                Application Received!
              </h1>
              <p className="text-sm text-ink-700 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.fullName}</strong>. Your creator application has been received and queued for manual human verification.
              </p>
            </div>

            <div className="p-4 bg-sand-200/60 dark:bg-neutral-900 rounded-xl border border-sand-300 dark:border-neutral-800 max-w-sm mx-auto">
              <span className="text-xs uppercase font-semibold text-ink-600 dark:text-neutral-400 block">
                Your Secure Application Reference:
              </span>
              <span className="font-mono text-2xl font-bold text-teal-900 dark:text-[#D7400B] tracking-wider">
                {submittedCode}
              </span>
              <p className="text-[11px] text-ink-500 dark:text-neutral-400 mt-1">
                Save this code to check your verification status anytime.
              </p>
            </div>

            <div className="text-xs text-ink-600 dark:text-neutral-300 max-w-md mx-auto space-y-2 text-left bg-sand-100 dark:bg-neutral-900 p-4 rounded-lg border border-sand-200 dark:border-neutral-800">
              <p className="font-semibold text-teal-950 dark:text-white">What happens next?</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Our team verifies your identity document against your social profile.</li>
                <li>Your profile remains completely private until approved.</li>
                <li>You will receive a WhatsApp message from our concierge once approved.</li>
              </ul>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/status"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-teal-900 hover:bg-teal-800 dark:bg-[#D7400B] dark:hover:bg-[#BD3607] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Track Status
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-sand-200 dark:bg-neutral-800 text-ink-900 dark:text-white text-xs font-semibold uppercase tracking-wider hover:bg-sand-300 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-white dark:bg-black text-[#1A3739] dark:text-white min-h-screen transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/10 dark:bg-teal-950/40 text-teal-900 dark:text-teal-300 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
            Verified Creator Application
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-teal-950 dark:text-white">
            Apply to Join Get Linked
          </h1>
          <p className="text-xs sm:text-sm text-ink-700 dark:text-neutral-400 max-w-lg mx-auto">
            Connect with Sri Lanka&apos;s finest hotels, villas, and boutique stays. 18+ age & 5,000+ authentic followers required.
          </p>
        </div>

        {/* Banner if already an approved creator */}
        {existingApprovedApp && (
          <div className="mb-8 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-in fade-in">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                  Approved Creator
                </span>
                <h3 className="font-serif text-base font-bold text-emerald-950 dark:text-white">
                  You are already a Verified GetLinked Creator!
                </h3>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                  Reference: <span className="font-mono font-bold">{existingApprovedApp.reference_code}</span> • Destination: {existingApprovedApp.city}
                </p>
              </div>
            </div>
            <Link
              href="/status"
              className="px-4 py-2.5 rounded-xl bg-teal-900 hover:bg-teal-800 text-sand-50 text-xs font-semibold shrink-0 transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>View My Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Multi-step Stepper Progress Tracker per Modern Web Guidance */}
        <nav aria-label="Application Progress" className="mb-8">
          <ol className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-sand-300 dark:bg-neutral-800 -z-0" />
            {stepsMeta.map((s) => {
              const isDone = step > s.num;
              const isActive = step === s.num;
              return (
                <li key={s.num} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isDone
                        ? "bg-teal-900 dark:bg-[#D7400B] text-white shadow-warm"
                        : isActive
                        ? "bg-gold-500 text-ink-950 ring-4 ring-gold-200 dark:ring-gold-900/40"
                        : "bg-sand-200 dark:bg-neutral-800 text-ink-600 dark:text-neutral-400 border border-sand-400 dark:border-neutral-700"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                  </div>
                  <span
                    className={`text-[11px] font-semibold mt-1.5 hidden sm:block ${
                      isActive ? "text-teal-950 dark:text-white" : "text-ink-500 dark:text-neutral-400"
                    }`}
                  >
                    {s.title}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Error Alert Banner */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main Form Container */}
        <div className="bg-sand-50 dark:bg-neutral-950 rounded-2xl border border-sand-300 dark:border-neutral-800 p-6 sm:p-10 shadow-warm">
          {/* STEP 1: ABOUT YOU */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-sand-200 dark:border-neutral-800 pb-4">
                <h2 className="font-serif text-xl font-bold text-teal-950 dark:text-white">
                  Step 1: Personal Details
                </h2>
                <p className="text-xs text-ink-600 dark:text-neutral-400 mt-0.5">
                  Used solely for identity verification. Never publicly displayed.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="As written on your passport or ID"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                    Age (18+ Required) *
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={100}
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                  />
                  {formData.age < 18 && (
                    <span className="text-[11px] text-rose-600 font-medium mt-1 block">
                      Must be 18 or older
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                    Country of Residence *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. United Kingdom, Australia, Sri Lanka"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                  WhatsApp Number (with country code) *
                </label>
                <PhoneInputWithCountry
                  value={formData.whatsapp}
                  onChange={(val) => setFormData({ ...formData, whatsapp: val })}
                  placeholder="e.g. 7911 123456 or 77 123 4567"
                  required
                />
                <span className="text-[11px] text-ink-500 mt-1 block">
                  Private. Used exclusively by our concierge for collaboration introductions.
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: SOCIAL PROFILE */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-sand-200 pb-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-teal-950">
                    Step 2: Social Media & Audience
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-teal-100 text-teal-900 border border-teal-200 shrink-0">
                    At least 1 required
                  </span>
                </div>
                <p className="text-xs text-ink-600 mt-1">
                  Connect your active creator channels (Instagram, TikTok, or Facebook). You must provide at least one to register.
                </p>
              </div>

              {/* SEPARATE SOCIAL MEDIA CHANNELS */}
              <div className="space-y-4">
                {/* 1. INSTAGRAM */}
                <div className="p-3.5 sm:p-4 rounded-xl border border-sand-300 bg-sand-50/80 focus-within:border-teal-900 focus-within:ring-2 focus-within:ring-teal-900/20 transition-all space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-teal-950 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-xs">
                        <Instagram className="w-3.5 h-3.5" />
                      </span>
                      <span>Instagram Profile</span>
                    </label>
                    {formData.instagramUrl.trim() && (
                      <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Added
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="https://instagram.com/yourhandle or @yourhandle"
                    value={formData.instagramUrl}
                    onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-sand-400 bg-white text-sm text-teal-950 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-teal-900"
                  />
                </div>

                {/* 2. TIKTOK */}
                <div className="p-3.5 sm:p-4 rounded-xl border border-sand-300 bg-sand-50/80 focus-within:border-teal-900 focus-within:ring-2 focus-within:ring-teal-900/20 transition-all space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-teal-950 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-black flex items-center justify-center text-white shadow-xs">
                        <TikTokIcon className="w-3.5 h-3.5" />
                      </span>
                      <span>TikTok Profile</span>
                    </label>
                    {formData.tiktokUrl.trim() && (
                      <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Added
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="https://tiktok.com/@yourhandle or @yourhandle"
                    value={formData.tiktokUrl}
                    onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-sand-400 bg-white text-sm text-teal-950 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-teal-900"
                  />
                </div>

                {/* 3. FACEBOOK */}
                <div className="p-3.5 sm:p-4 rounded-xl border border-sand-300 bg-sand-50/80 focus-within:border-teal-900 focus-within:ring-2 focus-within:ring-teal-900/20 transition-all space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-teal-950 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#1877F2] flex items-center justify-center text-white shadow-xs">
                        <Facebook className="w-3.5 h-3.5" />
                      </span>
                      <span>Facebook Profile or Page</span>
                    </label>
                    {formData.facebookUrl.trim() && (
                      <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Added
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="https://facebook.com/yourhandle or your page URL"
                    value={formData.facebookUrl}
                    onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-sand-400 bg-white text-sm text-teal-950 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-teal-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">
                    Follower Count (5,000+ Required) *
                  </label>
                  <input
                    type="number"
                    min={5000}
                    step={100}
                    required
                    value={formData.followerCount}
                    onChange={(e) =>
                      setFormData({ ...formData, followerCount: Number(e.target.value) })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                  />
                  {formData.followerCount < 5000 && (
                    <span className="text-[11px] text-rose-600 font-medium mt-1 block">
                      Minimum 5,000 followers required
                    </span>
                  )}
                  <span className="text-[11px] text-ink-500 mt-1 block">
                    Combined verified audience reach across your primary platform.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                    Content Niche *
                  </label>
                  <select
                    value={formData.niche}
                    onChange={(e) =>
                      setFormData({ ...formData, niche: e.target.value as NicheType })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                  >
                    {CREATOR_NICHES.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Creator Profile / Avatar Photo */}
              <div className="pt-2 border-t border-sand-200">
                <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                  Creator Profile Photo / Avatar (Recommended)
                </label>
                <p className="text-xs text-ink-600 mb-3">
                  Upload a headshot or creative portrait. This will be featured on your creator card in the discovery directory.
                </p>

                {formData.avatarUrl ? (
                  <div className="flex items-center gap-4 p-3.5 bg-sand-100 rounded-xl border border-sand-300">
                    <img
                      src={formData.avatarUrl}
                      alt="Avatar Preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-teal-900 shadow-sm shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-teal-950 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Photo Saved to Google Drive</span>
                      </p>
                      <p className="text-[11px] text-ink-500 truncate mt-0.5 font-mono">
                        {formData.avatarUrl}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, avatarUrl: "" })}
                      className="text-xs text-rose-700 hover:text-rose-900 font-semibold px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1 shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                ) : (
                  <div className="relative border-2 border-dashed border-sand-400 hover:border-teal-800 rounded-xl p-5 text-center transition-colors bg-sand-100/40 hover:bg-sand-100/70">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={isUploadingAvatar}
                      onChange={handleAvatarUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                      <div className="w-10 h-10 rounded-full bg-teal-900/10 text-teal-900 flex items-center justify-center">
                        {isUploadingAvatar ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Camera className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-teal-950 block">
                          {isUploadingAvatar ? "Saving photo to Google Drive..." : "Click or drag profile photo here"}
                        </span>
                        <span className="text-[11px] text-ink-500 block mt-0.5">
                          JPG, PNG, or WebP up to 10MB (automatically saved to Google Drive)
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Direct Link / Google Drive Alternative Input */}
                {!formData.avatarUrl && (
                  <div className="pt-2">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="Or paste image web link / Google Drive photo link..."
                        value={driveAvatarInput}
                        onChange={(e) => setDriveAvatarInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const val = driveAvatarInput.trim();
                            if (!val) return;
                            const driveId = extractGoogleDriveFileId(val);
                            const finalUrl = driveId ? getGoogleDriveImageUrl(driveId, 800) : val;
                            setFormData({ ...formData, avatarUrl: finalUrl });
                            setDriveAvatarInput("");
                          }
                        }}
                        className="flex-grow px-3 py-2 rounded-lg border border-sand-400 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-900"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const val = driveAvatarInput.trim();
                          if (!val) return;
                          const driveId = extractGoogleDriveFileId(val);
                          const finalUrl = driveId ? getGoogleDriveImageUrl(driveId, 800) : val;
                          setFormData({ ...formData, avatarUrl: finalUrl });
                          setDriveAvatarInput("");
                        }}
                        className="px-3.5 py-2 rounded-lg bg-teal-900 hover:bg-teal-800 text-white text-xs font-semibold shrink-0 transition-colors"
                      >
                        Set Photo
                      </button>
                    </div>
                    <span className="text-[10px] text-ink-500 mt-1 block">
                      Google Drive image links are automatically converted to high-speed CDN photos.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: TRAVEL PLANS */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-sand-200 pb-4">
                <h2 className="font-serif text-xl font-bold text-teal-950">
                  Step 3: Sri Lanka Travel Window
                </h2>
                <p className="text-xs text-ink-600 mt-0.5">
                  Helps accommodations find you for specific dates and destinations.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider">
                    Destination City in Sri Lanka *
                  </label>
                  <span className="text-[10px] text-teal-900 font-bold px-2 py-0.5 rounded-full bg-teal-100/80 border border-teal-200 whitespace-nowrap">
                    {allowedCreatorLocations.length}
                  </span>
                </div>

                {allowedCreatorLocations.length === 0 ? (
                  <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 text-xs font-medium">
                    Creator registrations are temporarily not accepted for any locations. Please check back later.
                  </div>
                ) : (
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                  >
                    {allowedCreatorLocations.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                )}
                <p className="text-[11px] text-ink-500 mt-1">
                  Only destinations currently open for creator partnerships are selectable.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                    Visit Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.visitStart}
                    onChange={(e) => setFormData({ ...formData, visitStart: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                    Visit End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.visitEnd}
                    onChange={(e) => setFormData({ ...formData, visitEnd: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                  Trip Content Brief *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your creative angle, content format (e.g. 4K Reels, photography, YouTube vlog), and what type of stays you seek..."
                  value={formData.tripBrief}
                  onChange={(e) => setFormData({ ...formData, tripBrief: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                />
              </div>
            </div>
          )}

          {/* STEP 4: IDENTITY VERIFICATION */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-sand-200 pb-4">
                <h2 className="font-serif text-xl font-bold text-teal-950">
                  Step 4: Secure Identity Verification
                </h2>
                <p className="text-xs text-ink-600 mt-0.5">
                  Required to prevent fake profiles. Your document is stored in private encrypted storage.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                    Document Type *
                  </label>
                  <select
                    value={formData.documentType}
                    onChange={(e) =>
                      setFormData({ ...formData, documentType: e.target.value as DocumentType })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                  >
                    <option value="PASSPORT">Passport (International & Local)</option>
                    <option value="NATIONAL_ID">National ID (Sri Lankan NIC)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                    Document / Passport Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GB98210344X"
                    value={formData.documentReference}
                    onChange={(e) =>
                      setFormData({ ...formData, documentReference: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                  />
                </div>
              </div>

              {/* Upload Dropzone */}
              <div>
                <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-2">
                  Upload Scanned Document / Photo (PDF, PNG, JPG - max 25MB) *
                </label>
                <div className="border-2 border-dashed border-sand-400 rounded-xl p-6 text-center bg-sand-100/60 hover:bg-sand-100 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                    disabled={isUploadingDoc}
                    onChange={handleDocumentUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="space-y-2 pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-teal-900/10 text-teal-900 flex items-center justify-center mx-auto">
                      {isUploadingDoc ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Upload className="w-6 h-6" />
                      )}
                    </div>
                    {formData.documentFileName ? (
                      <div>
                        <span className="text-sm font-bold text-teal-900 block flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                          {formData.documentFileName}
                        </span>
                        <span className="text-xs text-ink-500 font-mono">
                          {formData.documentSize} • Saved securely to Google Drive
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-sm font-semibold text-teal-950 block">
                          {isUploadingDoc ? "Saving document to Google Drive..." : "Click or drag ID document to upload"}
                        </span>
                        <span className="text-xs text-ink-500">
                          High resolution photo or PDF scan (automatically saved to Google Drive)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-sand-200/60 rounded-lg text-xs text-ink-700">
                <Lock className="w-4 h-4 text-gold-600 shrink-0" />
                <span>
                  Documents are stored in an isolated private vault and only accessible by authorized Get Linked reviewers.
                </span>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & CONSENT */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-sand-200 pb-4">
                <h2 className="font-serif text-xl font-bold text-teal-950">
                  Step 5: Review & Consent
                </h2>
                <p className="text-xs text-ink-600 mt-0.5">
                  Confirm your submission details before submitting to the review queue.
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-4 bg-sand-100 rounded-xl border border-sand-300 space-y-3 text-xs text-ink-800">
                {formData.avatarUrl && (
                  <div className="flex items-center gap-3 pb-3 border-b border-sand-200">
                    <img
                      src={formData.avatarUrl}
                      alt={formData.fullName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-teal-900 shadow-sm"
                    />
                    <div>
                      <span className="font-serif font-bold text-base text-teal-950 block">
                        {formData.fullName}
                      </span>
                      <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Profile photo ready
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-ink-500 block">Full Name:</span>
                    <strong className="text-teal-950">{formData.fullName} ({formData.age} y/o)</strong>
                  </div>
                  <div>
                    <span className="text-ink-500 block">Country:</span>
                    <strong className="text-teal-950">{formData.country}</strong>
                  </div>
                  <div>
                    <span className="text-ink-500 block">Niche:</span>
                    <strong className="text-teal-950">{formData.niche}</strong>
                  </div>
                  <div>
                    <span className="text-ink-500 block">Audience:</span>
                    <strong className="text-teal-950">{formData.followerCount.toLocaleString()} followers</strong>
                  </div>
                  <div>
                    <span className="text-ink-500 block">Visiting:</span>
                    <strong className="text-teal-950">{formData.city}</strong>
                  </div>
                  <div>
                    <span className="text-ink-500 block">Dates:</span>
                    <strong className="text-teal-950">{formData.visitStart} to {formData.visitEnd}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-ink-500 block">Connected Social Channels:</span>
                    <span className="font-mono text-ink-700">
                      {[
                        formData.instagramUrl.trim() && `Instagram: ${formData.instagramUrl.trim()}`,
                        formData.tiktokUrl.trim() && `TikTok: ${formData.tiktokUrl.trim()}`,
                        formData.facebookUrl.trim() && `Facebook: ${formData.facebookUrl.trim()}`,
                      ]
                        .filter(Boolean)
                        .join(" • ")}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-ink-500 block">ID Reference:</span>
                    <span className="font-mono text-ink-700">{formData.documentType}: {formData.documentReference} ({formData.documentFileName})</span>
                  </div>
                </div>
              </div>

              {/* Sri Lanka PDPA Consent Checkbox */}
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
                    I consent to Get Linked processing the personal information and identity documents provided in accordance with Sri Lanka&apos;s Personal Data Protection Act (PDPA) for identity verification, review, and collaboration matching. I understand my WhatsApp and ID will never be publicly exposed.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="pt-8 border-t border-sand-200 flex items-center justify-between gap-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-lg border border-sand-400 text-ink-700 text-xs font-semibold uppercase tracking-wider hover:bg-sand-200 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 rounded-lg bg-teal-900 hover:bg-teal-800 text-sand-50 text-xs font-semibold uppercase tracking-wider shadow-warm transition-all flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-8 py-3 rounded-lg bg-teal-900 hover:bg-teal-800 text-sand-50 text-xs font-semibold uppercase tracking-wider shadow-warm transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-gold-400" />
                <span>Submit Application for Review</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
