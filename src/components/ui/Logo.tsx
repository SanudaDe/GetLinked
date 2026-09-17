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
  // Width calculated based on 300:61 ratio (~4.918)
  const width = Math.round(height * (300 / 61));
  
  const imageSrc =
    variant === "light"
      ? "/logo-white.png"
      : variant === "original"
      ? "/logo.png"
      : "/logo-transparent.png";

  const content = (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className="relative shrink-0 flex items-center">
        <Image
          src={imageSrc}
          alt="GetLinked Sri Lanka Logo"
          width={width}
          height={height}
          className="object-contain w-auto transition-transform duration-200 group-hover:scale-[1.02]"
          style={{ height: `${height}px`, width: "auto" }}
          priority={priority}
        />
      </div>
      {showSubtext && (
        <span
          className={`text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full ${
            variant === "light"
              ? "bg-teal-900/80 text-sand-200 border border-teal-800"
              : "bg-teal-50 text-teal-600 border border-teal-100"
          }`}
        >
          {subtext}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-flex items-center focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
};
