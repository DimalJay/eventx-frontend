"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type Segment = {
  label: string;
  value: number;
  color: string;
};

type Props = {
  segments: Segment[];
  trackClassName?: string;
  className?: string;
};

export default function SegmentBar({
  segments,
  trackClassName,
  className,
}: Props) {
  const reducedMotion = useReducedMotion();
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  if (total === 0) {
    return (
      <div
        className={cn("h-2.5 overflow-hidden rounded-full bg-zinc-100", trackClassName, className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full",
        trackClassName,
        className
      )}
    >
      {segments.map((s, i) => {
        const widthPct = (s.value / total) * 100;
        return (
          <motion.div
            key={s.label}
            initial={reducedMotion ? false : { width: 0 }}
            animate={{ width: `${widthPct}%` }}
            transition={{ delay: i * 0.1, duration: 0.7, ease: "easeOut" }}
            className="h-full first:rounded-l-full last:rounded-r-full"
            style={{ background: s.color }}
            title={`${s.label}: ${s.value}`}
          />
        );
      })}
    </div>
  );
}