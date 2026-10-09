import { NextRequest, NextResponse } from "next/server";

function parseFollowerCountString(str: string): number {
  if (!str) return 0;
  const clean = str.replace(/,/g, "").trim().toUpperCase();
  if (clean.endsWith("M")) {
    const num = parseFloat(clean.replace("M", ""));
    return Math.round(num * 1_000_000);
  }
  if (clean.endsWith("K")) {
    const num = parseFloat(clean.replace("K", ""));
    return Math.round(num * 1_000);
  }
  if (clean.endsWith("B")) {
    const num = parseFloat(clean.replace("B", ""));
    return Math.round(num * 1_000_000_000);
  }
  const parsed = parseInt(clean, 10);
  return isNaN(parsed) ? 0 : parsed;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawUrl: string = body.url || "";

    if (!rawUrl || typeof rawUrl !== "string") {
      return NextResponse.json(
        { success: false, message: "URL is required" },
        { status: 400 }
      );
    }

    const cleanUrl = rawUrl.trim();
    const BOT_UA =
      "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)";
    const BROWSER_UA =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

    // 1. INSTAGRAM
    if (cleanUrl.includes("instagram.com") || cleanUrl.includes("instagr.am")) {
      const uMatch = cleanUrl.match(
        /(?:instagram\.com|instagr\.am)\/([A-Za-z0-9._]+)/i
      );
      const handle = uMatch ? uMatch[1].replace(/\/$/, "") : "";

      if (!handle || ["p", "reel", "stories", "explore", "tv"].includes(handle)) {
        return NextResponse.json({
          success: false,
          platform: "Instagram",
          message: "Please provide a link to your Instagram profile (not a specific post or reel).",
        });
      }

      // Try primary direct bot fetch
      try {
        const res = await fetch(`https://www.instagram.com/${handle}/`, {
          headers: {
            "User-Agent": BOT_UA,
            Accept: "text/html,application/xhtml+xml",
          },
          next: { revalidate: 3600 },
        });

        const html = await res.text();
        const meta =
          html.match(
            /<meta[^>]+(?:name|property)="description"[^>]+content="([^"]+)"/i
          ) ||
          html.match(
            /<meta[^>]+(?:name|property)="og:description"[^>]+content="([^"]+)"/i
          );
        const text = meta ? meta[1] : html;
        const fMatch = text.match(/([0-9.,]+[KkMmB]?)\s+Followers/i);
        const ogImage = html.match(
          /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i
        );
        const titleMatch = html.match(
          /<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i
        );

        if (fMatch) {
          const count = parseFollowerCountString(fMatch[1]);
          return NextResponse.json({
            success: true,
            platform: "Instagram",
            handle,
            followerCount: count,
            followerCountFormatted: fMatch[1],
            avatarUrl: ogImage ? ogImage[1].replace(/&amp;/g, "&") : undefined,
            name: titleMatch ? titleMatch[1].split("(")[0].trim() : handle,
          });
        }
      } catch (err) {
        console.warn("Instagram primary fetch failed:", err);
      }

      // Secondary fallback via search snippet index
      try {
        const ddgUrl = `https://html.duckduckgo.com/html/?q=site%3Ainstagram.com%2F${handle}`;
        const res = await fetch(ddgUrl, {
          headers: { "User-Agent": BROWSER_UA },
          next: { revalidate: 3600 },
        });

        if (res.ok) {
          const html = await res.text();
          const snippetMatch = html.match(
            /class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i
          );
          const snippet = snippetMatch
            ? snippetMatch[1].replace(/<[^>]+>/g, "").trim()
            : "";
          const fMatch = snippet.match(/([0-9.,]+[KkMmB]?)\s+Followers/i);

          if (fMatch) {
            const count = parseFollowerCountString(fMatch[1]);
            return NextResponse.json({
              success: true,
              platform: "Instagram",
              handle,
              followerCount: count,
              followerCountFormatted: fMatch[1],
            });
          }
        }
      } catch (err) {
        console.warn("Instagram snippet fallback failed:", err);
      }

      return NextResponse.json({
        success: false,
        platform: "Instagram",
        handle,
        message: "Instagram account detected. Please confirm your follower count below.",
      });
    }

    // 2. TIKTOK
    if (cleanUrl.includes("tiktok.com")) {
      const uMatch = cleanUrl.match(/tiktok\.com\/@?([A-Za-z0-9._]+)/i);
      const handle = uMatch ? uMatch[1] : "";

      if (!handle) {
        return NextResponse.json({
          success: false,
          platform: "TikTok",
          message: "Invalid TikTok profile URL",
        });
      }

      try {
        const res = await fetch(`https://www.tiktok.com/@${handle}`, {
          headers: {
            "User-Agent": BROWSER_UA,
            Accept: "text/html,application/xhtml+xml",
          },
          next: { revalidate: 3600 },
        });

        const html = await res.text();
        const fMatch = html.match(/"followerCount":\s*(\d+)/i);
        const avatarMatch =
          html.match(/"avatarLarger":\s*"([^"]+)"/i) ||
          html.match(/"avatarMedium":\s*"([^"]+)"/i);
        const nickMatch = html.match(/"nickname":\s*"([^"]+)"/i);

        if (fMatch) {
          const count = parseInt(fMatch[1], 10);
          let avatarUrl: string | undefined;
          let name: string = handle;

          try {
            if (avatarMatch) avatarUrl = JSON.parse(`"${avatarMatch[1]}"`);
            if (nickMatch) name = JSON.parse(`"${nickMatch[1]}"`);
          } catch {
            // ignore decode error
          }

          return NextResponse.json({
            success: true,
            platform: "TikTok",
            handle,
            followerCount: count,
            avatarUrl,
            name,
          });
        }
      } catch (err) {
        console.warn("TikTok fetch failed:", err);
      }

      return NextResponse.json({
        success: false,
        platform: "TikTok",
        handle,
        message: "TikTok profile detected. Please confirm your follower count below.",
      });
    }

    // 3. FACEBOOK
    if (cleanUrl.includes("facebook.com") || cleanUrl.includes("fb.com")) {
      const uMatch = cleanUrl.match(
        /(?:facebook\.com|fb\.com)\/([A-Za-z0-9._]+)/i
      );
      const handle = uMatch ? uMatch[1] : "";

      if (!handle) {
        return NextResponse.json({
          success: false,
          platform: "Facebook",
          message: "Invalid Facebook page URL",
        });
      }

      try {
        const res = await fetch(`https://www.facebook.com/${handle}`, {
          headers: {
            "User-Agent": BOT_UA,
            Accept: "text/html",
          },
          next: { revalidate: 3600 },
        });

        const html = await res.text();
        const meta =
          html.match(
            /<meta[^>]+(?:name|property)="description"[^>]+content="([^"]+)"/i
          ) ||
          html.match(
            /<meta[^>]+(?:name|property)="og:description"[^>]+content="([^"]+)"/i
          );
        const text = meta ? meta[1] : html;
        const fMatch = text.match(
          /([0-9.,]+[KkMmB]?)\s+(?:followers|likes)/i
        );
        const ogImage = html.match(
          /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i
        );

        if (fMatch) {
          const count = parseFollowerCountString(fMatch[1]);
          return NextResponse.json({
            success: true,
            platform: "Facebook",
            handle,
            followerCount: count,
            avatarUrl: ogImage ? ogImage[1].replace(/&amp;/g, "&") : undefined,
          });
        }
      } catch (err) {
        console.warn("Facebook fetch failed:", err);
      }

      return NextResponse.json({
        success: false,
        platform: "Facebook",
        handle,
        message: "Facebook page detected. Please confirm your follower count below.",
      });
    }

    // 4. YOUTUBE
    if (cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be")) {
      try {
        const res = await fetch(cleanUrl, {
          headers: {
            "User-Agent": BROWSER_UA,
            Accept: "text/html",
          },
          next: { revalidate: 3600 },
        });

        const html = await res.text();
        const ytSub =
          html.match(
            /"subscriberCountText":\{[^}]*"simpleText":"([^"]+)"\}/i
          ) || html.match(/([0-9.,]+[KkMmB]?)\s+subscribers/i);
        const ytAvatar = html.match(
          /"avatar":\{"thumbnails":\[\{"url":"([^"]+)"/i
        );

        if (ytSub) {
          const subText = ytSub[1].replace(/subscribers/i, "").trim();
          const count = parseFollowerCountString(subText);
          return NextResponse.json({
            success: true,
            platform: "YouTube",
            followerCount: count,
            avatarUrl: ytAvatar ? ytAvatar[1] : undefined,
          });
        }
      } catch (err) {
        console.warn("YouTube fetch failed:", err);
      }

      return NextResponse.json({
        success: false,
        platform: "YouTube",
        message: "YouTube channel detected. Please confirm your subscriber count below.",
      });
    }

    // Generic / Other social platform
    return NextResponse.json({
      success: false,
      message: "Please confirm your follower count for this profile.",
    });
  } catch (err: any) {
    console.error("Social lookup route exception:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
