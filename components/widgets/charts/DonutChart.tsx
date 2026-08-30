"use client";

import { useId, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type DonutSlice = {
  label: string;
  value: number;
  color: string;
};

type Props = {
  data: DonutSlice[];
  size?: number;
  thickness?: number;
  centerTitle?: string;
  centerValue?: string;
  centerSub?: string;
  className?: string;
};

const GAP_PCT = 1.6;

type SliceWithGeom = DonutSlice & {
  drawn: number;
  offset: number;
};

export default function DonutChart({
  data,
  size = 180,
  thickness = 24,
  centerTitle,
  centerValue,
  centerSub,
  className,
}: Props) {
  const gradientId = useId().replace(/[:]/g, "");
  const reducedMotion = useReducedMotion();
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;

  const slices = useMemo<SliceWithGeom[]>(() => {
    const live = data.filter((d) => d.value > 0);
    if (live.length === 0) return [];
    const sum = live.reduce((s, d) => s + d.value, 0);
    return live.reduce<SliceWithGeom[]>((acc, d) => {
      const pct = sum > 0 ? (d.value / sum) * 100 : 0;
      const drawn = live.length > 1 ? Math.max(pct - GAP_PCT, 0) : pct;
      const offset = -acc.reduce((s, x) => s + x.drawn + GAP_PCT, 0);
      acc.push({ ...d, drawn, offset });
      return acc;
    }, []);
  }, [data]);

  return (
    <div
      className={cn("relative inline-flex", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
        </defs>
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#f4f4f5"
          strokeWidth={thickness}
        />
        {slices.map((slice, i) => (
          <motion.circle
            key={slice.label}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={slice.color}
            strokeWidth={thickness}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${slice.drawn} ${100 - slice.drawn}`}
            strokeDashoffset={slice.offset}
            initial={reducedMotion ? false : { strokeDasharray: "0 100" }}
            animate={{ strokeDasharray: `${slice.drawn} ${100 - slice.drawn}` }}
            transition={{ delay: i * 0.12, duration: 0.9, ease: "easeOut" }}
          />
        ))}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        {centerTitle && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            {centerTitle}
          </span>
        )}
        <span className="mt-1 font-display text-3xl font-medium tracking-tight text-zinc-900">
          {centerValue ?? String(total)}
        </span>
        {centerSub && <span className="mt-0.5 text-xs text-zinc-500">{centerSub}</span>}
      </div>
    </div>
  );
}