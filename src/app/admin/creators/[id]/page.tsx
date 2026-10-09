"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/data/store";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Badge } from "@/components/ui/Badge";
import { formatFollowerCount, formatDateRange } from "@/utils/formatters";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  Lock,
  Eye,
  MessageSquare,
  Globe,
  Clock,
  Trash2,
  X,
  Download,
  ZoomIn,
  Image as ImageIcon,
} from "lucide-react";

export default function AdminCreatorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const { applications, approveCreator, rejectCreator, deleteApplication } = useStore();

  const app = applications.find(
    (a) => a.id === id || a.reference_code === id
  );

  const [notes, setNotes] = useState(app?.admin_notes || "");
  const [showDocPreview, setShowDocPreview] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imgLoadError, setImgLoadError] = useState(false);
  const [actionDone, setActionDone] = useState<string | null>(null);

  if (!app) {
    return (
      <div className="space-y-6">
        <AdminHeader title="Application Not Found" />
        <div className="bg-white rounded-2xl border border-sand-300 p-10 text-center max-w-md mx-auto space-y-4 shadow-warm">
          <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
          <h2 className="font-serif text-xl font-bold text-teal-950">
            Creator Application Not Found
          </h2>
          <p className="text-xs text-ink-600">
            No application exists with ID or reference &ldquo;{id}&rdquo;.
          </p>
          <Link
            href="/admin/creators"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-900 text-sand-50 text-xs font-semibold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Queue</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleApprove = () => {
    approveCreator(app.id, notes);
    setActionDone("Application Approved and published to Creator Directory!");
    setTimeout(() => {
      router.push("/admin/creators");
    }, 1500);
  };

  const handleReject = () => {
    if (!notes.trim()) {
      alert("Please provide internal admin notes explaining the rejection reason.");
      return;
    }
    rejectCreator(app.id, notes);
    setActionDone("Application Rejected and marked in archives.");
    setTimeout(() => {
      router.push("/admin/creators");
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-16">
      <AdminHeader
        title={`Review: ${app.full_name}`}
        subtitle={`Reference: ${app.reference_code} • Submitted ${new Date(
          app.created_at
        ).toLocaleDateString()}`}
        action={
          <Link
            href="/admin/creators"
            className="inline-flex items-center gap-2 text-xs font-semibold text-teal-900 hover:text-gold-600 border border-sand-300 px-3 py-1.5 rounded-lg bg-white shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Creator Queue</span>
          </Link>
        }
      />

      {actionDone && (
        <div className="mx-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{actionDone}</span>
        </div>
      )}

      {/* Duplicate Detection Warning Banner */}
      {app.is_duplicate && (
        <div className="mx-6 p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <span className="font-bold text-sm block text-amber-900">
              ⚠️ Possible Duplicate Detected
            </span>
            <p className="text-amber-800">
              {app.duplicate_reason ||
                "This applicant shares contact or passport details with an existing record."}
            </p>
          </div>
        </div>
      )}

      <div className="px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Creator Metadata & Verification */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Info Card */}
          <div className="bg-white rounded-2xl border border-sand-300 p-6 sm:p-8 space-y-6 shadow-warm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-200 pb-5">
              <div className="flex items-center gap-4">
                {app.avatar_url ? (
                  <img
                    src={app.avatar_url}
                    alt={app.full_name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-teal-900 shadow-sm shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-sand-200 border-2 border-sand-300 flex items-center justify-center text-teal-950 font-bold font-serif text-2xl shrink-0">
                    {app.full_name.charAt(0)}
                  </div>
                )}
                <div>
                  <span className="text-[11px] font-mono font-bold text-gold-700 uppercase tracking-wider block">
                    {app.reference_code}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-teal-950 mt-1">
                    {app.full_name}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-ink-600 mt-1">
                    <span>{app.age} years old</span>
                    <span>•</span>
                    <span>Origin: {app.country}</span>
                    <span>•</span>
                    <span className="font-mono text-teal-950 font-semibold">
                      WhatsApp: {app.whatsapp}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <Badge
                  variant={
                    app.status === "APPROVED"
                      ? "approved"
                      : app.status === "REJECTED"
                      ? "rejected"
                      : "pending"
                  }
                  size="md"
                >
                  {app.status}
                </Badge>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200">
                <span className="text-[10px] uppercase tracking-wider text-ink-500 font-bold block">
                  Follower Count
                </span>
                <span className="text-base font-bold text-teal-950 font-mono mt-0.5 block">
                  {formatFollowerCount(app.follower_count)}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200">
                <span className="text-[10px] uppercase tracking-wider text-ink-500 font-bold block">
                  Content Niche
                </span>
                <span className="text-base font-bold text-teal-950 mt-0.5 block">
                  {app.niche}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200">
                <span className="text-[10px] uppercase tracking-wider text-ink-500 font-bold block">
                  Scheduled City
                </span>
                <span className="text-base font-bold text-teal-950 mt-0.5 block">
                  {app.city}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200">
                <span className="text-[10px] uppercase tracking-wider text-ink-500 font-bold block">
                  Travel Window
                </span>
                <span className="text-xs font-bold text-teal-950 mt-1 block">
                  {formatDateRange(app.visit_start, app.visit_end)}
                </span>
              </div>
            </div>

            {/* Social Profile Inspection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-teal-950 uppercase tracking-wider block">
                Primary Social Profile URL
              </label>
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-sand-50 border border-sand-200">
                <span className="text-xs font-mono text-ink-800 truncate max-w-md">
                  {app.social_url}
                </span>
                <a
                  href={app.social_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-900 hover:text-gold-600 ml-4 shrink-0"
                >
                  <span>Open Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Trip Brief */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-teal-950 uppercase tracking-wider block">
                Trip Brief & Collaboration Pitch
              </label>
              <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 text-xs text-ink-800 leading-relaxed whitespace-pre-wrap">
                {app.trip_brief}
              </div>
            </div>
          </div>

          {/* Secure Document Viewer Section */}
          <div className="bg-white rounded-2xl border border-sand-300 p-6 sm:p-8 space-y-4 shadow-warm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-900 text-gold-400 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-teal-950">
                    Government ID Verification
                  </h3>
                  <span className="text-[11px] text-ink-500">
                    Private Vault Document • Accessible by Staff Only
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowDocPreview(!showDocPreview)}
                className="px-3.5 py-1.5 rounded-lg bg-sand-100 hover:bg-sand-200 text-teal-950 text-xs font-bold border border-sand-300 flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showDocPreview ? "Hide Document" : "Inspect Document"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-sand-50 p-3.5 rounded-xl border border-sand-200">
              <div>
                <span className="text-ink-500 text-[10px] uppercase font-bold block">
                  Document Type
                </span>
                <span className="font-semibold text-teal-950">
                  {app.document_type}
                </span>
              </div>
              <div>
                <span className="text-ink-500 text-[10px] uppercase font-bold block">
                  Document Ref #
                </span>
                <span className="font-mono font-bold text-teal-950">
                  {app.document_reference}
                </span>
              </div>
              <div>
                <span className="text-ink-500 text-[10px] uppercase font-bold block">
                  Uploaded Filename
                </span>
                <span className="font-mono text-ink-700 text-[11px] truncate block">
                  {app.document_filename || "id_document.pdf"}
                </span>
              </div>
            </div>

            {/* Document Preview Box */}
            {showDocPreview && (
              <div className="p-6 rounded-xl bg-teal-950 text-sand-50 space-y-4 animate-in fade-in-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-800/80 pb-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-gold-400">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span className="truncate max-w-xs sm:max-w-md">
                      {app.document_filename || "government_id_document"}
                    </span>
                    {app.document_size && (
                      <span className="text-[10px] bg-teal-900 text-sand-300 px-2 py-0.5 rounded">
                        {app.document_size}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {app.document_url && (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsLightboxOpen(true)}
                          className="px-3 py-1.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-gold-400 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-teal-700"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                          <span>Inspect Fullscreen</span>
                        </button>
                        <a
                          href={app.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-teal-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open Original</span>
                        </a>
                      </>
                    )}
                  </div>
                </div>

                {/* Actual Uploaded File Rendering */}
                {app.document_url ? (
                  (() => {
                    const docUrl = app.document_url.toLowerCase();
                    const filename = (app.document_filename || "").toLowerCase();
                    const isPdf = docUrl.endsWith(".pdf") || filename.endsWith(".pdf");

                    if (isPdf) {
                      return (
                        <div className="space-y-3">
                          <div className="w-full h-[600px] rounded-xl overflow-hidden border border-teal-800 bg-white">
                            <iframe
                              src={app.document_url}
                              title="Government ID PDF Preview"
                              className="w-full h-full"
                            />
                          </div>
                        </div>
                      );
                    }

                    // Otherwise render as Image (PNG, JPG, JPEG, WEBP, etc.)
                    return (
                      <div className="space-y-3">
                        <div
                          onClick={() => setIsLightboxOpen(true)}
                          className="relative group bg-black/60 rounded-xl overflow-hidden border border-teal-800/80 p-3 flex flex-col items-center justify-center min-h-[320px] max-h-[600px] cursor-pointer"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={app.document_url}
                            alt={app.document_filename || "Government ID Document"}
                            className="max-h-[550px] w-auto max-w-full object-contain rounded shadow-lg transition-transform duration-300 group-hover:scale-[1.01]"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <span className="px-4 py-2 rounded-xl bg-teal-950/95 text-gold-400 border border-gold-500/50 text-xs font-bold flex items-center gap-2 shadow-2xl">
                              <ZoomIn className="w-4 h-4" />
                              <span>Click to View Full Size</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-sand-300 px-1">
                          <span>
                            Document # <strong className="text-gold-400 font-mono">{app.document_reference}</strong> ({app.document_type})
                          </span>
                          <span className="text-emerald-400 font-mono flex items-center gap-1">
                            ✓ Verified Document Upload
                          </span>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="bg-sand-900/60 rounded-lg p-6 border border-teal-800 text-center space-y-3">
                    <ShieldCheck className="w-10 h-10 text-gold-400 mx-auto" />
                    <p className="font-serif text-base font-bold text-sand-50">
                      {app.document_type === "PASSPORT"
                        ? "International Passport Identification"
                        : "National Identity Card (NIC)"}
                    </p>
                    <p className="text-xs text-sand-300 max-w-sm mx-auto">
                      Holder: <strong className="text-white">{app.full_name}</strong> • Document #{" "}
                      <code className="text-gold-400 font-mono">{app.document_reference}</code>
                    </p>
                    <div className="pt-2">
                      <span className="text-[11px] text-amber-300 font-mono bg-amber-950/50 px-3 py-1 rounded-full border border-amber-800/60">
                        ℹ️ Sample record without physical file upload
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Staff Action & Notes Panel */}
        <div className="lg:col-span-4 sticky top-24 space-y-5">
          <div className="bg-white rounded-2xl border border-sand-300 p-6 sm:p-7 shadow-elevated space-y-5">
            <h3 className="font-serif text-lg font-bold text-teal-950 border-b border-sand-200 pb-3">
              Staff Review Decision
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-bold text-teal-950 uppercase tracking-wider block">
                Internal Admin Notes
              </label>
              <textarea
                rows={4}
                placeholder="Log notes about identity check, follower quality, or reason for decision..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-sand-400 bg-sand-50 text-xs focus:outline-none focus:ring-2 focus:ring-teal-900"
              />
              <span className="text-[10px] text-ink-500 block">
                Notes are logged into immutable staff audit trail.
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleApprove}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider shadow-warm transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Publish Creator</span>
              </button>

              <button
                onClick={handleReject}
                className="w-full py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Application</span>
              </button>

              {deleteApplication && (
                <button
                  onClick={async () => {
                    if (confirm(`Permanently delete creator record for ${app.full_name} (${app.reference_code}) from database?`)) {
                      await deleteApplication(app.id);
                      router.push("/admin/creators");
                    }
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-ink-500 hover:text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Record</span>
                </button>
              )}
            </div>

            <div className="pt-4 border-t border-sand-200 text-[11px] text-ink-500 space-y-1">
              <div className="flex justify-between">
                <span>Created:</span>
                <span className="font-mono">
                  {new Date(app.created_at).toLocaleDateString()}
                </span>
              </div>
              {app.reviewed_by && (
                <div className="flex justify-between">
                  <span>Last Reviewed By:</span>
                  <span className="font-mono text-teal-950">{app.reviewed_by}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Document Inspection Lightbox Modal */}
      {isLightboxOpen && app.document_url && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex flex-col items-center justify-center p-3 sm:p-6 animate-in fade-in-50"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Header Bar */}
          <div
            className="w-full max-w-5xl flex items-center justify-between text-sand-50 mb-3 px-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-xs">
              <FileText className="w-4 h-4 text-gold-400 shrink-0" />
              <span className="font-mono text-sand-200 truncate max-w-xs sm:max-w-md">
                {app.document_filename || "Government ID Document"}
              </span>
              <span className="text-sand-400 hidden sm:inline">•</span>
              <span className="text-gold-400 font-bold hidden sm:inline">
                {app.full_name} ({app.document_reference})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={app.document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-gold-400 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Open original image in separate tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Open Original</span>
              </a>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Image Container */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full rounded-2xl overflow-hidden bg-neutral-950 border border-teal-800/80 shadow-2xl flex items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={app.document_url}
              alt={app.document_filename || "Government ID Document Full Resolution"}
              className="max-h-[80vh] w-auto max-w-full object-contain mx-auto rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}
