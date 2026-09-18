"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, ArrowRight, CheckCircle2, Building2, Compass } from "lucide-react";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: "creator" | "stay";
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({
  isOpen,
  onClose,
  defaultRole = "creator",
}) => {
  const [role, setRole] = useState<"creator" | "stay">(defaultRole);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#122026]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-[#FAF8F5] text-[#122026] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E7E2DA] z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#5E686F] hover:text-[#122026] rounded-full hover:bg-[#F3EFE8] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8A949C]">
                Get Linked Sri Lanka
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#122026] mt-1.5 leading-tight">
                Join the Curated Network
              </h2>
              <p className="text-xs sm:text-sm text-[#5E686F] mt-2 leading-relaxed">
                Connect with verified creators and distinctive boutique stays across Sri Lanka.
              </p>
            </div>

            {/* Role Selector Tabs */}
            <div className="flex rounded-full bg-[#F3EFE8] p-1 mb-6 border border-[#E7E2DA]">
              <button
                type="button"
                onClick={() => setRole("creator")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-medium transition-all ${
                  role === "creator"
                    ? "bg-[#16252C] text-white shadow-sm"
                    : "text-[#5E686F] hover:text-[#122026]"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>For Creators</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("stay")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-medium transition-all ${
                  role === "stay"
                    ? "bg-[#16252C] text-white shadow-sm"
                    : "text-[#5E686F] hover:text-[#122026]"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>For Stays</span>
              </button>
            </div>

            {/* Email Early Access Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#5E686F] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#E7E2DA] focus:border-[#16252C] focus:outline-none text-sm text-[#122026] placeholder:text-[#8A949C]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-[#16252C] hover:bg-black text-white text-xs font-medium uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Request Early Access</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#E7E2DA] flex items-center justify-between text-xs text-[#5E686F]">
              <span>Ready for immediate onboarding?</span>
              {role === "creator" ? (
                <Link
                  href="/apply"
                  onClick={onClose}
                  className="font-medium text-[#122026] underline hover:text-[#C4A67B] transition-colors"
                >
                  Full Creator Application →
                </Link>
              ) : (
                <Link
                  href="/list-property"
                  onClick={onClose}
                  className="font-medium text-[#122026] underline hover:text-[#C4A67B] transition-colors"
                >
                  List Your Property →
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#F3EFE8] text-[#122026] flex items-center justify-center mx-auto border border-[#E7E2DA]">
              <CheckCircle2 className="w-6 h-6 text-[#16252C]" />
            </div>
            <h3 className="font-serif text-2xl text-[#122026]">You&apos;re on the list</h3>
            <p className="text-xs sm:text-sm text-[#5E686F] max-w-xs mx-auto leading-relaxed">
              Thank you for your interest in Get Linked. We review applications by cohort and will reach out to <span className="font-semibold text-[#122026]">{email}</span> soon.
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-[#16252C] text-white text-xs uppercase tracking-wider font-medium hover:bg-black"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
