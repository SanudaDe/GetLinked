"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Play, Pause, Volume2, VolumeX } from "lucide-react";

export const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay was prevented by browser policy:", err);
          setIsPlaying(false);
        });
      }
    }
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between overflow-hidden bg-white dark:bg-black transition-colors duration-200">
      {/* Background Video (Web BG Video.mp4) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center transition-opacity duration-700"
          style={{ filter: "brightness(0.96)" }}
        >
          <source src="/videos/Web%20BG%20Video.mp4" type="video/mp4" />
          <source src="/videos/Web BG Video.mp4" type="video/mp4" />
          <source src="/videos/web-bg-video.mp4" type="video/mp4" />
        </video>

        {/* Ambient Overlays: Preserves Video Vibrancy while Ensuring Text Readability */}
        <div className="absolute inset-0 bg-white/20 dark:bg-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 via-35% to-white/10 dark:from-black/95 dark:via-black/75 dark:via-35% dark:to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-black to-transparent pointer-events-none" />
      </div>

      {/* Top Spacer for Fixed Transparent Navbar */}
      <div className="h-24 sm:h-28 relative z-10" />

      {/* Center Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-12">
        <div className="max-w-2xl">
          {/* Kicker / Tag */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.28em] text-[#D7400B] drop-shadow-xs">
              REAL CREATORS. VERIFIED STAYS.
            </span>
          </div>

          {/* Editorial Display Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-[68px] font-normal tracking-tight text-[#1A3739] dark:text-white leading-[1.14]">
            An island tells its story best through the people who stay.
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-[#1A3739] dark:text-neutral-200 max-w-xl font-medium leading-relaxed">
            We bring Sri Lanka&apos;s finest stays together with the voices worth trusting with them.
          </p>

          {/* Dual CTAs */}
          <div className="flex items-center gap-4 mt-8 flex-wrap">
            <Link
              href="/creators"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#D7400B] hover:bg-[#BD3607] text-white text-xs sm:text-sm font-semibold tracking-wider shadow-md hover:shadow-lg transition-all duration-200 group"
            >
              <span>Find Creators</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/list-property"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#1A3739] dark:bg-neutral-800 hover:bg-[#152E30] dark:hover:bg-neutral-700 text-white text-xs sm:text-sm font-semibold tracking-wider border border-[#1A3739] dark:border-neutral-700 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <span>List Your Stay</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Trust Line */}
          <p className="mt-8 text-xs sm:text-sm text-[#1A3739]/90 dark:text-neutral-300 tracking-wide font-medium">
            Every introduction made by hand. Nothing rushed, nothing automated.
          </p>
        </div>
      </div>

      {/* Bottom Hero Bar with Controls & Slogan */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Discreet Video Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-black/60 hover:bg-white dark:hover:bg-black/80 backdrop-blur-md border border-gray-200/70 dark:border-white/15 text-[#1A3739] dark:text-white text-xs font-medium shadow-xs transition-all cursor-pointer"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span className="text-[11px] uppercase tracking-wider font-semibold">Pause Video</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span className="text-[11px] uppercase tracking-wider font-semibold">Play Video</span>
              </>
            )}
          </button>

          <button
            onClick={toggleMute}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-black/60 hover:bg-white dark:hover:bg-black/80 backdrop-blur-md border border-gray-200/70 dark:border-white/15 text-[#1A3739] dark:text-white text-xs font-medium shadow-xs transition-all cursor-pointer"
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="text-[11px] uppercase tracking-wider font-semibold">Sound Off</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span className="text-[11px] uppercase tracking-wider font-semibold">Sound On</span>
              </>
            )}
          </button>
        </div>

        {/* Right Slogan */}
        <div className="text-left sm:text-right">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#1A3739] dark:text-neutral-400">
            A BRIGHTER WAY TO TRAVEL TOGETHER
          </span>
        </div>
      </div>
    </section>
  );
};
