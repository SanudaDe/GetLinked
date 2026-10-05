"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, User, ShieldCheck } from "lucide-react";
import { WaitlistModal } from "@/components/home/WaitlistModal";
import { Logo } from "@/components/ui/Logo";
import { useStore } from "@/data/store";
import { formatStorageUrl } from "@/utils/formatters";

import { ThemeSwitch } from "@/components/ui/ThemeSwitch";

export const Navbar: React.FC = () => {
  const { authUser, signOutUser } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/creators", label: "Creators" },
    { href: "/for-accommodations", label: "Stays" },
    { href: isHomePage ? "#our-story" : "/about", label: "Our Story" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled || !isHomePage
            ? "bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-200/80 dark:border-neutral-800 py-4 sm:py-4.5 shadow-xs"
            : "bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-gray-200/50 dark:border-neutral-800/60 py-4.5 sm:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[15px] lg:text-base font-sans font-medium text-[#336467] dark:text-neutral-300 hover:text-[#D7400B] dark:hover:text-[#D7400B] transition-colors relative py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Center Brand Wordmark / Logo */}
          <div className="flex-1 md:flex-initial text-left md:text-center flex justify-start md:justify-center items-center min-w-0 pr-1">
            <div className="md:hidden">
              <Logo href="/" height={28} variant="dark" priority />
            </div>
            <div className="hidden md:block">
              <Logo href="/" height={44} variant="dark" priority />
            </div>
          </div>

          {/* Right Navigation & CTAs */}
          <div className="hidden md:flex items-center gap-4 lg:gap-5">
            {/* Theme Toggle Switch */}
            <ThemeSwitch />

            {authUser ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/status"
                  className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 border border-gray-200 dark:border-neutral-800 transition-all bg-gray-50 dark:bg-neutral-900 shadow-xs group"
                  title="View My Application Status"
                >
                  {authUser.avatar_url ? (
                    <img
                      src={formatStorageUrl(authUser.avatar_url)}
                      alt={authUser.name}
                      className="w-8 h-8 rounded-full object-cover border border-[#336467]/30 dark:border-neutral-700 shadow-xs"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#336467] dark:bg-neutral-800 text-white flex items-center justify-center text-xs font-bold font-serif">
                      {authUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="text-left">
                    <span className="text-xs font-bold text-[#336467] dark:text-neutral-200 block leading-tight truncate max-w-[120px] group-hover:text-[#D7400B] transition-colors">
                      {authUser.name}
                    </span>
                    <span className="text-[10px] text-[#336467]/75 dark:text-neutral-400 block leading-tight font-medium">
                      My Status
                    </span>
                  </div>
                </Link>

                <button
                  onClick={signOutUser}
                  className="text-xs font-semibold text-[#336467]/75 dark:text-neutral-400 hover:text-rose-700 dark:hover:text-rose-400 transition-colors py-1.5 px-2.5 rounded-lg hover:bg-rose-50/60 dark:hover:bg-rose-950/40"
                  title="Sign out"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-[15px] lg:text-base font-sans font-medium text-[#336467] dark:text-neutral-300 hover:text-[#D7400B] dark:hover:text-[#D7400B] transition-colors"
              >
                Log in
              </Link>
            )}

            <button
              onClick={() => setWaitlistOpen(true)}
              className="px-6 py-2.5 rounded-full bg-[#D7400B] hover:bg-[#BD3607] text-white text-[13px] sm:text-sm font-semibold tracking-wide shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              Join waitlist
            </button>
          </div>

          {/* Mobile Hamburger Button & Action Bar */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            <ThemeSwitch compact />
            <button
              onClick={() => setWaitlistOpen(true)}
              className="px-3 py-1.5 rounded-full bg-[#D7400B] text-white text-xs font-semibold tracking-wide cursor-pointer shrink-0"
            >
              Waitlist
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 text-[#336467] dark:text-neutral-200 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="md:hidden bg-white dark:bg-neutral-950 border-b border-gray-200 dark:border-neutral-800 px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
            {/* Authenticated User Banner on Mobile */}
            {authUser && (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-xs">
                <div className="flex items-center gap-3 min-w-0">
                  {authUser.avatar_url ? (
                    <img
                      src={formatStorageUrl(authUser.avatar_url)}
                      alt={authUser.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#336467]/30 dark:border-neutral-700 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#336467] dark:bg-neutral-800 text-white flex items-center justify-center font-bold font-serif shrink-0">
                      {authUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <strong className="text-xs font-bold text-[#336467] dark:text-neutral-100 block truncate">
                      {authUser.name}
                    </strong>
                    <span className="text-[11px] text-[#336467]/75 dark:text-neutral-400 block truncate">
                      {authUser.email}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    signOutUser();
                    setIsOpen(false);
                  }}
                  className="text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900 shrink-0 ml-2"
                >
                  Log out
                </button>
              </div>
            )}

            <div className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-serif text-[#336467] dark:text-neutral-100 py-1.5 hover:text-[#D7400B] dark:hover:text-[#D7400B]"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-200 dark:border-neutral-800 space-y-2">
                <Link
                  href="/apply"
                  onClick={() => setIsOpen(false)}
                  className="block text-sm uppercase tracking-wider text-[#467679] dark:text-neutral-400 py-1.5 hover:text-[#336467] dark:hover:text-white"
                >
                  Apply as Creator
                </Link>
                <Link
                  href="/list-property"
                  onClick={() => setIsOpen(false)}
                  className="block text-sm uppercase tracking-wider text-[#467679] dark:text-neutral-400 py-1.5 hover:text-[#336467] dark:hover:text-white"
                >
                  List Property
                </Link>
                <Link
                  href="/status"
                  onClick={() => setIsOpen(false)}
                  className="block text-sm uppercase tracking-wider text-[#467679] dark:text-neutral-400 py-1.5 hover:text-[#336467] dark:hover:text-white"
                >
                  Check Application Status
                </Link>
                {!authUser && (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block text-sm uppercase tracking-wider text-[#336467] dark:text-neutral-200 font-semibold py-1.5 hover:text-[#D7400B]"
                  >
                    Log in (Creators & Stays) →
                  </Link>
                )}
              </div>
            </div>

            {/* Theme Toggle in Mobile Drawer */}
            <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-neutral-800">
              <span className="text-sm font-sans font-medium text-[#336467] dark:text-neutral-200">
                Appearance
              </span>
              <ThemeSwitch showLabels />
            </div>

            <div className="pt-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setWaitlistOpen(true);
                }}
                className="w-full py-3.5 rounded-full bg-[#D7400B] hover:bg-[#BD3607] text-white text-sm font-semibold uppercase tracking-widest text-center shadow-sm cursor-pointer"
              >
                Join waitlist
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Waitlist Modal Triggerable Globally */}
      <WaitlistModal isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </>
  );
};
