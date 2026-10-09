"use client";

import React, { useState } from "react";
import {
  extractGoogleDriveFileId,
  getGoogleDrivePreviewUrl,
  getGoogleDriveImageUrl,
  isGoogleDriveUrl,
} from "@/utils/googleDrive";
import { Play, Maximize2, ExternalLink, Video as VideoIcon } from "lucide-react";

interface GoogleDrivePlayerProps {
  url: string;
  title?: string;
  className?: string;
  aspectRatio?: "16/9" | "9/16" | "4/3" | "1/1";
  autoPlay?: boolean;
  poster?: string;
}

export const GoogleDrivePlayer: React.FC<GoogleDrivePlayerProps> = ({
  url,
  title,
  className = "",
  aspectRatio = "16/9",
  autoPlay = false,
  poster,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [hasError, setHasError] = useState(false);

  const driveFileId = extractGoogleDriveFileId(url);
  const isDrive = isGoogleDriveUrl(url) || !!driveFileId;

  // Aspect ratio classes
  const aspectClass =
    aspectRatio === "9/16"
      ? "aspect-[9/16]"
      : aspectRatio === "4/3"
      ? "aspect-[4/3]"
      : aspectRatio === "1/1"
      ? "aspect-square"
      : "aspect-[16/9]";

  // If it's a Drive file, the preview URL provides Google's video streaming player
  const previewUrl = driveFileId
    ? getGoogleDrivePreviewUrl(driveFileId)
    : url;

  const posterImage =
    poster || (driveFileId ? getGoogleDriveImageUrl(driveFileId, 1200) : undefined);

  if (hasError) {
    return (
      <div
        className={`relative ${aspectClass} bg-sand-200 dark:bg-neutral-900 rounded-2xl flex flex-col items-center justify-center p-6 text-center border border-sand-300 dark:border-neutral-800 ${className}`}
      >
        <VideoIcon className="w-8 h-8 text-ink-400 dark:text-neutral-500 mb-2" />
        <p className="text-xs text-ink-600 dark:text-neutral-400 font-medium">
          Unable to preview video directly
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-teal-900 dark:text-gold-400 font-semibold underline"
        >
          <span>Open in Google Drive</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  // Not playing yet: show high-res poster and luxury play button
  if (!isPlaying) {
    return (
      <div
        onClick={() => setIsPlaying(true)}
        className={`relative ${aspectClass} bg-[#1A3739] rounded-2xl overflow-hidden cursor-pointer group shadow-warm border border-sand-300 dark:border-neutral-800 ${className}`}
      >
        {posterImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={posterImage}
            alt={title || "Video preview"}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
            onError={() => setHasError(false)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1A3739] to-[#0D1F20] flex items-center justify-center">
            <VideoIcon className="w-12 h-12 text-sand-200/40" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md flex items-center justify-center text-teal-950 dark:text-white group-hover:scale-110 group-hover:bg-[#D7400B] group-hover:text-white transition-all shadow-xl">
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
        </div>

        {/* Title & Drive Badge */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
          <div>
            {isDrive && (
              <span className="text-[10px] uppercase font-bold tracking-wider text-gold-400 bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs mb-1 inline-block">
                Google Drive Stream
              </span>
            )}
            {title && (
              <h4 className="font-serif text-base sm:text-lg font-medium drop-shadow-md">
                {title}
              </h4>
            )}
          </div>
          <span className="text-[11px] text-white/80 group-hover:text-white transition-colors">
            Click to Play
          </span>
        </div>
      </div>
    );
  }

  // Playing state
  if (isDrive) {
    return (
      <div
        className={`relative ${aspectClass} rounded-2xl overflow-hidden bg-black shadow-warm border border-sand-300 dark:border-neutral-800 ${className}`}
      >
        <iframe
          src={previewUrl}
          title={title || "Google Drive Video Player"}
          className="w-full h-full border-0"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          onError={() => setHasError(true)}
        />
        <div className="absolute top-2 right-2 z-10">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in Google Drive"
            className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white/80 hover:text-white backdrop-blur-xs transition-colors flex items-center gap-1 text-[10px]"
          >
            <ExternalLink className="w-3 h-3" />
            <span className="hidden sm:inline">Drive</span>
          </a>
        </div>
      </div>
    );
  }

  // Native HTML5 video player fallback
  return (
    <div
      className={`relative ${aspectClass} rounded-2xl overflow-hidden bg-black shadow-warm border border-sand-300 dark:border-neutral-800 ${className}`}
    >
      <video
        src={url}
        controls
        autoPlay
        playsInline
        poster={posterImage}
        className="w-full h-full object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
};
