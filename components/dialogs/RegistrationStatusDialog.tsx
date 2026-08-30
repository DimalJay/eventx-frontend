"use client";

import { IRegistration } from "@/types";
import Dialog from "@/components/widgets/Dialog";

type Props = {
  reg: IRegistration;
  open: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => void;
  isPending: boolean;
  pendingStatus: string | null;
};

const dialogOptions = [
  { value: "GOING", label: "Going" },
  { value: "WAITLIST", label: "Waitlist" },
  { value: "NOT_GOING", label: "Not going" },
];

export default function RegistrationStatusDialog({ reg, open, onClose, onUpdateStatus, isPending, pendingStatus }: Props) {
  const handleUpdate = (status: string) => {
    onUpdateStatus(reg.id, status);
  };

  if (!open || !reg) return null;

  return (
    <Dialog
      open={open}
      eyebrow="Update status"
      title={`${reg.firstName} ${reg.lastName}`}
      description={reg.email}
      maxWidth="sm"
    >
      <div className="mt-5 grid gap-2">
          {dialogOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              disabled={isPending}
              className={`flex w-full items-center justify-between rounded-xl border px-5 py-3 text-left text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
                reg.status === opt.value
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-primary/30"
              }`}
              onClick={() => handleUpdate(opt.value)}
            >
              <div className="flex items-center gap-2">
                {isPending && pendingStatus === opt.value ? "Updating..." : opt.label}
              </div>
              {reg.status === opt.value && (!isPending || pendingStatus !== opt.value) ? (
                <span className="text-xs text-primary/70">Current</span>
              ) : null}
            </button>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
            onClick={onClose}
          >
            Close
          </button>
        </div>
    </Dialog>
  );
}
