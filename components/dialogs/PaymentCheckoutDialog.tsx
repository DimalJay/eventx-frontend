"use client";

import { useMutation } from "@tanstack/react-query";
import { createCheckoutSession } from "@/service/paymentService";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  eventId: string;
  title: string;
  price: number;
  seatsLeft?: number;
  capacity?: number;
  open: boolean;
  onClose: () => void;
};

export default function PaymentCheckoutDialog({
  eventId,
  title,
  price,
  seatsLeft,
  capacity,
  open,
  onClose,
}: Props) {
  const mutation = useMutation({
    mutationFn: () => createCheckoutSession({ eventId }),
    onSuccess: (url) => {
      window.open(url, "_blank", "noopener,noreferrer");
      onClose();
    },
    onError: (err: Error) => {
      toast.error(err?.message || "Could not start payment. Please try again.");
    },
  });

  if (!open) return null;

  const formattedPrice = formatPrice(price);

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
          Checkout
        </p>
        <h3 className="mt-2 text-xl font-semibold text-black">
          Buy your ticket
        </h3>
        <p className="mt-2 text-sm text-black/60">
          Confirm your ticket below. Payment is taken securely on Stripe&apos;s
          site.
        </p>

        {/* Order summary */}
        <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-black/5 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-black">{title}</p>
            <p className="mt-0.5 text-xs text-black/50">
              {capacity && capacity > 0 ? (
                <>
                  {seatsLeft ?? 0} of {capacity} seats left
                </>
              ) : (
                "Unlimited seats"
              )}
            </p>
          </div>
          <p className="shrink-0 text-lg font-semibold text-black">{formattedPrice}</p>
        </div>

        <p className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          You will be redirected to Stripe to complete your payment.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={mutation.isPending}
            className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40 disabled:opacity-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
            className="inline-flex h-10 items-center justify-center rounded-full bg-black px-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/90 disabled:opacity-50"
          >
            {mutation.isPending ? "Redirecting to Stripe..." : `Pay ${formattedPrice}`}
          </button>
        </div>
      </div>
    </div>
  );
}
