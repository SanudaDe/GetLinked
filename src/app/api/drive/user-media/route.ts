import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { deleteDriveFile } from "@/lib/googleDriveAuth";

/**
 * GET /api/drive/user-media
 * Returns media belonging to the authenticated user.
 * Optional query params: ?category=PHOTO&search=villa&limit=50
 */
export async function GET(request: NextRequest) {
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
        { success: false, error: "Unauthorized: Invalid session" },
        { status: 401 }
      );
    }

    const userId = authData.user.id;
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    let query = supabaseAdmin
      .from("user_media")
      .select("*")
      .eq("owner_user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (category && category !== "ALL") {
      query = query.eq("category", category.toUpperCase());
    }

    if (search && search.trim()) {
      query = query.or(`title.ilike.%${search.trim()}%,original_filename.ilike.%${search.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Fetch user media DB error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Compute user storage statistics
    const totalBytes = (data || []).reduce(
      (acc, item) => acc + (Number(item.file_size) || 0),
      0
    );

    return NextResponse.json({
      success: true,
      media: data || [],
      count: data?.length || 0,
      totalBytes,
      quotaBytes: 500 * 1024 * 1024, // 500 MB quota
    });
  } catch (err: any) {
    console.error("GET user-media error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to retrieve media records" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/drive/user-media
 * Updates title or visibility of a media record owned by the authenticated user.
 */
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Missing token" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !authData?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid session" },
        { status: 401 }
      );
    }

    const userId = authData.user.id;
    const body = await request.json();
    const { id, title, visibility } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing media ID" },
        { status: 400 }
      );
    }

    // Verify ownership
    const { data: existing, error: findError } = await supabaseAdmin
      .from("user_media")
      .select("owner_user_id")
      .eq("id", id)
      .single();

    if (findError || !existing) {
      return NextResponse.json(
        { success: false, error: "Media item not found" },
        { status: 404 }
      );
    }

    if (existing.owner_user_id !== userId) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You do not own this media item" },
        { status: 403 }
      );
    }

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (typeof title === "string" && title.trim()) {
      updatePayload.title = title.trim().slice(0, 150);
    }
    if (visibility === "PUBLIC" || visibility === "PRIVATE") {
      updatePayload.visibility = visibility;
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("user_media")
      .update(updatePayload)
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) {
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      media: updated,
    });
  } catch (err: any) {
    console.error("PATCH user-media error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update media item" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/drive/user-media?id=UUID
 * Deletes the specified media item from both Google Drive storage and Supabase database.
 * Strictly verifies ownership.
 */
export async function DELETE(request: NextRequest) {
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
        { success: false, error: "Unauthorized: Invalid session" },
        { status: 401 }
      );
    }

    const userId = authData.user.id;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing media ID parameter" },
        { status: 400 }
      );
    }

    // 1. Fetch record from database to verify ownership and obtain drive_file_id
    const { data: record, error: findError } = await supabaseAdmin
      .from("user_media")
      .select("*")
      .eq("id", id)
      .single();

    if (findError || !record) {
      return NextResponse.json(
        { success: false, error: "Media item not found in database" },
        { status: 404 }
      );
    }

    // 2. Strict ownership check
    if (record.owner_user_id !== userId) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You do not have permission to delete this media" },
        { status: 403 }
      );
    }

    // 3. Delete from Google Drive
    if (record.drive_file_id) {
      try {
        await deleteDriveFile(record.drive_file_id);
      } catch (driveErr) {
        console.warn("Failed to delete Google Drive object (may already be trashed):", driveErr);
      }
    }

    // 4. Delete record from Supabase
    const { error: dbDeleteError } = await supabaseAdmin
      .from("user_media")
      .delete()
      .eq("id", id);

    if (dbDeleteError) {
      return NextResponse.json(
        { success: false, error: "Failed to delete record: " + dbDeleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Media item permanently deleted from Google Drive and database.",
    });
  } catch (err: any) {
    console.error("DELETE user-media error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete media item" },
      { status: 500 }
    );
  }
}
