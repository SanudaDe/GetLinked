import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { deleteDriveFile } from "@/lib/googleDriveAuth";

/**
 * Validates admin authorization for server-side operations
 */
function verifyAdminAuthorization(request: NextRequest): boolean {
  const adminSecret = process.env.ADMIN_DEFAULT_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "getlinked@admin26";
  const authHeader = request.headers.get("x-admin-key") || request.headers.get("authorization");

  if (!authHeader) return false;

  const token = authHeader.replace(/^Bearer\s+/i, "");
  return token === adminSecret;
}

/**
 * GET /api/drive/admin
 * Returns all uploaded media items across all users with storage aggregations
 */
export async function GET(request: NextRequest) {
  try {
    if (!verifyAdminAuthorization(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Administrator privileges required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "200", 10);

    let query = supabaseAdmin
      .from("user_media")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (category && category !== "ALL") {
      query = query.eq("category", category.toUpperCase());
    }

    if (search && search.trim()) {
      query = query.or(`title.ilike.%${search.trim()}%,original_filename.ilike.%${search.trim()}%`);
    }

    const { data: mediaItems, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Storage calculations
    const items = mediaItems || [];
    const totalStorageBytes = items.reduce((acc, item) => acc + (Number(item.file_size) || 0), 0);
    const photosCount = items.filter((i) => i.category === "PHOTO").length;
    const videosCount = items.filter((i) => i.category === "VIDEO").length;
    const docsCount = items.filter((i) => i.category === "DOCUMENT").length;

    return NextResponse.json({
      success: true,
      items,
      count: items.length,
      stats: {
        totalStorageBytes,
        photosCount,
        videosCount,
        docsCount,
      },
    });
  } catch (err: any) {
    console.error("Admin media GET error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load admin media records" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/drive/admin?id=UUID
 * Allows administrator to remove inappropriate or infringing media files
 */
export async function DELETE(request: NextRequest) {
  try {
    if (!verifyAdminAuthorization(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Administrator privileges required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing media ID" }, { status: 400 });
    }

    const { data: record, error: findError } = await supabaseAdmin
      .from("user_media")
      .select("*")
      .eq("id", id)
      .single();

    if (findError || !record) {
      return NextResponse.json({ success: false, error: "Media item not found" }, { status: 404 });
    }

    // Delete from Google Drive
    if (record.drive_file_id) {
      try {
        await deleteDriveFile(record.drive_file_id);
      } catch (err) {
        console.warn("Admin drive deletion warning:", err);
      }
    }

    // Delete record from Supabase
    const { error: dbError } = await supabaseAdmin.from("user_media").delete().eq("id", id);
    if (dbError) {
      return NextResponse.json({ success: false, error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Media item successfully removed by administrator.",
    });
  } catch (err: any) {
    console.error("Admin media DELETE error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete media item" },
      { status: 500 }
    );
  }
}
