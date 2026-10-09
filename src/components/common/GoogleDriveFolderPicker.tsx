"use client";

import React, { useState, useEffect } from "react";
import {
  GETLINKED_DRIVE_FOLDER_ID,
  GETLINKED_DRIVE_FOLDER_URL,
  GoogleDriveMediaItem,
  extractGoogleDriveFolderId,
  extractGoogleDriveFileId,
  getGoogleDriveImageUrl,
} from "@/utils/googleDrive";
import {
  Folder,
  RefreshCw,
  ExternalLink,
  Image as ImageIcon,
  Video as VideoIcon,
  Check,
  Plus,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface GoogleDriveFolderPickerProps {
  onSelectImage?: (url: string) => void;
  onSelectVideo?: (url: string) => void;
  onImportAll?: (urls: string[]) => void;
  selectedUrls?: string[];
  isOpen?: boolean;
  onClose?: () => void;
}

export const GoogleDriveFolderPicker: React.FC<GoogleDriveFolderPickerProps> = ({
  onSelectImage,
  onSelectVideo,
  onImportAll,
  selectedUrls = [],
  isOpen = true,
  onClose,
}) => {
  const [folderInput, setFolderInput] = useState(GETLINKED_DRIVE_FOLDER_URL);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<GoogleDriveMediaItem[]>([]);
  const [folderName, setFolderName] = useState("GetLinked_Media");
  const [activeTab, setActiveTab] = useState<"all" | "images" | "videos">("all");
  const [message, setMessage] = useState<string | null>(null);

  const fetchDriveFiles = async (folderTarget: string = GETLINKED_DRIVE_FOLDER_ID) => {
    setIsLoading(true);
    setMessage(null);
    try {
      const folderId = extractGoogleDriveFolderId(folderTarget) || folderTarget;
      const res = await fetch(`/api/drive?folder=${encodeURIComponent(folderId)}`);
      const data = await res.json();

      if (data.success) {
        setFiles(data.files || []);
        if (data.folderName) setFolderName(data.folderName);
        setMessage(data.message || null);
      } else {
        setMessage(data.error || "Failed to load files from Google Drive.");
      }
    } catch (err: any) {
      console.error("Error fetching drive files:", err);
      setMessage("Network error connecting to Google Drive.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDriveFiles(GETLINKED_DRIVE_FOLDER_ID);
  }, []);

  const filteredFiles = files.filter((f) => {
    if (activeTab === "images") return f.type === "image";
    if (activeTab === "videos") return f.type === "video";
    return true;
  });

  const handleImportAllClick = () => {
    if (!onImportAll) return;
    const urls = files
      .filter((f) => f.type === "image" || f.type === "video")
      .map((f) => f.directUrl);
    if (urls.length > 0) {
      onImportAll(urls);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-sand-300 dark:border-neutral-800 shadow-warm p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-200 dark:border-neutral-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-400">
            <Folder className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg font-bold text-teal-950 dark:text-white">
                Google Drive Media Cloud
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Connected
              </span>
            </div>
            <p className="text-xs text-ink-600 dark:text-neutral-400">
              Folder: <span className="font-mono font-semibold text-teal-900 dark:text-gold-400">{folderName}</span> ({files.length} items loaded)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Direct Drive Button */}
          <a
            href={GETLINKED_DRIVE_FOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sand-100 dark:bg-neutral-800 hover:bg-sand-200 dark:hover:bg-neutral-700 text-teal-950 dark:text-white text-xs font-semibold border border-sand-300 dark:border-neutral-700 transition-colors"
          >
            <span>Open in Google Drive</span>
            <ExternalLink className="w-3.5 h-3.5 text-teal-700 dark:text-gold-400" />
          </a>

          {/* Sync Button */}
          <button
            type="button"
            onClick={() => fetchDriveFiles(folderInput)}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-900 hover:bg-teal-800 dark:bg-[#D7400B] text-white text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>{isLoading ? "Syncing..." : "Sync Drive"}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="inline-flex p-1 rounded-lg bg-sand-100 dark:bg-neutral-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1 rounded-md font-semibold transition-colors ${
              activeTab === "all"
                ? "bg-white dark:bg-neutral-900 text-teal-950 dark:text-white shadow-xs"
                : "text-ink-600 dark:text-neutral-400 hover:text-teal-950"
            }`}
          >
            All Files ({files.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("images")}
            className={`px-3 py-1 rounded-md font-semibold transition-colors ${
              activeTab === "images"
                ? "bg-white dark:bg-neutral-900 text-teal-950 dark:text-white shadow-xs"
                : "text-ink-600 dark:text-neutral-400 hover:text-teal-950"
            }`}
          >
            Images ({files.filter((f) => f.type === "image").length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("videos")}
            className={`px-3 py-1 rounded-md font-semibold transition-colors ${
              activeTab === "videos"
                ? "bg-white dark:bg-neutral-900 text-teal-950 dark:text-white shadow-xs"
                : "text-ink-600 dark:text-neutral-400 hover:text-teal-950"
            }`}
          >
            Videos ({files.filter((f) => f.type === "video").length})
          </button>
        </div>

        {onImportAll && files.length > 0 && (
          <button
            type="button"
            onClick={handleImportAllClick}
            className="text-xs font-semibold text-teal-900 dark:text-gold-400 hover:underline inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Import All {files.length} to Listing</span>
          </button>
        )}
      </div>

      {/* File Grid or Empty State */}
      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-teal-800 dark:text-[#D7400B] animate-spin" />
          <p className="text-xs text-ink-600 dark:text-neutral-400">
            Connecting to Google Drive folder <span className="font-semibold">{folderName}</span>...
          </p>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="p-6 rounded-xl bg-sand-50 dark:bg-neutral-950/50 border border-dashed border-sand-300 dark:border-neutral-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-sand-200 dark:bg-neutral-800 mx-auto flex items-center justify-center text-ink-500">
            <Folder className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h4 className="font-serif text-sm font-bold text-teal-950 dark:text-white">
              No files in &ldquo;{folderName}&rdquo; yet
            </h4>
            <p className="text-xs text-ink-600 dark:text-neutral-400 leading-relaxed">
              Drop photos or videos into your Google Drive folder. They will immediately become available to use across GetLinked!
            </p>
          </div>
          <div className="pt-2">
            <a
              href={GETLINKED_DRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A3739] hover:bg-[#122728] text-gold-400 text-xs font-bold transition-all shadow-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Upload Files to &ldquo;{folderName}&rdquo; in Google Drive</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 max-h-96 overflow-y-auto pr-1">
          {filteredFiles.map((file) => {
            const isSelected = selectedUrls.includes(file.directUrl);

            return (
              <div
                key={file.id}
                className={`relative rounded-xl overflow-hidden border-2 bg-sand-100 dark:bg-neutral-800 flex flex-col justify-between group transition-all ${
                  isSelected
                    ? "border-emerald-600 ring-2 ring-emerald-400/30"
                    : "border-sand-300 dark:border-neutral-700 hover:border-teal-700 dark:hover:border-gold-500"
                }`}
              >
                {/* Visual Thumbnail */}
                <div className="relative aspect-video bg-sand-200 dark:bg-neutral-900 overflow-hidden">
                  {file.type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={file.thumbnailUrl}
                      alt={file.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-teal-950 text-white">
                      <VideoIcon className="w-6 h-6 text-gold-400 mb-1" />
                      <span className="text-[10px] uppercase font-bold tracking-wider text-sand-300">
                        Drive Video
                      </span>
                    </div>
                  )}

                  {/* Type Badge */}
                  <span className="absolute top-1.5 left-1.5 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-black/70 text-white backdrop-blur-xs">
                    {file.type}
                  </span>

                  {file.size && (
                    <span className="absolute bottom-1.5 right-1.5 text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/70 text-white/90 backdrop-blur-xs">
                      {file.size}
                    </span>
                  )}
                </div>

                {/* Info & Action Buttons */}
                <div className="p-2 space-y-1.5 bg-white dark:bg-neutral-900">
                  <p className="text-[11px] font-medium text-teal-950 dark:text-white truncate" title={file.name}>
                    {file.name}
                  </p>

                  <div className="flex items-center gap-1">
                    {file.type === "image" && onSelectImage && (
                      <button
                        type="button"
                        onClick={() => onSelectImage(file.directUrl)}
                        className={`flex-1 py-1 px-1.5 rounded text-[10px] font-bold transition-colors flex items-center justify-center gap-1 ${
                          isSelected
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-teal-900 hover:bg-teal-800 text-white"
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Selected</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>Use Photo</span>
                          </>
                        )}
                      </button>
                    )}

                    {file.type === "video" && onSelectVideo && (
                      <button
                        type="button"
                        onClick={() => onSelectVideo(file.embedUrl)}
                        className="flex-1 py-1 px-1.5 rounded bg-[#D7400B] hover:bg-[#BD3607] text-white text-[10px] font-bold transition-colors flex items-center justify-center gap-1"
                      >
                        <VideoIcon className="w-3 h-3" />
                        <span>Use Video</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Notice */}
      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
        <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-amber-700 dark:text-amber-400" />
        <div className="space-y-0.5">
          <span className="font-bold block">How Google Drive Big Files Storage Works:</span>
          <p className="text-[11px] leading-relaxed text-amber-900/80 dark:text-amber-300">
            Large videos and 4K property photos stored in your Google Drive folder are delivered through Google&apos;s global CDN at full speed. Database tables store clean Drive file links, and the website formats them on-the-fly for retina displays and smooth video streaming.
          </p>
        </div>
      </div>
    </div>
  );
};
