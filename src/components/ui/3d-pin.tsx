"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const PinContainer = ({
  children,
  title,
  href,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  title?: string;
  href?: string;
  className?: string;
  containerClassName?: string;
}) => {
  const [transform, setTransform] = useState(
    "translate(-50%,-50%) rotateX(0deg)"
  );

  const onMouseEnter = () => {
    setTransform("translate(-50%,-50%) rotateX(36deg) scale(0.88)");
  };
  const onMouseLeave = () => {
    setTransform("translate(-50%,-50%) rotateX(0deg) scale(1)");
  };

  return (
    <div
      className={cn(
        "relative group/pin z-10 cursor-pointer",
        containerClassName
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        style={{
          perspective: "1000px",
          transform: "rotateX(70deg) translateZ(0deg)",
        }}
        className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          style={{
            transform: transform,
          }}
          className="absolute left-1/2 top-1/2 p-3 sm:p-4 flex justify-start items-start rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.35)] bg-[#152E30]/95 backdrop-blur-md border border-[#336467]/60 group-hover/pin:border-[#D7400B] group-hover/pin:shadow-[0_20px_50px_rgba(215,64,11,0.25)] transition-all duration-700 overflow-hidden"
        >
          <div className={cn("relative z-50", className)}>{children}</div>
        </div>
      </div>
      <PinPerspective title={title} href={href} />
    </div>
  );
};

export const PinPerspective = ({
  title,
  href,
}: {
  title?: string;
  href?: string;
}) => {
  return (
    <motion.div className="pointer-events-none w-full h-[32rem] flex items-center justify-center opacity-0 group-hover/pin:opacity-100 z-[60] transition-opacity duration-500">
      <div className="w-full h-full flex-none inset-0 relative">
        {/* Floating Social Media Link Pin */}
        <div className="absolute top-2 inset-x-0 flex justify-center z-50">
          <a
            href={href || "https://instagram.com"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="relative flex space-x-2 items-center z-50 rounded-full bg-zinc-950/95 py-1.5 px-4 ring-1 ring-white/20 shadow-2xl pointer-events-auto hover:scale-108 hover:ring-[#D7400B] transition-all duration-300 group/btn"
          >
            <span className="relative z-20 text-white text-xs font-semibold inline-flex items-center gap-2 py-0.5">
              <span className="w-2 h-2 rounded-full bg-[#D7400B] animate-ping" />
              <span className="tracking-wide">{title || "Visit Social Profile"}</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#D7400B] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
              >
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </span>

            <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-[#D7400B]/0 via-[#D7400B] to-[#D7400B]/0 transition-opacity duration-500 group-hover/btn:opacity-100" />
          </a>
        </div>

        {/* 3D Pulsing Concentric Rings */}
        <div
          style={{
            perspective: "1000px",
            transform: "rotateX(70deg) translateZ(0)",
          }}
          className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          <>
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                scale: 1,
                z: 0,
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: 0,
              }}
              className="absolute left-1/2 top-1/2 h-[12rem] w-[12rem] rounded-[50%] bg-[#D7400B]/[0.15] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
            />
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                scale: 1,
                z: 0,
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: 2,
              }}
              className="absolute left-1/2 top-1/2 h-[12rem] w-[12rem] rounded-[50%] bg-amber-500/[0.12] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
            />
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                scale: 1,
                z: 0,
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: 4,
              }}
              className="absolute left-1/2 top-1/2 h-[12rem] w-[12rem] rounded-[50%] bg-emerald-500/[0.12] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
            />
          </>
        </div>

        {/* Vertical Glowing Light Beam Pin */}
        <div className="pointer-events-none">
          <motion.div className="absolute right-1/2 bottom-1/2 bg-gradient-to-b from-transparent via-[#D7400B] to-[#D7400B] translate-y-[14px] w-px h-28 group-hover/pin:h-52 blur-[2px]" />
          <motion.div className="absolute right-1/2 bottom-1/2 bg-gradient-to-b from-transparent via-[#D7400B] to-[#D7400B] translate-y-[14px] w-px h-28 group-hover/pin:h-52" />
          <motion.div className="absolute right-1/2 translate-x-[1.5px] bottom-1/2 bg-[#D7400B] translate-y-[14px] w-[4px] h-[4px] rounded-full z-40 blur-[3px]" />
          <motion.div className="absolute right-1/2 translate-x-[0.5px] bottom-1/2 bg-amber-300 translate-y-[14px] w-[2px] h-[2px] rounded-full z-40" />
        </div>
      </div>
    </motion.div>
  );
};
