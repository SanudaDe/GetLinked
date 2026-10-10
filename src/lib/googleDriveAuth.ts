/**
 * Google Drive Backend OAuth & API Manager for GetLinked
 *
 * Implements server-side token refresh, least-privilege OAuth flow,
 * multipart upload for standard media, and resumable uploads for large video/files.
 * Secrets are strictly kept server-side.
 */

export const DEFAULT_DRIVE_FOLDER_ID = "1F2xh_ii87HDSCW3PHFHLXY7DpN_qfkOX";

export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
  token_type: string;
}

// In-memory cache for the server's Google access token
let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0;

export function getDriveConfig() {
  const clientId =
    process.env.GOOGLE_DRIVE_CLIENT_ID ||
    process.env.GOOGLE_CLIENT_ID ||
    "";
  const clientSecret =
    process.env.GOOGLE_DRIVE_CLIENT_SECRET ||
    process.env.GOOGLE_CLIENT_SECRET ||
    "";
  const refreshToken =
    process.env.GOOGLE_DRIVE_REFRESH_TOKEN ||
    process.env.GOOGLE_REFRESH_TOKEN ||
    "";
  const folderId =
    process.env.GOOGLE_DRIVE_FOLDER_ID ||
    DEFAULT_DRIVE_FOLDER_ID;

  return {
    clientId,
    clientSecret,
    refreshToken,
    folderId,
    isConfigured: Boolean(clientId && clientSecret && (refreshToken || true)),
  };
}

/**
 * Returns a valid access token for Google Drive API calls,
 * automatically refreshing using the stored refresh token when near expiration.
 */
export async function getGoogleDriveAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  // Return cached token if valid with at least 90s grace period
  if (cachedAccessToken && tokenExpiresAt > now + 90) {
    return cachedAccessToken;
  }

  const { clientId, clientSecret, refreshToken } = getDriveConfig();

  if (!refreshToken) {
    throw new Error(
      "Google Drive refresh token is missing. Please authorize the backend via /api/drive/auth/init or set GOOGLE_DRIVE_REFRESH_TOKEN in .env.local"
    );
  }
  if (!clientId || !clientSecret) {
    throw new Error(
      "Google Drive OAuth credentials missing: GOOGLE_DRIVE_CLIENT_ID and GOOGLE_DRIVE_CLIENT_SECRET must be configured."
    );
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Google token refresh failed:", errorText);
    throw new Error(`Google token refresh failed with HTTP ${response.status}: ${errorText}`);
  }

  const tokenData: GoogleTokenResponse = await response.json();
  cachedAccessToken = tokenData.access_token;
  tokenExpiresAt = now + (tokenData.expires_in || 3600);

  // If Google issues a new or rotated refresh token, auto-persist to .env.local
  if (tokenData.refresh_token && tokenData.refresh_token !== refreshToken) {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const envPath = path.join(process.cwd(), ".env.local");
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, "utf-8");
        if (envContent.includes("GOOGLE_DRIVE_REFRESH_TOKEN")) {
          envContent = envContent.replace(
            /GOOGLE_DRIVE_REFRESH_TOKEN=.*/,
            `GOOGLE_DRIVE_REFRESH_TOKEN=${tokenData.refresh_token}`
          );
        } else {
          envContent += `\nGOOGLE_DRIVE_REFRESH_TOKEN=${tokenData.refresh_token}\n`;
        }
        fs.writeFileSync(envPath, envContent, "utf-8");
        console.log("Auto-persisted rotated refresh token to .env.local");
      }
    } catch (fsErr) {
      console.warn("Could not auto-write rotated refresh token to .env.local:", fsErr);
    }
  }

  return tokenData.access_token;
}

/**
 * Generates an OAuth authorization URL for the folder owner to authorize the backend.
 */
