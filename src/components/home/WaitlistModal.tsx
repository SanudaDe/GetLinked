"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, ArrowRight, CheckCircle2, Building2, Compass } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

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
  const [googleLoading, setGoogleLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        console.error("Google sign in error:", error.message);
        setGoogleLoading(false);
      }
    } catch (err) {
      console.error("Google sign in exception:", err);
      setGoogleLoading(false);
    }
  };

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

            {/* Quick Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              type="button"
              className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-white hover:bg-white/90 text-[#336467] font-semibold text-xs uppercase tracking-wider border border-[#C8C488] shadow-xs transition-all cursor-pointer disabled:opacity-60 mb-4"
            >
              {googleLoading ? (
                <div className="w-4 h-4 border-2 border-[#336467] border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center mb-5">
              <div className="border-t border-[#C8C488] w-full" />
              <span className="bg-[#E0DDAE] px-3 text-[10px] uppercase tracking-wider font-semibold text-[#336467]/60 absolute">
                or with email
              </span>
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
