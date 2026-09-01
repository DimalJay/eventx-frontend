'use client'
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
import { usePopoverPosition } from "@/lib/usePopoverPosition";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

type Mode = "datetime" | "date";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function parseValue(value: string, mode: Mode): Date | null {
  const re = mode === "datetime" ? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/ : /^(\d{4})-(\d{2})-(\d{2})/;
  const m = value.match(re);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4] ?? 0), Number(m[5] ?? 0));
}

function formatValue(date: Date, mode: Mode): string {
  const base = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  return mode === "datetime" ? `${base}T${pad(date.getHours())}:${pad(date.getMinutes())}` : base;
}

function displayValue(date: Date, mode: Mode): string {
  const base = `${MONTHS[date.getMonth()].slice(0, 3)} ${date.getDate()}, ${date.getFullYear()}`;
  if (mode === "date") return base;
  let h = date.getHours();
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${base} · ${h}:${pad(date.getMinutes())} ${period}`;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function DateTimePicker({
  name,
  value,
  onChange,
  placeholder,
  ariaLabel,
  align = "left",
  mode = "datetime",
  minDate,
  className,
}: {
  name?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  align?: "left" | "right";
  mode?: Mode;
  minDate?: Date;
  className?: string;
}) {
  const isDate = mode === "date";
  const wrapperRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const geom = usePopoverPosition(open, wrapperRef, popoverRef, "bottom", align);
  const selected = parseValue(value, mode);
  const [view, setView] = useState(() => {
    const base = selected ?? new Date();
    return { year: base.getFullYear(), month: base.getMonth() };
  });

  const toggleOpen = () => {
    setOpen((wasOpen) => {
      if (!wasOpen) {
        const base = parseValue(value, mode) ?? new Date();
        setView({ year: base.getFullYear(), month: base.getMonth() });
      }
      return !wasOpen;
    });
  };

  const today = new Date();
  const firstWeekday = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const timeStr = selected ? `${pad(selected.getHours())}:${pad(selected.getMinutes())}` : "09:00";

  const shiftMonth = (delta: number) => {
    setView((v) => {
      const m = v.month + delta;
      return { year: v.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 };
    });
  };

  const selectDay = (day: number) => {
    const base = selected ?? new Date();
    const h = mode === "datetime" && selected ? base.getHours() : 9;
    const mi = mode === "datetime" && selected ? base.getMinutes() : 0;
    onChange(formatValue(new Date(view.year, view.month, day, h, mi), mode));
  };

  const minDateStart = minDate
    ? new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()).getTime()
    : null;

  const isDisabled = (day: number) => {
    if (minDateStart === null) return false;
    const ts = new Date(view.year, view.month, day).getTime();
    return ts < minDateStart;
  };

  const changeTime = (t: string) => {
    const [h, mi] = t.split(":").map(Number);
    const base = selected ?? new Date();
    onChange(
      formatValue(new Date(base.getFullYear(), base.getMonth(), base.getDate(), h || 0, mi || 0), mode)
    );
  };

  const trigger = isDate ? (
    <button
      type="button"
      onClick={toggleOpen}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-label={ariaLabel}
      className="flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium outline-none transition hover:border-zinc-300 focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
    >
      <span className={selected ? "text-zinc-900" : "text-zinc-500"}>
        {selected ? displayValue(selected, mode) : (placeholder ?? "Select a date")}
      </span>
      <FiCalendar className="h-4 w-4 shrink-0 text-zinc-400" />
    </button>
  ) : (
    <button
      type="button"
      onClick={toggleOpen}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-label={ariaLabel}
      className="w-full bg-transparent text-left text-sm outline-none"
    >
      <span className={selected ? "text-zinc-900" : "text-zinc-500"}>
        {selected ? displayValue(selected, mode) : (placeholder ?? "Select date & time")}
      </span>
    </button>
  );

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      {name && <input type="hidden" name={name} value={value} />}
      {trigger}

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <div
              ref={popoverRef}
              role="dialog"
              style={{
                position: "fixed",
                top: geom ? geom.top : -9999,
                left: geom ? geom.left : -9999,
              }}
              className="z-[95] w-72 max-w-[90vw] rounded-2xl border border-zinc-200 bg-white p-3 shadow-pop"
            >
            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                aria-label="Previous month"
                onClick={() => shiftMonth(-1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
              >
                <FiChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-semibold text-zinc-900">
                {MONTHS[view.month]} {view.year}
              </span>
              <button
                type="button"
                aria-label="Next month"
                onClick={() => shiftMonth(1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
              >
                <FiChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-2 grid grid-cols-7 gap-1">
              {WEEKDAYS.map((d) => (
                <span key={d} className="py-1 text-center text-[11px] font-medium text-zinc-400">
                  {d}
                </span>
              ))}
              {cells.map((day, i) => {
                if (day === null) return <span key={`e${i}`} />;
                const cellDate = new Date(view.year, view.month, day);
                const isSelected = selected != null && sameDay(cellDate, selected);
                const isToday = sameDay(cellDate, today);
                const disabled = isDisabled(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => !disabled && selectDay(day)}
                    disabled={disabled}
                    className={cn(
                      "flex h-9 items-center justify-center rounded-lg text-sm transition",
                      isSelected
                        ? "bg-primary font-semibold text-white"
                        : disabled
                        ? "cursor-not-allowed text-zinc-300"
                        : "text-zinc-900 hover:bg-primary-faint",
                      !isSelected && isToday && !disabled && "font-semibold text-primary ring-1 ring-inset ring-primary/30"
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 border-t border-zinc-200 pt-3">
              {!isDate && (
                <input
                  type="time"
                  value={timeStr}
                  onChange={(e) => changeTime(e.target.value)}
                  className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-900 outline-none transition focus:border-primary/60"
                />
              )}
              <div className={cn("flex items-center gap-1", isDate && "ml-auto")}>
                {selected && (
                  <button
                    type="button"
                    onClick={() => {
                      onChange("");
                      setOpen(false);
                    }}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-primary-strong"
                >
                  Done
                </button>
              </div>
            </div>
            </div>
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[90] cursor-default bg-transparent"
            />
          </>,
          document.body
        )}
    </div>
  );
}