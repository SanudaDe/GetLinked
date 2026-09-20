"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, User, ShieldCheck } from "lucide-react";
import { WaitlistModal } from "@/components/home/WaitlistModal";
import { Logo } from "@/components/ui/Logo";

export const Navbar: React.FC = () => {
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
            ? "bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E7E2DA] py-3.5 shadow-xs"
            : "bg-gradient-to-b from-black/20 via-transparent to-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[13px] font-sans font-medium tracking-wide text-[#122026] hover:text-black transition-colors relative py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Center Brand Wordmark / Logo */}
          <div className="flex-1 md:flex-initial text-left md:text-center flex justify-start md:justify-center items-center">
            <Logo href="/" height={34} variant="dark" priority />
          </div>

          {/* Right Navigation & CTAs */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/admin/login"
              className="text-[13px] font-sans font-medium tracking-wide text-[#122026] hover:text-black transition-colors"
            >
              Log in
            </Link>

            <button
              onClick={() => setWaitlistOpen(true)}
              className="px-5 py-2 rounded-full bg-[#25aca9] hover:bg-[#1e9693] text-white text-xs font-medium tracking-wide shadow-sm hover:shadow transition-all duration-200"
            >
              Join waitlist
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setWaitlistOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-[#25aca9] text-white text-[11px] font-medium tracking-wide"
            >
              Join waitlist
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[#122026] rounded-lg hover:bg-black/5 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="md:hidden bg-[#FAF8F5] border-b border-[#E7E2DA] px-6 py-6 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
            <div className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-base font-serif text-[#122026] py-1 hover:text-[#C4A67B]"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-[#E7E2DA] space-y-2">
                <Link
                  href="/apply"
                  onClick={() => setIsOpen(false)}
                  className="block text-xs uppercase tracking-wider text-[#5E686F] py-1 hover:text-[#122026]"
                >
                  Apply as Creator
                </Link>
                <Link
                  href="/list-property"
                  onClick={() => setIsOpen(false)}
                  className="block text-xs uppercase tracking-wider text-[#5E686F] py-1 hover:text-[#122026]"
                >
                  List Property
                </Link>
                <Link
                  href="/status"
                  onClick={() => setIsOpen(false)}
                  className="block text-xs uppercase tracking-wider text-[#5E686F] py-1 hover:text-[#122026]"
                >
                  Check Application Status
                </Link>
                <Link
                  href="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-xs uppercase tracking-wider text-[#122026] font-semibold py-1"
                >
                  Admin / Log in →
                </Link>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setWaitlistOpen(true);
                }}
                className="w-full py-3 rounded-full bg-[#25aca9] hover:bg-[#1e9693] text-white text-xs font-medium uppercase tracking-widest text-center shadow-sm"
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
