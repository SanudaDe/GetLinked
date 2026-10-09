/**
 * Google Drive Media Utilities for GetLinked
 * Provides parsing, high-resolution direct web image conversion, and video embed streaming
 * for public Google Drive shared files and folders.
 */

export const GETLINKED_DRIVE_FOLDER_ID = "1F2xh_ii87HDSCW3PHFHLXY7DpN_qfkOX";
export const GETLINKED_DRIVE_FOLDER_URL =
  "https://drive.google.com/drive/folders/1F2xh_ii87HDSCW3PHFHLXY7DpN_qfkOX?usp=sharing";

export interface GoogleDriveResource {
  id: string;
  type: "file" | "folder";
}

export interface GoogleDriveMediaItem {
  id: string;
  name: string;
  mimeType: string;
  type: "image" | "video" | "document" | "other";
  thumbnailUrl: string;
  previewUrl: string;
  directUrl: string;
  embedUrl: string;
  size?: string;
  modifiedTime?: string;
}

/**
 * Checks whether a URL is a Google Drive or Google User Content link.
 */
export function isGoogleDriveUrl(url?: string): boolean {
  if (!url) return false;
  return (
    url.includes("drive.google.com") ||
    url.includes("docs.google.com") ||
    url.includes("googleusercontent.com/d/")
  );
}

/**
 * Extracts the file or folder ID and resource type from a Google Drive URL.
 */
export function extractGoogleDriveResource(url: string): GoogleDriveResource | null {
  if (!url) return null;
  const trimmed = url.trim();

  // 1. Google Drive Folder URLs:
  // e.g. https://drive.google.com/drive/folders/1F2xh_ii87HDSCW3PHFHLXY7DpN_qfkOX
  // or https://drive.google.com/drive/u/0/folders/1F2xh_ii87HDSCW3PHFHLXY7DpN_qfkOX
  const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]{20,})/);
  if (folderMatch) {
    return { id: folderMatch[1], type: "folder" };
  }

  // 2. Google Drive File URLs:
  // e.g. https://drive.google.com/file/d/1A2B3C.../view
  // or https://drive.google.com/file/d/1A2B3C.../preview
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]{20,})/);
  if (fileMatch) {
    return { id: fileMatch[1], type: "file" };
  }

  // 3. Query param id URLs:
  // e.g. https://drive.google.com/open?id=1A2B3C...
  // or https://drive.google.com/uc?id=1A2B3C...
  // or https://drive.google.com/thumbnail?id=1A2B3C...
  const queryMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{20,})/);
  if (queryMatch) {
    return { id: queryMatch[1], type: "file" };
  }

  // 4. Googleusercontent direct paths:
  // e.g. https://lh3.googleusercontent.com/d/1A2B3C...
  const lh3Match = trimmed.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]{20,})/);
  if (lh3Match) {
    return { id: lh3Match[1], type: "file" };
  }

  // 5. Bare ID fallback (25 to 45 alphanumeric, dash, or underscore chars)
  if (/^[a-zA-Z0-9_-]{25,45}$/.test(trimmed)) {
    return { id: trimmed, type: "file" };
  }

  return null;
}

/**
 * Returns the Google Drive File ID if the input is a valid Drive file link.
 */
export function extractGoogleDriveFileId(url: string): string | null {
  const resource = extractGoogleDriveResource(url);
  if (resource && resource.type === "file") {
    return resource.id;
  }
  return null;
}

/**
 * Returns the Google Drive Folder ID if the input is a valid Drive folder link.
 */
export function extractGoogleDriveFolderId(url: string): string | null {
  const resource = extractGoogleDriveResource(url);
  if (resource && resource.type === "folder") {
    return resource.id;
  }
  return null;
}

/**
 * Converts a Google Drive file link or ID into a high-resolution, web-ready image URL.
 * Defaults to 1600px width for crystal-clear retina rendering.
 */
export function getGoogleDriveImageUrl(fileIdOrUrl: string, width: number = 1600): string {
  if (!fileIdOrUrl) return "";
  const fileId = extractGoogleDriveFileId(fileIdOrUrl) || fileIdOrUrl;
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`;
}

/**
 * Returns the Google Drive responsive preview / iframe embed URL for videos and documents.
 */
export function getGoogleDrivePreviewUrl(fileIdOrUrl: string): string {
  if (!fileIdOrUrl) return "";
  const fileId = extractGoogleDriveFileId(fileIdOrUrl) || fileIdOrUrl;
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/**
 * Checks whether a URL points to a video (Drive video or MP4/WebM/MOV).
 */
export function isVideoUrl(url?: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.endsWith(".mp4") ||
    lower.endsWith(".webm") ||
    lower.endsWith(".mov") ||
    lower.endsWith(".m4v") ||
    lower.includes("video") ||
    (isGoogleDriveUrl(url) && (lower.includes("preview") || lower.includes("usp=sharing")))
  );
}

/**
 * Formats bytes into human-readable size.
 */
export function formatBytes(bytes?: number | string): string {
  if (!bytes) return "";
  const n = typeof bytes === "string" ? parseInt(bytes, 10) : bytes;
  if (isNaN(n) || n === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(n) / Math.log(k));
  return `${parseFloat((n / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
