"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/data/store";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { formatDateRange, formatFollowerCount, SRI_LANKA_CITIES } from "@/utils/formatters";
import { generateWhatsAppLink } from "@/utils/whatsapp";
import { ApplicationStatus, AccommodationApplication } from "@/types";
import {
  Building2,
  Search,
  CheckCircle2,
  XCircle,
  MessageCircle,
  MapPin,
  Calendar,
  Users,
  Eye,
  Gift,
} from "lucide-react";

export default function AdminAccommodationsPage() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as ApplicationStatus) || "PENDING";

  const { accommodations, approveAccommodation, rejectAccommodation } = useStore();

  const [activeTab, setActiveTab] = useState<ApplicationStatus>(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("All Sri Lanka");
  const [selectedAcc, setSelectedAcc] = useState<AccommodationApplication | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const filtered = useMemo(() => {
    return accommodations.filter((acc) => {
      if (acc.status !== activeTab) return false;
      if (cityFilter !== "All Sri Lanka" && acc.city !== cityFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = acc.accommodation_name.toLowerCase().includes(q);
        const matchRef = acc.reference_code.toLowerCase().includes(q);
        const matchContact = acc.contact_person.toLowerCase().includes(q);
        const matchPhone = acc.whatsapp.toLowerCase().includes(q);
        if (!matchName && !matchRef && !matchContact && !matchPhone) return false;
      }

      return true;
    });
  }, [accommodations, activeTab, cityFilter, searchQuery]);

  const counts = {
    PENDING: accommodations.filter((a) => a.status === "PENDING").length,
    APPROVED: accommodations.filter((a) => a.status === "APPROVED").length,
    REJECTED: accommodations.filter((a) => a.status === "REJECTED").length,
  };

  const handleOpenDetail = (acc: AccommodationApplication) => {
    setSelectedAcc(acc);
    setAdminNotes(acc.admin_notes || "");
  };

  const handleApprove = (acc: AccommodationApplication) => {
    approveAccommodation(acc.id, adminNotes);
    setSelectedAcc(null);
  };

  const handleReject = (acc: AccommodationApplication) => {
    rejectAccommodation(acc.id, adminNotes || "Standard property review criteria");
    setSelectedAcc(null);
  };

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title="Accommodations Queue"
        subtitle="Review hotel and villa listings, host offerings, and contact credentials."
      />

      <div className="px-6 space-y-6">
        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-sand-300">
          {(["PENDING", "APPROVED", "REJECTED"] as ApplicationStatus[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-5 text-xs font-semibold uppercase tracking-wider transition-colors relative flex items-center gap-2 ${
                activeTab === tab
                  ? "text-teal-950 font-bold border-b-2 border-teal-900"
                  : "text-ink-500 hover:text-ink-900"
              }`}
            >
              <span>{tab}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === tab
                    ? "bg-teal-900 text-sand-50"
                    : "bg-sand-200 text-ink-600"
                }`}
              >
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-sand-50 rounded-xl p-4 border border-sand-300 shadow-warm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-ink-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by property, ref code, contact person..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-sand-400 bg-sand-50 text-xs focus:outline-none focus:ring-2 focus:ring-teal-900"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs text-ink-600 font-medium shrink-0">City:</span>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-sand-400 bg-sand-50 text-xs focus:outline-none focus:ring-2 focus:ring-teal-900"
            >
              {SRI_LANKA_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* List of Accommodations */}
        <div className="bg-sand-50 rounded-2xl border border-sand-300 shadow-warm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-xs text-ink-500 space-y-2">
              <Building2 className="w-8 h-8 text-sand-400 mx-auto" />
              <p>No accommodation listings in {activeTab.toLowerCase()} status matching your filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-sand-200">
              {filtered.map((acc) => (
                <div
                  key={acc.id}
                  className="p-5 hover:bg-sand-100/60 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-grow">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif text-lg font-bold text-teal-950">
                        {acc.accommodation_name}
                      </span>
                      <span className="font-mono text-xs text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {acc.reference_code}
                      </span>
                      <span className="text-xs text-ink-600">
                        ({acc.property_type})
                      </span>
                      <Badge
                        variant={
                          acc.status === "APPROVED"
                            ? "approved"
                            : acc.status === "REJECTED"
                            ? "rejected"
                            : "pending"
                        }
                        size="sm"
                      >
                        {acc.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-ink-700 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-teal-800" />
                        {acc.city}
                      </span>
                      <span>•</span>
                      <span>Contact: {acc.contact_person}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-gold-700 font-semibold">
                        <Gift className="w-3 h-3" />
                        {acc.offer_type}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-teal-700" />
                        {formatDateRange(acc.coverage_start, acc.coverage_end)}
                      </span>
                      <span>•</span>
                      <span>Min: {formatFollowerCount(acc.minimum_followers)}+</span>
                    </div>

                    <p className="text-xs text-ink-600 line-clamp-1 max-w-2xl">
                      {acc.requirements}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/admin/accommodations/${acc.id}`}
                      className="px-4 py-2 rounded-lg bg-sand-200 hover:bg-teal-900 hover:text-sand-50 text-xs font-semibold text-teal-950 transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review Details</span>
                    </Link>
                    {acc.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleApprove(acc)}
                          className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject(acc)}
                          className="px-3 py-2 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedAcc && (
        <Modal
          isOpen={!!selectedAcc}
          onClose={() => setSelectedAcc(null)}
          title={`Property Review: ${selectedAcc.accommodation_name}`}
          subtitle={`Listing ${selectedAcc.reference_code} • Contact: ${selectedAcc.contact_person}`}
          maxWidth="xl"
        >
          <div className="space-y-5 text-xs text-ink-800">
            {/* Grid details */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-sand-100 rounded-xl border border-sand-300">
              <div>
                <span className="text-ink-500 block">Host Contact:</span>
                <strong className="text-teal-950 text-sm">{selectedAcc.contact_person}</strong>
              </div>

              <div>
                <span className="text-ink-500 block">Host WhatsApp (Private):</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <strong className="font-mono text-teal-950">{selectedAcc.whatsapp}</strong>
                  <a
                    href={generateWhatsAppLink(
                      selectedAcc.whatsapp,
                      `Hi ${selectedAcc.contact_person}, this is the Get Linked verification team regarding ${selectedAcc.accommodation_name}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-emerald-700 hover:text-emerald-900"
                    title="Direct WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div>
                <span className="text-ink-500 block">Location:</span>
                <strong className="text-teal-950">{selectedAcc.city}, Sri Lanka</strong>
              </div>

              <div>
                <span className="text-ink-500 block">Property Category:</span>
                <strong className="text-teal-950">{selectedAcc.property_type}</strong>
              </div>

              <div>
                <span className="text-ink-500 block">Coverage Availability:</span>
                <strong className="text-teal-950">
                  {selectedAcc.coverage_start} to {selectedAcc.coverage_end}
                </strong>
              </div>

              <div>
                <span className="text-ink-500 block">Offer Structure:</span>
                <strong className="text-gold-700">{selectedAcc.offer_type}</strong>
              </div>

              <div className="col-span-2">
                <span className="text-ink-500 block">Minimum Creator Followers:</span>
                <strong className="text-teal-950">
                  {selectedAcc.minimum_followers.toLocaleString()}+ followers
                </strong>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <span className="text-ink-700 font-semibold block mb-1">
                Collaboration Requirements / What Host is Looking For:
              </span>
              <p className="p-3 bg-sand-100 rounded-lg border border-sand-200 text-xs leading-relaxed text-ink-800">
                {selectedAcc.requirements}
              </p>
            </div>

            {/* Admin Notes */}
            <div>
              <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                Admin Notes
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Verified business registration. Contact confirmed via WhatsApp."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-sand-400 bg-sand-50 text-xs focus:outline-none focus:ring-2 focus:ring-teal-900"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-sand-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedAcc(null)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink-600 hover:text-ink-900"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleReject(selectedAcc)}
                  className="px-4 py-2 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject Listing</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove(selectedAcc)}
                  className="px-5 py-2 rounded-lg bg-teal-900 hover:bg-teal-800 text-sand-50 text-xs font-semibold uppercase tracking-wider shadow-warm transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
                  <span>Approve for Matchmaking</span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
