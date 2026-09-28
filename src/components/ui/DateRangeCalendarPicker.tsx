"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Check,
  Clock,
} from "lucide-react";

interface DateRangeCalendarPickerProps {
  startDate: string; // "YYYY-MM-DD" or ""
  endDate: string; // "YYYY-MM-DD" or ""
  onChange: (startDate: string, endDate: string) => void;
  className?: string;
  placeholder?: string;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Helper to pad numbers
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

// Converts Date to "YYYY-MM-DD" in local time
export const formatYmd = (date: Date): string => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

// Converts "YYYY-MM-DD" to Date object in local time
export const parseYmd = (str: string): Date | null => {
  if (!str) return null;
  const parts = str.split("-").map(Number);
  if (parts.length !== 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) return null;
  return new Date(parts[0], parts[1] - 1, parts[2]);
};

// Formats for human display e.g. "Oct 15"
const formatHumanDate = (ymd: string, includeYear = true): string => {
  const d = parseYmd(ymd);
  if (!d) return "";
  const month = MONTH_NAMES[d.getMonth()].slice(0, 3);
  return includeYear ? `${month} ${d.getDate()}, ${d.getFullYear()}` : `${month} ${d.getDate()}`;
};

export const DateRangeCalendarPicker: React.FC<DateRangeCalendarPickerProps> = ({
  startDate,
  endDate,
  onChange,
  className = "",
  placeholder = "Select Stay Dates",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Active view month (defaults to startDate's month or current month)
  const [viewYear, setViewYear] = useState<number>(() => {
    const parsed = parseYmd(startDate);
    return parsed ? parsed.getFullYear() : new Date().getFullYear();
  });
  const [viewMonth, setViewMonth] = useState<number>(() => {
    const parsed = parseYmd(startDate);
    return parsed ? parsed.getMonth() : new Date().getMonth();
  });

  // Local selection staging
  const [localStart, setLocalStart] = useState<string>(startDate);
  const [localEnd, setLocalEnd] = useState<string>(endDate);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  // Sync with incoming props if changed externally
  useEffect(() => {
    setLocalStart(startDate);
    setLocalEnd(endDate);
    if (startDate) {
      const parsed = parseYmd(startDate);
      if (parsed) {
        setViewYear(parsed.getFullYear());
        setViewMonth(parsed.getMonth());
      }
    }
  }, [startDate, endDate]);

  // Close popup on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Navigate months
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Second month for dual view on desktop
  const nextMonthYear = viewMonth === 11 ? viewYear + 1 : viewYear;
  const nextMonthIndex = viewMonth === 11 ? 0 : viewMonth + 1;

  // Build calendar matrix for a given year & month
  const getMonthMatrix = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Array<{ dayNumber: number; ymd: string; isCurrentMonth: boolean }> = [];

    // Empty lead slots
    for (let i = 0; i < firstDay; i++) {
      days.push({ dayNumber: 0, ymd: "", isCurrentMonth: false });
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const ymd = `${year}-${pad(month + 1)}-${pad(d)}`;
      days.push({ dayNumber: d, ymd, isCurrentMonth: true });
    }

    return days;
  };

  const currentMonthDays = useMemo(() => getMonthMatrix(viewYear, viewMonth), [viewYear, viewMonth]);
  const nextMonthDays = useMemo(
    () => getMonthMatrix(nextMonthYear, nextMonthIndex),
    [nextMonthYear, nextMonthIndex]
  );

  // Handle Day Click
  const handleDayClick = (ymd: string) => {
    if (!ymd) return;

    if (!localStart || (localStart && localEnd)) {
      // Starting new selection
      setLocalStart(ymd);
      setLocalEnd("");
    } else if (localStart && !localEnd) {
      // Finishing selection
      if (ymd < localStart) {
        // Clicked a date before current start: flip or reset start
        setLocalStart(ymd);
        setLocalEnd("");
      } else {
        setLocalEnd(ymd);
        onChange(localStart, ymd);
        setTimeout(() => {
          setIsOpen(false);
        }, 300);
      }
    }
  };

  // Quick Presets
  const applyPreset = (type: "thisMonth" | "nextMonth" | "next7" | "next14" | "clear") => {
    const today = new Date();
    if (type === "clear") {
      setLocalStart("");
      setLocalEnd("");
      onChange("", "");
      setIsOpen(false);
      return;
    }

    if (type === "next7") {
      const start = formatYmd(today);
      const end = new Date(today);
      end.setDate(today.getDate() + 7);
      const endYmd = formatYmd(end);
      setLocalStart(start);
      setLocalEnd(endYmd);
      onChange(start, endYmd);
      setIsOpen(false);
      return;
    }

    if (type === "next14") {
      const start = formatYmd(today);
      const end = new Date(today);
      end.setDate(today.getDate() + 14);
      const endYmd = formatYmd(end);
      setLocalStart(start);
      setLocalEnd(endYmd);
      onChange(start, endYmd);
      setIsOpen(false);
      return;
    }

    if (type === "thisMonth") {
      const start = `${viewYear}-${pad(viewMonth + 1)}-01`;
      const daysCount = new Date(viewYear, viewMonth + 1, 0).getDate();
      const end = `${viewYear}-${pad(viewMonth + 1)}-${pad(daysCount)}`;
      setLocalStart(start);
      setLocalEnd(end);
      onChange(start, end);
      setIsOpen(false);
      return;
    }

    if (type === "nextMonth") {
      const targetYear = viewMonth === 11 ? viewYear + 1 : viewYear;
      const targetMonth = viewMonth === 11 ? 0 : viewMonth + 1;
      const start = `${targetYear}-${pad(targetMonth + 1)}-01`;
      const daysCount = new Date(targetYear, targetMonth + 1, 0).getDate();
      const end = `${targetYear}-${pad(targetMonth + 1)}-${pad(daysCount)}`;
      setLocalStart(start);
      setLocalEnd(end);
      onChange(start, end);
      setIsOpen(false);
      return;
    }
  };

  // Compute night count
  const nightCount = useMemo(() => {
    if (!localStart || !localEnd) return null;
    const s = parseYmd(localStart);
    const e = parseYmd(localEnd);
    if (!s || !e) return null;
    const diff = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : null;
  }, [localStart, localEnd]);

  // Determine styling for a day cell
  const getDayStatus = (ymd: string) => {
    if (!ymd) return { isSelected: false, isStart: false, isEnd: false, isInRange: false };

    const effectiveEnd = localEnd || (localStart && hoveredDate && hoveredDate > localStart ? hoveredDate : "");

    const isStart = ymd === localStart;
    const isEnd = ymd === localEnd || (Boolean(!localEnd && localStart && hoveredDate === ymd && hoveredDate > localStart));
    const isInRange = Boolean(
      (localStart && effectiveEnd && ymd > localStart && ymd < effectiveEnd) ||
      (localStart && localEnd && ymd > localStart && ymd < localEnd)
    );

    return {
      isSelected: isStart || isEnd,
      isStart,
      isEnd,
      isInRange,
    };
  };

  // Quick clear single action
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalStart("");
    setLocalEnd("");
    onChange("", "");
  };

  // Render a month calendar table
  const renderCalendarMonth = (
    title: string,
    year: number,
    month: number,
    days: Array<{ dayNumber: number; ymd: string; isCurrentMonth: boolean }>
  ) => {
    const todayYmd = formatYmd(new Date());

    return (
      <div className="w-full flex-1">
        <div className="text-center font-serif font-bold text-teal-950 text-sm mb-3">
          {title}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {DAYS_SHORT.map((d, idx) => (
            <div
              key={idx}
              className="text-[10px] font-bold text-ink-500 uppercase tracking-wider py-1"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1 gap-x-0">
          {days.map((item, index) => {
            if (!item.isCurrentMonth || !item.ymd) {
              return <div key={index} className="h-8 w-full" />;
            }

            const { isSelected, isStart, isEnd, isInRange } = getDayStatus(item.ymd);
            const isToday = item.ymd === todayYmd;

            return (
              <div
                key={item.ymd}
                className="relative py-0.5 flex items-center justify-center"
                onMouseEnter={() => {
                  if (localStart && !localEnd) {
                    setHoveredDate(item.ymd);
                  }
                }}
              >
                {/* Connecting Range Background Bar */}
                {isInRange && (
                  <div className="absolute inset-y-1 inset-x-0 bg-sinopia/15" />
                )}
                {isStart && (localEnd || hoveredDate) && (
                  <div className="absolute inset-y-1 right-0 left-1/2 bg-sinopia/15" />
                )}
                {isEnd && localStart && (
                  <div className="absolute inset-y-1 left-0 right-1/2 bg-sinopia/15" />
                )}

                {/* Date Button */}
                <button
                  type="button"
                  onClick={() => handleDayClick(item.ymd)}
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-sinopia text-white shadow-md font-bold scale-105"
                      : isInRange
                      ? "text-teal-950 hover:bg-sinopia/25 font-semibold"
                      : "text-ink-800 hover:bg-sand-200/80 hover:text-teal-950"
                  } ${isToday && !isSelected ? "border border-sinopia text-sinopia font-bold" : ""}`}
                >
                  {item.dayNumber}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`relative ${isOpen ? "z-50" : "z-20"} ${className}`} ref={containerRef}>
      {/* Modern Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full group flex items-center justify-between gap-2.5 px-3.5 py-2 rounded-xl border text-left transition-all ${
          isOpen
            ? "border-teal-900 bg-white ring-2 ring-teal-900/10 shadow-sm"
            : localStart && localEnd
            ? "border-sinopia/40 bg-sinopia/5 hover:border-sinopia"
            : "border-sand-300 bg-white hover:border-teal-800 hover:bg-sand-50/50"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              localStart && localEnd
                ? "bg-sinopia text-white shadow-xs"
                : "bg-sand-100 text-teal-900 group-hover:bg-sand-200"
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
          </div>

          <div className="truncate">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-500">
              Travel Window
            </span>
            <span className="block text-xs font-semibold text-teal-950 truncate">
              {localStart && localEnd ? (
                <>
                  <span className="font-bold">{formatHumanDate(localStart, false)}</span>
                  <span className="text-ink-400 mx-1.5">—</span>
                  <span className="font-bold">{formatHumanDate(localEnd, true)}</span>
                </>
              ) : localStart ? (
                <>
                  <span className="font-bold text-sinopia">{formatHumanDate(localStart, false)}</span>
                  <span className="text-ink-400 mx-1.5">→</span>
                  <span className="italic text-ink-500">Select departure date</span>
                </>
              ) : (
                <span className="text-ink-500 font-normal">{placeholder}</span>
              )}
            </span>
          </div>
        </div>

        {/* Right Badges & Quick Clear */}
        <div className="flex items-center gap-1.5 shrink-0">
          {nightCount !== null && (
            <span className="text-[10px] font-bold bg-teal-950 text-white px-2 py-0.5 rounded-full font-mono shadow-xs">
              {nightCount} {nightCount === 1 ? "night" : "nights"}
            </span>
          )}

          {localStart && (
            <div
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleClear(e as unknown as React.MouseEvent);
                }
              }}
              title="Clear travel dates"
              className="p-1 rounded-full text-ink-400 hover:text-sinopia hover:bg-sand-200/80 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </button>

      {/* Floating Modern Calendar Popover */}
      {isOpen && (
        <div
          onMouseLeave={() => setHoveredDate(null)}
          className="absolute left-0 mt-2 z-[100] w-full sm:w-[620px] max-w-[95vw] bg-white rounded-2xl border border-sand-300 shadow-[0_20px_50px_rgba(0,0,0,0.22)] p-4 sm:p-5 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Top Bar with Presets & Navigation */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-sand-200 gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              <button
                type="button"
                onClick={() => applyPreset("thisMonth")}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-sand-100 hover:bg-sand-200 text-teal-950 transition-colors shrink-0"
              >
                This Month
              </button>
              <button
                type="button"
                onClick={() => applyPreset("nextMonth")}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-sand-100 hover:bg-sand-200 text-teal-950 transition-colors shrink-0"
              >
                Next Month
              </button>
              <button
                type="button"
                onClick={() => applyPreset("next7")}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-sand-100 hover:bg-sand-200 text-teal-950 transition-colors shrink-0"
              >
                Next 7 Days
              </button>
              <button
                type="button"
                onClick={() => applyPreset("next14")}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-sand-100 hover:bg-sand-200 text-teal-950 transition-colors shrink-0"
              >
                Next 14 Days
              </button>
            </div>

            {/* Month Navigation Arrows */}
            <div className="flex items-center gap-1 ml-auto">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg border border-sand-300 hover:bg-sand-100 text-teal-950 transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg border border-sand-300 hover:bg-sand-100 text-teal-950 transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendars: Responsive Dual-Month on Desktop, Single on Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:divide-x sm:divide-sand-200">
            {/* Month 1 */}
            <div>
              {renderCalendarMonth(
                `${MONTH_NAMES[viewMonth]} ${viewYear}`,
                viewYear,
                viewMonth,
                currentMonthDays
              )}
            </div>

            {/* Month 2 (Only visible on sm+ screens) */}
            <div className="hidden sm:block sm:pl-6">
              {renderCalendarMonth(
                `${MONTH_NAMES[nextMonthIndex]} ${nextMonthYear}`,
                nextMonthYear,
                nextMonthIndex,
                nextMonthDays
              )}
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="mt-4 pt-3 border-t border-sand-200 flex items-center justify-between gap-3 text-xs">
            <div className="text-ink-600 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sinopia" />
              <span>
                {localStart && localEnd ? (
                  <>
                    <strong className="text-teal-950 font-bold">{formatHumanDate(localStart)}</strong> to{" "}
                    <strong className="text-teal-950 font-bold">{formatHumanDate(localEnd)}</strong>
                  </>
                ) : (
                  <span>Click arrival date, then departure date</span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => applyPreset("clear")}
                className="px-3 py-1.5 rounded-lg text-ink-600 hover:text-teal-950 hover:bg-sand-100 font-semibold transition-colors"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  if (localStart && localEnd) {
                    onChange(localStart, localEnd);
                  } else if (localStart && !localEnd) {
                    setLocalEnd(localStart);
                    onChange(localStart, localStart);
                  }
                  setIsOpen(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-teal-950 hover:bg-teal-900 text-white font-semibold transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
