import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      title: "Introduce yourself",
      body: "Share your dates, your work, and where you're headed. A photo ID, and a few honest lines about what you do.",
    },
    {
      number: "02",
      title: "We take the time to know you",
      body: "A member of our team reviews every application by hand. No automation, no shortcuts.",
    },
    {
      number: "03",
      title: "Discover a stay worth writing about",
      body: "Once approved, your dates become visible to the stays we've chosen with equal care.",
    },
    {
      number: "04",
      title: "We make the introduction",
      body: "When there's a fit, we bring both sides together directly — and step back.",
    },
  ];

  return (
    <div className="py-24 sm:py-32 bg-white dark:bg-black text-[#1A3739] dark:text-white min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Page Header */}
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#1A3739] dark:text-white tracking-tight leading-tight">
            How an introduction is made.
          </h1>
          <p className="text-sm sm:text-base text-[#1A3739]/80 dark:text-neutral-400 leading-relaxed pt-2">
            We don&apos;t run an app. We run a quiet, considered process — the same for every creator, every stay.
          </p>
        </div>

        {/* The 4 Steps */}
        <div className="space-y-12">
          {steps.map((step) => (
            <div
              key={step.number}
              className="p-8 sm:p-10 rounded-2xl bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row gap-6 md:gap-10 items-start"
            >
              <span className="font-mono text-xs sm:text-sm text-[#D7400B] font-semibold tracking-widest pt-1 shrink-0">
                {step.number} —
              </span>

              <div className="space-y-2 flex-1">
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1A3739] dark:text-white">
                  {step.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#1A3739]/80 dark:text-neutral-300 leading-relaxed max-w-xl">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Functional Clean CTAs */}
        <div className="pt-8 border-t border-gray-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/apply"
            className="px-8 py-3.5 rounded-full bg-[#D7400B] hover:bg-[#BD3607] text-white text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer"
          >
            Apply as a Creator
          </Link>
          <Link
            href="/list-property"
            className="px-8 py-3.5 rounded-full bg-[#1A3739] dark:bg-neutral-900 hover:bg-[#132A2B] dark:hover:bg-neutral-800 text-white text-xs font-semibold tracking-wide border border-[#1A3739] dark:border-neutral-700 shadow-sm transition-all cursor-pointer"
          >
            List Your Stay
          </Link>
        </div>
      </div>
    </div>
  );
}
