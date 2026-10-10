import { NextRequest, NextResponse } from "next/server";
import { exchangeAuthCodeForTokens, getDriveConfig } from "@/lib/googleDriveAuth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error");

  const storedState = request.cookies.get("drive_oauth_state")?.value;

  if (errorParam) {
    return new NextResponse(
      `<html><body style="font-family:sans-serif;padding:40px;background:#fff1f2;color:#9f1239;">
        <h2>Google Drive Authorization Denied</h2>
        <p>Google returned error: <strong>${errorParam}</strong></p>
        <p><a href="/admin/media">Return to Admin Media</a></p>
      </body></html>`,
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }

  if (!code) {
    return new NextResponse(
      `<html><body style="font-family:sans-serif;padding:40px;background:#fff1f2;color:#9f1239;">
        <h2>Authorization Failed</h2>
        <p>Missing authorization code from Google.</p>
        <p><a href="/admin/media">Return to Admin Media</a></p>
      </body></html>`,
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }

  // Validate state
  if (!storedState || storedState !== state) {
    return new NextResponse(
      `<html><body style="font-family:sans-serif;padding:40px;background:#fff1f2;color:#9f1239;">
        <h2>Invalid State / CSRF Mismatch</h2>
        <p>The state parameter did not match the session. Please re-initiate the authorization from the admin panel.</p>
        <p><a href="/admin/media">Return to Admin Media</a></p>
      </body></html>`,
      { status: 403, headers: { "Content-Type": "text/html" } }
    );
  }

  try {
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    const redirectUri = `${protocol}://${host}/api/drive/auth/callback`;

    const tokens = await exchangeAuthCodeForTokens(code, redirectUri);
    const refreshToken = tokens.refresh_token;

    let autoUpdatedEnv = false;
    if (refreshToken) {
      try {
        const fs = await import("fs");
        const path = await import("path");
        const envPath = path.join(process.cwd(), ".env.local");
        if (fs.existsSync(envPath)) {
          let envContent = fs.readFileSync(envPath, "utf-8");
          if (envContent.includes("GOOGLE_DRIVE_REFRESH_TOKEN")) {
            envContent = envContent.replace(
              /GOOGLE_DRIVE_REFRESH_TOKEN=.*/,
              `GOOGLE_DRIVE_REFRESH_TOKEN=${refreshToken}`
            );
          } else {
            envContent += `\nGOOGLE_DRIVE_REFRESH_TOKEN=${refreshToken}\n`;
          }
          fs.writeFileSync(envPath, envContent, "utf-8");
          autoUpdatedEnv = true;
          console.log("Successfully auto-updated .env.local with new GOOGLE_DRIVE_REFRESH_TOKEN!");
        }
      } catch (fsErr) {
        console.warn("Could not auto-write to .env.local:", fsErr);
      }
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Google Drive Backend Authorization Successful</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #fdfbf7; color: #1a3739; padding: 40px; max-width: 680px; margin: 0 auto; line-height: 1.6; }
          .card { background: white; border: 1px solid #e7ded3; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; background: #e6f4ea; color: #137333; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 16px; }
          h1 { margin: 0 0 12px; font-size: 24px; color: #1a3739; }
          p { margin: 0 0 16px; font-size: 14px; color: #4a5568; }
          .code-box { background: #1a202c; color: #68d391; padding: 16px; border-radius: 10px; font-family: monospace; font-size: 13px; word-break: break-all; margin: 16px 0; }
          .btn { display: inline-block; padding: 10px 20px; background: #d7400b; color: white; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 13px; text-transform: uppercase; margin-top: 16px; }
          .notice { font-size: 12px; color: #718096; border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">Connected</div>
          <h1>Google Drive Storage Authorized!</h1>
          <p>The GetLinked backend has successfully established OAuth communication with your designated Google Drive folder.</p>
          
          ${
            autoUpdatedEnv
              ? `<div style="background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46;padding:12px;border-radius:10px;font-size:13px;font-weight:600;margin:16px 0;">
                  ✓ Your <code>.env.local</code> was automatically updated with the new refresh token!
                </div>`
              : ""
          }

          ${
            refreshToken
              ? `
              <p>Your active refresh token:</p>
              <div class="code-box">GOOGLE_DRIVE_REFRESH_TOKEN=${refreshToken}</div>
              `
              : `
              <p>Access token granted! (Your existing refresh token in environment remains active).</p>
              `
          }

          <p>Your destination folder: <code>${getDriveConfig().folderId}</code></p>
          <a class="btn" href="/admin/media">Go to Admin Media Cloud &rarr;</a>

          <div class="notice">
            Note: For security, refresh tokens are never exposed to client-side code and are kept securely in backend environment variables.
          </div>
        </div>
      </body>
      </html>
    `;

    const response = new NextResponse(html, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });

    // Clear state cookie
    response.cookies.delete("drive_oauth_state");

    return response;
  } catch (err: any) {
    console.error("Token exchange failed:", err);
    return new NextResponse(
      `<html><body style="font-family:sans-serif;padding:40px;background:#fff1f2;color:#9f1239;">
        <h2>Token Exchange Error</h2>
        <p>${err.message || "Failed to exchange authorization code for tokens."}</p>
        <p><a href="/admin/media">Return to Admin Media</a></p>
      </body></html>`,
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
}
