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
          return (
            <div
              key={`${d.label}-${i}`}
              className="group relative flex h-full min-w-0 flex-1 items-end justify-center"
            >
              <div className="relative flex w-full flex-1 items-end justify-center px-0.5">
                <div
                  className={cn(
                    "pointer-events-none absolute -top-7 z-10 hidden whitespace-nowrap rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs font-semibold text-zinc-900 shadow-card group-hover:block",
                    isPeak && "border-primary/30 text-primary"
                  )}
                >
                  {d.value}
                </div>
                <motion.div
                  initial={reducedMotion ? false : { height: "0%" }}
                  animate={{ height: `${Math.max(pct, d.value > 0 ? 4 : 2)}%` }}
                  transition={{ delay: i * 0.05, duration: 0.7, ease: "easeOut" }}
                  className={cn(
                    "w-[70%] min-w-1 rounded-t-lg transition-colors",
                    barClassName,
                    isPeak && "bg-primary-strong"
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