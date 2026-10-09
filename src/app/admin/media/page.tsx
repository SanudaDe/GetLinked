"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  GETLINKED_DRIVE_FOLDER_ID,
  GETLINKED_DRIVE_FOLDER_URL,
  GoogleDriveMediaItem,
  getGoogleDriveImageUrl,
  getGoogleDrivePreviewUrl,
  extractGoogleDriveFolderId,
} from "@/utils/googleDrive";
import { GoogleDrivePlayer } from "@/components/common/GoogleDrivePlayer";
import {
  Folder,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Video as VideoIcon,
  Image as ImageIcon,
  Sparkles,
  Database,
  Cloud,
  FileCode,
  ShieldCheck,
  Eye,
  Info,
} from "lucide-react";

export default function AdminMediaPage() {
  const [folderId, setFolderId] = useState(GETLINKED_DRIVE_FOLDER_ID);
  const [folderName, setFolderName] = useState("GetLinked_Media");
  const [files, setFiles] = useState<GoogleDriveMediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "images" | "videos">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<GoogleDriveMediaItem | null>(null);
  const [apiMessage, setApiMessage] = useState<string | null>(null);

  const fetchFiles = async (targetId: string = folderId) => {
    setIsLoading(true);
    setApiMessage(null);
    try {
      const cleanId = extractGoogleDriveFolderId(targetId) || targetId;
      const res = await fetch(`/api/drive?folder=${encodeURIComponent(cleanId)}`);
      const data = await res.json();
      if (data.success) {
        setFiles(data.files || []);
        if (data.folderName) setFolderName(data.folderName);
        setApiMessage(data.message || null);
      } else {
        setApiMessage(data.error || "Failed to load files from Google Drive.");
      }
    } catch (err: any) {
      console.error("Fetch media error:", err);
      setApiMessage("Failed to connect to Google Drive service.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles(GETLINKED_DRIVE_FOLDER_ID);
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredFiles = files.filter((f) => {
    if (activeTab === "images") return f.type === "image";
    if (activeTab === "videos") return f.type === "video";
    return true;
  });

  return (
    <div className="space-y-6 pb-20">
      <AdminHeader
        title="Google Drive Media Cloud"
        subtitle="Manage and sync large 4K property videos, photos, and creator assets hosted in your shared Google Drive."
        action={
          <div className="flex items-center gap-2">
            <a
              href={GETLINKED_DRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sand-200 hover:bg-sand-300 text-teal-950 text-xs font-semibold border border-sand-400 transition-colors"
            >
              <span>Open in Drive</span>
              <ExternalLink className="w-3.5 h-3.5 text-teal-800" />
            </a>
            <button
              onClick={() => fetchFiles(folderId)}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-sand-50 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>{isLoading ? "Syncing..." : "Sync from Drive"}</span>
            </button>
          </div>
        }
      />

      <div className="px-6 space-y-6">
        {/* Connected Folder Card */}
        <div className="bg-white rounded-2xl border border-sand-300 p-6 shadow-warm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                <Folder className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif text-xl font-bold text-teal-950">
                    {folderName}
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span>Live Drive Connected</span>
                  </span>
                </div>
                <p className="text-xs text-ink-600">
                  Folder ID: <code className="font-mono bg-sand-100 px-1.5 py-0.5 rounded text-teal-900">{folderId}</code>
                </p>
                <p className="text-xs text-ink-500">
                  Share permissions: <strong className="text-ink-700">Anyone with the link can view</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <a
                href={GETLINKED_DRIVE_FOLDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Cloud className="w-4 h-4" />
                <span>Upload New Files to Drive</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              <button
                onClick={() => handleCopy(GETLINKED_DRIVE_FOLDER_URL, "folder-url")}
                className="px-3.5 py-2.5 rounded-xl bg-sand-100 hover:bg-sand-200 text-teal-950 text-xs font-semibold border border-sand-300 transition-colors flex items-center justify-center gap-1.5"
              >
                {copiedId === "folder-url" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-ink-500" />
                    <span>Copy Folder Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {apiMessage && (
            <div className="mt-4 p-3 rounded-xl bg-sand-50 border border-sand-200 text-xs text-ink-700 flex items-center gap-2">
              <Info className="w-4 h-4 text-teal-800 shrink-0" />
              <span>{apiMessage}</span>
            </div>
          )}
        </div>

        {/* Media Controls & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="inline-flex p-1 rounded-xl bg-sand-200 text-xs">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors ${
                activeTab === "all" ? "bg-white text-teal-950 shadow-xs" : "text-ink-600 hover:text-teal-950"
              }`}
            >
              All Media ({files.length})
            </button>
            <button
              onClick={() => setActiveTab("images")}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors ${
                activeTab === "images" ? "bg-white text-teal-950 shadow-xs" : "text-ink-600 hover:text-teal-950"
              }`}
            >
              Images ({files.filter((f) => f.type === "image").length})
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors ${
                activeTab === "videos" ? "bg-white text-teal-950 shadow-xs" : "text-ink-600 hover:text-teal-950"
              }`}
            >
              Videos ({files.filter((f) => f.type === "video").length})
            </button>
          </div>

          <span className="text-xs text-ink-500 font-medium">
            Showing {filteredFiles.length} item(s) from Google Drive
          </span>
        </div>

        {/* Media Grid or Upload Prompt */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-sand-300 p-12 text-center space-y-3 shadow-warm">
            <RefreshCw className="w-8 h-8 text-teal-900 animate-spin mx-auto" />
            <p className="text-xs text-ink-600">Syncing files from Google Drive folder...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-sand-400 p-10 text-center space-y-4 shadow-warm">
            <div className="w-16 h-16 rounded-full bg-sand-100 mx-auto flex items-center justify-center text-amber-700">
              <Folder className="w-8 h-8" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="font-serif text-lg font-bold text-teal-950">
                Your Google Drive Media folder is ready!
              </h3>
              <p className="text-xs text-ink-600 leading-relaxed">
                Whenever you or your hosts upload photos or videos to the shared Google Drive folder{" "}
                <span className="font-semibold text-teal-900">&ldquo;{folderName}&rdquo;</span>, click{" "}
                <strong>&ldquo;Sync from Drive&rdquo;</strong> to automatically load and use them in GetLinked.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <a
                href={GETLINKED_DRIVE_FOLDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-teal-900 hover:bg-teal-800 text-gold-400 text-xs font-bold transition-all shadow-sm flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open & Upload Files in Google Drive</span>
              </a>
              <button
                onClick={() => fetchFiles(folderId)}
                className="px-4 py-2.5 rounded-xl bg-sand-200 hover:bg-sand-300 text-teal-950 text-xs font-semibold transition-colors"
              >
                Refresh Folder
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="bg-white rounded-2xl border border-sand-300 overflow-hidden shadow-warm hover:shadow-warm-lg transition-all flex flex-col justify-between group"
              >
                {/* Media Thumbnail */}
                <div className="relative aspect-video bg-[#1A3739] overflow-hidden">
                  {file.type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={file.thumbnailUrl}
                      alt={file.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white">
                      <VideoIcon className="w-8 h-8 text-gold-400 mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sand-300">
                        Drive Video Stream
                      </span>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-black/70 text-white backdrop-blur-xs">
                      {file.type}
                    </span>
                  </div>

                  {file.size && (
                    <span className="absolute bottom-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/70 text-sand-100 backdrop-blur-xs">
                      {file.size}
                    </span>
                  )}

                  {/* Hover Quick Preview Button */}
                  <button
                    onClick={() => setSelectedFileForPreview(file)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold backdrop-blur-xs cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Watch / Preview</span>
                  </button>
                </div>

                {/* Details & Copy Actions */}
                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-teal-950 truncate" title={file.name}>
                      {file.name}
                    </h4>
                    <span className="text-[10px] text-ink-500 font-mono block mt-0.5">
                      ID: {file.id.slice(0, 16)}...
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1 border-t border-sand-200">
                    <button
                      onClick={() => handleCopy(file.directUrl, `cdn-${file.id}`)}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-sand-100 hover:bg-sand-200 text-teal-950 text-[11px] font-semibold transition-colors flex items-center justify-between"
                    >
                      <span>Web CDN Image URL</span>
                      {copiedId === `cdn-${file.id}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-ink-500" />
                      )}
                    </button>

                    {file.type === "video" && (
                      <button
                        onClick={() => handleCopy(file.embedUrl, `embed-${file.id}`)}
                        className="w-full py-1.5 px-2.5 rounded-lg bg-sand-100 hover:bg-sand-200 text-[#D7400B] text-[11px] font-semibold transition-colors flex items-center justify-between"
                      >
                        <span>Video Stream Embed Link</span>
                        {copiedId === `embed-${file.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-ink-500" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Database & Architecture Guide */}
        <div className="bg-sand-50 rounded-2xl border border-sand-300 p-6 space-y-4">
          <div className="flex items-center gap-2 text-teal-950">
            <Database className="w-5 h-5 text-teal-900" />
            <h3 className="font-serif text-lg font-bold">
              How Google Drive Integrates with Your Database Tables
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white border border-sand-300 space-y-2">
              <span className="font-bold text-teal-900 block flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-teal-900 text-white flex items-center justify-center text-[10px]">1</span>
                <span>Save to Google Drive</span>
              </span>
              <p className="text-ink-600 leading-relaxed">
                Save full-resolution property photos, videos, and reels in your shared Google Drive folder: <code className="text-teal-950 font-mono text-[11px]">GetLinked_Media</code>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-sand-300 space-y-2">
              <span className="font-bold text-teal-900 block flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-teal-900 text-white flex items-center justify-center text-[10px]">2</span>
                <span>Save Drive Link in DB</span>
              </span>
              <p className="text-ink-600 leading-relaxed">
                Store the Drive URL in Supabase tables: <code className="text-teal-950 font-mono text-[11px]">image_url</code>, <code className="text-teal-950 font-mono text-[11px]">images[]</code>, <code className="text-teal-950 font-mono text-[11px]">video_url</code>, or <code className="text-teal-950 font-mono text-[11px]">avatar_url</code>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-sand-300 space-y-2">
              <span className="font-bold text-teal-900 block flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-teal-900 text-white flex items-center justify-center text-[10px]">3</span>
                <span>Instant CDN Delivery</span>
              </span>
              <p className="text-ink-600 leading-relaxed">
                GetLinked&apos;s <code className="text-teal-950 font-mono text-[11px]">formatStorageUrl</code> automatically converts Drive links into fast Google CDN thumbnails, and videos stream via Google Drive responsive preview player!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Video Preview Modal */}
      {selectedFileForPreview && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedFileForPreview(null)}
        >
          <div
            className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden max-w-3xl w-full border border-sand-300 dark:border-neutral-800 shadow-2xl space-y-4 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-sand-200 dark:border-neutral-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-teal-950 dark:text-white truncate">
                {selectedFileForPreview.name}
              </h3>
              <button
                onClick={() => setSelectedFileForPreview(null)}
                className="text-ink-500 hover:text-ink-900 dark:text-neutral-400 dark:hover:text-white text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="max-h-[65vh] overflow-hidden rounded-xl">
              {selectedFileForPreview.type === "video" ? (
                <GoogleDrivePlayer
                  url={selectedFileForPreview.embedUrl}
                  title={selectedFileForPreview.name}
                  aspectRatio="16/9"
                  autoPlay
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedFileForPreview.directUrl}
                  alt={selectedFileForPreview.name}
                  className="w-full max-h-[60vh] object-contain rounded-xl bg-black"
                />
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-ink-500">
                Format: {selectedFileForPreview.type.toUpperCase()} • Size: {selectedFileForPreview.size || "Standard"}
              </span>
              <a
                href={`https://drive.google.com/file/d/${selectedFileForPreview.id}/view`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-teal-900 dark:text-gold-400 font-bold underline inline-flex items-center gap-1"
              >
                <span>Open Original in Drive</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
