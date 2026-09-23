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
        className="fixed inset-0 bg-[#1A3739]/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-[#E0DDAE] text-[#336467] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#C8C488] z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#336467]/70 hover:text-[#336467] rounded-full hover:bg-[#D0CD96] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D7400B]">
                Get Linked Sri Lanka
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#336467] mt-1.5 leading-tight">
                Join the Curated Network
              </h2>
              <p className="text-xs sm:text-sm text-[#336467]/80 mt-2 leading-relaxed">
                Connect with verified creators and distinctive boutique stays across Sri Lanka.
              </p>
            </div>

            {/* Role Selector Tabs */}
            <div className="flex rounded-full bg-[#D0CD96] p-1 mb-6 border border-[#C8C488]">
              <button
                type="button"
                onClick={() => setRole("creator")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  role === "creator"
                    ? "bg-[#D7400B] text-white shadow-sm"
                    : "text-[#336467] hover:text-[#336467]/80"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>For Creators</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("stay")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  role === "stay"
                    ? "bg-[#D7400B] text-white shadow-sm"
                    : "text-[#336467] hover:text-[#336467]/80"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>For Stays</span>
              </button>
            </div>

            {/* Email Early Access Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#336467] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#C8C488] focus:border-[#D7400B] focus:outline-none text-sm text-[#336467] placeholder:text-[#336467]/50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-[#D7400B] hover:bg-[#BD3607] text-white text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>Request Early Access</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#C8C488] flex items-center justify-between text-xs text-[#336467]/80">
              <span>Ready for immediate onboarding?</span>
              {role === "creator" ? (
                <Link
                  href="/apply"
                  onClick={onClose}
                  className="font-semibold text-[#336467] underline hover:text-[#D7400B] transition-colors"
                >
                  Full Creator Application →
                </Link>
              ) : (
                <Link
                  href="/list-property"
                  onClick={onClose}
                  className="font-semibold text-[#336467] underline hover:text-[#D7400B] transition-colors"
                >
                  List Your Property →
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#D0CD96] text-[#336467] flex items-center justify-center mx-auto border border-[#C8C488]">
              <CheckCircle2 className="w-6 h-6 text-[#D7400B]" />
            </div>
            <h3 className="font-serif text-2xl text-[#336467]">You&apos;re on the list</h3>
            <p className="text-xs sm:text-sm text-[#336467]/80 max-w-xs mx-auto leading-relaxed">
              Thank you for your interest in Get Linked. We review applications by cohort and will reach out to <span className="font-semibold text-[#336467]">{email}</span> soon.
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-[#D7400B] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#BD3607] cursor-pointer"
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
