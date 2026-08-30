"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

type Side = "top" | "right" | "bottom" | "left";

type HelpTooltipProps = {
  text: string;
  /** Preferred side; the tooltip flips and clamps so it always stays in view. */
  side?: Side;
  iconClassName?: string;
  className?: string;
};

const OPPOSITE: Record<Side, Side> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

const GAP = 8;
const EDGE = 8;
const ARROW = 8;

type Geometry = {
  top: number;
  left: number;
  bw: number;
  bh: number;
  arrowX: number;
  arrowY: number;
  side: Side;
};

export default function HelpTooltip({
  text,
  side = "top",
  iconClassName,
  className,
}: HelpTooltipProps) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const autoId = useId().replace(/[:]/g, "");
  const tooltipId = `help-tooltip-${autoId}`;

  const [open, setOpen] = useState(false);
  const [geom, setGeom] = useState<Geometry | null>(null);

  /* Measure the trigger and bubble, pick a side that fits, then clamp the
     bubble inside the viewport and aim the arrow at the trigger. Rendered
     through a portal to <body> so ancestor transforms never corrupt layout. */
  useLayoutEffect(() => {
    if (!open) return;
    const triggerEl = triggerRef.current;
    const bubbleEl = bubbleRef.current;
    if (!triggerEl || !bubbleEl) return;

    const trig = triggerEl.getBoundingClientRect();
    const bw = bubbleEl.offsetWidth;
    const bh = bubbleEl.offsetHeight;
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth);
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight);

    const fits = (s: Side): boolean => {
      switch (s) {
        case "top":
          return trig.top - GAP - bh >= EDGE;
        case "bottom":
          return trig.bottom + GAP + bh <= vh - EDGE;
        case "left":
          return trig.left - GAP - bw >= EDGE;
        case "right":
          return trig.right + GAP + bw <= vw - EDGE;
      }
    };

    let s = fits(side) ? side : OPPOSITE[side];
    if (!fits(s)) s = fits(OPPOSITE[side]) ? OPPOSITE[side] : side;

    let left = trig.left + trig.width / 2 - bw / 2;
    let top = trig.top + trig.height / 2 - bh / 2;
    switch (s) {
      case "top":
        left = trig.left + trig.width / 2 - bw / 2;
        top = trig.top - GAP - bh;
        break;
      case "bottom":
        left = trig.left + trig.width / 2 - bw / 2;
        top = trig.bottom + GAP;
        break;
      case "left":
        left = trig.left - GAP - bw;
        top = trig.top + trig.height / 2 - bh / 2;
        break;
      case "right":
        left = trig.right + GAP;
        top = trig.top + trig.height / 2 - bh / 2;
        break;
    }

    left = Math.min(Math.max(left, EDGE), vw - bw - EDGE);
    top = Math.min(Math.max(top, EDGE), vh - bh - EDGE);

    const arrowX = trig.left + trig.width / 2 - left;
    const arrowY = trig.top + trig.height / 2 - top;

    setGeom({ top, left, bw, bh, arrowX, arrowY, side: s });
  }, [open, side, text]);

  const close = () => setOpen(false);

  const isVertical = geom?.side === "top" || geom?.side === "bottom";

  const clampCross = (value: number, max: number) =>
    Math.min(Math.max(value - ARROW / 2, EDGE), max - ARROW - EDGE);

  const arrowStyle: React.CSSProperties = geom
    ? isVertical
      ? {
          left: clampCross(geom.arrowX, geom.bw),
          ...(geom.side === "top" ? { bottom: -4 } : { top: -4 }),
        }
      : {
          top: clampCross(geom.arrowY, geom.bh),
          ...(geom.side === "left" ? { right: -4 } : { left: -4 }),
        }
    : {};

  const tooltip =
    typeof document !== "undefined" && open ? (
      createPortal(
        <span
          ref={bubbleRef}
          id={tooltipId}
          role="tooltip"
          style={{
            position: "fixed",
            top: geom ? geom.top : -9999,
            left: geom ? geom.left : -9999,
          }}
          className="pointer-events-none z-[100] max-w-xs rounded-lg bg-zinc-900 px-2.5 py-1.5 text-xs leading-snug text-white shadow-pop"
        >
          {text}
          <span
            aria-hidden="true"
            className="absolute h-2 w-2 rotate-45 bg-zinc-900"
            style={arrowStyle}
          />
        </span>,
        document.body
      )
    ) : null;

  return (
    <span
      ref={triggerRef}
      className={cn("relative inline-flex items-center", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={close}
    >
      <button
        type="button"
        aria-label={text}
        aria-describedby={open ? tooltipId : undefined}
        onFocus={() => setOpen(true)}
        onBlur={close}
        onKeyDown={(e) => {
          if (e.key === "Escape") close();
        }}
        className="inline-flex h-5 w-5 shrink-0 cursor-help items-center justify-center rounded-full text-muted-subtle transition-colors hover:bg-zinc-100 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Info className={cn("h-4 w-4", iconClassName)} strokeWidth={1.8} />
      </button>

      {tooltip}
    </span>
  );
}
