"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Compass,
  Sparkles,
  UserCheck,
  Building2,
  HelpCircle,
  ClipboardCheck,
} from "lucide-react";
import { useStore } from "@/data/store";
import { Logo } from "@/components/ui/Logo";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { settings } = useStore();

  const publicNavLinks = [
    { href: "/creators", label: "Find Creators" },
    { href: "/for-creators", label: "For Creators" },
    { href: "/for-accommodations", label: "For Properties" },
    { href: "/how-it-works", label: "How It Works" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Platform Announcement Bar */}
      <div className="bg-teal-950 text-sand-100 text-xs py-2 px-4 border-b border-teal-900/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0 animate-pulse" />
            <span className="font-medium text-[11px] sm:text-xs text-sand-200">
              {settings.platform_phase === "FREE"
                ? "Phase 1 Launch: Verified Sri Lankan stay listings and creator matchmaking are currently 100% free."
                : "Curated collaborations connecting verified creators with exceptional Sri Lankan accommodations."}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-3 shrink-0 text-[11px] text-sand-300 font-mono">
            <span>getlinkedlk.com</span>
            <span className="text-teal-700">•</span>
            <span>getlinked.today</span>
          </div>
        </div>
      </div>

      {/* Main Header (Clean White / Warm-tinted Background) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sand-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Logo href="/" height={34} variant="dark" priority showSubtext subtext="Sri Lanka" />

          {/* Center Primary Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-ink-800">
            {publicNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-teal-600 relative py-1 ${
                  isActive(link.href)
                    ? "text-teal-600 font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-teal-600"
                    : "text-ink-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Controls & Primary CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/status"
              className="text-xs font-semibold text-ink-700 hover:text-teal-600 flex items-center gap-1.5 transition-colors py-1.5 px-2"
            >
              <ClipboardCheck className="w-4 h-4 text-teal-600" />
              <span>Check Application</span>
            </Link>

            <Link
              href="/contact"
              className="text-xs font-semibold text-ink-700 hover:text-teal-600 flex items-center gap-1.5 transition-colors py-1.5 px-2"
            >
              <HelpCircle className="w-4 h-4 text-teal-600" />
              <span>Help</span>
            </Link>

            <div className="h-6 w-px bg-sand-300 mx-1" />

            <Link
              href="/list-property"
              className="text-xs font-semibold uppercase tracking-wider text-teal-950 bg-sand-100 hover:bg-sand-200 px-4 py-2.5 rounded-lg border border-sand-300 transition-all shadow-xs"
            >
              List Your Property
            </Link>

            <Link
              href="/apply"
              className="text-xs font-bold uppercase tracking-wider text-white bg-teal-600 hover:bg-teal-700 px-4 py-2.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-white" />
              <span>Join as Creator</span>
            </Link>
          </div>

          {/* Mobile Navigation Trigger */}
          <div className="flex items-center gap-3 lg:hidden">
            <Link
              href="/status"
              className="text-xs font-semibold text-teal-950 flex items-center gap-1 bg-sand-100 px-2.5 py-1.5 rounded-md border border-sand-300"
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-teal-800" />
              <span>Status</span>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-lg text-ink-800 hover:bg-sand-100 focus:outline-none focus:ring-2 focus:ring-teal-900"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white border-b border-sand-300 px-6 py-6 space-y-5 animate-in slide-in-from-top-2 shadow-lg">
            <div className="flex flex-col space-y-3 font-medium text-ink-800">
              {publicNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`py-2 px-3 rounded-lg text-base transition-colors ${
                    isActive(link.href)
                      ? "bg-sand-100 text-teal-950 font-semibold"
                      : "hover:bg-sand-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/status"
                onClick={() => setIsOpen(false)}
                className="py-2 px-3 rounded-lg text-base text-ink-700 hover:bg-sand-50 flex items-center gap-2"
              >
                <ClipboardCheck className="w-4 h-4 text-teal-800" />
                <span>Check Application Status</span>
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="py-2 px-3 rounded-lg text-base text-ink-700 hover:bg-sand-50 flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4 text-teal-800" />
                <span>Help & Concierge Inquiries</span>
              </Link>
            </div>

            <div className="pt-4 border-t border-sand-300 flex flex-col gap-3">
              <Link
                href="/list-property"
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-sm font-semibold uppercase tracking-wider text-teal-950 bg-sand-100 hover:bg-sand-200 py-3 rounded-lg border border-sand-400/80 shadow-xs"
              >
                List Your Property
              </Link>
              <Link
                href="/apply"
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-sm font-bold uppercase tracking-wider text-white bg-teal-600 hover:bg-teal-700 py-3 rounded-lg shadow-sm flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-white" />
                <span>Join as Creator</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
