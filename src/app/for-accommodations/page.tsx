import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ForAccommodationsPage() {
  return (
    <div className="py-24 sm:py-32 bg-white dark:bg-black text-[#1A3739] dark:text-white min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Editorial Header */}
        <div className="space-y-6 text-center">
          <h1 className="font-serif text-5xl sm:text-7xl font-normal text-[#1A3739] dark:text-white tracking-tight leading-[1.08]">
            For stays worth discovering.
          </h1>
          <p className="text-[20px] sm:text-[24px] lg:text-[26px] text-[#1A3739]/90 dark:text-neutral-200 leading-relaxed max-w-2xl mx-auto font-normal pt-2">
            List once. We&apos;ll bring you creators already heading your way — reviewed, verified, and matched by hand.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/list-property"
              className="inline-flex items-center gap-3 px-9 py-4 rounded-full bg-[#D7400B] hover:bg-[#BD3607] text-white text-[17px] sm:text-[18px] font-sans font-semibold tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer group"
            >
              <span>List Your Property</span>
              <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/creators"
              className="inline-flex items-center gap-3 px-9 py-4 rounded-full bg-gray-100 dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-neutral-800 text-[#1A3739] dark:text-neutral-200 text-[17px] sm:text-[18px] font-sans font-semibold tracking-wider border border-gray-200 dark:border-neutral-700 transition-all cursor-pointer"
            >
              <span>Browse Creators</span>
            </Link>
          </div>
        </div>

        {/* Quiet Info Note */}
        <div className="p-8 sm:p-10 rounded-2xl bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 shadow-sm space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1A3739] dark:text-white">
            Considered Collaborations
          </h2>
          <p className="text-[17px] sm:text-[18px] text-[#1A3739]/90 dark:text-neutral-200 leading-relaxed">
            Every introduction is made with care. We confirm creator identities, travel dates, and aesthetic compatibility before initiating conversations on your terms.
          </p>
        </div>
      </div>
    </div>
  );
}