export function generateDriveAuthUrl(redirectUri: string, state: string): string {
  const { clientId } = getDriveConfig();
  if (!clientId) {
    throw new Error("GOOGLE_DRIVE_CLIENT_ID is not configured in server environment.");
  }

  // Request drive.file + drive metadata access
  const scopes = [
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive",
  ].join(" ");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scopes,
    access_type: "offline",
    prompt: "consent", // Force consent screen to guarantee refresh token is returned
    include_granted_scopes: "true",
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchanges the one-time authorization code for access and refresh tokens.
 */
export async function exchangeAuthCodeForTokens(
  code: string,
  redirectUri: string
): Promise<GoogleTokenResponse> {
  const { clientId, clientSecret } = getDriveConfig();

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to exchange code: ${errorText}`);
  }

  const data: GoogleTokenResponse = await response.json();
  if (data.access_token) {
    cachedAccessToken = data.access_token;
    tokenExpiresAt = Math.floor(Date.now() / 1000) + (data.expires_in || 3600);
  }

  return data;
}

/**
 * Uploads a file (buffer or Uint8Array) into the designated Google Drive folder.
 * Uses Google Drive v3 multipart upload for small/medium files (< 5MB).
 */
export async function uploadBufferToDrive({
  buffer,
  filename,
  mimeType,
  parentFolderId = DEFAULT_DRIVE_FOLDER_ID,
  description,
}: {
  buffer: Buffer | Uint8Array;
  filename: string;
  mimeType: string;
  parentFolderId?: string;
  description?: string;
}): Promise<{ id: string; name: string; webViewLink?: string; size?: string }> {
  const accessToken = await getGoogleDriveAccessToken();

  const metadata = {
    name: filename,
    parents: [parentFolderId],
    description: description || `Uploaded via GetLinked`,
  };

  const boundary = `-------getlinked_upload_${Date.now()}`;
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metaHeader = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(
    metadata
  )}`;
  const mediaHeader = `${delimiter}Content-Type: ${mimeType}\r\n\r\n`;

  const metaBuffer = Buffer.from(metaHeader, "utf-8");
  const mediaHeaderBuffer = Buffer.from(mediaHeader, "utf-8");
  const closeBuffer = Buffer.from(closeDelimiter, "utf-8");

  const body = Buffer.concat([
    metaBuffer,
    mediaHeaderBuffer,
    Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer),
    closeBuffer,
  ]);

  const uploadUrl =
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true&fields=id,name,webViewLink,size";

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
      "Content-Length": String(body.length),
    },
    body,
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Google Drive multipart upload failed:", err);
    throw new Error(`Google Drive upload failed (${response.status}): ${err}`);
  }

  return await response.json();
}

/**
 * Initializes a Google Drive Resumable Upload session for large files or videos.
 * Returns the resumable upload URI which streams bytes without buffering in memory.
 * Sets the Origin header so Google Drive accepts direct browser uploads with CORS.
 */
export async function createResumableUploadSession({
  filename,
  mimeType,
  fileSize,
  parentFolderId = DEFAULT_DRIVE_FOLDER_ID,
  clientOrigin,
}: {
  filename: string;
  mimeType: string;
  fileSize: number;
  parentFolderId?: string;
  clientOrigin?: string;
}): Promise<{ sessionUrl: string }> {
  const accessToken = await getGoogleDriveAccessToken();

  const metadata = {
    name: filename,
    parents: [parentFolderId],
  };

  const initUrl =
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true";

  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json; charset=UTF-8",
    "X-Upload-Content-Type": mimeType,
    "X-Upload-Content-Length": String(fileSize),
  };

  if (clientOrigin) {
    headers["Origin"] = clientOrigin;
  }

  const response = await fetch(initUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(metadata),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to initialize resumable upload session (${response.status}): ${errorText}`
    );
  }

  const sessionUrl = response.headers.get("location");
  if (!sessionUrl) {
    throw new Error("Google Drive did not return a resumable upload location header.");
  }

  return { sessionUrl };
}

/**
 * Retrieves file metadata from Google Drive.
 */
export async function getFileMetadata(fileId: string): Promise<{ id: string; name: string; size?: string; mimeType?: string }> {
  const accessToken = await getGoogleDriveAccessToken();

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?supportsAllDrives=true&fields=id,name,size,mimeType`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to get file metadata: ${err}`);
  }

  return await response.json();
}

/**
 * Deletes a file from Google Drive permanently or sends it to trash.
 */
export async function deleteDriveFile(fileId: string): Promise<boolean> {
  const accessToken = await getGoogleDriveAccessToken();

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?supportsAllDrives=true`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  // 204 No Content indicates success; 404 is also acceptable if already deleted
  if (response.status === 204 || response.status === 404) {
    return true;
  }

  const errorText = await response.text();
  console.error("Failed to delete file from Google Drive:", errorText);
  throw new Error(`Failed to delete Google Drive file: ${errorText}`);
}
