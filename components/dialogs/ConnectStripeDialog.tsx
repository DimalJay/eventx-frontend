"use client";

import { useMutation } from "@tanstack/react-query";
import { connectStripeAccount } from "@/service/paymentService";
import { useAuth } from "@/components/auth/AuthContext";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
  connected?: boolean;
};

export default function ConnectStripeDialog({ open, onClose, connected }: Props) {
  const { user } = useAuth();
  const email = user?.email ?? "";

  const mutation = useMutation({
    mutationFn: () => connectStripeAccount(email),
    onSuccess: (url) => {
      window.open(url, "_blank", "noopener,noreferrer");
      onClose();
    },
    onError: (err: Error) => {
      toast.error(
        err?.message || "Could not start Stripe connection. Please try again.",
      );
    },
  });

  if (!open) return null;

  const handleConnect = () => {
    if (!email) {
      toast.error("Please log in to connect your Stripe account.");
      return;
    }
    mutation.mutate();
  };

  const isConnected = connected === true;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-zinc-900/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-pop">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
            isConnected ? "bg-emerald-50 text-emerald-600" : "bg-[#635bff]/10 text-[#635bff]"
          }`}
        >
          {isConnected ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
              <path d="m22 4-10 10.01-3-3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.639 15.703 0 13.15 0 7.886 0 3.381 2.821 3.381 7.06c0 4.212 3.567 5.64 7.13 6.838 2.609.872 3.455 1.635 3.455 2.771 0 .927-.81 1.424-2.219 1.424-1.663 0-4.907-.965-7.05-2.041l-.955 5.96c1.972.995 4.975 1.643 6.174 1.643 5.318 0 9.372-2.858 9.372-7.311 0-4.448-3.393-5.81-7.312-6.783Z" />
            </svg>
          )}
        </div>

        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          Stripe
        </p>
        <h3 className="mt-2 text-xl font-semibold text-zinc-900">
          {isConnected
            ? "Stripe account connected"
            : "Connect Stripe to sell tickets"}
        </h3>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          {isConnected
            ? "Your account is connected. Paid events will collect ticket payments and send them to your Stripe account."
            : "Paid events need a connected Stripe account. Stripe handles the payment and sends ticket money to you. You will go to Stripe to set up your account, then come back to finish creating this event."}
        </p>

        <p className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Your bank and tax details stay with Stripe. EventX never sees them.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={mutation.isPending}
            className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900 disabled:opacity-50"
            onClick={onClose}
          >
            Not now
          </button>
          <button
            type="button"
            disabled={mutation.isPending}
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-white transition disabled:opacity-50 ${
              isConnected
                ? "bg-primary hover:bg-primary/90"
                : "bg-[#635bff] hover:bg-[#4f47e8]"
            }`}
            onClick={handleConnect}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
              <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.639 15.703 0 13.15 0 7.886 0 3.381 2.821 3.381 7.06c0 4.212 3.567 5.64 7.13 6.838 2.609.872 3.455 1.635 3.455 2.771 0 .927-.81 1.424-2.219 1.424-1.663 0-4.907-.965-7.05-2.041l-.955 5.96c1.972.995 4.975 1.643 6.174 1.643 5.318 0 9.372-2.858 9.372-7.311 0-4.448-3.393-5.81-7.312-6.783Z" />
            </svg>
            {mutation.isPending
              ? "Opening..."
              : isConnected
                ? "Open Stripe dashboard"
                : "Connect Stripe"}
          </button>
        </div>
      </div>
    </div>
  );
}