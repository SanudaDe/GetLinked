import { NextRequest, NextResponse } from "next/server";
import { generateDriveAuthUrl, getDriveConfig } from "@/lib/googleDriveAuth";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  try {
    const { clientId } = getDriveConfig();
    if (!clientId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "GOOGLE_DRIVE_CLIENT_ID is not configured in server environment. Please set it in .env.local first.",
        },
        { status: 400 }
      );
    }

    const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    const redirectUri = `${protocol}://${host}/api/drive/auth/callback`;

    // Generate secure CSRF state
    const state = crypto.randomBytes(24).toString("hex");

    const authUrl = generateDriveAuthUrl(redirectUri, state);

    const response = NextResponse.redirect(authUrl);

    // Set secure HTTP-only cookie with state for verification
    response.cookies.set("drive_oauth_state", state, {
      httpOnly: true,
      secure: protocol === "https",
      sameSite: "lax",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Error initiating Drive OAuth:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to initiate Drive authorization" },
      { status: 500 }
    );
  }
}
