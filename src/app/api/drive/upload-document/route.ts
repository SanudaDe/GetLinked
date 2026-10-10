import { NextRequest, NextResponse } from "next/server";
import {
  getDriveConfig,
  uploadBufferToDrive,
  createResumableUploadSession,
  getFileMetadata,
  deleteDriveFile,
} from "@/lib/googleDriveAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const maxDuration = 60;

function sanitizeName(str: string): string {
  return str.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40) || "user";
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    // OPTION A: JSON request to initiate Resumable Upload (for large files > 4MB)
    if (contentType.includes("application/json")) {
      const body = await request.json();
      const { filename, mimeType, fileSize, docType, applicantName, confirmFileId } = body;

      // Sub-case: Confirm completed resumable upload
      if (confirmFileId) {
        const meta = await getFileMetadata(confirmFileId);
        return NextResponse.json({
          success: true,
          driveFileId: confirmFileId,
          fileName: meta.name || filename,
          fileSize: meta.size || fileSize,
          mimeType: meta.mimeType || mimeType,
          previewUrl: `https://drive.google.com/file/d/${confirmFileId}/preview`,
          thumbnailUrl: `https://drive.google.com/thumbnail?id=${confirmFileId}&sz=w1600`,
          webViewLink: `https://drive.google.com/file/d/${confirmFileId}/view`,
        });
      }

      // Sub-case: Initiate Resumable Session for large files
      if (!filename || !mimeType || !fileSize) {
        return NextResponse.json(
          { success: false, error: "Missing required metadata (filename, mimeType, fileSize)" },
          { status: 400 }
        );
      }

      if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
        return NextResponse.json(
          { success: false, error: `Invalid format: ${mimeType}. Please upload JPG, PNG, WebP, or PDF.` },
          { status: 400 }
        );
      }

      const cleanApplicant = sanitizeName(applicantName || "applicant");
      const ext = filename.split(".").pop()?.toLowerCase() || "dat";
      const prefix = docType === "AVATAR" ? "AVATAR" : `ID_${docType || "DOC"}`;
      const storageFilename = `${prefix}_${cleanApplicant}_${Date.now()}.${ext}`;

      const { folderId } = getDriveConfig();
      const clientOrigin = request.headers.get("origin") || request.headers.get("referer") || undefined;

      const { sessionUrl } = await createResumableUploadSession({
        filename: storageFilename,
        mimeType,
        fileSize: Number(fileSize),
        parentFolderId: folderId,
        clientOrigin,
      });

      return NextResponse.json({
        success: true,
        sessionUrl,
        storageFilename,
        folderId,
      });
    }

    // OPTION B: Direct multipart FormData upload (for normal files <= 4MB)
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const docType = (formData.get("docType") as string) || "DOCUMENT";
    const applicantName = (formData.get("applicantName") as string) || "applicant";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided in upload request." },
        { status: 400 }
      );
    }

    const mimeType = file.type || "application/octet-stream";
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file format (${mimeType}). Please upload JPG, PNG, WebP, or PDF.`,
        },
        { status: 400 }
      );
    }

    // Avatar max 10MB, documents max 25MB
    const maxAllowedSize = docType === "AVATAR" ? 10 * 1024 * 1024 : 25 * 1024 * 1024;
    if (file.size > maxAllowedSize) {
      return NextResponse.json(
        {
          success: false,
          error: `File is too large. Max allowed size is ${Math.round(maxAllowedSize / (1024 * 1024))}MB.`,
        },
        { status: 400 }
      );
    }

    // Generate descriptive filename for Google Drive folder
    const cleanApplicant = sanitizeName(applicantName);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const prefix = docType === "AVATAR" ? "AVATAR" : `ID_${docType}`;
    const storageFilename = `${prefix}_${cleanApplicant}_${Date.now()}.${ext}`;

    // Read bytes & stream to Google Drive
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const { folderId } = getDriveConfig();

    const driveResult = await uploadBufferToDrive({
      buffer,
      filename: storageFilename,
      mimeType,
      parentFolderId: folderId,
      description: `${prefix} uploaded for ${applicantName} via GetLinked`,
    });

    if (!driveResult?.id) {
      throw new Error("Failed to receive Google Drive file ID.");
    }

    const formattedSize =
      file.size >= 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    // If user is authenticated, also track in user_media table
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.substring(7);
        const { data: authData } = await supabaseAdmin.auth.getUser(token);
        if (authData?.user) {
          await supabaseAdmin.from("user_media").insert({
            owner_user_id: authData.user.id,
            title: `${docType === "AVATAR" ? "Profile Photo" : "Identity Document"} - ${applicantName}`,
            original_filename: file.name,
            storage_filename: storageFilename,
            category: docType === "AVATAR" ? "AVATAR" : "DOCUMENT",
            mime_type: mimeType,
            file_size: file.size,
            drive_file_id: driveResult.id,
            drive_parent_folder_id: folderId,
            visibility: docType === "AVATAR" ? "PUBLIC" : "PRIVATE",
            upload_status: "COMPLETED",
          });
        }
      } catch (trackErr) {
        console.warn("user_media tracking notice:", trackErr);
      }
    }

    return NextResponse.json({
      success: true,
      driveFileId: driveResult.id,
      fileName: storageFilename,
      originalName: file.name,
      fileSize: formattedSize,
      mimeType,
      previewUrl: `https://drive.google.com/file/d/${driveResult.id}/preview`,
      thumbnailUrl: `https://drive.google.com/thumbnail?id=${driveResult.id}&sz=w1600`,
      webViewLink: driveResult.webViewLink || `https://drive.google.com/file/d/${driveResult.id}/view`,
    });
  } catch (err: any) {
    console.error("Upload document route error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to upload document to Google Drive.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get("fileId") || searchParams.get("id");

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: "fileId is required to delete" },
        { status: 400 }
      );
    }

    await deleteDriveFile(fileId);

    // Also remove from user_media table if tracked in Supabase
    if (supabaseAdmin) {
      try {
        await supabaseAdmin.from("user_media").delete().eq("drive_file_id", fileId);
      } catch (e) {
        console.warn("user_media record delete notice:", e);
      }
    }

    return NextResponse.json({ success: true, message: "File deleted from Google Drive" });
  } catch (err: any) {
    console.error("Delete document from Drive error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete file from Google Drive" },
      { status: 500 }
    );
  }
}
