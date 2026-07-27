"use client";

import { IRegistration } from "@/types";

type Props = {
  reg: IRegistration;
  open: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => void;
  isPending: boolean;
};

const dialogOptions = [
  { value: "GOING", label: "Going" },
  { value: "WAITLIST", label: "Waitlist" },
  { value: "NOT_GOING", label: "Not going" },
];

export default function RegistrationStatusDialog({ reg, open, onClose, onUpdateStatus, isPending }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-sm rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
          Update status
        </p>
        <h3 className="mt-2 text-xl font-semibold text-black">
          {reg.firstName} {reg.lastName}
        </h3>
        <p className="mt-2 text-sm text-black/60">
          {reg.email}
        </p>

        <div className="mt-5 grid gap-2">
          {dialogOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              disabled={isPending}
              className={`flex w-full items-center justify-between rounded-2xl border px-5 py-3 text-left text-sm font-semibold transition ${
                reg.status === opt.value
                  ? "border-black/30 bg-black/5 text-black"
                  : "border-black/10 bg-white text-black/70 hover:border-black/30"
              }`}
              onClick={() => onUpdateStatus(reg.id, opt.value)}
            >
              {opt.label}
              {reg.status === opt.value ? (
                <span className="text-xs text-black/40">Current</span>
              ) : null}
            </button>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
