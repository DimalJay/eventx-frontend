"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type BarDatum = {
  label: string;
  value: number;
};

type Props = {
  data: BarDatum[];
  height?: number;
  barClassName?: string;
  highlightPeak?: boolean;
  className?: string;
};

export default function VerticalBars({
  data,
  height = 240,
  barClassName = "bg-primary",
  highlightPeak = true,
  className,
}: Props) {
  const reducedMotion = useReducedMotion();
  const values = data.map((d) => d.value);
  const max = Math.max(0, ...values, 1);
  const peakIndex = data.length > 0 ? values.indexOf(max) : -1;

  return (
    <div className={cn("flex flex-col", className)}>
      <div
        className="relative flex items-end gap-2 sm:gap-3"
        style={{ height }}
      >
        {[0.25, 0.5, 0.75].map((f) => (
          <div
            key={f}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 border-t border-dashed border-zinc-100"
            style={{ bottom: `${f * 100}%` }}
          />
        ))}

        {data.map((d, i) => {
          const pct = max > 0 ? (d.value / max) * 100 : 0;
          const isPeak = highlightPeak && i === peakIndex && d.value > 0;
          const barHeightPct = Math.max(pct, d.value > 0 ? 8 : 3);

          return (
            <div
              key={`${d.label}-${i}`}
              className="group relative flex h-full min-w-0 flex-1 items-end justify-center"
            >
              <div className="relative flex h-full w-full items-end justify-center px-0.5">
                {/* Count Badge floating dynamically above top of the Bar */}
                {d.value > 0 && (
                  <div
                    className={cn(
                      "absolute z-10 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-bold tabular-nums shadow-2xs transition-transform group-hover:scale-110",
                      isPeak
                        ? "bg-purple-700 text-white"
                        : "bg-zinc-800 text-white"
                    )}
                    style={{ bottom: `calc(${barHeightPct}% + 6px)` }}
                  >
                    {d.value}
                  </div>
                )}

                <motion.div
                  initial={reducedMotion ? false : { height: "0%" }}
                  animate={{ height: `${barHeightPct}%` }}
                  transition={{ delay: i * 0.05, duration: 0.7, ease: "easeOut" }}
                  className={cn(
                    "w-[70%] min-w-[12px] rounded-t-lg transition-all",
                    isPeak
                      ? "bg-purple-600 hover:bg-purple-700 shadow-md ring-2 ring-purple-200"
                      : d.value > 0
                      ? "bg-purple-400 hover:bg-purple-500"
                      : "bg-zinc-200/60"
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex gap-2 sm:gap-3">
        {data.map((d, i) => (
          <div
            key={`${d.label}-${i}`}
            className="flex-1 truncate text-center text-[11px] font-medium text-zinc-500"
          >
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
}