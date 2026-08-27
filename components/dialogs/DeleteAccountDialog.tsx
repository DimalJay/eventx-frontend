"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  email: string;
  pending?: boolean;
};

export default function DeleteAccountDialog({
  open,
  onClose,
  onConfirm,
  email,
  pending,
}: Props) {
  const [value, setValue] = useState("");

  if (!open) return null;

  const matched =
    value.trim().toLowerCase() === (email ?? "").trim().toLowerCase();

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
          Account
        </p>

        <h3 className="mt-2 text-xl font-semibold text-black">
          Delete your account?
        </h3>

        <p className="mt-2 text-sm leading-6 text-black/60">
          This removes your profile, your events, and all related data. This
          cannot be undone.
        </p>

        <label className="mt-4 block text-xs text-black/60">
          Type your email to confirm
        </label>
        <input
          type="email"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={email}
          className="mt-1.5 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
        />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!matched || pending}
            className="inline-flex h-10 items-center justify-center rounded-full bg-red-500 px-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={onConfirm}
          >
            {pending ? "Deleting..." : "Delete account"}
          </button>
        </div>
      </div>
    </div>
  );
}