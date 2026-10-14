"use client";

import React, { useState } from "react";
import { Mail, MessageCircle, MapPin, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="py-16 bg-white dark:bg-black text-[#1A3739] dark:text-white min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-14">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-teal-950 dark:text-white tracking-tight leading-tight">
            Contact Get Linked
          </h1>
          <p className="text-[22px] sm:text-[26px] lg:text-[28px] text-[#1A3739] dark:text-neutral-100 leading-relaxed max-w-2xl mx-auto font-normal pt-1">
            Have questions regarding creator verification, property onboarding, or media collaborations?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-sand-50 dark:bg-neutral-950 rounded-2xl border border-sand-300 dark:border-neutral-800 p-6 text-center space-y-3 shadow-warm">
            <div className="w-10 h-10 rounded-xl bg-teal-900 dark:bg-neutral-900 text-gold-400 flex items-center justify-center mx-auto">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-teal-950 dark:text-white">WhatsApp Concierge</h3>
            <p className="text-xs text-ink-600 dark:text-neutral-400">Available Mon-Sat, 9am-6pm IST</p>
            <p className="font-mono text-xs font-semibold text-teal-900 dark:text-teal-400">+94 77 123 4567</p>
          </div>

          <div className="bg-sand-50 dark:bg-neutral-950 rounded-2xl border border-sand-300 dark:border-neutral-800 p-6 text-center space-y-3 shadow-warm">
            <div className="w-10 h-10 rounded-xl bg-teal-900 dark:bg-neutral-900 text-gold-400 flex items-center justify-center mx-auto">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-teal-950 dark:text-white">Email Support</h3>
            <p className="text-xs text-ink-600 dark:text-neutral-400">General inquiries & partnerships</p>
            <p className="font-mono text-xs font-semibold text-teal-900 dark:text-teal-400">hello@getlinked.today</p>
          </div>

          <div className="bg-sand-50 dark:bg-neutral-950 rounded-2xl border border-sand-300 dark:border-neutral-800 p-6 text-center space-y-3 shadow-warm">
            <div className="w-10 h-10 rounded-xl bg-teal-900 dark:bg-neutral-900 text-gold-400 flex items-center justify-center mx-auto">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-teal-950 dark:text-white">Location</h3>
            <p className="text-xs text-ink-600 dark:text-neutral-400">Headquarters</p>
            <p className="text-xs font-medium text-teal-900 dark:text-teal-400">Colombo 03, Sri Lanka</p>
          </div>
        </div>

        {/* Simple Message Form */}
        <div className="bg-sand-50 dark:bg-neutral-950 rounded-2xl border border-sand-300 dark:border-neutral-800 p-8 shadow-warm max-w-xl mx-auto">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-serif text-lg font-bold text-teal-950 dark:text-white">Message Sent!</h4>
              <p className="text-xs text-ink-700 dark:text-neutral-400">Our concierge team will reply within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">Your Name</label>
                <input required type="text" className="w-full px-3 py-2.5 rounded-lg border border-sand-400 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-teal-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-900 dark:focus:ring-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">Email / WhatsApp</label>
                <input required type="text" className="w-full px-3 py-2.5 rounded-lg border border-sand-400 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-teal-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-900 dark:focus:ring-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">Message</label>
                <textarea required rows={4} className="w-full px-3 py-2.5 rounded-lg border border-sand-400 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-teal-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-900 dark:focus:ring-white" />
              </div>
              <button type="submit" className="w-full py-3 rounded-lg bg-teal-900 hover:bg-teal-800 dark:bg-[#D7400B] dark:hover:bg-[#BD3607] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer">
                Send Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
