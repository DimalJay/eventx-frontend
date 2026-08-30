"use client";

import { useRouter } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";
import Dialog from "@/components/widgets/Dialog";

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
    <Dialog
      open={open}
      eyebrow="Sign in required"
      title="Log in to buy your ticket"
      onClose={onClose}
    >
      <p className="mt-4 text-sm leading-6 text-zinc-600">
        {eventName ? (
          <>
            Buying a ticket for <span className="font-semibold text-zinc-900">{eventName}</span>{" "}
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
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Log in
          </button>
          <button
            type="button"
            onClick={goRegister}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-zinc-200 px-5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
          >
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Create an account
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-full items-center justify-center rounded-full px-5 text-sm font-semibold text-zinc-500 transition hover:text-zinc-900"
          >
            Not now
          </button>
        </div>
    </Dialog>
  );
}
