"use client";

import React, { useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MediaCategory, MediaVisibility, UserMedia } from "@/types";
import { formatBytes } from "@/utils/googleDrive";
import {
  Upload,
  UploadCloud,
  X,
  FileCheck,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  Lock,
  Globe,
  Loader2,
} from "lucide-react";

interface MediaUploaderProps {
  onSuccess?: (media: UserMedia) => void;
  defaultCategory?: MediaCategory;
  className?: string;
  compact?: boolean;
}

const ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".pdf",
  ".mp4",
  ".webm",
];

const MAX_SIZES: Record<string, number> = {
  image: 25 * 1024 * 1024, // 25 MB
  document: 35 * 1024 * 1024, // 35 MB
  video: 250 * 1024 * 1024, // 250 MB
};

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onSuccess,
  defaultCategory = "PHOTO",
  className = "",
  compact = false,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<MediaCategory>(defaultCategory);
  const [visibility, setVisibility] = useState<MediaVisibility>("PRIVATE");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const validateFile = (selectedFile: File): boolean => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const ext = "." + selectedFile.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setErrorMsg(
        `Unsupported file type (${ext}). Allowed formats: JPG, PNG, WebP, PDF, MP4, WebM.`
      );
      return false;
    }

    let maxLimit = MAX_SIZES.image;
    if (selectedFile.type.startsWith("video/") || ext === ".mp4" || ext === ".webm") {
      maxLimit = MAX_SIZES.video;
    } else if (selectedFile.type === "application/pdf" || ext === ".pdf") {
      maxLimit = MAX_SIZES.document;
    }

    if (selectedFile.size > maxLimit) {
      setErrorMsg(
        `File size exceeds ${formatBytes(maxLimit)} limit for this media format.`
      );
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && validateFile(selected)) {
      setFile(selected);
      setTitle(selected.name.replace(/\.[^/.]+$/, ""));
      // Auto-detect category
      if (selected.type.startsWith("video/")) {
        setCategory("VIDEO");
      } else if (selected.type === "application/pdf") {
        setCategory("DOCUMENT");
      } else if (selected.type.startsWith("image/")) {
        setCategory("PHOTO");
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && validateFile(dropped)) {
      setFile(dropped);
      setTitle(dropped.name.replace(/\.[^/.]+$/, ""));
      if (dropped.type.startsWith("video/")) {
        setCategory("VIDEO");
      } else if (dropped.type === "application/pdf") {
        setCategory("DOCUMENT");
      } else if (dropped.type.startsWith("image/")) {
        setCategory("PHOTO");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleCancelUpload = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
    setIsUploading(false);
    setUploadProgress(0);
    setErrorMsg("Upload cancelled by user.");
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg("Please select a file to upload.");
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 1. Get current Supabase session token
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setErrorMsg("You must be logged in to upload files. Please sign in first.");
        setIsUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title || file.name);
      formData.append("category", category);
      formData.append("visibility", visibility);

      // 2. Use XMLHttpRequest for precise upload progress tracking
      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 95);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        setIsUploading(false);
        xhrRef.current = null;
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            if (data.success) {
              setUploadProgress(100);
              setSuccessMsg(`"${file.name}" uploaded successfully to Google Drive!`);
              setFile(null);
              setTitle("");
              if (fileInputRef.current) fileInputRef.current.value = "";
              if (onSuccess && data.media) {
                onSuccess(data.media);
              }
            } else {
              setErrorMsg(data.error || "Upload failed. Please try again.");
            }
          } catch {
            setErrorMsg("Invalid server response.");
          }
        } else {
          try {
            const errData = JSON.parse(xhr.responseText);
            setErrorMsg(errData.error || `Upload failed with HTTP ${xhr.status}`);
          } catch {
            setErrorMsg(`Server error (${xhr.status}).`);
          }
        }
      };

      xhr.onerror = () => {
        setIsUploading(false);
        xhrRef.current = null;
        setErrorMsg("Network error connecting to upload endpoint.");
      };

      xhr.open("POST", "/api/drive/upload");
      xhr.setRequestHeader("Authorization", `Bearer ${session.access_token}`);
      xhr.send(formData);
    } catch (err: any) {
      setIsUploading(false);
      setErrorMsg(err.message || "Failed to initiate upload.");
    }
  };

  return (
    <div
      className={`bg-white dark:bg-neutral-900 border border-sand-300 dark:border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-warm ${className}`}
    >
      <div className="flex items-center justify-between pb-4 border-b border-sand-200 dark:border-neutral-800">
        <div>
          <h3 className="font-serif text-lg font-bold text-teal-950 dark:text-white flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-[#D7400B]" />
            Upload to Google Drive
          </h3>
          <p className="text-xs text-ink-600 dark:text-neutral-400">
            Securely stored in your platform Google Drive folder (ID: <span className="font-mono">1F2xh...OX</span>)
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="mt-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleUploadSubmit} className="mt-4 space-y-4">
        {/* Drop Zone */}
        {!file ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? "border-[#D7400B] bg-orange-50/50 dark:bg-orange-950/20"
                : "border-sand-400 dark:border-neutral-700 hover:border-[#D7400B] bg-sand-50/50 dark:bg-neutral-800/40"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.webp,.pdf,.mp4,.webm"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-sand-200 dark:bg-neutral-700 text-[#D7400B] flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-teal-950 dark:text-white">
              Drag & drop media file or <span className="text-[#D7400B] underline">browse</span>
            </p>
            <p className="text-[11px] text-ink-500 dark:text-neutral-400 mt-1">
              Supports JPG, PNG, WebP (up to 25MB), PDF (up to 35MB), MP4 & WebM (up to 250MB)
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-sand-100 dark:bg-neutral-800/60 border border-sand-300 dark:border-neutral-700 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[#D7400B]/10 text-[#D7400B] flex items-center justify-center shrink-0">
                {file.type.startsWith("video/") ? (
                  <VideoIcon className="w-5 h-5" />
                ) : file.type === "application/pdf" ? (
                  <FileText className="w-5 h-5" />
                ) : (
                  <ImageIcon className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-teal-950 dark:text-white truncate">
                  {file.name}
                </p>
                <p className="text-[11px] text-ink-500 dark:text-neutral-400">
                  {formatBytes(file.size)} &bull; {file.type || "file"}
                </p>
              </div>
            </div>
            {!isUploading && (
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setErrorMsg(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="p-1.5 rounded-lg text-ink-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Metadata Controls */}
        {file && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="sm:col-span-1">
              <label className="block text-[11px] font-bold text-ink-700 dark:text-neutral-300 uppercase tracking-wider mb-1">
                Display Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isUploading}
                placeholder="Media title"
                className="w-full px-3 py-2 text-xs rounded-lg border border-sand-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-teal-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#D7400B]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-ink-700 dark:text-neutral-300 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MediaCategory)}
                disabled={isUploading}
                className="w-full px-3 py-2 text-xs rounded-lg border border-sand-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-teal-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#D7400B]"
              >
                <option value="PHOTO">Photo</option>
                <option value="VIDEO">Video / Reel</option>
                <option value="DOCUMENT">Document</option>
                <option value="AVATAR">Profile Avatar</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-ink-700 dark:text-neutral-300 uppercase tracking-wider mb-1">
                Visibility
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as MediaVisibility)}
                disabled={isUploading}
                className="w-full px-3 py-2 text-xs rounded-lg border border-sand-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-teal-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#D7400B]"
              >
                <option value="PRIVATE">Private (Only you & staff)</option>
                <option value="PUBLIC">Public (Visible in directory)</option>
              </select>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {isUploading && (
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-teal-950 dark:text-white">
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D7400B]" />
                Uploading to Google Drive...
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-sand-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#D7400B] h-full transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {file && (
          <div className="flex items-center justify-end gap-2 pt-2">
            {isUploading ? (
              <button
                type="button"
                onClick={handleCancelUpload}
                className="px-4 py-2 rounded-full border border-sand-400 dark:border-neutral-700 hover:bg-sand-100 dark:hover:bg-neutral-800 text-ink-700 dark:text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel Upload
              </button>
            ) : (
              <button
                type="submit"
                disabled={!file || isUploading}
                className="px-6 py-2.5 rounded-full bg-[#D7400B] hover:bg-[#bd3607] text-white text-xs font-semibold uppercase tracking-wider shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                Start Upload
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};
