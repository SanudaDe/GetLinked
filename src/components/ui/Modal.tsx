"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "lg",
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  }[maxWidth];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/60 backdrop-blur-sm animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative w-full ${maxWidthClasses} bg-sand-50 rounded-xl shadow-elevated border border-sand-300 p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-start justify-between pb-4 border-b border-sand-200">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-teal-900">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs sm:text-sm text-ink-600 mt-1">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-ink-400 hover:text-ink-900 rounded-lg hover:bg-sand-200 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="pt-6">{children}</div>
      </div>
    </div>
  );
};
