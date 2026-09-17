import React from "react";

export type BadgeVariant =
  | "pending"
  | "approved"
  | "rejected"
  | "confirmed"
  | "introduced"
  | "duplicate"
  | "teal"
  | "gold"
  | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  className = "",
  size = "md",
}) => {
  const sizeStyles = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  const variantStyles = {
    pending: "bg-amber-50 text-amber-800 border-amber-300",
    approved: "bg-emerald-50 text-emerald-800 border-emerald-300",
    rejected: "bg-rose-50 text-rose-800 border-rose-300",
    confirmed: "bg-teal-50 text-teal-800 border-teal-300",
    introduced: "bg-sky-50 text-sky-800 border-sky-300",
    duplicate: "bg-red-100 text-red-900 border-red-400 font-bold animate-pulse",
    teal: "bg-teal-900 text-sand-50 border-teal-800",
    gold: "bg-gold-500 text-ink-950 border-gold-600 font-semibold",
    neutral: "bg-sand-200 text-ink-700 border-sand-400",
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border ${sizeStyles} ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
};
