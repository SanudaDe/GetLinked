"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, User, ShieldCheck } from "lucide-react";
import { WaitlistModal } from "@/components/home/WaitlistModal";
import { Logo } from "@/components/ui/Logo";
import { useStore } from "@/data/store";
import { formatStorageUrl } from "@/utils/formatters";

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
            ? "bg-[#E0DDAE]/95 backdrop-blur-md border-b border-[#C8C488] py-4 sm:py-4.5 shadow-xs"
            : "bg-[#E0DDAE]/90 backdrop-blur-md border-b border-[#C8C488]/50 py-4.5 sm:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[15px] lg:text-base font-sans font-medium text-[#336467] hover:text-[#D7400B] transition-colors relative py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Center Brand Wordmark / Logo */}
          <div className="flex-1 md:flex-initial text-left md:text-center flex justify-start md:justify-center items-center">
            <Logo href="/" height={44} variant="dark" priority />
          </div>

          {/* Right Navigation & CTAs */}
          <div className="hidden md:flex items-center gap-5 lg:gap-6">
            {authUser ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/status"
                  className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-full hover:bg-black/5 border border-[#C8C488] transition-all bg-[#ECE9C4]/70 shadow-xs group"
                  title="View My Application Status"
                >
                  {authUser.avatar_url ? (
                    <img
                      src={formatStorageUrl(authUser.avatar_url)}
                      alt={authUser.name}
                      className="w-8 h-8 rounded-full object-cover border border-[#336467]/30 shadow-xs"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#336467] text-white flex items-center justify-center text-xs font-bold font-serif">
                      {authUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="text-left">
                    <span className="text-xs font-bold text-[#336467] block leading-tight truncate max-w-[120px] group-hover:text-[#D7400B] transition-colors">
                      {authUser.name}
                    </span>
                    <span className="text-[10px] text-[#336467]/75 block leading-tight font-medium">
                      My Status
                    </span>
                  </div>
                </Link>

                <button
                  onClick={signOutUser}
                  className="text-xs font-semibold text-[#336467]/75 hover:text-rose-700 transition-colors py-1.5 px-2.5 rounded-lg hover:bg-rose-50/60"
                  title="Sign out"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-[15px] lg:text-base font-sans font-medium text-[#336467] hover:text-[#D7400B] transition-colors"
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

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setWaitlistOpen(true)}
              className="px-4 py-2 rounded-full bg-[#D7400B] text-white text-xs font-semibold tracking-wide cursor-pointer"
            >
              Join waitlist
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[#336467] rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="md:hidden bg-[#E0DDAE] border-b border-[#C8C488] px-6 py-6 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
            {/* Authenticated User Banner on Mobile */}
            {authUser && (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#ECE9C4] border border-[#C8C488] shadow-xs">
                <div className="flex items-center gap-3 min-w-0">
                  {authUser.avatar_url ? (
                    <img
                      src={formatStorageUrl(authUser.avatar_url)}
                      alt={authUser.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#336467]/30 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#336467] text-white flex items-center justify-center font-bold font-serif shrink-0">
                      {authUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <strong className="text-xs font-bold text-[#336467] block truncate">
                      {authUser.name}
                    </strong>
                    <span className="text-[11px] text-[#336467]/75 block truncate">
                      {authUser.email}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    signOutUser();
                    setIsOpen(false);
                  }}
                  className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200 shrink-0 ml-2"
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
                  className="block text-lg font-serif text-[#336467] py-1.5 hover:text-[#D7400B]"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-[#C8C488] space-y-2">
                <Link
                  href="/apply"
                  onClick={() => setIsOpen(false)}
                  className="block text-sm uppercase tracking-wider text-[#467679] py-1.5 hover:text-[#336467]"
                >
                  Apply as Creator
                </Link>
                <Link
                  href="/list-property"
                  onClick={() => setIsOpen(false)}
                  className="block text-sm uppercase tracking-wider text-[#467679] py-1.5 hover:text-[#336467]"
                >
                  List Property
                </Link>
                <Link
                  href="/status"
                  onClick={() => setIsOpen(false)}
                  className="block text-sm uppercase tracking-wider text-[#467679] py-1.5 hover:text-[#336467]"
                >
                  Check Application Status
                </Link>
                {!authUser && (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block text-sm uppercase tracking-wider text-[#336467] font-semibold py-1.5"
                  >
                    Log in (Creators & Stays) →
                  </Link>
                )}
              </div>
            </div>

            <div className="pt-2">
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
