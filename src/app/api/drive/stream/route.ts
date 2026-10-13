import { NextRequest, NextResponse } from "next/server";
import { extractGoogleDriveFileId } from "@/utils/googleDrive";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idOrUrl =
      searchParams.get("id") ||
      searchParams.get("fileId") ||
      searchParams.get("url") ||
      searchParams.get("v");

    if (!idOrUrl) {
      return new NextResponse("Missing file ID or URL parameter", { status: 400 });
    }

    const fileId = extractGoogleDriveFileId(idOrUrl) || idOrUrl.trim();
    const targetUrl = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`;

    const rangeHeader = request.headers.get("range");
    const fetchHeaders: Record<string, string> = {};
    if (rangeHeader) {
      fetchHeaders["Range"] = rangeHeader;
    }

    const upstreamRes = await fetch(targetUrl, {
      headers: fetchHeaders,
      redirect: "follow",
    });

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", upstreamRes.headers.get("content-type") || "video/mp4");
    responseHeaders.set("Accept-Ranges", "bytes");

    const contentRange = upstreamRes.headers.get("content-range");
    if (contentRange) {
      responseHeaders.set("Content-Range", contentRange);
    }

    const contentLength = upstreamRes.headers.get("content-length");
    if (contentLength) {
      responseHeaders.set("Content-Length", contentLength);
    }

    responseHeaders.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");

    return new NextResponse(upstreamRes.body, {
      status: upstreamRes.status === 206 ? 206 : 200,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error("Error in /api/drive/stream:", error);
    return new NextResponse("Error streaming video: " + error.message, { status: 500 });
  }
}
