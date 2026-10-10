import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  getDriveConfig,
  uploadBufferToDrive,
  deleteDriveFile,
} from "@/lib/googleDriveAuth";
import { MediaCategory, MediaVisibility } from "@/types";

// Maximum execution duration for upload routes (Next.js route config)
export const maxDuration = 60;

// Maximum allowed per-user storage quota (500 MB default)
const USER_STORAGE_QUOTA_BYTES = 500 * 1024 * 1024;

const ALLOWED_MIME_TYPES: Record<
  string,
  { category: MediaCategory; maxSize: number }
> = {
  "image/jpeg": { category: "PHOTO", maxSize: 25 * 1024 * 1024 },
  "image/png": { category: "PHOTO", maxSize: 25 * 1024 * 1024 },
  "image/webp": { category: "PHOTO", maxSize: 25 * 1024 * 1024 },
  "application/pdf": { category: "DOCUMENT", maxSize: 35 * 1024 * 1024 },
  "video/mp4": { category: "VIDEO", maxSize: 250 * 1024 * 1024 },
  "video/webm": { category: "VIDEO", maxSize: 250 * 1024 * 1024 },
};

function sanitizeFilename(name: string): string {
  // Strip path traversal and dangerous characters
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user from Supabase Bearer token
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Missing authentication token" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !authData?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid or expired session" },
        { status: 401 }
      );
    }

    const user = authData.user;
    const userId = user.id;

    // 2. Parse form-data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) || (file ? file.name : "Untitled Media");
    const visibility = ((formData.get("visibility") as string) || "PRIVATE").toUpperCase() as MediaVisibility;
    const requestedCategory = (formData.get("category") as string)?.toUpperCase() as MediaCategory;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Bad Request: No file provided" },
        { status: 400 }
      );
    }

    // 3. File validation: MIME type & size
    const mimeType = file.type || "application/octet-stream";
    const typeRule = ALLOWED_MIME_TYPES[mimeType];

    if (!typeRule) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file type: "${mimeType}". Allowed: JPEG, PNG, WebP, PDF, MP4, WebM.`,
        },
        { status: 400 }
      );
    }

    if (file.size > typeRule.maxSize) {
      const maxMb = Math.round(typeRule.maxSize / (1024 * 1024));
      return NextResponse.json(
        {
          success: false,
          error: `File exceeds maximum allowed size of ${maxMb}MB for ${typeRule.category.toLowerCase()} files.`,
        },
        { status: 400 }
      );
    }

    // 4. Per-user quota check
    const { data: usageData, error: usageError } = await supabaseAdmin
      .from("user_media")
      .select("file_size")
      .eq("owner_user_id", userId)
      .eq("upload_status", "COMPLETED");

    if (!usageError && usageData) {
      const currentUsage = usageData.reduce((acc, row) => acc + (Number(row.file_size) || 0), 0);
      if (currentUsage + file.size > USER_STORAGE_QUOTA_BYTES) {
        return NextResponse.json(
          {
            success: false,
            error: `Storage quota exceeded (500MB allowance). Please delete existing files before uploading new content.`,
          },
          { status: 403 }
        );
      }
    }

    // 5. Sanitize and prepare file storage name
    const originalName = sanitizeFilename(file.name);
    const storageFilename = `usr_${userId.slice(0, 8)}_${Date.now()}_${originalName}`;
    const category = requestedCategory && ["PHOTO", "VIDEO", "DOCUMENT", "AVATAR"].includes(requestedCategory)
      ? requestedCategory
      : typeRule.category;

    // 6. Convert file into buffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 7. Stream upload to designated Google Drive folder
    const { folderId } = getDriveConfig();
    const driveResult = await uploadBufferToDrive({
      buffer,
      filename: storageFilename,
      mimeType,
      parentFolderId: folderId,
      description: `Uploaded by ${user.email || userId} via GetLinked Media Storage`,
    });

    if (!driveResult?.id) {
      throw new Error("Google Drive upload completed but no file ID was returned.");
    }

    // 8. Commit metadata record to Supabase user_media table
    const { data: mediaRecord, error: dbError } = await supabaseAdmin
      .from("user_media")
      .insert({
        owner_user_id: userId,
        title: title.slice(0, 150),
        original_filename: originalName,
        storage_filename: storageFilename,
        category,
        mime_type: mimeType,
        file_size: file.size,
        drive_file_id: driveResult.id,
        drive_parent_folder_id: folderId,
        visibility: visibility === "PUBLIC" ? "PUBLIC" : "PRIVATE",
        upload_status: "COMPLETED",
        metadata: {
          uploader_email: user.email,
          uploaded_from: "web_client",
        },
      })
      .select("*")
      .single();

    if (dbError) {
      console.error("Database insert error after Drive upload:", dbError);
      // Attempt safe rollback of uploaded Drive file to avoid orphaned storage
      try {
        await deleteDriveFile(driveResult.id);
      } catch (cleanupErr) {
        console.warn("Drive cleanup after DB error warning:", cleanupErr);
      }

      return NextResponse.json(
        { success: false, error: "Failed to persist media metadata: " + dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      media: mediaRecord,
      message: "File successfully uploaded to Google Drive storage.",
    });
  } catch (err: any) {
    console.error("Upload handler error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "An unexpected error occurred during upload.",
      },
      { status: 500 }
    );
  }
}
