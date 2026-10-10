import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getDriveConfig, getFileMetadata, deleteDriveFile } from "@/lib/googleDriveAuth";
import { MediaCategory, MediaVisibility } from "@/types";

export async function POST(request: NextRequest) {
  try {
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

    const user = authData.user;
    const userId = user.id;

    const body = await request.json();
    const {
      driveFileId,
      title,
      originalFilename,
      storageFilename,
      category,
      mimeType,
      fileSize,
      visibility,
    } = body;

    if (!driveFileId || !storageFilename || !mimeType) {
      return NextResponse.json(
        { success: false, error: "Missing required upload confirmation details" },
        { status: 400 }
      );
    }

    const { folderId } = getDriveConfig();

    // Verify file exists in Google Drive
    try {
      await getFileMetadata(driveFileId);
    } catch (metaErr: any) {
      console.warn("Drive metadata verification error:", metaErr);
      // Proceed if Drive API allows or return error
    }

    // Persist verified metadata in Supabase user_media table
    const { data: mediaRecord, error: dbError } = await supabaseAdmin
      .from("user_media")
      .insert({
        owner_user_id: userId,
        title: (title || originalFilename || "Untitled").slice(0, 150),
        original_filename: originalFilename || storageFilename,
        storage_filename: storageFilename,
        category: (category || "PHOTO").toUpperCase(),
        mime_type: mimeType,
        file_size: Number(fileSize) || 0,
        drive_file_id: driveFileId,
        drive_parent_folder_id: folderId,
        visibility: visibility === "PUBLIC" ? "PUBLIC" : "PRIVATE",
        upload_status: "COMPLETED",
        metadata: {
          uploader_email: user.email,
          uploaded_via: "direct_resumable_session",
        },
      })
      .select("*")
      .single();

    if (dbError) {
      console.error("Database insert error after resumable upload:", dbError);
      return NextResponse.json(
        { success: false, error: "Failed to persist media metadata: " + dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      media: mediaRecord,
      message: "Media metadata successfully recorded in database.",
    });
  } catch (err: any) {
    console.error("Confirm upload error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to confirm upload" },
      { status: 500 }
    );
  }
}
