"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/data/store";
import { SRI_LANKA_CITIES, CREATOR_NICHES } from "@/utils/formatters";
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
} from "lucide-react";

export default function ApplyPage() {
  const { submitCreatorApplication } = useStore();

  const [step, setStep] = useState<number>(1);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: About You
    fullName: "",
    age: 24,
    whatsapp: "",
    country: "United Kingdom",
    // Step 2: Social
    socialUrl: "",
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
    // Step 5: Consent
    consentGiven: false,
  });

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
      if (!formData.socialUrl.trim() || !formData.socialUrl.startsWith("http")) {
        setErrorMsg("Please enter a valid social media URL (e.g. https://instagram.com/yourhandle).");
        return false;
      }
      if (formData.followerCount < 5000) {
        setErrorMsg("A minimum of 5,000 verified followers is required to join Get Linked.");
        return false;
      }
      return true;
    }

    if (currentStep === 3) {
      if (!formData.city) {
        setErrorMsg("Please select the Sri Lankan destination you plan to visit.");
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

  const handleMockUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (< 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg("File size must be under 10MB.");
        return;
      }
      setFormData({
        ...formData,
        documentFileName: file.name,
        documentSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      });
      setErrorMsg(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consentGiven) {
      setErrorMsg("You must consent to the identity verification and privacy terms to submit.");
      return;
    }

    const res = submitCreatorApplication({
      full_name: formData.fullName,
      age: formData.age,
      whatsapp: formData.whatsapp,
      country: formData.country,
      document_type: formData.documentType,
      document_reference: formData.documentReference,
      document_filename: formData.documentFileName,
      document_size: formData.documentSize,
      social_url: formData.socialUrl,
      follower_count: formData.followerCount,
      niche: formData.niche,
      city: formData.city,
      visit_start: formData.visitStart,
      visit_end: formData.visitEnd,
      trip_brief: formData.tripBrief,
    });

    if (res.success) {
      setSubmittedCode(res.reference_code);
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
      <div className="py-20 bg-sand-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-sand-50 rounded-2xl border border-sand-300 p-8 sm:p-12 text-center space-y-6 shadow-warm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-3xl font-bold text-teal-950">
                Application Received!
              </h1>
              <p className="text-sm text-ink-700 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.fullName}</strong>. Your creator application has been received and queued for manual human verification.
              </p>
            </div>

            <div className="p-4 bg-sand-200/60 rounded-xl border border-sand-300 max-w-sm mx-auto">
              <span className="text-xs uppercase font-semibold text-ink-600 block">
                Your Secure Application Reference:
              </span>
              <span className="font-mono text-2xl font-bold text-teal-900 tracking-wider">
                {submittedCode}
              </span>
              <p className="text-[11px] text-ink-500 mt-1">
                Save this code to check your verification status anytime.
              </p>
            </div>

            <div className="text-xs text-ink-600 max-w-md mx-auto space-y-2 text-left bg-sand-100 p-4 rounded-lg border border-sand-200">
              <p className="font-semibold text-teal-950">What happens next?</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Our team verifies your identity document against your social profile.</li>
                <li>Your profile remains completely private until approved.</li>
                <li>You will receive a WhatsApp message from our concierge once approved.</li>
              </ul>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/status"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-teal-900 text-sand-50 text-xs font-semibold uppercase tracking-wider hover:bg-teal-800 transition-colors"
              >
                Track Status
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-sand-200 text-ink-900 text-xs font-semibold uppercase tracking-wider hover:bg-sand-300 transition-colors"
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
    <div className="py-12 bg-sand-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/10 text-teal-900 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
            Verified Creator Application
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-teal-950">
            Apply to Join Get Linked
          </h1>
          <p className="text-xs sm:text-sm text-ink-700 max-w-lg mx-auto">
            Connect with Sri Lanka&apos;s finest hotels, villas, and boutique stays. 18+ age & 5,000+ authentic followers required.
          </p>
        </div>

        {/* Multi-step Stepper Progress Tracker per Modern Web Guidance */}
        <nav aria-label="Application Progress" className="mb-8">
          <ol className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-sand-300 -z-0" />
            {stepsMeta.map((s) => {
              const isDone = step > s.num;
              const isActive = step === s.num;
              return (
                <li key={s.num} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isDone
                        ? "bg-teal-900 text-sand-50 shadow-warm"
                        : isActive
                        ? "bg-gold-500 text-ink-950 ring-4 ring-gold-200"
                        : "bg-sand-200 text-ink-600 border border-sand-400"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                  </div>
                  <span
                    className={`text-[11px] font-semibold mt-1.5 hidden sm:block ${
                      isActive ? "text-teal-950" : "text-ink-500"
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
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main Form Container */}
        <div className="bg-sand-50 rounded-2xl border border-sand-300 p-6 sm:p-10 shadow-warm">
          {/* STEP 1: ABOUT YOU */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-sand-200 pb-4">
                <h2 className="font-serif text-xl font-bold text-teal-950">
                  Step 1: Personal Details
                </h2>
                <p className="text-xs text-ink-600 mt-0.5">
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
                <input
                  type="tel"
                  required
                  placeholder="e.g. +447911123456 or +94771234567"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
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
                <h2 className="font-serif text-xl font-bold text-teal-950">
                  Step 2: Social Media & Audience
                </h2>
                <p className="text-xs text-ink-600 mt-0.5">
                  We verify audience authenticity and engagement rate.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                  Primary Social Media URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://instagram.com/yourhandle or https://tiktok.com/@yourhandle"
                  value={formData.socialUrl}
                  onChange={(e) => setFormData({ ...formData, socialUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
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
                <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                  Destination City in Sri Lanka *
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
                  Upload Scanned Document / Photo (PDF, PNG, JPG - max 10MB) *
                </label>
                <div className="border-2 border-dashed border-sand-400 rounded-xl p-6 text-center bg-sand-100/60 hover:bg-sand-100 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleMockUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-full bg-teal-900/10 text-teal-900 flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6" />
                    </div>
                    {formData.documentFileName ? (
                      <div>
                        <span className="text-sm font-bold text-teal-900 block">
                          {formData.documentFileName}
                        </span>
                        <span className="text-xs text-ink-500">
                          {formData.documentSize} • Ready to upload securely
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-sm font-semibold text-teal-900 block">
                          Click or drag ID document to upload
                        </span>
                        <span className="text-xs text-ink-500">
                          High resolution photo or PDF scan
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
