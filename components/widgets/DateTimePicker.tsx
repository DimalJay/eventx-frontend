'use client'
import { useState } from "react";
import { cn } from "@/lib/utils";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function parseValue(value: string): Date | null {
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5]));
}

function formatValue(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

function displayValue(date: Date): string {
  let h = date.getHours();
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${MONTHS[date.getMonth()].slice(0, 3)} ${date.getDate()}, ${date.getFullYear()} · ${h}:${pad(
    date.getMinutes()
  )} ${period}`;
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
  placeholder = "Select date & time",
  ariaLabel,
  align = "left",
  className,
}: {
  name?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  align?: "left" | "right";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = parseValue(value);
  const [view, setView] = useState(() => {
    const base = selected ?? new Date();
    return { year: base.getFullYear(), month: base.getMonth() };
  });

  const toggleOpen = () => {
    setOpen((wasOpen) => {
      if (!wasOpen) {
        const base = parseValue(value) ?? new Date();
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
    const h = selected ? base.getHours() : 9;
    const mi = selected ? base.getMinutes() : 0;
    onChange(formatValue(new Date(view.year, view.month, day, h, mi)));
  };

  const changeTime = (t: string) => {
    const [h, mi] = t.split(":").map(Number);
    const base = selected ?? new Date();
    onChange(
      formatValue(new Date(base.getFullYear(), base.getMonth(), base.getDate(), h || 0, mi || 0))
    );
  };

  return (
    <div className={cn("relative", className)}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        type="button"
        onClick={toggleOpen}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="w-full bg-transparent text-left text-sm outline-none"
      >
        <span className={selected ? "text-black" : "text-black/35"}>
          {selected ? displayValue(selected) : placeholder}
        </span>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-20 cursor-default"
          />
          <div
            role="dialog"
            className={cn(
              "absolute top-full z-30 mt-2 w-72 max-w-[90vw] rounded-2xl border border-black/10 bg-white p-3 shadow-[0_25px_70px_-35px_rgba(0,0,0,0.45)]",
              align === "right" ? "right-0" : "left-0"
            )}
          >
            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                aria-label="Previous month"
                onClick={() => shiftMonth(-1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-black/60 transition hover:bg-black/5 hover:text-black"
              >
                <FiChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-semibold text-black">
                {MONTHS[view.month]} {view.year}
              </span>
              <button
                type="button"
                aria-label="Next month"
                onClick={() => shiftMonth(1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-black/60 transition hover:bg-black/5 hover:text-black"
              >
                <FiChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-2 grid grid-cols-7 gap-1">
              {WEEKDAYS.map((d) => (
                <span key={d} className="py-1 text-center text-[11px] font-medium text-black/40">
                  {d}
                </span>
              ))}
              {cells.map((day, i) => {
                if (day === null) return <span key={`e${i}`} />;
                const cellDate = new Date(view.year, view.month, day);
                const isSelected = selected != null && sameDay(cellDate, selected);
                const isToday = sameDay(cellDate, today);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => selectDay(day)}
                    className={cn(
                      "flex h-9 items-center justify-center rounded-lg text-sm transition",
                      isSelected
                        ? "bg-black font-semibold text-white"
                        : "text-black hover:bg-black/5",
                      !isSelected && isToday && "font-semibold text-black ring-1 ring-inset ring-black/20"
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 border-t border-black/10 pt-3">
              <input
                type="time"
                value={timeStr}
                onChange={(e) => changeTime(e.target.value)}
                className="rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-sm text-black outline-none transition focus:border-black/40"
              />
              <div className="flex items-center gap-1">
                {selected && (
                  <button
                    type="button"
                    onClick={() => {
                      onChange("");
                      setOpen(false);
                    }}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-black/50 transition hover:bg-black/5 hover:text-black"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-black px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-black/90"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
