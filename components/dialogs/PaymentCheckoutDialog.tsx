"use client";

import { useMutation } from "@tanstack/react-query";
import { createCheckoutSession } from "@/service/paymentService";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import Dialog from "@/components/widgets/Dialog";

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

  const formattedPrice = formatPrice(price);

  return (
    <Dialog
      open={open}
      eyebrow="Checkout"
      title="Buy your ticket"
      description="Confirm your ticket below. Payment is taken securely on Stripe's site."
    >
      {/* Order summary */}
        <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-zinc-900">{title}</p>
            <p className="mt-0.5 text-xs text-zinc-500">
              {capacity && capacity > 0 ? (
                <>
                  {seatsLeft ?? 0} of {capacity} seats left
                </>
              ) : (
                "Unlimited seats"
              )}
            </p>
          </div>
          <p className="shrink-0 text-lg font-semibold text-zinc-900">{formattedPrice}</p>
        </div>

        <p className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
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
            className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900 disabled:opacity-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Redirecting to Stripe...
              </>
            ) : (
              `Pay ${formattedPrice}`
            )}
          </button>
        </div>
    </Dialog>
  );
}
