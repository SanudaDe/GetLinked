"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  variant?: "dark" | "light" | "original" | "stacked";
  className?: string;
  height?: number;
  showSubtext?: boolean;
  subtext?: string;
  href?: string;
  priority?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = "dark",
  className = "",
  height = 42,
  showSubtext = false,
  subtext = "Sri Lanka",
  href,
  priority = false,
}) => {
  const isLight = variant === "light";
  const isStacked = variant === "stacked";
  const isOriginal = variant === "original";

  let imageSrc = "/logo-horizontal.png";
  let aspectRatio = 496 / 100;

  if (isOriginal) {
    imageSrc = "/logo-original.jpg";
    aspectRatio = 1024 / 576;
  } else if (isStacked) {
    imageSrc = "/logo.png";
    aspectRatio = 442 / 296;
  } else if (isLight) {
    imageSrc = "/logo-white.png";
    aspectRatio = 442 / 296;
  }

  const width = Math.round(height * aspectRatio);

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div className="relative shrink-0 flex items-center">
        <Image
          src={imageSrc}
          alt="GetLinked Logo"
          width={width}
          height={height}
          className="object-contain w-auto transition-transform duration-200 group-hover:scale-[1.02]"
          style={{ height: `${height}px`, width: "auto" }}
          priority={priority}
        />
      </div>

      {showSubtext && (
        <span
          className={`text-[9px] uppercase tracking-[0.22em] font-medium px-2 py-0.5 rounded-full border transition-colors ${
            isLight
              ? "text-white/90 border-white/30 bg-white/10"
              : "text-[#1A3739] dark:text-neutral-200 border-gray-200 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800"
          }`}
        >
          {subtext}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group inline-flex items-center focus:outline-none hover:opacity-90 transition-opacity"
      >
        {content}
      </Link>
    );
  }

  return content;
};
