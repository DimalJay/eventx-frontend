"use client";

import { useRouter } from "next/navigation";
import { X, LogIn, UserPlus } from "lucide-react";

type Props = {
  eventName: string;
  open: boolean;
  onClose: () => void;
};

export default function LoginPromptDialog({ eventName, open, onClose }: Props) {
  const router = useRouter();

  if (!open) return null;

  const goLogin = () => {
    onClose();
    router.push("/login");
  };

  const goRegister = () => {
    onClose();
    router.push("/register");
  };

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
              Sign in required
            </p>
            <h3 className="mt-2 text-xl font-semibold text-black">
              Log in to buy your ticket
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-1 -mt-1 rounded-full p-1.5 text-black/50 transition hover:bg-black/5 hover:text-black"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-4 text-sm leading-6 text-black/60">
          {eventName ? (
            <>
              Buying a ticket for <span className="font-semibold text-black">{eventName}</span>{" "}
              requires an account. Log in to continue, or create a new account if
              you&apos;re new here.
            </>
          ) : (
            "You need an account to purchase tickets for this event."
          )}
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={goLogin}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
          >
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Log in
          </button>
          <button
            type="button"
            onClick={goRegister}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-black/15 px-5 text-sm font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
          >
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Create an account
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-full items-center justify-center rounded-full px-5 text-xs font-semibold uppercase tracking-widest text-black/50 transition hover:text-black"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
