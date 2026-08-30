"use client";

import { useLayoutEffect, useState } from "react";

const GAP = 8;
const EDGE = 8;

export type PopoverSide = "top" | "bottom" | "left" | "right";

export type PopoverGeom = {
  top: number;
  left: number;
  width: number;
  height: number;
  side: PopoverSide;
  triggerWidth: number;
};

const OPPOSITE: Record<PopoverSide, PopoverSide> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

/**
 * Positions a popover (rendered through a portal to <body>) relative to its
 * trigger, keeping it fully contained inside the viewport:
 *  - flips to the opposite side when the preferred side has no room,
 *  - clamps both axes so the popover can never clip off-screen.
 */
export function usePopoverPosition(
  open: boolean,
  triggerRef: { current: HTMLElement | null },
  popoverRef: { current: HTMLElement | null },
  preferred: PopoverSide = "bottom",
  hAlign: "left" | "right" = "left"
) {
  const [geom, setGeom] = useState<PopoverGeom | null>(null);

  useLayoutEffect(() => {
    if (!open) return;
    const trig = triggerRef.current;
    const pop = popoverRef.current;
    if (!trig || !pop) return;

    const tr = trig.getBoundingClientRect();
    const pw = pop.offsetWidth;
    const ph = pop.offsetHeight;
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth);
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight);

    const fits = (s: PopoverSide): boolean => {
      switch (s) {
        case "top":
          return tr.top - GAP - ph >= EDGE;
        case "bottom":
          return tr.bottom + GAP + ph <= vh - EDGE;
        case "left":
          return tr.left - GAP - pw >= EDGE;
        case "right":
          return tr.right + GAP + pw <= vw - EDGE;
      }
    };

    let side = fits(preferred) ? preferred : OPPOSITE[preferred];
    if (!fits(side)) side = OPPOSITE[side];

    let top =
      side === "top" ? tr.top - GAP - ph : side === "bottom" ? tr.bottom + GAP : tr.top + tr.height / 2 - ph / 2;
    let left =
      side === "left"
        ? tr.left - GAP - pw
        : side === "right"
          ? tr.right + GAP
          : hAlign === "right"
            ? tr.right - pw
            : tr.left;

    left = Math.min(Math.max(left, EDGE), vw - pw - EDGE);
    top = Math.min(Math.max(top, EDGE), vh - ph - EDGE);

    setGeom({ top, left, width: pw, height: ph, side, triggerWidth: tr.width });
  }, [open, triggerRef, popoverRef, preferred, hAlign]);

  return geom;
}