"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-50 dark:bg-black text-[#1A3739] dark:text-white border-t border-gray-200 dark:border-neutral-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">
          {/* Brand & Tagline */}
          <div className="md:col-span-4 space-y-3">
            <Logo href="/" height={42} variant="dark" />
            <p className="font-serif italic text-lg sm:text-xl text-[#2C5A5D] dark:text-neutral-300 pt-1">
              Sri Lanka, told properly.
            </p>
          </div>

          {/* Nav Column 1: For Creators */}
          <div className="md:col-span-3 space-y-4">
            <span className="text-[14px] sm:text-[15px] font-bold uppercase tracking-[0.2em] text-[#1A3739] dark:text-white block">
              For Creators
            </span>
            <ul className="space-y-3.5 text-[15px] sm:text-[16px] font-medium text-[#2C5A5D] dark:text-neutral-300">
              <li>
                <Link href="/for-creators" className="hover:text-[#D7400B] dark:hover:text-[#D7400B] transition-colors block">
                  Creator Program
                </Link>
              </li>
              <li>
                <Link href="/apply" className="hover:text-[#D7400B] dark:hover:text-[#D7400B] transition-colors inline-flex items-center gap-1 group">
                  <span>Apply to Join</span>
                  <ArrowUpRight className="w-4 h-4 text-[#2C5A5D]/70 dark:text-neutral-400 group-hover:text-[#D7400B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/creators" className="hover:text-[#D7400B] dark:hover:text-[#D7400B] transition-colors block">
                  Current Directory
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-[#D7400B] dark:hover:text-[#D7400B] transition-colors block">
                  Check Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Column 2: For Stays & Eats */}
          <div className="md:col-span-3 space-y-4">
            <span className="text-[14px] sm:text-[15px] font-bold uppercase tracking-[0.2em] text-[#1A3739] dark:text-white block">
              For Stays & Eats
            </span>
            <ul className="space-y-3.5 text-[15px] sm:text-[16px] font-medium text-[#2C5A5D] dark:text-neutral-300">
              <li>
                <Link href="/for-accommodations" className="hover:text-[#D7400B] dark:hover:text-[#D7400B] transition-colors block">
                  Stays Program
                </Link>
              </li>
              <li>
                <Link href="/eats" className="hover:text-[#D7400B] dark:hover:text-[#D7400B] transition-colors block">
                  Eats Program
                </Link>
              </li>
              <li>
                <Link href="/list-property" className="hover:text-[#D7400B] dark:hover:text-[#D7400B] transition-colors inline-flex items-center gap-1 group">
                  <span>List Stays or Eats</span>
                  <ArrowUpRight className="w-4 h-4 text-[#2C5A5D]/70 dark:text-neutral-400 group-hover:text-[#D7400B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#D7400B] dark:hover:text-[#D7400B] transition-colors block">
                  How Introductions Work
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Column 3: Trust & Privacy */}
          <div className="md:col-span-2 space-y-4">
            <span className="text-[14px] sm:text-[15px] font-bold uppercase tracking-[0.2em] text-[#1A3739] dark:text-white block">
              Trust & Privacy
            </span>
            <ul className="space-y-3.5 text-[15px] sm:text-[16px] font-medium text-[#2C5A5D] dark:text-neutral-300">
              <li>
                <Link href="/privacy" className="hover:text-[#D7400B] dark:hover:text-[#D7400B] transition-colors block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#D7400B] dark:hover:text-[#D7400B] transition-colors block">
                  Terms of Collaboration
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#D7400B] dark:hover:text-[#D7400B] transition-colors block">
                  Contact Curators
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Hairline & Fine Print */}
        <div className="mt-14 pt-8 border-t border-gray-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm sm:text-[15px] text-[#2C5A5D] dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <span>© 2026 Get Linked Sri Lanka. All rights reserved.</span>
            {/* Discreet staff access - hidden from public view */}
            <Link
              href="/admin/login"
              className="text-transparent hover:text-neutral-400/40 select-none transition-colors text-xs"
              tabIndex={-1}
              aria-hidden="true"
            >
              •
            </Link>
          </div>
          <div className="flex items-center gap-2 text-sm sm:text-[15px] font-mono font-semibold text-[#1A3739] dark:text-neutral-200">
            <span>getlinked.lk</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
