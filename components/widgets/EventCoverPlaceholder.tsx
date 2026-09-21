"use client";

import { Sparkles, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

type EventCoverPlaceholderProps = {
  title?: string;
  category?: string;
  className?: string;
};

export default function EventCoverPlaceholder({
  title = "EventX Experience",
  category,
  className,
}: EventCoverPlaceholderProps) {
  const displayCategory = category || "Official Event";

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-sky-400 via-cyan-500 to-blue-600 p-5 select-none",
        className
      )}
    >
      {/* Decorative Glow & Geometric Background Mesh */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/25 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-cyan-200/30 blur-2xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:18px_18px] opacity-40" />


      {/* Center Branded Graphic & Title */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-4 px-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/30 bg-white/20 text-white shadow-md backdrop-blur-md mb-2">
          <span className="font-display text-xl font-bold tracking-wider text-white">X</span>
        </div>
        <h3 className="line-clamp-2 max-w-[22ch] font-display text-lg font-bold leading-tight tracking-tight text-white drop-shadow-xs">
          {title}
        </h3>
      </div>

      {/* Bottom EventX Logo Pill */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-2.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-sky-100">
          EventX Verified
        </span>
        <span className="text-[11px] font-extrabold tracking-wider text-white">
          EVENT<span className="text-amber-200">X</span>
        </span>
      </div>
    </div>
  );
}
