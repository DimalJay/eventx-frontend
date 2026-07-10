"use client";

import { useState, useRef, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { IRegistration } from "@/types";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
  registrations: IRegistration[];
  onCheckIn: (id: string) => void;
  onNotGoing: (id: string) => void;
  isPending: boolean;
};

export default function CheckInDialog({ open, onClose, registrations, onCheckIn, onNotGoing, isPending }: Props) {
  const [scannedReg, setScannedReg] = useState<IRegistration | null>(null);
  const [input, setInput] = useState("");
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    if (open) {
      setScannedReg(null);
      setInput("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
          Check in
        </p>

        {scannedReg ? (
          <>
            <h3 className="mt-2 text-xl font-semibold text-black">
              {scannedReg.firstName} {scannedReg.lastName}
            </h3>
            <p className="mt-1 text-sm text-black/60">
              {scannedReg.email}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-black/40">
              Ticket code: {scannedReg.ticketCode}
            </p>

            <div className="mt-5 flex flex-col gap-3">
              <button
                type="button"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90 disabled:opacity-40"
                onClick={() =>
                  onCheckIn(scannedReg.id)
                }
              >
                Mark as checked in
              </button>
              <button
                type="button"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 px-5 py-3 text-sm font-semibold uppercase tracking-widest text-rose-700 transition hover:border-rose-300 disabled:opacity-40"
                onClick={() =>
                  onNotGoing(scannedReg.id)
                }
              >
                Not going
              </button>
            </div>

            <button
              type="button"
              className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
              onClick={() => {
                setScannedReg(null);
                setInput("");
              }}
            >
              Scan another
            </button>
          </>
        ) : (
          <>
            <h3 className="mt-2 text-xl font-semibold text-black">
              Scan ticket
            </h3>
            <p className="mt-2 text-sm text-black/60">
              Point the camera at the attendee&apos;s QR code.
            </p>

            <div className="mt-4 overflow-hidden rounded-2xl bg-black/5">
              <Scanner
                ref={scannerRef}
                onScan={(detectedCodes) => {
                  const code = detectedCodes?.[0]?.rawValue;
                  if (code) {
                    const match = registrations.find(
                      (r) => r.ticketCode === code
                    );
                    if (match) {
                      setScannedReg(match);
                    } else {
                      toast.error("No attendee found with that ticket code.");
                    }
                  }
                }}
                styles={{ container: { width: "100%" } }}
              />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-black/10" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">
                or enter code
              </span>
              <div className="h-px flex-1 bg-black/10" />
            </div>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Ticket code"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="h-11 flex-1 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
              />
              <button
                type="button"
                disabled={!input.trim()}
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-black px-5 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/90 disabled:opacity-40"
                onClick={() => {
                  const match = registrations.find(
                    (r) =>
                      r.email.toLowerCase() === input.trim().toLowerCase() ||
                      r.ticketCode === input.trim()
                  );
                  if (match) {
                    setScannedReg(match);
                    setInput("");
                  } else {
                    toast.error("No attendee found with that email or code.");
                  }
                }}
              >
                Find
              </button>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
                onClick={() => {
                  setScannedReg(null);
                  setInput("");
                  onClose();
                }}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
