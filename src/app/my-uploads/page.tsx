"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useStore } from "@/data/store";
import { supabase } from "@/lib/supabaseClient";
import { UserMedia, MediaCategory } from "@/types";
import { MediaUploader } from "@/components/media/MediaUploader";
import { GoogleDrivePlayer } from "@/components/common/GoogleDrivePlayer";
import {
  getGoogleDriveImageUrl,
  getGoogleDrivePreviewUrl,
  formatBytes,
} from "@/utils/googleDrive";
import {
  UploadCloud,
  Folder,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  Search,
  Filter,
  Trash2,
  Edit2,
  ExternalLink,
  Download,
  Lock,
  Globe,
  RefreshCw,
  Plus,
  HardDrive,
  Eye,
  Check,
  X,
  AlertCircle,
  Play,
} from "lucide-react";

export default function MyUploadsPage() {
  const { authUser, isAuthLoading } = useStore();
  const [mediaList, setMediaList] = useState<UserMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalBytes, setTotalBytes] = useState(0);
  const [quotaBytes, setQuotaBytes] = useState(500 * 1024 * 1024);
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<UserMedia | null>(null);
  const [editingMedia, setEditingMedia] = useState<UserMedia | null>(null);
  const [editTitleInput, setEditTitleInput] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchUserMedia = useCallback(async () => {
    setIsLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setIsLoading(false);
        return;
      }

      let url = `/api/drive/user-media?limit=100`;
      if (categoryFilter !== "ALL") {
        url += `&category=${encodeURIComponent(categoryFilter)}`;
      }
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setMediaList(data.media || []);
        setTotalBytes(data.totalBytes || 0);
        if (data.quotaBytes) setQuotaBytes(data.quotaBytes);
      } else {
        console.warn("Fetch media error:", data.error);
      }
    } catch (err) {
      console.error("Network error fetching user media:", err);
    } finally {
      setIsLoading(false);
    }
  }, [categoryFilter, searchQuery]);

  useEffect(() => {
    if (authUser) {
      fetchUserMedia();
    } else if (!isAuthLoading) {
      setIsLoading(false);
    }
  }, [authUser, isAuthLoading, fetchUserMedia]);

  const handleEditSave = async (id: string) => {
    if (!editTitleInput.trim()) return;
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(`/api/drive/user-media`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ id, title: editTitleInput.trim() }),
      });

      const data = await res.json();
      if (data.success) {
        setMediaList((prev) =>
          prev.map((item) => (item.id === id ? { ...item, title: editTitleInput.trim() } : item))
        );
        setEditingMedia(null);
        setFeedbackMsg({ type: "success", text: "Title updated successfully." });
        setTimeout(() => setFeedbackMsg(null), 3000);
      } else {
        setFeedbackMsg({ type: "error", text: data.error || "Failed to update title." });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "Network error updating title." });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this file from Google Drive storage?")) {
      return;
    }

    setDeletingId(id);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(`/api/drive/user-media?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setMediaList((prev) => prev.filter((item) => item.id !== id));
        setFeedbackMsg({ type: "success", text: "File deleted successfully from Google Drive." });
        setTimeout(() => setFeedbackMsg(null), 3000);
      } else {
        setFeedbackMsg({ type: "error", text: data.error || "Failed to delete file." });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "Network error deleting file." });
    } finally {
      setDeletingId(null);
    }
  };

  // If unauthenticated, show sign-in prompt
  if (!isAuthLoading && !authUser) {
    return (
      <div className="min-h-screen bg-sand-50 dark:bg-black text-teal-950 dark:text-white pt-28 pb-16 px-4">
        <div className="max-w-md mx-auto text-center bg-white dark:bg-neutral-900 border border-sand-300 dark:border-neutral-800 rounded-3xl p-8 shadow-warm space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#D7400B]/10 text-[#D7400B] flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl font-bold">Authentication Required</h1>
          <p className="text-xs text-ink-600 dark:text-neutral-400">
            Please log in with your verified GetLinked Google account to view and manage your uploaded media.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-block px-6 py-3 rounded-full bg-[#D7400B] hover:bg-[#bd3607] text-white text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Sign In with Google &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const quotaPercent = Math.min(Math.round((totalBytes / quotaBytes) * 100), 100);

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-black text-[#1A3739] dark:text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="bg-white dark:bg-neutral-900 border border-sand-300 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-warm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-100 dark:bg-neutral-800 text-[#D7400B] text-xs font-bold uppercase tracking-wider">
              <Folder className="w-3.5 h-3.5" />
              <span>Google Drive Storage</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-teal-950 dark:text-white pt-1">
              My Uploaded Media
            </h1>
            <p className="text-xs sm:text-sm text-ink-600 dark:text-neutral-400">
              Manage your verified high-resolution images, cinematic videos, and verification documents.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Storage Quota Gauge */}
            <div className="bg-sand-50 dark:bg-neutral-800/60 border border-sand-300 dark:border-neutral-700 rounded-2xl p-3.5 min-w-[200px]">
              <div className="flex items-center justify-between text-xs font-semibold text-teal-950 dark:text-neutral-200 mb-1.5">
                <span className="flex items-center gap-1 text-[11px] text-ink-500 dark:text-neutral-400">
                  <HardDrive className="w-3.5 h-3.5 text-[#D7400B]" />
                  Storage Used
                </span>
                <span>{quotaPercent}%</span>
              </div>
              <div className="w-full bg-sand-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    quotaPercent > 90 ? "bg-rose-500" : "bg-[#D7400B]"
                  }`}
                  style={{ width: `${quotaPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-ink-500 dark:text-neutral-400 mt-1 text-right font-mono">
                {formatBytes(totalBytes)} / {formatBytes(quotaBytes)}
              </p>
            </div>

            <button
              onClick={() => setIsUploaderOpen(!isUploaderOpen)}
              className="px-5 py-3 rounded-full bg-[#D7400B] hover:bg-[#bd3607] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isUploaderOpen ? "Close Uploader" : "Upload File"}</span>
            </button>
          </div>
        </div>

        {/* Feedback Message */}
        {feedbackMsg && (
          <div
            className={`p-4 rounded-2xl text-xs font-medium flex items-center gap-2 shadow-xs ${
              feedbackMsg.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            {feedbackMsg.type === "success" ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Collapsible Uploader Component */}
        {isUploaderOpen && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <MediaUploader
              onSuccess={(newMedia) => {
                setMediaList((prev) => [newMedia, ...prev]);
                setTotalBytes((prev) => prev + Number(newMedia.file_size));
                setFeedbackMsg({
                  type: "success",
                  text: `"${newMedia.title}" saved successfully to Google Drive.`,
                });
                setTimeout(() => setFeedbackMsg(null), 4000);
              }}
            />
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-sand-200 dark:bg-neutral-800/80 rounded-2xl border border-sand-300 dark:border-neutral-700 text-xs font-semibold overflow-x-auto">
            {["ALL", "PHOTO", "VIDEO", "DOCUMENT", "AVATAR"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  categoryFilter === cat
                    ? "bg-[#D7400B] text-white shadow-xs"
                    : "text-ink-700 dark:text-neutral-300 hover:text-[#D7400B]"
                }`}
              >
                {cat === "ALL" ? "All Media" : cat.charAt(0) + cat.slice(1).toLowerCase() + "s"}
              </button>
            ))}
          </div>

          {/* Search Input & Refresh */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-ink-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by filename or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-sand-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-teal-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#D7400B]"
              />
            </div>
            <button
              onClick={fetchUserMedia}
              disabled={isLoading}
              className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-sand-300 dark:border-neutral-700 hover:bg-sand-100 dark:hover:bg-neutral-800 text-ink-700 dark:text-neutral-200 transition-colors"
              title="Refresh Media"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Media Grid */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-[#D7400B] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-ink-600 dark:text-neutral-400">Loading your media from Google Drive...</p>
          </div>
        ) : mediaList.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 border border-sand-300 dark:border-neutral-800 rounded-3xl p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-sand-100 dark:bg-neutral-800 text-ink-400 flex items-center justify-center mx-auto">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-lg font-bold text-teal-950 dark:text-white">
              No files uploaded yet
            </h3>
            <p className="text-xs text-ink-600 dark:text-neutral-400 max-w-sm mx-auto">
              You haven't uploaded any media items yet. Click &ldquo;Upload File&rdquo; to add your property images, videos, or documents.
            </p>
            <button
              onClick={() => setIsUploaderOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#D7400B] text-white text-xs font-semibold uppercase tracking-wider"
            >
              Upload Your First File
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {mediaList.map((item) => {
              const isVideo = item.category === "VIDEO" || item.mime_type.startsWith("video/");
              const isImage = item.category === "PHOTO" || item.mime_type.startsWith("image/");
              const isDoc = item.category === "DOCUMENT" || item.mime_type === "application/pdf";
              const thumbUrl = getGoogleDriveImageUrl(item.drive_file_id, 800);
              const downloadUrl = `https://drive.google.com/uc?id=${item.drive_file_id}&export=download`;

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-neutral-900 border border-sand-300 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-warm hover:shadow-elevated transition-all flex flex-col group"
                >
                  {/* Media Visual Area */}
                  <div className="relative aspect-video bg-sand-200 dark:bg-neutral-800 overflow-hidden flex items-center justify-center">
                    {isImage ? (
                      <img
                        src={thumbUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : isVideo ? (
                      <div className="w-full h-full flex flex-col items-center justify-center relative bg-neutral-950 text-white">
                        <img
                          src={thumbUrl}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-60"
                        />
                        <button
                          onClick={() => setPreviewMedia(item)}
                          className="relative w-12 h-12 rounded-full bg-[#D7400B] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Play className="w-5 h-5 ml-0.5 fill-white" />
                        </button>
                        <span className="relative text-[10px] font-semibold uppercase tracking-wider mt-2 bg-black/60 px-2 py-0.5 rounded">
                          Video Reel
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-ink-500 dark:text-neutral-400 gap-2 p-4 text-center">
                        <FileText className="w-10 h-10 text-[#D7400B]" />
                        <span className="text-xs font-mono">{item.original_filename}</span>
                      </div>
                    )}

                    {/* Visibility Badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs ${
                          item.visibility === "PUBLIC"
                            ? "bg-emerald-500/90 text-white"
                            : "bg-neutral-900/80 text-sand-100"
                        }`}
                      >
                        {item.visibility === "PUBLIC" ? (
                          <>
                            <Globe className="w-3 h-3" />
                            <span>Public</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3" />
                            <span>Private</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Quick Preview Action */}
                    <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <button
                        onClick={() => setPreviewMedia(item)}
                        className="p-1.5 rounded-lg bg-white/90 dark:bg-neutral-900/90 text-teal-950 dark:text-white shadow hover:bg-white"
                        title="View Full Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Metadata Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      {editingMedia?.id === item.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editTitleInput}
                            onChange={(e) => setEditTitleInput(e.target.value)}
                            className="flex-1 px-2 py-1 text-xs rounded border border-[#D7400B] bg-sand-50 dark:bg-neutral-800"
                            autoFocus
                          />
                          <button
                            onClick={() => handleEditSave(item.id)}
                            className="p-1 rounded text-emerald-600 hover:bg-emerald-50"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingMedia(null)}
                            className="p-1 rounded text-ink-400 hover:bg-sand-100"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif font-bold text-sm text-teal-950 dark:text-white line-clamp-1">
                            {item.title}
                          </h4>
                          <button
                            onClick={() => {
                              setEditingMedia(item);
                              setEditTitleInput(item.title);
                            }}
                            className="text-ink-400 hover:text-[#D7400B] transition-colors shrink-0"
                            title="Rename"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      <p className="text-[11px] text-ink-500 dark:text-neutral-400 truncate mt-0.5">
                        {item.original_filename}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-ink-500 dark:text-neutral-400 pt-2 border-t border-sand-200 dark:border-neutral-800">
                      <span>{formatBytes(item.file_size)}</span>
                      <span>
                        {new Date(item.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D7400B] hover:underline"
                        title="Download from Google Drive"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </a>

                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="p-1.5 rounded-lg text-ink-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50"
                        title="Delete from Google Drive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Full Preview */}
        {previewMedia && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-900 border border-sand-300 dark:border-neutral-800 rounded-3xl max-w-3xl w-full p-6 space-y-4 shadow-2xl relative animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-sand-200 dark:border-neutral-800 pb-3">
                <div className="min-w-0">
                  <h3 className="font-serif font-bold text-lg text-teal-950 dark:text-white truncate">
                    {previewMedia.title}
                  </h3>
                  <p className="text-xs text-ink-500 dark:text-neutral-400 font-mono">
                    Drive File ID: {previewMedia.drive_file_id}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewMedia(null)}
                  className="p-2 rounded-xl text-ink-400 hover:bg-sand-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden bg-black flex items-center justify-center min-h-[300px] max-h-[65vh]">
                {previewMedia.category === "VIDEO" || previewMedia.mime_type.startsWith("video/") ? (
                  <GoogleDrivePlayer
                    url={`https://drive.google.com/file/d/${previewMedia.drive_file_id}/preview`}
                    title={previewMedia.title}
                    autoPlay
                    aspectRatio="16/9"
                    className="w-full"
                  />
                ) : (
                  <img
                    src={getGoogleDriveImageUrl(previewMedia.drive_file_id, 1600)}
                    alt={previewMedia.title}
                    className="max-h-[60vh] object-contain mx-auto"
                  />
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-ink-600 dark:text-neutral-400 pt-2">
                <span>Size: {formatBytes(previewMedia.file_size)}</span>
                <a
                  href={`https://drive.google.com/file/d/${previewMedia.drive_file_id}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#D7400B] font-semibold hover:underline"
                >
                  <span>Open in Google Drive</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
