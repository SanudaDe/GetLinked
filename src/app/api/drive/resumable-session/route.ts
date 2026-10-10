import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  getDriveConfig,
  createResumableUploadSession,
} from "@/lib/googleDriveAuth";
import { MediaCategory, MediaVisibility } from "@/types";

const USER_STORAGE_QUOTA_BYTES = 500 * 1024 * 1024; // 500 MB quota

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
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user from Supabase Bearer token
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
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

    const userId = authData.user.id;

    // 2. Parse lightweight JSON metadata
    const body = await request.json();
    const { filename, mimeType, fileSize, category, visibility } = body;

    if (!filename || !mimeType || !fileSize) {
      return NextResponse.json(
        { success: false, error: "Missing required file metadata (filename, mimeType, fileSize)" },
        { status: 400 }
      );
    }

    // 3. File type & size validation
    const typeRule = ALLOWED_MIME_TYPES[mimeType];
    if (!typeRule) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file type: "${mimeType}". Allowed formats: JPEG, PNG, WebP, PDF, MP4, WebM.`,
        },
        { status: 400 }
      );
    }

    if (fileSize > typeRule.maxSize) {
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
      if (currentUsage + fileSize > USER_STORAGE_QUOTA_BYTES) {
        return NextResponse.json(
          {
            success: false,
            error: `Storage quota exceeded (500MB allowance). Please delete existing files before uploading new content.`,
          },
          { status: 403 }
        );
      }
    }

    // 5. Generate secure storage filename
    const originalName = sanitizeFilename(filename);
    const storageFilename = `usr_${userId.slice(0, 8)}_${Date.now()}_${originalName}`;

    // 6. Get client origin for CORS header matching
    const clientOrigin = request.headers.get("origin") || request.headers.get("referer") || undefined;

    // 7. Initialize Google Drive resumable upload session
    const { folderId } = getDriveConfig();
    const { sessionUrl } = await createResumableUploadSession({
      filename: storageFilename,
      mimeType,
      fileSize,
      parentFolderId: folderId,
      clientOrigin,
    });

    return NextResponse.json({
      success: true,
      sessionUrl,
      storageFilename,
      folderId,
    });
  } catch (err: any) {
    console.error("Resumable session init error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to initialize Google Drive upload session.",
      },
      { status: 500 }
    );
  }
}
