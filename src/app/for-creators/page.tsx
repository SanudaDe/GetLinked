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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Editorial Header */}
        <div className="space-y-6 text-center">
          <h1 className="font-serif text-5xl sm:text-7xl font-normal text-[#1A3739] dark:text-white tracking-tight leading-[1.08]">
            For the ones who tell it well.
          </h1>
          <p className="text-[22px] sm:text-[26px] lg:text-[28px] text-[#1A3739] dark:text-neutral-100 leading-relaxed max-w-2xl mx-auto font-normal pt-2">
            Get Linked is free for creators. Tell us where you&apos;re headed and when - we&apos;ll do the rest, quietly, by hand.
          </p>

          <div className="pt-6">
            <Link
              href="/apply"
              className="inline-flex items-center gap-3 px-9 py-4 rounded-full bg-[#D7400B] hover:bg-[#BD3607] text-white text-[17px] sm:text-[18px] font-sans font-semibold tracking-wider shadow-md hover:shadow-lg transition-all group"
            >
              <span>Apply as a Creator</span>
              <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Requirements Card (Functional, plain, clear) */}
        <div className="p-8 sm:p-10 rounded-2xl bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 shadow-sm space-y-6">
          <div className="space-y-2 border-b border-gray-200 dark:border-neutral-800 pb-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1A3739] dark:text-white">
              Requirements
            </h2>
            <p className="text-[17px] sm:text-[18px] text-[#1A3739]/80 dark:text-neutral-400">
              Criteria for creator verification across all platforms
            </p>
          </div>

          <ul className="space-y-4 pt-2">
            {requirements.map((req, idx) => (
              <li key={idx} className="flex items-center gap-3 text-[18px] sm:text-[20px] text-[#1A3739] dark:text-neutral-200">
                <div className="w-5 h-5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-800/40 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-[#D7400B]" />
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
