"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Sparkles, Building2, Compass, ArrowRight, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [role, setRole] = useState<"creator" | "stay">("creator");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setErrorMsg(null);
      setGoogleLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        console.error("Google sign in error:", error.message);
        if (error.message.toLowerCase().includes("provider is not enabled") || error.message.toLowerCase().includes("unsupported provider")) {
          setErrorMsg("Google Sign-In is not enabled in your new Supabase project yet. Please go to Supabase Dashboard > Authentication > Providers > Google, enable it, and enter your Google Client ID & Secret.");
        } else {
          setErrorMsg(error.message);
        }
        setGoogleLoading(false);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Google sign in failed";
      setErrorMsg(message);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-[#1A3739] dark:text-white flex items-center justify-center p-4 py-16 transition-colors duration-300">
      <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-gray-200 dark:border-neutral-800 p-8 max-w-md w-full shadow-xl space-y-6">
        {/* Header with Logo */}
        <div className="text-center space-y-2">
          <Logo variant="dark" height={42} className="mx-auto" />
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1A3739] dark:text-white pt-2">
            Welcome to Get Linked
          </h1>
          <p className="text-xs sm:text-sm text-[#1A3739]/80 dark:text-neutral-400 leading-relaxed">
            Direct sign-in for verified creators and boutique accommodation hosts.
          </p>
        </div>

        {/* Role Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setRole("creator")}
            className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              role === "creator"
                ? "bg-[#D7400B] text-white shadow-xs"
                : "text-[#1A3739] dark:text-neutral-300 hover:text-[#D7400B]"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Influencer / Creator</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("stay")}
            className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              role === "stay"
                ? "bg-[#D7400B] text-white shadow-xs"
                : "text-[#1A3739] dark:text-neutral-300 hover:text-[#D7400B]"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Stay Host</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300 text-xs leading-relaxed space-y-1.5">
            <div className="font-semibold flex items-center gap-1.5 text-rose-900 dark:text-rose-200">
              <span>⚠️ Configuration Required</span>
            </div>
            <p>{errorMsg}</p>
            <a
              href="https://supabase.com/dashboard/project/gpkljpnbgnylcekrcluy/auth/providers"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[#D7400B] font-bold hover:underline pt-0.5"
            >
              Open Supabase Google Provider Settings ➔
            </a>
          </div>
        )}

        {/* Google OAuth Login Button */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            type="button"
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800 text-[#1A3739] dark:text-white font-semibold text-xs sm:text-sm uppercase tracking-wider border border-gray-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-60"
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-[#1A3739] dark:border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            <span>Sign in with Google</span>
          </button>

          <p className="text-[11px] text-center text-[#1A3739]/70 dark:text-neutral-400">
            Use the Google Account registered with your application or profile.
          </p>
        </div>

        {/* Alternative Links: Status Tracker or Apply */}
        <div className="pt-4 border-t border-gray-200 dark:border-neutral-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#1A3739]/80 dark:text-neutral-300">
            <span>Check application status?</span>
            <Link
              href="/status"
              className="font-semibold text-[#D7400B] hover:underline"
            >
              Application Tracker →
            </Link>
          </div>

          <div className="flex items-center justify-between text-xs text-[#1A3739]/80 dark:text-neutral-300">
            <span>New to Get Linked?</span>
            {role === "creator" ? (
              <Link
                href="/apply"
                className="font-semibold text-[#1A3739] dark:text-white underline hover:text-[#D7400B]"
              >
                Apply as Creator
              </Link>
            ) : (
              <Link
                href="/list-property"
                className="font-semibold text-[#1A3739] dark:text-white underline hover:text-[#D7400B]"
              >
                List Your Stay
              </Link>
            )}
          </div>
        </div>

        {/* Footer Admin Link */}
        <div className="text-center pt-2 border-t border-gray-100 dark:border-neutral-900">
          <Link
            href="/admin/login"
            className="text-[11px] text-[#1A3739]/60 dark:text-neutral-500 hover:text-[#1A3739] dark:hover:text-white transition-colors"
          >
            Staff & Administrators Portal →
          </Link>
        </div>
      </div>
    </div>
  );
}
