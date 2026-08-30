"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: number;
  max: number;
  color: string;
  suffix?: string;
  valueLabel?: string;
  className?: string;
};

export default function ProgressRow({
  label,
  value,
  max,
  color,
  suffix = "count",
  valueLabel,
  className,
}: Props) {
  const reducedMotion = useReducedMotion();
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div className={cn("grid gap-1.5", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="truncate text-sm font-medium text-zinc-700">{label}</span>
        <span className="shrink-0 text-sm font-semibold tabular-nums text-zinc-900">
          {valueLabel ?? `${value} ${suffix}`}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
        <motion.div
          initial={reducedMotion ? false : { width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}