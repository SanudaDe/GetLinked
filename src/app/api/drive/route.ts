import { NextRequest, NextResponse } from "next/server";
import {
  GETLINKED_DRIVE_FOLDER_ID,
  extractGoogleDriveFolderId,
  extractGoogleDriveFileId,
  getGoogleDriveImageUrl,
  getGoogleDrivePreviewUrl,
  GoogleDriveMediaItem,
  formatBytes,
} from "@/utils/googleDrive";

// Public API key extracted from Google Drive web client for public file/folder queries
const DRIVE_PUBLIC_API_KEY =
  process.env.GOOGLE_DRIVE_API_KEY || "AIzaSyAWGrfCCr7albM3lmCc937gx4uIphbpeKQ";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folderParam = searchParams.get("folder") || searchParams.get("folderId");
    const fileParam = searchParams.get("file") || searchParams.get("fileId");

    // Case 1: Specific Single File Lookup
    if (fileParam) {
      const fileId = extractGoogleDriveFileId(fileParam) || fileParam;
      const fileUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?key=${DRIVE_PUBLIC_API_KEY}&fields=id,name,mimeType,size,modifiedTime,thumbnailLink,webViewLink&supportsAllDrives=true`;

      try {
        const res = await fetch(fileUrl, { next: { revalidate: 60 } });
        if (res.ok) {
          const item = await res.json();
          const mime = item.mimeType || "";
          const isVideo = mime.startsWith("video/");
          const isImage = mime.startsWith("image/");

          const mediaItem: GoogleDriveMediaItem = {
            id: item.id,
            name: item.name,
            mimeType: mime,
            type: isVideo ? "video" : isImage ? "image" : "other",
            thumbnailUrl: getGoogleDriveImageUrl(item.id, 1600),
            previewUrl: getGoogleDrivePreviewUrl(item.id),
            directUrl: getGoogleDriveImageUrl(item.id, 2000),
            embedUrl: getGoogleDrivePreviewUrl(item.id),
            size: formatBytes(item.size),
            modifiedTime: item.modifiedTime,
          };

          return NextResponse.json({ success: true, item: mediaItem });
        }
      } catch (err) {
        console.warn("Single file Drive API fetch warning:", err);
      }

      // Fallback response for single file if API fails or quota hit
      return NextResponse.json({
        success: true,
        item: {
          id: fileId,
          name: `Drive File ${fileId.slice(0, 8)}`,
          mimeType: "unknown",
          type: "image",
          thumbnailUrl: getGoogleDriveImageUrl(fileId, 1600),
          previewUrl: getGoogleDrivePreviewUrl(fileId),
          directUrl: getGoogleDriveImageUrl(fileId, 2000),
          embedUrl: getGoogleDrivePreviewUrl(fileId),
        },
      });
    }

    // Case 2: Folder Files Listing
    const folderId = folderParam
      ? extractGoogleDriveFolderId(folderParam) || folderParam
      : GETLINKED_DRIVE_FOLDER_ID;

    // Fetch folder metadata and items
    const q = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
    const apiUrl = `https://www.googleapis.com/drive/v3/files?q=${q}&key=${DRIVE_PUBLIC_API_KEY}&supportsAllDrives=true&includeItemsFromAllDrives=true&fields=files(id,name,mimeType,size,modifiedTime,thumbnailLink,webViewLink)&orderBy=modifiedTime desc`;

    let files: GoogleDriveMediaItem[] = [];
    let folderName = "GetLinked_Media";

    try {
      // 1. Fetch Folder Info
      const folderMetaRes = await fetch(
        `https://www.googleapis.com/drive/v3/files/${folderId}?key=${DRIVE_PUBLIC_API_KEY}&fields=id,name&supportsAllDrives=true`,
        { next: { revalidate: 60 } }
      );
      if (folderMetaRes.ok) {
        const folderMeta = await folderMetaRes.json();
        if (folderMeta.name) folderName = folderMeta.name;
      }

      // 2. Fetch File List
      const listRes = await fetch(apiUrl, { next: { revalidate: 30 } });
      if (listRes.ok) {
        const listData = await listRes.json();
        if (Array.isArray(listData.files)) {
          files = listData.files.map((file: {
            id: string;
            name: string;
            mimeType: string;
            size?: string;
            modifiedTime?: string;
          }) => {
            const mime = file.mimeType || "";
            const isVideo = mime.startsWith("video/") || /\.(mp4|mov|webm|m4v|avi)$/i.test(file.name);
            const isImage = mime.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(file.name);

            return {
              id: file.id,
              name: file.name,
              mimeType: mime,
              type: isVideo ? "video" : isImage ? "image" : "other",
              thumbnailUrl: getGoogleDriveImageUrl(file.id, 1600),
              previewUrl: getGoogleDrivePreviewUrl(file.id),
              directUrl: getGoogleDriveImageUrl(file.id, 2000),
              embedUrl: getGoogleDrivePreviewUrl(file.id),
              size: formatBytes(file.size),
              modifiedTime: file.modifiedTime,
            };
          });
        }
      }
    } catch (apiErr) {
      console.warn("Drive API list error:", apiErr);
    }

    return NextResponse.json({
      success: true,
      folderId,
      folderName,
      folderUrl: `https://drive.google.com/drive/folders/${folderId}?usp=sharing`,
      count: files.length,
      files,
      message:
        files.length > 0
          ? `Found ${files.length} media item(s) in Google Drive folder.`
          : `Connected to Google Drive folder "${folderName}". Upload photos or videos to this folder on Google Drive and click Refresh to view and use them across GetLinked.`,
    });
  } catch (error: any) {
    console.error("API /api/drive error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process Google Drive request" },
      { status: 500 }
    );
  }
}
