"use client";

import React, { useState } from "react";
import { Mail, MessageCircle, MapPin, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="py-16 bg-sand-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-teal-950">
            Contact Get Linked
          </h1>
          <p className="text-sm sm:text-base text-ink-700">
            Have questions regarding creator verification, property onboarding, or media collaborations?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-sand-50 rounded-2xl border border-sand-300 p-6 text-center space-y-3 shadow-warm">
            <div className="w-10 h-10 rounded-xl bg-teal-900 text-gold-400 flex items-center justify-center mx-auto">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-teal-950">WhatsApp Concierge</h3>
            <p className="text-xs text-ink-600">Available Mon-Sat, 9am-6pm IST</p>
            <p className="font-mono text-xs font-semibold text-teal-900">+94 77 123 4567</p>
          </div>

          <div className="bg-sand-50 rounded-2xl border border-sand-300 p-6 text-center space-y-3 shadow-warm">
            <div className="w-10 h-10 rounded-xl bg-teal-900 text-gold-400 flex items-center justify-center mx-auto">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-teal-950">Email Support</h3>
            <p className="text-xs text-ink-600">General inquiries & partnerships</p>
            <p className="font-mono text-xs font-semibold text-teal-900">hello@getlinked.today</p>
          </div>

          <div className="bg-sand-50 rounded-2xl border border-sand-300 p-6 text-center space-y-3 shadow-warm">
            <div className="w-10 h-10 rounded-xl bg-teal-900 text-gold-400 flex items-center justify-center mx-auto">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-teal-950">Location</h3>
            <p className="text-xs text-ink-600">Headquarters</p>
            <p className="text-xs font-medium text-teal-900">Colombo 03, Sri Lanka</p>
          </div>
        </div>

        {/* Simple Message Form */}
        <div className="bg-sand-50 rounded-2xl border border-sand-300 p-8 shadow-warm max-w-xl mx-auto">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-serif text-lg font-bold text-teal-950">Message Sent!</h4>
              <p className="text-xs text-ink-700">Our concierge team will reply within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">Your Name</label>
                <input required type="text" className="w-full px-3 py-2.5 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">Email / WhatsApp</label>
                <input required type="text" className="w-full px-3 py-2.5 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">Message</label>
                <textarea required rows={4} className="w-full px-3 py-2.5 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900" />
              </div>
              <button type="submit" className="w-full py-3 rounded-lg bg-teal-900 text-sand-50 text-xs font-semibold uppercase tracking-wider hover:bg-teal-800 transition-colors">
                Send Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
