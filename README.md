# Get Linked — Sri Lanka Creator & Stay Marketplace

**Domains**: `getlinkedlk.com` • `getlinked.today`

Get Linked is a two-sided marketplace connecting verified social media influencers and creators with hand-selected hotels, villas, guesthouses, and resorts across Sri Lanka.

The platform is strictly human-in-the-middle:
**APPLY → VERIFY → APPROVE → DISCOVER → REQUEST → HUMAN MATCHING → INTRODUCTION**

---

## 🌴 Core Architecture & Business Rules

1. **Human-in-the-Middle**: No automated approvals. Every creator and accommodation is manually reviewed by the Get Linked team before appearing in the directory or matching workspace.
2. **Absolute Contact Privacy**: WhatsApp numbers and government-issued ID/passports are **never** exposed publicly or via public APIs.
3. **Curated Introductions**: Direct creator-to-hotel messaging is prohibited. Confirmed matches generate pre-filled WhatsApp concierge links for manual admin introduction.
4. **18+ Age & 5,000+ Follower Validation**: Strictly enforced on creator submissions.
5. **Date Overlap Algorithm**: Real mathematical overlap (`creator.visit_start <= acc.coverage_end AND creator.visit_end >= acc.coverage_start`).
6. **1,000 Active Creator Pool Cap**: Enforced with warning thresholds in admin settings and dashboard.
7. **Two-Phase Commercial Model**:
   - **Phase 1 (Free / Launch)**: Months 1–3. Free for creators and accommodations. Monetized via sponsor banners.
   - **Phase 2 (Paid)**: Accommodations pay per collaboration or subscription. Configurable via Settings without codebase rewrites.

---

## 🚀 Quick Start (Zero-Database UI Preview)

The platform includes a complete in-memory and `localStorage`-persisted mock data store with realistic Sri Lankan destinations (Galle, Colombo, Weligama, Ella, Kandy, Sigiriya), enabling full testing of all workflows without requiring an external database.

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗺️ Page & Route Map

### Public Pages
- `/` — Home page (Hero, Value Proposition, 4-Step Process, Live Match Showcase, Featured Creators, Why Us, PDPA Trust, Ad Banner, FAQ)
- `/how-it-works` — Detailed operational walkthrough of the human-in-the-middle model
- `/for-creators` — Creator benefits, eligibility rules (18+, 5k+ followers), supported niches
- `/for-accommodations` — Host benefits, offer models, and phase-aware pricing notice
- `/creators` — Public Creator Directory with live search, city filter, niche filter, date overlap filter, follower tier filter, and &ldquo;Request this Creator&rdquo; modal
- `/apply` — 5-Step Mobile-First Creator Application Wizard with ID upload & PDPA consent
- `/list-property` — Mobile-First Accommodation Listing Form
- `/status` — Rate-safe Application Status Lookup using WhatsApp + Reference Code (`GL-C-XXXX` or `GL-A-XXXX`)
- `/about` — Brand story & Sri Lankan hospitality ethos
- `/contact` — Support and concierge contacts
- `/privacy` — Privacy Policy compliant with Sri Lanka Personal Data Protection Act (PDPA)
- `/terms` — Marketplace terms of service

### Staff Admin Backoffice (`/admin`)
- `/admin/login` — Staff credentials gateway (Demo passwords: `admin123` or `getlinked2026`)
- `/admin` — Operations Dashboard (KPIs, queues, 1,000 capacity gauge)
- `/admin/creators` — Creator Queue (Tabs: Pending, Approved, Rejected; Duplicate flags; Private document inspection modal; Approve/Reject actions)
- `/admin/accommodations` — Accommodations Queue (Review property specs, offer types, Approve/Reject)
- `/admin/requests` — Creator Requests Queue (Incoming accommodation requests; Convert to Match)
- `/admin/matching` — Proactive Human Matchmaking Workspace (Dual-column pairing tool with transparent date overlap and follower criteria)
- `/admin/matches` — Confirmed Matches Manager (Pre-filled WhatsApp click-to-chat links for host and creator, timestamp tracking)
- `/admin/advertisements` — Phase 1 Ad Campaign Manager (Placements on Home and Accommodation directory)
- `/admin/analytics` — Operational analytics (Approval rates, review turnaround, city/niche distribution)
- `/admin/audit-logs` — Chronological administrative decision trail
- `/admin/settings` — Phase Control (FREE vs PAID), Billing Mode, 1,000 Pool Cap, PDPA Retention Days

---

## 🧪 Automated Testing

Run the automated business rules test suite:
```bash
node tests/test-business-rules.mjs
```

Verifies:
- Date overlap logic (exact boundaries & invalid ranges)
- Age >= 18 enforcement
- Follower count >= 5,000 threshold
- Sri Lankan phone sanitization (`077...` → `9477...`)
- Pre-filled WhatsApp click-to-chat URL formatting
- Privacy field stripping from public serializers
- Duplicate detection flags

---

## 🔒 Security & Privacy (Sri Lanka PDPA Compliance)

- **Air-Gapped Private Storage**: Sensitive government passports and National ID cards are uploaded into isolated private storage (`storage/private_documents/`) using randomized UUID filenames.
- **Strict Public Serializers**: WhatsApp numbers and ID documents are deliberately excluded from public data objects.
- **No Applicant Login Friction**: Applicants track verification status securely using `WhatsApp + Reference Code` without needing complex passwords.

---

## 📋 Open Business Decisions (Documented for Stakeholders)

As specified, the system is designed to allow the following to be decided without refactoring:

1. **Paid Model (Phase 2)**: Configurable in Settings (`none`, `per_match`, `subscription`).
2. **Phase 2 Exact Pricing**: Messaging is phase-aware rather than displaying hard-coded dollar amounts.
3. **ID Document Retention Duration**: Configurable in Settings (30, 60, 90, or 180 days).
4. **Directory Visibility**: Configurable in Settings (`PUBLIC` vs `RESTRICTED`).
5. **Applicant User Accounts**: Kept intentionally simple without unnecessary applicant login friction.

---

## 🛠️ Production Build

```bash
npm run build
npm start
```
