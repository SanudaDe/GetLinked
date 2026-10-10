"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/data/store";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { formatFollowerCount, formatDateRange, SRI_LANKA_CITIES, formatStorageUrl } from "@/utils/formatters";
import {
  extractGoogleDriveFileId,
  getGoogleDriveImageUrl,
  getGoogleDrivePreviewUrl,
  isGoogleDriveUrl,
} from "@/utils/googleDrive";
import { generateWhatsAppLink } from "@/utils/whatsapp";
import { ApplicationStatus, InfluencerApplication } from "@/types";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  ExternalLink,
  MessageCircle,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  MapPin,
  Eye,
  Lock,
  Trash2,
  Folder,
  ZoomIn,
} from "lucide-react";

export default function AdminCreatorsPage() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as ApplicationStatus) || "PENDING";
  const initialId = searchParams.get("id");

  const { applications, approveCreator, rejectCreator, deleteApplication } = useStore();

  const [activeTab, setActiveTab] = useState<ApplicationStatus>(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("All Sri Lanka");
  const [selectedApp, setSelectedApp] = useState<InfluencerApplication | null>(
    initialId ? applications.find((a) => a.id === initialId) || null : null
  );
  const [adminNotes, setAdminNotes] = useState("");
  const [showDocModal, setShowDocModal] = useState(false);

  // Filter applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      if (app.status !== activeTab) return false;
      if (cityFilter !== "All Sri Lanka" && app.city !== cityFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = app.full_name.toLowerCase().includes(q);
        const matchRef = app.reference_code.toLowerCase().includes(q);
        const matchPhone = app.whatsapp.toLowerCase().includes(q);
        const matchSocial = app.social_url.toLowerCase().includes(q);
        const matchDoc = app.document_reference.toLowerCase().includes(q);
        if (!matchName && !matchRef && !matchPhone && !matchSocial && !matchDoc) {
          return false;
        }
      }

      return true;
    });
  }, [applications, activeTab, cityFilter, searchQuery]);

  const counts = {
    PENDING: applications.filter((a) => a.status === "PENDING").length,
    APPROVED: applications.filter((a) => a.status === "APPROVED").length,
    REJECTED: applications.filter((a) => a.status === "REJECTED").length,
  };

  const handleOpenDetail = (app: InfluencerApplication) => {
    setSelectedApp(app);
    setAdminNotes(app.admin_notes || "");
  };

  const handleApprove = (app: InfluencerApplication) => {
    approveCreator(app.id, adminNotes);
    setSelectedApp(null);
  };

  const handleReject = (app: InfluencerApplication) => {
    rejectCreator(app.id, adminNotes || "Does not meet verification criteria");
    setSelectedApp(null);
  };

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title="Creator Verification Queue"
        subtitle="Review identity documents, audience metrics, and trip briefs before approving for matchmaking."
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

        {/* Filters bar */}
        <div className="bg-sand-50 rounded-xl p-4 border border-sand-300 shadow-warm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-ink-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name, ref code, WhatsApp, handle..."
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

        {/* List of Applications */}
        <div className="bg-sand-50 rounded-2xl border border-sand-300 shadow-warm overflow-hidden">
          {filteredApps.length === 0 ? (
            <div className="text-center py-12 text-xs text-ink-500 space-y-2">
              <Users className="w-8 h-8 text-sand-400 mx-auto" />
              <p>No creator applications in {activeTab.toLowerCase()} status matching your filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-sand-200">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="p-5 hover:bg-sand-100/60 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 flex-grow">
                    {app.avatar_url ? (
                      <img
                        src={formatStorageUrl(app.avatar_url)}
                        alt={app.full_name}
                        className="w-12 h-12 rounded-full object-cover border border-sand-300 shadow-xs shrink-0 mt-0.5"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-sand-200 border border-sand-300 flex items-center justify-center text-teal-950 font-bold font-serif shrink-0 mt-0.5">
                        {app.full_name.charAt(0)}
                      </div>
                    )}
                    <div className="space-y-1.5 flex-grow">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-serif text-lg font-bold text-teal-950">
                          {app.full_name}
                        </span>
                        <span className="font-mono text-xs text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {app.reference_code}
                        </span>
                        <span className="text-xs text-ink-600 font-medium">
                          ({app.age} y/o • {app.country})
                        </span>
                        {app.is_duplicate && (
                          <Badge variant="duplicate" size="sm">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Possible Duplicate</span>
                          </Badge>
                        )}
                        <Badge
                          variant={
                            app.status === "APPROVED"
                              ? "approved"
                              : app.status === "REJECTED"
                              ? "rejected"
                              : "pending"
                          }
                          size="sm"
                        >
                          {app.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-ink-700 flex-wrap">
                        <span className="font-semibold text-teal-900">{app.niche}</span>
                        <span>•</span>
                        <span>{formatFollowerCount(app.follower_count)} followers</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-teal-800" />
                          {app.city}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gold-600" />
                          {formatDateRange(app.visit_start, app.visit_end)}
                        </span>
                      </div>

                      <p className="text-xs text-ink-600 line-clamp-1 max-w-2xl">
                        {app.trip_brief}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/admin/creators/${app.id}`}
                      className="px-4 py-2 rounded-lg bg-sand-200 hover:bg-teal-900 hover:text-sand-50 text-xs font-semibold text-teal-950 transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review Details</span>
                    </Link>
                    {app.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleApprove(app)}
                          className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject(app)}
                          className="px-3 py-2 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                    {deleteApplication && (
                      <button
                        onClick={() => {
                          if (confirm(`Permanently delete creator application for ${app.full_name} (${app.reference_code})?`)) {
                            deleteApplication(app.id);
                          }
                        }}
                        className="p-2 text-ink-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Review: ${selectedApp.full_name}`}
          subtitle={`Application ${selectedApp.reference_code} • Submitted ${new Date(selectedApp.created_at).toLocaleDateString()}`}
          maxWidth="xl"
        >
          <div className="space-y-5 text-xs text-ink-800">
            {/* Duplicate Alert if flagged */}
            {selectedApp.is_duplicate && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Duplicate Detection Alert:</strong>
                  <p className="mt-0.5 text-xs text-rose-800">
                    {selectedApp.duplicate_reason || "Matches details of an existing profile."}
                  </p>
                </div>
              </div>
            )}

            {/* Verification Document Box */}
            <div className="p-4 bg-teal-900/10 rounded-xl border border-teal-900/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-teal-950 font-bold">
                  <ShieldCheck className="w-4 h-4 text-gold-600" />
                  <span>Government ID Verification File</span>
                </div>
                <button
                  onClick={() => setShowDocModal(true)}
                  className="px-2.5 py-1 rounded bg-teal-900 text-sand-50 font-semibold text-[11px] hover:bg-teal-800 transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>Inspect Document</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-ink-500">Document Type:</span>{" "}
                  <strong>{selectedApp.document_type}</strong>
                </div>
                <div>
                  <span className="text-ink-500">Reference Number:</span>{" "}
                  <strong className="font-mono">{selectedApp.document_reference}</strong>
                </div>
                <div>
                  <span className="text-ink-500">File Name:</span>{" "}
                  <span className="font-mono text-teal-900">{selectedApp.document_filename || "id_scan.pdf"}</span>
                </div>
                <div>
                  <span className="text-ink-500">File Size:</span>{" "}
                  <span>{selectedApp.document_size || "2.1 MB"}</span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-sand-100 rounded-xl border border-sand-300">
              <div>
                <span className="text-ink-500 block">WhatsApp (Private):</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <strong className="font-mono text-teal-950">{selectedApp.whatsapp}</strong>
                  <a
                    href={generateWhatsAppLink(
                      selectedApp.whatsapp,
                      `Hi ${selectedApp.full_name}, this is the Get Linked verification team.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-emerald-700 hover:text-emerald-900"
                    title="Message on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div>
                <span className="text-ink-500 block">Social Media Profile:</span>
                <a
                  href={selectedApp.social_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-teal-900 hover:text-gold-600 font-semibold mt-0.5 underline"
                >
                  <span>Open Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div>
                <span className="text-ink-500 block">Follower Count:</span>
                <strong className="text-teal-950 text-sm">
                  {selectedApp.follower_count.toLocaleString()}
                </strong>
              </div>

              <div>
                <span className="text-ink-500 block">Niche:</span>
                <strong className="text-teal-950">{selectedApp.niche}</strong>
              </div>

              <div>
                <span className="text-ink-500 block">Destination City:</span>
                <strong className="text-teal-950">{selectedApp.city}, Sri Lanka</strong>
              </div>

              <div>
                <span className="text-ink-500 block">Travel Window:</span>
                <strong className="text-teal-950">
                  {selectedApp.visit_start} to {selectedApp.visit_end}
                </strong>
              </div>
            </div>

            {/* Trip Brief */}
            <div>
              <span className="text-ink-700 font-semibold block mb-1">
                Trip Content Brief:
              </span>
              <p className="p-3 bg-sand-100 rounded-lg border border-sand-200 text-xs leading-relaxed text-ink-800">
                {selectedApp.trip_brief}
              </p>
            </div>

            {/* Admin Notes */}
            <div>
              <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
                Internal Admin Notes (Never exposed to creators)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Verified passport photo against Instagram photos. Engagement rate 4.8%. Great fit for luxury villas in Galle."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-sand-400 bg-sand-50 text-xs focus:outline-none focus:ring-2 focus:ring-teal-900"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-sand-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink-600 hover:text-ink-900"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleReject(selectedApp)}
                  className="px-4 py-2 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject Application</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove(selectedApp)}
                  className="px-5 py-2 rounded-lg bg-teal-900 hover:bg-teal-800 text-sand-50 text-xs font-semibold uppercase tracking-wider shadow-warm transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
                  <span>Approve & Add to Directory</span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Private Document Viewer Modal */}
      {showDocModal && selectedApp && (
        <Modal
          isOpen={showDocModal}
          onClose={() => setShowDocModal(false)}
          title="Private Document Inspection Vault"
          subtitle={`Confidential verification document for ${selectedApp.full_name} (${selectedApp.reference_code})`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            {(() => {
              const driveFileId = selectedApp.document_url ? extractGoogleDriveFileId(selectedApp.document_url) : null;
              const isDrive = selectedApp.document_url ? (isGoogleDriveUrl(selectedApp.document_url) || !!driveFileId) : false;
              const docUrl = (selectedApp.document_url || "").toLowerCase();
              const filename = (selectedApp.document_filename || "").toLowerCase();
              const isPdf = docUrl.endsWith(".pdf") || filename.endsWith(".pdf") || docUrl.includes(".pdf");
              const previewSrc = driveFileId ? getGoogleDrivePreviewUrl(driveFileId) : selectedApp.document_url;
              const imageSrc = driveFileId ? getGoogleDriveImageUrl(driveFileId, 1600) : selectedApp.document_url;
              const driveViewLink = driveFileId ? `https://drive.google.com/file/d/${driveFileId}/view` : selectedApp.document_url;

              return (
                <div className="space-y-4">
                  {/* Google Drive Status Banner */}
                  <div className="p-3 bg-teal-900/10 border border-teal-900/30 rounded-xl text-teal-950 text-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Folder className="w-4 h-4 text-gold-600 shrink-0" />
                      <span>
                        {isDrive
                          ? "Stored permanently in designated Google Drive folder (GetLinked_Media)"
                          : "Government identity verification file"}
                      </span>
                    </div>
                    {driveViewLink && (
                      <a
                        href={driveViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded bg-teal-900 text-gold-400 hover:bg-teal-800 text-[11px] font-bold shrink-0 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Open in Drive</span>
                      </a>
                    )}
                  </div>

                  {/* Document Display */}
                  {selectedApp.document_url ? (
                    <div className="rounded-xl overflow-hidden border border-sand-300 bg-sand-100 p-2">
                      {isPdf ? (
                        <div className="w-full h-[480px] rounded-lg overflow-hidden bg-white border border-sand-200">
                          <iframe
                            src={previewSrc}
                            title="Government ID PDF"
                            className="w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center min-h-[300px] max-h-[500px] bg-black/80 rounded-lg p-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imageSrc}
                            alt={selectedApp.document_filename || "Government ID Document"}
                            className="max-h-[460px] w-auto max-w-full object-contain rounded"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="border border-sand-400 rounded-xl p-6 bg-sand-200/60 text-center space-y-3">
                      <ShieldCheck className="w-12 h-12 text-teal-900 mx-auto" />
                      <h4 className="font-serif text-base font-bold text-teal-950">
                        {selectedApp.document_type === "PASSPORT" ? "Passport Verification Record" : "National ID Card (NIC) Record"}
                      </h4>
                      <p className="text-xs text-ink-600 font-mono">
                        Document Reference: <strong>{selectedApp.document_reference}</strong>
                      </p>
                    </div>
                  )}

                  {/* Document Metadata Details */}
                  <div className="p-3.5 bg-sand-50 rounded-xl border border-sand-300 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-ink-500 block text-[10px] uppercase font-bold">Document Type</span>
                      <strong className="text-teal-950">{selectedApp.document_type}</strong>
                    </div>
                    <div>
                      <span className="text-ink-500 block text-[10px] uppercase font-bold">Document # / Reference</span>
                      <strong className="font-mono text-teal-950">{selectedApp.document_reference}</strong>
                    </div>
                    <div>
                      <span className="text-ink-500 block text-[10px] uppercase font-bold">Filename</span>
                      <span className="font-mono text-teal-900 truncate block text-[11px]">
                        {selectedApp.document_filename || "id_document"}
                      </span>
                    </div>
                    <div>
                      <span className="text-ink-500 block text-[10px] uppercase font-bold">File Size</span>
                      <span className="font-mono text-ink-700">{selectedApp.document_size || "Verified"}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowDocModal(false)}
                className="px-5 py-2 rounded-lg bg-teal-900 text-sand-50 text-xs font-semibold cursor-pointer"
              >
                Done Inspecting
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
