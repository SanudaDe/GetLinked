"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  variant?: "dark" | "light" | "original";
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
  height = 34,
  showSubtext = false,
  subtext = "Sri Lanka",
  href,
  priority = false,
}) => {
  // Original aspect ratio 300:61
  const width = Math.round(height * (300 / 61));
  const isLight = variant === "light";
  const imageSrc = isLight ? "/logo-white.png" : "/logo.png";

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
          className={`text-[9px] uppercase tracking-[0.22em] font-medium px-2 py-0.5 rounded-full border ${
            isLight
              ? "text-[#FAF8F5]/80 border-white/20 bg-white/10"
              : "text-[#8A949C] border-[#E7E2DA] bg-[#F4EFEA]"
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
