"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, ShieldCheck, Heart, MapPin } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export const Footer: React.FC = () => {
  const pathname = usePathname();


  return (
    <footer className="bg-teal-950 text-sand-100 border-t border-teal-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Brand & Ethos */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" height={44} href="/" showSubtext subtext="Sri Lanka • Marketplace" />
            <p className="text-sm text-sand-300 max-w-sm leading-relaxed">
              Sri Lanka&apos;s curated collaboration platform connecting verified social media creators with hand-selected hotels, villas, and guesthouses. Curated with human review and personal introductions.
            </p>
            <div className="flex items-center gap-2 text-xs text-sand-300">
              <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Colombo • Galle • Kandy • Ella • Mirissa • Sigiriya</span>
            </div>
            <div className="pt-2 text-xs text-sand-300">
              Domains: <span className="text-sand-100">getlinkedlk.com</span> | <span className="text-sand-100">getlinked.today</span>
            </div>
          </div>

          {/* Col 3: For Creators */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-sand-50 tracking-wide">
              For Creators
            </h4>
            <ul className="space-y-2 text-sm text-sand-300">
              <li>
                <Link href="/for-creators" className="hover:text-gold-400 transition-colors">
                  Creator Benefits
                </Link>
              </li>
              <li>
                <Link href="/apply" className="hover:text-gold-400 transition-colors font-medium text-gold-400">
                  Apply to Join (5K+ Followers)
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-gold-400 transition-colors">
                  Check Application Status
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-gold-400 transition-colors">
                  The Verification Process
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: For Accommodations */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-sand-50 tracking-wide">
              For Stays
            </h4>
            <ul className="space-y-2 text-sm text-sand-300">
              <li>
                <Link href="/for-accommodations" className="hover:text-gold-400 transition-colors">
                  Host Program
                </Link>
              </li>
              <li>
                <Link href="/list-property" className="hover:text-gold-400 transition-colors font-medium text-gold-400">
                  List Your Property (Free)
                </Link>
              </li>
              <li>
                <Link href="/creators" className="hover:text-gold-400 transition-colors">
                  Browse Creator Directory
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-gold-400 transition-colors">
                  Check Listing Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Trust & Compliance */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-sand-50 tracking-wide">
              Trust & Privacy
            </h4>
            <ul className="space-y-2 text-sm text-sand-300">
              <li>
                <Link href="/privacy" className="hover:text-gold-400 transition-colors">
                  Privacy Policy (PDPA)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gold-400 transition-colors">
                  Terms of Collaboration
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold-400 transition-colors">
                  About Get Linked
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gold-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li className="pt-1">
                <Link href="/admin" className="hover:text-gold-400 transition-colors inline-flex items-center gap-1.5 text-xs text-sand-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                  <span>Staff / Admin</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-teal-900/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sand-300">
          <p>© {new Date().getFullYear()} Get Linked Sri Lanka. All rights reserved. Private identity documents never exposed.</p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1 text-sand-300">
              <span>Built with care for Sri Lankan hospitality</span>
              <Heart className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-sand-100 hover:text-white border border-teal-700/70 font-medium text-xs transition-all shadow-sm hover:shadow"
              title="Staff Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
              <span>Admin Panel</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
