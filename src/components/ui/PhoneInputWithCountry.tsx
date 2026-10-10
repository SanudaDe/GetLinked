"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import {
  CountryCodeItem,
  POPULAR_COUNTRIES,
  ALL_COUNTRIES,
  parsePhoneWithCountry,
} from "@/data/countryCodes";

interface PhoneInputWithCountryProps {
  value: string;
  onChange: (fullE164Phone: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  defaultCountryCode?: string; // e.g. "LK" or "GB"
  className?: string;
}

export function PhoneInputWithCountry({
  value,
  onChange,
  placeholder = "e.g. 77 123 4567",
  required = false,
  disabled = false,
  id,
  name,
  defaultCountryCode = "LK",
  className = "",
}: PhoneInputWithCountryProps) {
  // Parse incoming value into Country + National Number
  const initialParsed = useMemo(
    () => parsePhoneWithCountry(value, defaultCountryCode),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [selectedCountry, setSelectedCountry] = useState<CountryCodeItem>(initialParsed.country);
  const [nationalNumber, setNationalNumber] = useState<string>(initialParsed.nationalNumber);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const numberInputRef = useRef<HTMLInputElement>(null);

  // Sync with external value changes if phone string was updated externally
  useEffect(() => {
    if (!value) {
      setNationalNumber("");
      return;
    }
    const parsed = parsePhoneWithCountry(value, selectedCountry.code);
    setSelectedCountry(parsed.country);
    setNationalNumber(parsed.nationalNumber);
  }, [value]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Auto-focus search input
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Combine and emit full phone number whenever country or national number changes
  const updatePhoneNumber = (country: CountryCodeItem, localNumber: string) => {
    let cleanedLocal = localNumber.replace(/[^0-9]/g, "");
    if (cleanedLocal.startsWith("0")) {
      cleanedLocal = cleanedLocal.replace(/^0+/, "");
    }
    if (!cleanedLocal) {
      onChange("");
    } else {
      onChange(`${country.dialCode}${cleanedLocal}`);
    }
  };

  const handleCountrySelect = (country: CountryCodeItem) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchQuery("");
    updatePhoneNumber(country, nationalNumber);
    // Return focus to number input
    setTimeout(() => {
      numberInputRef.current?.focus();
    }, 50);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;

    // Check if user pasted an international number with +
    if (rawVal.trim().startsWith("+")) {
      const parsed = parsePhoneWithCountry(rawVal, selectedCountry.code);
      setSelectedCountry(parsed.country);
      setNationalNumber(parsed.nationalNumber);
      updatePhoneNumber(parsed.country, parsed.nationalNumber);
      return;
    }

    setNationalNumber(rawVal);
    updatePhoneNumber(selectedCountry, rawVal);
  };

  // Filter countries for search
  const filteredCountries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return ALL_COUNTRIES;
    return ALL_COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.replace("+", "").includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Phone Input Box Group */}
      <div className="flex items-center w-full rounded-lg border border-sand-400 dark:border-neutral-700 bg-sand-50 dark:bg-neutral-900 focus-within:ring-2 focus-within:ring-teal-900 dark:focus-within:ring-[#D7400B] focus-within:border-transparent transition-all shadow-xs">
        {/* Country Code Trigger Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-1.5 px-3 py-3 rounded-l-lg border-r border-sand-300 dark:border-neutral-700 hover:bg-sand-100 dark:hover:bg-neutral-800 text-teal-950 dark:text-neutral-100 text-sm font-semibold transition-colors shrink-0 cursor-pointer focus:outline-none"
          title="Select country code"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="text-lg leading-none" role="img" aria-label={selectedCountry.name}>
            {selectedCountry.flag}
          </span>
          <span className="font-mono text-xs font-bold tracking-tight text-teal-900 dark:text-neutral-200">
            {selectedCountry.dialCode}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-ink-400 dark:text-neutral-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* National Number Input Field */}
        <input
          ref={numberInputRef}
          type="tel"
          id={id}
          name={name}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          value={nationalNumber}
          onChange={handleNumberChange}
          className="w-full px-3.5 py-3 rounded-r-lg bg-transparent text-sm text-teal-950 dark:text-white placeholder:text-ink-400 dark:placeholder:text-neutral-500 focus:outline-none font-sans"
        />
      </div>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute z-50 left-0 top-full mt-1.5 w-72 sm:w-80 rounded-xl bg-white dark:bg-neutral-900 border border-sand-300 dark:border-neutral-700 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Search Header */}
          <div className="p-2.5 border-b border-sand-200 dark:border-neutral-800 bg-sand-50/70 dark:bg-neutral-950/60 sticky top-0 z-10">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-2.5 text-ink-400 dark:text-neutral-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search country or code (e.g. 44, UK)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-sand-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs text-teal-950 dark:text-neutral-100 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-teal-800 dark:focus:ring-[#D7400B]"
              />
            </div>
          </div>

          {/* List of Countries */}
          <div className="max-h-60 overflow-y-auto divide-y divide-sand-100 dark:divide-neutral-800/60 overscroll-contain">
            {/* Quick Popular section if not searching */}
            {!searchQuery.trim() && (
              <div className="py-1 bg-sand-50/30 dark:bg-neutral-950/20">
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-400 dark:text-neutral-500 block">
                  Popular Countries
                </span>
                {POPULAR_COUNTRIES.map((country) => {
                  const isSelected = selectedCountry.code === country.code;
                  return (
                    <button
                      key={`pop-${country.code}`}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className={`w-full px-3 py-1.5 text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-teal-50 dark:bg-neutral-800 font-bold text-teal-950 dark:text-white"
                          : "hover:bg-sand-100 dark:hover:bg-neutral-800 text-ink-800 dark:text-neutral-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="text-base leading-none">{country.flag}</span>
                        <span className="truncate">{country.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-mono text-ink-500 dark:text-neutral-400 text-[11px]">
                          {country.dialCode}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-teal-800 dark:text-teal-400" />}
                      </div>
                    </button>
                  );
                })}
                <div className="border-t border-sand-200 dark:border-neutral-800 my-1" />
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-400 dark:text-neutral-500 block">
                  All Countries
                </span>
              </div>
            )}

            {filteredCountries.length === 0 ? (
              <div className="p-4 text-center text-xs text-ink-400 dark:text-neutral-500">
                No country found matching &ldquo;{searchQuery}&rdquo;
              </div>
            ) : (
              filteredCountries.map((country) => {
                const isSelected = selectedCountry.code === country.code;
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-teal-50 dark:bg-neutral-800 font-bold text-teal-950 dark:text-white"
                        : "hover:bg-sand-100 dark:hover:bg-neutral-800 text-ink-800 dark:text-neutral-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="text-base leading-none">{country.flag}</span>
                      <span className="truncate">{country.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-mono text-ink-500 dark:text-neutral-400 text-[11px]">
                        {country.dialCode}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-teal-800 dark:text-teal-400" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
