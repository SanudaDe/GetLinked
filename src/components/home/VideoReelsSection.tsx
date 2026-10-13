"use client";

import React, { useState, useRef } from "react";
import { Volume2, VolumeX, Play, Pause, Maximize2, X, Sparkles } from "lucide-react";
import { GoogleDrivePlayer } from "@/components/common/GoogleDrivePlayer";

interface ReelItem {
  id: string;
  src: string;
  title: string;
  location: string;
  creator: string;
  handle: string;
  tag: string;
}

export const VideoReelsSection: React.FC = () => {
  const reels: ReelItem[] = [
    {
      id: "reel-1",
      src: "https://gpkljpnbgnylcekrcluy.supabase.co/storage/v1/object/public/images/web-bg-video-optimized.mp4",
      title: "Coastal Villa Awakening",
      location: "Thalpe, Southern Province",
      creator: "Elena Rostova",
      handle: "@elenatravels",
      tag: "FEATURED STAY REEL",
    },
    {
      id: "reel-2",
      src: "https://gpkljpnbgnylcekrcluy.supabase.co/storage/v1/object/public/images/web-bg-video-optimized.mp4",
      title: "Heritage Courtyard Escape",
      location: "Galle Fort, Sri Lanka",
      creator: "Marcus Vance",
      handle: "@marcusvance_surf",
      tag: "CURATED PARTNERSHIP",
    },
  ];

  // Video state management per video
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({
    "reel-1": true,
    "reel-2": true,
  });
  const [isMuted, setIsMuted] = useState<{ [key: string]: boolean }>({
    "reel-1": true,
    "reel-2": true,
  });
  const [modalVideo, setModalVideo] = useState<ReelItem | null>(null);

  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const togglePlay = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying((prev) => ({ ...prev, [id]: true }));
    } else {
      video.pause();
      setIsPlaying((prev) => ({ ...prev, [id]: false }));
    }
  };

  const toggleMute = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted((prev) => ({ ...prev, [id]: video.muted }));
  };

  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-black text-[#1A3739] dark:text-white overflow-hidden border-t border-gray-200 dark:border-neutral-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18 space-y-4">
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#1A3739] dark:text-white tracking-tight leading-tight">
            Real stays through the creator&apos;s lens.
          </h2>

          <p className="text-[20px] sm:text-[24px] lg:text-[26px] text-[#1A3739]/90 dark:text-neutral-200 leading-relaxed font-normal pt-1">
            Watch recent visual collaborations captured by verified creators at distinctive boutique villas across Sri Lanka.
          </p>
        </div>

        {/* 2-Column Luxury Video Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {reels.map((reel) => (
            <div
              key={reel.id}
              className="bg-gray-50 dark:bg-neutral-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-800 shadow-warm hover:shadow-warm-lg dark:shadow-none transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Video Player Frame */}
              <div className="relative aspect-[16/9] bg-[#1A3739] dark:bg-black overflow-hidden">
                <video
                  ref={(el) => {
                    videoRefs.current[reel.id] = el;
                  }}
                  src={reel.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => togglePlay(reel.id)}
                  aria-label={`${reel.title} video`}
                />

                {/* Subtle Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                {/* Top Badge Overlay */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] uppercase font-semibold tracking-[0.2em] text-white border border-white/20">
                    {reel.tag}
                  </span>
                </div>

                {/* Top Right Fullscreen Trigger */}
                <button
                  onClick={() => setModalVideo(reel)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                  aria-label="Open Fullscreen Video Modal"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Bottom Video Controls Overlay */}
                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePlay(reel.id)}
                      className="p-2 rounded-full bg-white/90 hover:bg-white text-[#1A3739] shadow-sm transition-transform hover:scale-105 cursor-pointer"
                      aria-label={isPlaying[reel.id] ? "Pause video" : "Play video"}
                    >
                      {isPlaying[reel.id] ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </button>

                    <button
                      onClick={() => toggleMute(reel.id)}
                      className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                      aria-label={isMuted[reel.id] ? "Unmute audio" : "Mute audio"}
                    >
                      {isMuted[reel.id] ? (
                        <VolumeX className="w-3.5 h-3.5" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <span className="text-[11px] font-mono text-white/90 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                    0:10 HD
                  </span>
                </div>
              </div>

              {/* Video Info Footer */}
              <div className="p-5 sm:p-6 bg-white dark:bg-neutral-950 border-t border-gray-200 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg sm:text-2xl font-normal text-[#336467] dark:text-white">
                    {reel.title}
                  </h3>
                  <p className="text-[16px] text-[#336467]/80 dark:text-neutral-300 mt-1">
                    {reel.location} • <span className="text-[#336467] dark:text-white font-semibold">{reel.creator}</span> ({reel.handle})
                  </p>
                </div>

                <button
                  onClick={() => setModalVideo(reel)}
                  className="text-[16px] font-semibold uppercase tracking-[0.18em] text-[#D7400B] hover:text-[#BD3607] transition-colors py-1 pl-2 cursor-pointer"
                >
                  WATCH FULL →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cinematic Modal Video Lightbox */}
      {modalVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
            onClick={() => setModalVideo(null)}
          />

          <div className="relative bg-[#336467] rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl border border-white/10 z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 bg-black/40 border-b border-white/10 text-white">
              <div>
                <h4 className="font-serif text-lg">{modalVideo.title}</h4>
                <p className="text-xs text-white/70">{modalVideo.location} • {modalVideo.creator}</p>
              </div>
              <button
                onClick={() => setModalVideo(null)}
                className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                aria-label="Close video player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-[16/9] bg-black">
              <GoogleDrivePlayer
                url={modalVideo.src}
                title={`${modalVideo.title} — ${modalVideo.creator}`}
                aspectRatio="16/9"
                autoPlay
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
