"use client";

import { useState, useRef, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { IRegistration } from "@/types";
import { toast } from "sonner";
import Dialog from "@/components/widgets/Dialog";

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

  if (scannedReg) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        eyebrow="Check in"
        title={`${scannedReg.firstName} ${scannedReg.lastName}`}
        description={scannedReg.email}
      >
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
          Ticket code: {scannedReg.ticketCode}
        </p>

        <div className="mt-5 flex flex-col gap-3">
          <button
            type="button"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() =>
              onCheckIn(scannedReg.id)
            }
          >
            {isPending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Checking in...
              </>
            ) : (
              "Mark as checked in"
            )}
          </button>
          <button
            type="button"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:border-red-300 disabled:opacity-40"
            onClick={() =>
              onNotGoing(scannedReg.id)
            }
          >
            Not going
          </button>
        </div>

        <button
          type="button"
          className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
          onClick={() => {
            setScannedReg(null);
            setInput("");
          }}
        >
          Scan another
        </button>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      eyebrow="Check in"
      title="Scan ticket"
      description="Point the camera at the attendee's QR code."
    >
      <div className="mt-4 overflow-hidden rounded-2xl bg-zinc-100">
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
              <div className="h-px flex-1 bg-zinc-200" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                or enter code
              </span>
              <div className="h-px flex-1 bg-zinc-200" />
            </div>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Ticket code"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="h-11 flex-1 rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-primary/60 focus:ring-primary/20"
              />
              <button
                type="button"
                disabled={!input.trim()}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-40"
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
                className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
                onClick={() => {
                  setScannedReg(null);
                  setInput("");
                  onClose();
                }}
              >
                Close
              </button>
            </div>
    </Dialog>
  );
}
