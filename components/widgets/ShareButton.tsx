"use client";

import { useEffect, useState } from "react";
import { Share2, Link2, Check, Copy, X } from "lucide-react";

type ShareButtonProps = {
  title: string;
  text?: string;
  className?: string;
};

const UTM = "utm_source=share&utm_medium=social&utm_campaign=event";

function openWindow(url: string) {
  const w = window.open(url, "_blank", "noopener,noreferrer,width=600,height=600");
  if (w) w.opener = null;
}

type BrandIconProps = { path: string; bg: string; label: string };

const SHARE_TARGETS: Array<BrandIconProps & { build: (u: string, t: string) => string }> = [
  {
    label: "Post on X",
    bg: "#000000",
    path: "M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.59-6.64 7.59H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z",
    build: (u, t) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
  },
  {
    label: "Share on Facebook",
    bg: "#1877F2",
    path: "M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.09 24 18.1 24 12.07Z",
    build: (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
  },
  {
    label: "Share on WhatsApp",
    bg: "#25D366",
    path: "M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.1 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Zm-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 9.88 9.89c0 5.44-4.44 9.88-9.89 9.88Zm8.41-18.29A11.82 11.82 0 0 0 12.04 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.6 5.95L0 24l6.33-1.66a11.88 11.88 0 0 0 5.7 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.47-8.4Z",
    build: (u, t) => `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}`,
  },
  {
    label: "Share on Telegram",
    bg: "#229ED9",
    path: "M11.94 0A12 12 0 1 0 24 12 12 12 0 0 0 11.94 0Zm5.9 8.53-2.03 9.57c-.15.68-.56.85-1.13.53l-3.12-2.3-1.51 1.45a.79.79 0 0 1-.63.31l.22-3.15 5.72-5.17c.25-.22-.05-.35-.39-.13L6.7 13.7l-3.05-.95c-.66-.2-.67-.66.14-.98l11.9-4.59c.55-.2 1.04.13.86.98Z",
    build: (u, t) => `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
  },
  {
    label: "Share on LinkedIn",
    bg: "#0A66C2",
    path: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z",
    build: (u, t) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}&summary=${encodeURIComponent(t)}`,
  },
];

export default function ShareButton({ title, text, className }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const canNative =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  useEffect(() => {
    if (open) {
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
      return () => {
        window.removeEventListener("keydown", onKey);
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  const url =
    typeof window !== "undefined" ? window.location.href.split("?")[0] : "";
  const shareUrl = url ? `${url}?${UTM}` : "";
  const shareText = text || `Check out ${title} on EventX`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl || url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title, text: shareText, url: shareUrl || url });
      setOpen(false);
    } catch {
      /* user cancelled */
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex h-12 items-center justify-center gap-2 rounded-full border border-black/15 px-5 text-sm font-semibold uppercase tracking-widest text-black transition hover:border-black/40 hover:bg-black/5 ${className ?? ""}`}
      >
        <Share2 className="h-4 w-4" aria-hidden="true" />
        Share
      </button>

      {open && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                  Share
                </p>
                <h3 className="mt-1 text-lg font-semibold text-black">
                  Share this event
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="-mr-1 -mt-1 rounded-full p-1.5 text-black/50 transition hover:bg-black/5 hover:text-black"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-5 gap-2">
              {SHARE_TARGETS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => openWindow(s.build(shareUrl || url, shareText))}
                  className="group flex flex-col items-center gap-2"
                  aria-label={s.label}
                  title={s.label}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full text-white transition group-hover:scale-105 group-active:scale-95">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                      <path fill={s.bg} d={s.path} />
                    </svg>
                  </span>
                  <span className="text-[11px] font-medium leading-tight text-black/60">
                    {s.label.split(" ").pop()}
                  </span>
                </button>
              ))}
            </div>

            {canNative && (
              <button
                type="button"
                onClick={nativeShare}
                className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
              >
                <Share2 className="h-4 w-4" aria-hidden="true" />
                Share via device
              </button>
            )}

            <div className="mt-3 flex items-stretch gap-2">
              <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4">
                <Link2 className="h-4 w-4 shrink-0 text-black/40" aria-hidden="true" />
                <span className="truncate text-xs text-black/60">{url || "event"}</span>
              </div>
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden="true" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
