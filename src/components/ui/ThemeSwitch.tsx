"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface ThemeSwitchProps {
  className?: string;
  showLabels?: boolean;
}

export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({
  className = "",
  showLabels = false,
}) => {
  const { theme, toggleTheme, isLoaded } = useTheme();
  const isDark = isLoaded ? theme === "dark" : false;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {showLabels && (
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 select-none">
          {isDark ? "Dark" : "Light"}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        onClick={toggleTheme}
        className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border p-1 transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D7400B] focus-visible:ring-offset-2 select-none ${
          isDark
            ? "bg-neutral-900 border-neutral-700 shadow-inner"
            : "bg-gray-100 border-gray-300 shadow-xs"
        }`}
      >
        {/* Track Icons for visual context */}
        <span className="absolute left-2 flex items-center justify-center text-amber-500 pointer-events-none transition-opacity duration-200">
          <Sun className="h-3.5 w-3.5" />
        </span>
        <span className="absolute right-2 flex items-center justify-center text-blue-300 pointer-events-none transition-opacity duration-200">
          <Moon className="h-3.5 w-3.5" />
        </span>

        {/* Sliding Knob */}
        <span
          className={`inline-flex h-6 w-6 rounded-full shadow-md transform transition-transform duration-300 ease-in-out items-center justify-center pointer-events-none z-10 ${
            isDark
              ? "translate-x-6 bg-black text-blue-200 border border-neutral-700"
              : "translate-x-0 bg-white text-amber-500 border border-gray-200"
          }`}
        >
          {isDark ? (
            <Moon className="h-3.5 w-3.5 fill-blue-300/30" />
          ) : (
            <Sun className="h-3.5 w-3.5 fill-amber-400/30" />
          )}
        </span>
      </button>
    </div>
  );
};
