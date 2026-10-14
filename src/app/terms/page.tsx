import React from "react";

export default function TermsPage() {
  return (
    <div className="py-16 bg-sand-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-teal-950">
            Terms of Service & Collaboration Guidelines
          </h1>
          <p className="text-xs sm:text-sm text-ink-600">
            Governing Get Linked Sri Lanka (getlinked.lk)
          </p>
        </div>

        <div className="bg-sand-50 rounded-2xl border border-sand-300 p-8 sm:p-12 shadow-warm space-y-6 text-ink-800 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-teal-950">1. Nature of the Service</h2>
            <p>
              Get Linked acts as a curated introduction intermediary connecting verified content creators with accommodation providers in Sri Lanka. Get Linked is not an employer, travel agency, or direct party to the hospitality stay contract.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-teal-950">2. Creator Code of Conduct</h2>
            <p>
              Creators agree to arrive on confirmed dates, treat accommodation staff and property with respect, and deliver promotional assets (reels, photos, posts) in accordance with agreed terms within 7 days of stay conclusion.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-teal-950">3. Host Obligations</h2>
            <p>
              Accommodation hosts agree to provide accommodations matching the description submitted, honor agreed meal arrangements, and treat creators cordially.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-teal-950">4. Cancellation & Discretion</h2>
            <p>
              Get Linked reserves the right to reject or revoke the verification status of any party found misrepresenting follower counts, utilizing false identity documents, or violating local laws.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
