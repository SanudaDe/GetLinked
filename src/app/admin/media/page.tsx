"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  GETLINKED_DRIVE_FOLDER_ID,
  GETLINKED_DRIVE_FOLDER_URL,
  GoogleDriveMediaItem,
  getGoogleDriveImageUrl,
  formatBytes,
} from "@/utils/googleDrive";
import { GoogleDrivePlayer } from "@/components/common/GoogleDrivePlayer";
import { UserMedia, MediaCategory } from "@/types";
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
  ShieldCheck,
  Eye,
  Info,
  Trash2,
  Lock,
  Globe,
  HardDrive,
  Search,
  KeyRound,
  FileText,
  AlertTriangle,
} from "lucide-react";

export default function AdminMediaPage() {
  const [viewMode, setViewMode] = useState<"database" | "drive">("database");
  const [folderId] = useState(GETLINKED_DRIVE_FOLDER_ID);
  const [folderName, setFolderName] = useState("GetLinked_Media");
  const [driveFiles, setDriveFiles] = useState<GoogleDriveMediaItem[]>([]);
  const [dbMedia, setDbMedia] = useState<UserMedia[]>([]);
  const [stats, setStats] = useState({
    totalStorageBytes: 0,
    photosCount: 0,
    videosCount: 0,
    docsCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<{
    id: string;
    name: string;
    type: string;
    url?: string;
    size?: string;
  } | null>(null);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch Database user_media records via admin API
  const fetchDbMedia = useCallback(async () => {
    setIsLoading(true);
    setApiMessage(null);
    try {
      const adminPass =
        process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "getlinked@admin26";
      let url = `/api/drive/admin?limit=150`;
      if (activeCategory !== "ALL") {
        url += `&category=${encodeURIComponent(activeCategory)}`;
      }
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }

      const res = await fetch(url, {
        headers: {
          "x-admin-key": adminPass,
        },
      });

      const data = await res.json();
      if (data.success) {
        setDbMedia(data.items || []);
        if (data.stats) setStats(data.stats);
      } else {
        setApiMessage(data.error || "Failed to load database media records.");
      }
    } catch (err: any) {
      console.error("Admin DB media error:", err);
      setApiMessage("Failed to connect to admin media API.");
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, searchQuery]);

  // Fetch raw Drive folder items via /api/drive
  const fetchDriveFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/drive?folder=${encodeURIComponent(folderId)}`);
      const data = await res.json();
      if (data.success) {
        setDriveFiles(data.files || []);
        if (data.folderName) setFolderName(data.folderName);
      }
    } catch (err: any) {
      console.error("Fetch Drive error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [folderId]);

  useEffect(() => {
    if (viewMode === "database") {
      fetchDbMedia();
    } else {
      fetchDriveFiles();
    }
  }, [viewMode, fetchDbMedia, fetchDriveFiles]);

  const handleAdminDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This will permanently remove the file from Google Drive and delete its database metadata.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const adminPass =
        process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "getlinked@admin26";
      const res = await fetch(`/api/drive/admin?id=${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-key": adminPass,
        },
      });

      const data = await res.json();
      if (data.success) {
        setDbMedia((prev) => prev.filter((item) => item.id !== id));
        setApiMessage(`"${title}" successfully deleted from Google Drive and database.`);
        setTimeout(() => setApiMessage(null), 4000);
      } else {
        alert(data.error || "Failed to delete file.");
      }
    } catch (err: any) {
      alert(err.message || "Network error deleting file.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 pb-20">
      <AdminHeader
        title="Google Drive Media Management"
        subtitle="Control user media storage, monitor Drive quotas, inspect assets, and authorize backend OAuth credentials."
        action={
          <div className="flex items-center gap-2">
            <a
              href="/api/drive/auth/init"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-gold-400 text-xs font-semibold shadow-xs transition-colors"
              title="Authorize Backend Drive Connection"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Authorize Drive OAuth</span>
            </a>
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
              onClick={() => (viewMode === "database" ? fetchDbMedia() : fetchDriveFiles())}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sand-200 hover:bg-sand-300 text-teal-950 text-xs font-semibold border border-sand-400 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        }
      />

      <div className="px-6 space-y-6">
        {/* Storage Analytics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-sand-300 p-5 shadow-warm space-y-1">
            <div className="flex items-center justify-between text-xs text-ink-500 font-semibold uppercase tracking-wider">
              <span>Total Storage Used</span>
              <HardDrive className="w-4 h-4 text-[#D7400B]" />
            </div>
            <p className="text-2xl font-bold font-serif text-teal-950">
              {formatBytes(stats.totalStorageBytes)}
            </p>
            <p className="text-[11px] text-ink-400">Total volume across registered users</p>
          </div>

          <div className="bg-white rounded-2xl border border-sand-300 p-5 shadow-warm space-y-1">
            <div className="flex items-center justify-between text-xs text-ink-500 font-semibold uppercase tracking-wider">
              <span>Managed Media</span>
              <Database className="w-4 h-4 text-teal-800" />
            </div>
            <p className="text-2xl font-bold font-serif text-teal-950">
              {dbMedia.length} Items
            </p>
            <p className="text-[11px] text-ink-400">Tracked in Supabase user_media</p>
          </div>

          <div className="bg-white rounded-2xl border border-sand-300 p-5 shadow-warm space-y-1">
            <div className="flex items-center justify-between text-xs text-ink-500 font-semibold uppercase tracking-wider">
              <span>Photos & Reels</span>
              <VideoIcon className="w-4 h-4 text-gold-600" />
            </div>
            <p className="text-2xl font-bold font-serif text-teal-950">
              {stats.photosCount} / {stats.videosCount}
            </p>
            <p className="text-[11px] text-ink-400">Photos vs Video Reels</p>
          </div>

          <div className="bg-white rounded-2xl border border-sand-300 p-5 shadow-warm space-y-1">
            <div className="flex items-center justify-between text-xs text-ink-500 font-semibold uppercase tracking-wider">
              <span>Drive Destination</span>
              <Folder className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-sm font-mono font-bold text-teal-950 truncate" title={folderId}>
              {folderId.slice(0, 14)}...
            </p>
            <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Folder Connected
            </p>
          </div>
        </div>

        {/* View Mode Toggle & OAuth Info Bar */}
        <div className="bg-white rounded-2xl border border-sand-300 p-4 shadow-warm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("database")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === "database"
                  ? "bg-teal-900 text-sand-50 shadow-xs"
                  : "bg-sand-100 text-ink-700 hover:bg-sand-200"
              }`}
            >
              User Media Database ({dbMedia.length})
            </button>
            <button
              onClick={() => setViewMode("drive")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === "drive"
                  ? "bg-teal-900 text-sand-50 shadow-xs"
                  : "bg-sand-100 text-ink-700 hover:bg-sand-200"
              }`}
            >
              Raw Google Drive Explorer ({driveFiles.length})
            </button>
          </div>

          <div className="text-xs text-ink-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Secure server-side Drive integration: secrets kept private in <code>.env.local</code>.
            </span>
          </div>
        </div>

        {apiMessage && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{apiMessage}</span>
          </div>
        )}

        {/* Controls: Search & Category */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-sand-200 rounded-xl text-xs font-semibold overflow-x-auto">
            {["ALL", "PHOTO", "VIDEO", "DOCUMENT", "AVATAR"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-white text-teal-950 font-bold shadow-xs"
                    : "text-ink-600 hover:text-teal-950"
                }`}
              >
                {cat === "ALL" ? "All Formats" : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-ink-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search filename or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-sand-300 bg-white text-teal-950 focus:outline-none focus:ring-1 focus:ring-teal-900"
            />
          </div>
        </div>

        {/* Database Media Grid */}
        {viewMode === "database" && (
          <div>
            {isLoading ? (
              <div className="bg-white rounded-2xl border border-sand-300 p-12 text-center space-y-3 shadow-warm">
                <RefreshCw className="w-8 h-8 text-teal-900 animate-spin mx-auto" />
                <p className="text-xs text-ink-600">Loading media records from Supabase PostgreSQL...</p>
              </div>
            ) : dbMedia.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-sand-400 p-12 text-center space-y-3 shadow-warm">
                <Database className="w-10 h-10 text-ink-400 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-teal-950">
                  No Database Media Records Found
                </h3>
                <p className="text-xs text-ink-600 max-w-md mx-auto">
                  When authenticated creators and hosts upload files via the user portal, their records with ownership and Google Drive file IDs will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {dbMedia.map((item) => {
                  const isVideo = item.category === "VIDEO" || item.mime_type.startsWith("video/");
                  const isImage = item.category === "PHOTO" || item.mime_type.startsWith("image/");
                  const thumbUrl = getGoogleDriveImageUrl(item.drive_file_id, 800);

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-sand-300 overflow-hidden shadow-warm hover:shadow-elevated transition-all flex flex-col justify-between group"
                    >
                      <div className="relative aspect-video bg-neutral-950 overflow-hidden flex items-center justify-center">
                        {isImage ? (
                          <img
                            src={thumbUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : isVideo ? (
                          <div className="w-full h-full flex flex-col items-center justify-center text-white relative">
                            <img
                              src={thumbUrl}
                              alt={item.title}
                              className="absolute inset-0 w-full h-full object-cover opacity-50"
                            />
                            <VideoIcon className="w-8 h-8 text-gold-400 relative" />
                            <span className="text-[10px] uppercase font-bold relative bg-black/60 px-2 py-0.5 rounded mt-1">
                              Drive Video
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-ink-400 p-4">
                            <FileText className="w-8 h-8 text-[#D7400B]" />
                            <span className="text-[11px] font-mono mt-1">{item.category}</span>
                          </div>
                        )}

                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/75 text-white backdrop-blur-xs">
                            {item.category}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded backdrop-blur-xs ${
                              item.visibility === "PUBLIC"
                                ? "bg-emerald-600/90 text-white"
                                : "bg-neutral-800/90 text-sand-200"
                            }`}
                          >
                            {item.visibility}
                          </span>
                        </div>

                        <button
                          onClick={() =>
                            setSelectedFileForPreview({
                              id: item.drive_file_id,
                              name: item.title,
                              type: item.category.toLowerCase(),
                              url: `https://drive.google.com/file/d/${item.drive_file_id}/preview`,
                              size: formatBytes(item.file_size),
                            })
                          }
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold backdrop-blur-xs cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Preview</span>
                        </button>
                      </div>

                      <div className="p-4 space-y-2">
                        <div>
                          <h4 className="font-bold text-xs text-teal-950 truncate" title={item.title}>
                            {item.title}
                          </h4>
                          <p className="text-[10px] text-ink-400 font-mono truncate mt-0.5">
                            {item.original_filename}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-ink-500 pt-2 border-t border-sand-200">
                          <span>{formatBytes(item.file_size)}</span>
                          <span className="font-mono text-[10px]">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <a
                            href={`https://drive.google.com/file/d/${item.drive_file_id}/view`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-semibold text-teal-900 hover:underline inline-flex items-center gap-1"
                          >
                            <span>Drive</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          <button
                            onClick={() => handleAdminDelete(item.id, item.title)}
                            disabled={deletingId === item.id}
                            className="p-1.5 text-ink-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Remove inappropriate file"
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
          </div>
        )}

        {/* Raw Drive Folder Explorer */}
        {viewMode === "drive" && (
          <div>
            {isLoading ? (
              <div className="bg-white rounded-2xl border border-sand-300 p-12 text-center space-y-3 shadow-warm">
                <RefreshCw className="w-8 h-8 text-teal-900 animate-spin mx-auto" />
                <p className="text-xs text-ink-600">Querying Google Drive folder contents...</p>
              </div>
            ) : driveFiles.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-sand-400 p-10 text-center space-y-3 shadow-warm">
                <Folder className="w-8 h-8 text-amber-700 mx-auto" />
                <p className="text-xs text-ink-600">
                  Folder is empty or requires permissions. Click Refresh to retry.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {driveFiles.map((file) => (
                  <div
                    key={file.id}
                    className="bg-white rounded-2xl border border-sand-300 overflow-hidden shadow-warm hover:shadow-elevated transition-all flex flex-col justify-between group"
                  >
                    <div className="relative aspect-video bg-neutral-950 overflow-hidden">
                      {file.type === "image" ? (
                        <img
                          src={file.thumbnailUrl}
                          alt={file.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white">
                          <VideoIcon className="w-8 h-8 text-gold-400 mb-1" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-sand-300">
                            Drive Stream
                          </span>
                        </div>
                      )}

                      <div className="absolute top-2 left-2">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-black/70 text-white backdrop-blur-xs">
                          {file.type}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          setSelectedFileForPreview({
                            id: file.id,
                            name: file.name,
                            type: file.type,
                            url: file.embedUrl,
                            size: file.size,
                          })
                        }
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold backdrop-blur-xs cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Preview</span>
                      </button>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="text-xs font-bold text-teal-950 truncate" title={file.name}>
                          {file.name}
                        </h4>
                        <span className="text-[10px] text-ink-400 font-mono block mt-0.5">
                          ID: {file.id.slice(0, 16)}...
                        </span>
                      </div>

                      <div className="space-y-1.5 pt-1 border-t border-sand-200">
                        <button
                          onClick={() => handleCopy(file.directUrl, `cdn-${file.id}`)}
                          className="w-full py-1.5 px-2.5 rounded-lg bg-sand-100 hover:bg-sand-200 text-teal-950 text-[11px] font-semibold transition-colors flex items-center justify-between"
                        >
                          <span>Copy Web CDN URL</span>
                          {copiedId === `cdn-${file.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-ink-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {selectedFileForPreview && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedFileForPreview(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full border border-sand-300 shadow-2xl space-y-4 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <h3 className="font-serif text-lg font-bold text-teal-950 truncate">
                {selectedFileForPreview.name}
              </h3>
              <button
                onClick={() => setSelectedFileForPreview(null)}
                className="text-ink-500 hover:text-ink-900 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="max-h-[65vh] overflow-hidden rounded-xl bg-black flex items-center justify-center">
              {selectedFileForPreview.type === "video" ? (
                <GoogleDrivePlayer
                  url={selectedFileForPreview.url || `https://drive.google.com/file/d/${selectedFileForPreview.id}/preview`}
                  title={selectedFileForPreview.name}
                  aspectRatio="16/9"
                  autoPlay
                />
              ) : (
                <img
                  src={getGoogleDriveImageUrl(selectedFileForPreview.id, 1600)}
                  alt={selectedFileForPreview.name}
                  className="w-full max-h-[60vh] object-contain rounded-xl bg-black"
                />
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-ink-500 font-mono">
                Drive ID: {selectedFileForPreview.id}
              </span>
              <a
                href={`https://drive.google.com/file/d/${selectedFileForPreview.id}/view`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-teal-900 font-bold underline inline-flex items-center gap-1"
              >
                <span>Open in Google Drive</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
