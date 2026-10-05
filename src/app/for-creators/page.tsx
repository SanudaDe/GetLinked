import React from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export default function ForCreatorsPage() {
  const requirements = [
    "18 years or older",
    "A valid national ID or passport",
    "5,000+ followers on a public social platform",
    "Confirmed travel dates in Sri Lanka",
  ];

  return (
    <div className="py-24 sm:py-32 bg-white dark:bg-black text-[#1A3739] dark:text-white min-h-screen transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Editorial Header */}
        <div className="space-y-5 text-center">
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#1A3739] dark:text-white tracking-tight leading-tight">
            For the ones who tell it well.
          </h1>
          <p className="text-sm sm:text-base text-[#1A3739]/80 dark:text-neutral-400 leading-relaxed max-w-xl mx-auto">
            Get Linked is free for creators. Tell us where you&apos;re headed and when — we&apos;ll do the rest, quietly, by hand.
          </p>

          <div className="pt-4">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#D7400B] hover:bg-[#BD3607] text-white text-xs font-semibold tracking-wide shadow-sm transition-all"
            >
              <span>Apply as a Creator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Requirements Card (Functional, plain, clear) */}
        <div className="p-8 sm:p-10 rounded-2xl bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 shadow-sm space-y-6">
          <div className="space-y-1 border-b border-gray-200 dark:border-neutral-800 pb-4">
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#1A3739] dark:text-white">
              Requirements
            </h2>
            <p className="text-xs text-[#1A3739]/70 dark:text-neutral-400">
              Criteria for creator verification across all platforms
            </p>
          </div>

          <ul className="space-y-4 pt-2">
            {requirements.map((req, idx) => (
              <li key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-[#1A3739] dark:text-neutral-200">
                <div className="w-4 h-4 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-800/40 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-[#D7400B]" />
                </div>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
