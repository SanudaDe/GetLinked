"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#E0DDAE] text-[#336467] border-t border-[#C8C488]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">
          {/* Brand & Tagline */}
          <div className="md:col-span-4 space-y-3">
            <Logo href="/" height={36} variant="dark" />
            <p className="font-serif italic text-base text-[#336467]/80">
              Sri Lanka, told properly.
            </p>
          </div>

          {/* Nav Column 1: For Creators */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#336467] block">
              For Creators
            </span>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#336467]/80">
              <li>
                <Link href="/for-creators" className="hover:text-[#D7400B] transition-colors">
                  Creator Program
                </Link>
              </li>
              <li>
                <Link href="/apply" className="hover:text-[#D7400B] transition-colors flex items-center gap-1">
                  <span>Apply to Join</span>
                  <ArrowUpRight className="w-3 h-3 text-[#336467]/60" />
                </Link>
              </li>
              <li>
                <Link href="/creators" className="hover:text-[#D7400B] transition-colors">
                  Current Directory
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-[#D7400B] transition-colors">
                  Check Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Column 2: For Stays */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#336467] block">
              For Stays
            </span>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#336467]/80">
              <li>
                <Link href="/for-accommodations" className="hover:text-[#D7400B] transition-colors">
                  Host Program
                </Link>
              </li>
              <li>
                <Link href="/list-property" className="hover:text-[#D7400B] transition-colors flex items-center gap-1">
                  <span>List Your Stay</span>
                  <ArrowUpRight className="w-3 h-3 text-[#336467]/60" />
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#D7400B] transition-colors">
                  How Introductions Work
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#D7400B] transition-colors">
                  Frequently Asked
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Column 3: Trust & Privacy */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#336467] block">
              Trust & Privacy
            </span>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#336467]/80">
              <li>
                <Link href="/privacy" className="hover:text-[#D7400B] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#D7400B] transition-colors">
                  Terms of Collaboration
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#D7400B] transition-colors">
                  Contact Curators
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-[#D7400B] transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Hairline & Fine Print */}
        <div className="mt-14 pt-8 border-t border-[#C8C488] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#336467]/70">
          <p>© 2026 Get Linked Sri Lanka. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px] font-mono text-[#336467]/70">
            <span>getlinked.today</span>
            <span>•</span>
            <span>getlinkedlk.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
