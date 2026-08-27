"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

type FormValues = z.infer<typeof schema>;

export default function PaymentCheckoutDialog({
  eventId,
  title,
  price,
  seatsLeft,
  capacity,
  open,
  onClose,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", firstName: "", lastName: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      createCheckoutSession({ eventId, email: data.email }),
    onSuccess: (url) => {
      window.location.href = url;
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
          Enter your details and pay for your ticket.
        </p>

        {/* Order summary */}
        <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3">
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

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
          <label className="mt-5 grid gap-2 text-sm font-semibold text-black">
            Email address
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register("email")}
              className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
            />
            {errors.email && (
              <p className="text-xs text-rose-600">{errors.email.message}</p>
            )}
          </label>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="grid gap-2 text-sm font-semibold text-black">
              First name
              <input
                type="text"
                placeholder="John"
                {...register("firstName")}
                className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
              />
              {errors.firstName && (
                <p className="text-xs text-rose-600">{errors.firstName.message}</p>
              )}
            </label>

            <label className="grid gap-2 text-sm font-semibold text-black">
              Last name
              <input
                type="text"
                placeholder="Doe"
                {...register("lastName")}
                className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
              />
              {errors.lastName && (
                <p className="text-xs text-rose-600">{errors.lastName.message}</p>
              )}
            </label>
          </div>

          <p className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Payment happens on Stripe&apos;s site. You will be redirected there to pay.
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
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex h-10 items-center justify-center rounded-full bg-black px-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/90 disabled:opacity-50"
            >
              {mutation.isPending ? "Redirecting to Stripe..." : `Pay ${formattedPrice}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}