"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthContext";
import DisconnectStripeDialog from "@/components/dialogs/DisconnectStripeDialog";
import {
  connectStripeAccount,
  disconnectStripe,
  getConnectStatus,
} from "@/service/paymentService";

export default function PaymentSettingsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [disconnectOpen, setDisconnectOpen] = useState(false);

  const { data: status, isLoading } = useQuery({
    queryKey: ["stripe-connect-status"],
    queryFn: () => getConnectStatus(),
    retry: false,
  });

  const connectMutation = useMutation({
    mutationFn: () => connectStripeAccount(user?.email ?? ""),
    onSuccess: (url) => {
      window.open(url, "_blank", "noopener,noreferrer");
    },
    onError: (err: Error) => {
      toast.error(err?.message || "Could not start Stripe connection.");
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: () => disconnectStripe(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stripe-connect-status"] });
      toast.success("Stripe account disconnected.");
    },
    onError: (err: Error) => {
      toast.error(err?.message || "Could not disconnect Stripe.");
    },
  });

  const handleDisconnect = () => {
    setDisconnectOpen(false);
    disconnectMutation.mutate();
  };

  const account = status?.account ?? null;
  const isConnected = status?.connected ?? false;
  const isPending = status?.pending ?? false;

  const badgeState = isConnected
    ? "bg-success-soft text-success"
    : isPending
      ? "bg-warning-soft text-warning"
      : "bg-zinc-100 text-zinc-500";

  const badgeLabel = isConnected
    ? "Connected"
    : isPending
      ? "Setup incomplete"
      : "Not connected";

  const actionLabel = isConnected
    ? "Open Stripe dashboard"
    : isPending
      ? "Resume setup"
      : "Connect Stripe";

  const detailRows = account
    ? [
        { label: "Charges enabled", value: account.chargesEnabled },
        { label: "Payouts enabled", value: account.payoutsEnabled },
        { label: "Details submitted", value: account.detailsSubmitted },
      ]
    : [];

  const steps = [
    { title: "Buyer pays", detail: "Buyers pay on the Stripe checkout page." },
    {
      title: "Payment recorded",
      detail: "The payment is recorded against the event.",
    },
    {
      title: "Money reaches you",
      detail: "The money reaches your Stripe account after checkout.",
    },
  ];

  if (isLoading) {
    return (
      <>
        <section className="rounded-2xl border border-zinc-200 bg-white p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 animate-pulse rounded-2xl bg-zinc-200" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold text-zinc-900">Stripe</p>
                  <div className="h-5 w-24 animate-pulse rounded-full bg-zinc-200" />
                </div>
                <div className="mt-1.5 h-3.5 w-52 animate-pulse rounded bg-zinc-100" />
              </div>
            </div>
          </div>

          <div className="mt-5 h-3.5 w-full animate-pulse rounded bg-zinc-100" />
          <div className="mt-2 h-3.5 w-3/4 animate-pulse rounded bg-zinc-100" />

          <div className="mt-6 flex gap-3">
            <div className="h-11 w-48 animate-pulse rounded-full bg-zinc-200" />
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-7">
          <div className="h-4 w-20 animate-pulse rounded bg-zinc-200" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="h-20 animate-pulse rounded-2xl bg-zinc-100" />
            <div className="h-20 animate-pulse rounded-2xl bg-zinc-100" />
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-7">
          <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-2xl border border-zinc-200 px-5 py-4">
                <div className="h-3 w-14 animate-pulse rounded bg-zinc-200" />
                <div className="mt-2 h-3.5 w-28 animate-pulse rounded bg-zinc-100" />
                <div className="mt-1.5 h-3 w-full animate-pulse rounded bg-zinc-100" />
              </div>
            ))}
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="rounded-2xl border border-zinc-200 bg-white p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#635bff]/10 text-[#635bff]">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.639 15.703 0 13.15 0 7.886 0 3.381 2.821 3.381 7.06c0 4.212 3.567 5.64 7.13 6.838 2.609.872 3.455 1.635 3.455 2.771 0 .927-.81 1.424-2.219 1.424-1.663 0-4.907-.965-7.05-2.041l-.955 5.96c1.972.995 4.975 1.643 6.174 1.643 5.318 0 9.372-2.858 9.372-7.311 0-4.448-3.393-5.81-7.312-6.783Z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold text-zinc-900">Stripe</p>
                  {!isLoading && (
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badgeState}`}
                    >
                      {badgeLabel}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-zinc-600">
                  Payment gateway for online ticket sales.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-zinc-600">
            Stripe collects the payment from the buyer and sends the money to
            your account. Your bank and tax details stay with Stripe, EventX
            never sees them.
          </p>

          {isConnected && account && (
            <div className="mt-5 grid gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:grid-cols-2">
              <div>
                <p className="text-xs text-zinc-500">Account email</p>
                <p className="mt-1 truncate text-sm font-semibold text-zinc-900">
                  {account.email || "No email on file"}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Account ID</p>
                <p className="mt-1 truncate text-sm font-semibold text-zinc-900">
                  {account.accountId}
                </p>
              </div>
              {account.businessName && (
                <div>
                  <p className="text-xs text-zinc-500">Business name</p>
                  <p className="mt-1 truncate text-sm font-semibold text-zinc-900">
                    {account.businessName}
                  </p>
                </div>
              )}
              {account.defaultCurrency && (
                <div>
                  <p className="text-xs text-zinc-500">Default currency</p>
                  <p className="mt-1 text-sm font-semibold uppercase text-zinc-900">
                    {account.defaultCurrency}
                  </p>
                </div>
              )}
              {account.country && (
                <div>
                  <p className="text-xs text-zinc-500">Country</p>
                  <p className="mt-1 text-sm font-semibold uppercase text-zinc-900">
                    {account.country}
                  </p>
                </div>
              )}
            </div>
          )}

          {isPending && account && (
            <div className="mt-5 rounded-2xl border border-warning/30 bg-warning-soft px-5 py-4">
              <p className="text-xs text-warning">
                Account <span className="font-semibold">{account.accountId}</span>{" "}
                is set up but not fully activated yet. Finish onboarding to
                start accepting payments.
              </p>
            </div>
          )}

          {detailRows.length > 0 && (
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {detailRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3"
                >
                  {row.value === true ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0 text-emerald-600">
                      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : row.value === false ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0 text-zinc-400">
                      <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-300" />
                  )}
                  <span className="text-xs text-zinc-600">{row.label}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={connectMutation.isPending || !user?.email}
              onClick={() => connectMutation.mutate()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#635bff] px-6 text-sm font-semibold text-white transition hover:bg-[#4f47e8] disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.639 15.703 0 13.15 0 7.886 0 3.381 2.821 3.381 7.06c0 4.212 3.567 5.64 7.13 6.838 2.609.872 3.455 1.635 3.455 2.771 0 .927-.81 1.424-2.219 1.424-1.663 0-4.907-.965-7.05-2.041l-.955 5.96c1.972.995 4.975 1.643 6.174 1.643 5.318 0 9.372-2.858 9.372-7.311 0-4.448-3.393-5.81-7.312-6.783Z" />
              </svg>
              {connectMutation.isPending ? "Opening..." : actionLabel}
            </button>

            {(isConnected || isPending) && (
              <button
                type="button"
                disabled={disconnectMutation.isPending}
                onClick={() => setDisconnectOpen(true)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-red-200 px-6 text-sm font-semibold text-red-600 transition hover:border-red-400 disabled:opacity-50"
              >
                {disconnectMutation.isPending ? "Disconnecting..." : "Disconnect"}
              </button>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-7">
          <p className="eyebrow">
            Payouts
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4">
              <p className="text-xs text-zinc-500">Currency</p>
              <p className="mt-1 text-lg font-semibold text-zinc-900">LKR</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4">
              <p className="text-xs text-zinc-500">Payout timing</p>
              <p className="mt-1 text-lg font-semibold text-zinc-900">
                After the sale
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-600">
            Ticket money is paid into the Stripe account you connect. Stripe
            sends it to your bank on the schedule their platform sets.
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-7">
          <p className="eyebrow">
            How it works
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-zinc-200 px-5 py-4">
                <p className="text-xs font-semibold text-[#635bff]">
                  Step {index + 1}
                </p>
                <p className="mt-1.5 text-sm font-semibold text-zinc-900">
                  {step.title}
                </p>
                <p className="mt-1 text-xs leading-5 text-zinc-600">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        <DisconnectStripeDialog
          open={disconnectOpen}
          onClose={() => setDisconnectOpen(false)}
          onConfirm={handleDisconnect}
          accountEmail={account?.email}
        />
    </>
  );
}