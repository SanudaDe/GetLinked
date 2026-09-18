"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FAF8F5] text-[#122026] border-t border-[#E7E2DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">
          {/* Brand & Mission Statement */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              className="inline-block font-serif text-2xl sm:text-3xl text-[#122026] tracking-tight hover:opacity-90 transition-opacity"
            >
              Get Linked
            </Link>
            <p className="text-xs sm:text-sm text-[#5E686F] max-w-sm leading-relaxed">
              Connecting verified creators with distinctive boutique stays across Sri Lanka. Every introduction is curated with care and verified with authentic review.
            </p>
            <p className="text-[11px] font-mono tracking-wider text-[#8A949C] uppercase">
              SRI LANKA • REAL CONNECTIONS
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A949C] block">
              PLATFORM
            </span>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#5E686F]">
              <li>
                <Link href="/creators" className="hover:text-[#122026] transition-colors">
                  Creators Directory
                </Link>
              </li>
              <li>
                <Link href="/for-accommodations" className="hover:text-[#122026] transition-colors">
                  For Properties
                </Link>
              </li>
              <li>
                <Link href="/for-creators" className="hover:text-[#122026] transition-colors">
                  For Creators
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#122026] transition-colors">
                  Our Story
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A949C] block">
              ONBOARDING
            </span>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#5E686F]">
              <li>
                <Link href="/apply" className="hover:text-[#122026] transition-colors flex items-center gap-1">
                  <span>Apply as Creator</span>
                  <ArrowUpRight className="w-3 h-3 text-[#8A949C]" />
                </Link>
              </li>
              <li>
                <Link href="/list-property" className="hover:text-[#122026] transition-colors flex items-center gap-1">
                  <span>List Your Stay</span>
                  <ArrowUpRight className="w-3 h-3 text-[#8A949C]" />
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-[#122026] transition-colors">
                  Application Status
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#122026] transition-colors">
                  Frequently Asked
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A949C] block">
              COLOMBO & COAST
            </span>
            <p className="text-xs text-[#5E686F] leading-relaxed">
              Curating stays in Galle Fort, Thalpe, Mirissa, Tangalle, Ella Highlands, Kandy, Sigiriya, and Colombo.
            </p>
            <div className="pt-2 text-xs text-[#5E686F]">
              <Link href="/contact" className="underline hover:text-[#122026]">
                Get in touch with curators
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Hairline & Legal */}
        <div className="mt-14 pt-8 border-t border-[#E7E2DA] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8A949C]">
          <p>© 2026 Get Linked Sri Lanka. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[#122026] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#122026] transition-colors">
              Terms of Collaboration
            </Link>
            <Link href="/admin/login" className="hover:text-[#122026] transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
