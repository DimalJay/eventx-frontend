"use client";

import { useEffect, useRef } from "react";

type Blob = {
  x: number;
  y: number;
  r: number;
  color: [number, number, number, number];
  vx: number;
  vy: number;
  phase: number;
  speed: number;
};

const BLOBS: Array<Omit<Blob, "x" | "y"> & { nx: number; ny: number }> = [
  { nx: 0.18, ny: 0.22, r: 0.55, color: [255, 201, 167, 0.55], vx: 14, vy: 10, phase: 0.2, speed: 0.9 },
  { nx: 0.82, ny: 0.28, r: 0.5, color: [159, 211, 255, 0.5], vx: -12, vy: 12, phase: 1.4, speed: 1.1 },
  { nx: 0.3, ny: 0.82, r: 0.6, color: [214, 190, 255, 0.4], vx: 10, vy: -8, phase: 2.8, speed: 0.8 },
  { nx: 0.75, ny: 0.78, r: 0.45, color: [255, 224, 178, 0.4], vx: -14, vy: -10, phase: 4.1, speed: 1.0 },
  { nx: 0.55, ny: 0.5, r: 0.72, color: [255, 255, 255, 0.5], vx: 6, vy: 6, phase: 5.5, speed: 0.6 },
];

const GRAIN_SIZE = 160;

export default function AuroraShader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduce = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    const start = performance.now();

    let grain: HTMLCanvasElement | null = null;

    const buildGrain = () => {
      const g = document.createElement("canvas");
      g.width = GRAIN_SIZE;
      g.height = GRAIN_SIZE;
      const gctx = g.getContext("2d");
      if (gctx) {
        const data = gctx.createImageData(GRAIN_SIZE, GRAIN_SIZE);
        for (let i = 0; i < data.data.length; i += 4) {
          const v = Math.random() * 255;
          data.data[i] = v;
          data.data[i + 1] = v;
          data.data[i + 2] = v;
          data.data[i + 3] = 255;
        }
        gctx.putImageData(data, 0, 0);
      }
      grain = g;
    };
    buildGrain();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = (now: number) => {
      const t = reduce.current ? 0 : (now - start) / 1000;

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#f7efe2";
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < BLOBS.length; i++) {
        const b = BLOBS[i];
        const cx =
          b.nx * width +
          Math.cos(t * b.speed + b.phase) * b.vx * 8 +
          Math.sin(t * 0.4 + b.phase * 2) * 6;
        const cy =
          b.ny * height +
          Math.sin(t * b.speed + b.phase * 2) * b.vy * 8 +
          Math.cos(t * 0.5 + b.phase) * 6;
        const r = b.r * Math.max(width, height);

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        const [r0, g0, b0, a] = b.color;
        grad.addColorStop(0, `rgba(${r0},${g0},${b0},${a})`);
        grad.addColorStop(1, `rgba(${r0},${g0},${b0},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.save();
      ctx.globalAlpha = 0.045;
      const off = Math.floor((t % 1) * GRAIN_SIZE * 2);
      ctx.translate(-off, 0);
      const pattern = grain ? ctx.createPattern(grain, "repeat") : null;
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, width + GRAIN_SIZE * 2, height);
      }
      ctx.restore();

      if (!reduce.current) {
        raf = requestAnimationFrame(frame);
      }
    };

    resize();
    raf = requestAnimationFrame(frame);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
