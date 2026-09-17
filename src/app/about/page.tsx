import React from "react";
import Link from "next/link";
import { Compass, ShieldCheck, Heart, MapPin, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-16 bg-sand-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/10 text-teal-900 text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-gold-500" />
            Our Story
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-teal-950">
            About Get Linked
          </h1>
          <p className="text-base sm:text-lg text-ink-700 leading-relaxed max-w-2xl mx-auto">
            A curated bridge between genuine digital storytellers and Sri Lanka&apos;s distinctive hospitality heritage.
          </p>
        </div>

        <div className="bg-sand-50 rounded-2xl border border-sand-300 p-8 sm:p-12 shadow-warm space-y-6 text-ink-800 leading-relaxed text-sm sm:text-base">
          <h2 className="font-serif text-2xl font-bold text-teal-950">
            Why We Started
          </h2>
          <p>
            Sri Lanka is one of the world&apos;s most visually captivating island destinations. From the 17th-century ramparts of Galle Fort to misty tea estates in Nuwara Eliya and the surf breaks of Weligama, hospitality providers here offer unforgettable stays.
          </p>
          <p>
            Yet for boutique hotels, villas, and guesthouses, managing influencer inquiries is often overwhelming. Inboxes are flooded with automated messages from accounts with purchased followers, vague travel dates, and uncertain credentials. Meanwhile, professional travel creators traveling to Sri Lanka struggle to reach hotel decision-makers.
          </p>
          <p>
            Get Linked was founded to eliminate this friction through <strong>strict human verification and curated matchmaking</strong>. We manually inspect identity documents, verify social engagement, validate travel dates, and manage introductions with professional discretion.
          </p>

          <div className="p-6 bg-teal-900 text-sand-50 rounded-xl space-y-3 my-8">
            <h3 className="font-serif text-xl font-bold text-gold-400">
              Our Founding Principles
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-sand-200">
              <li>• <strong>Human-in-the-Middle:</strong> No automated bots or cold algorithmic matches. Every collaboration is approved by our team.</li>
              <li>• <strong>Uncompromised Privacy:</strong> Passports and WhatsApp numbers are never publicly searchable.</li>
              <li>• <strong>Sri Lankan Focus:</strong> Dedicated entirely to elevating hospitality across Sri Lanka.</li>
            </ul>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-sand-200 text-xs text-ink-600">
            <div>
              Operating Domains: <span className="font-semibold text-teal-950">getlinkedlk.com</span> • <span className="font-semibold text-teal-950">getlinked.today</span>
            </div>
            <div>
              Colombo, Sri Lanka
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
