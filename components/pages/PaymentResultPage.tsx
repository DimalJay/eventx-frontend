"use client";

import Link from "next/link";

type Props = {
  kind: "success" | "cancelled";
};

export default function PaymentResultPage({ kind }: Props) {
  const isSuccess = kind === "success";

  return (
    <div className="relative flex flex-1 justify-center overflow-hidden bg-linear-to-br from-[#f7efe2] via-white to-[#e5f4ff]">
      <div className="pointer-events-none absolute -left-28 top-12 h-56 w-56 rounded-full bg-[#ffc9a7] opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-24 h-64 w-64 rounded-full bg-[#9fd3ff] opacity-35 blur-3xl" />

      <main className="relative flex w-full max-w-md flex-col items-center gap-6 px-5 py-16 text-center sm:px-6 sm:py-24">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-full border ${
            isSuccess
              ? "border-emerald-200 bg-emerald-50 text-emerald-600"
              : "border-black/10 bg-white text-black/50"
          }`}
        >
          {isSuccess ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
              <path d="m22 4-10 10.01-3-3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
            {isSuccess ? "Payment successful" : "Payment cancelled"}
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-black">
            {isSuccess ? "Payment confirmed" : "No charges were made."}
          </h1>
          <p className="mt-3 text-base leading-7 text-black/70">
            {isSuccess
              ? "Payment complete. Check your inbox for the confirmation email."
              : "You cancelled the payment. You can try again from the event page."}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {isSuccess ? (
            <>
              <Link
                href="/discover-events"
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90 sm:w-auto"
              >
                Discover more events
              </Link>
              <Link
                href="/home"
                className="inline-flex h-12 w-full items-center justify-center rounded-full border border-black/15 px-6 text-sm font-semibold uppercase tracking-widest text-black transition hover:border-black/40 sm:w-auto"
              >
                Go to dashboard
              </Link>
            </>
          ) : (
            <Link
              href="/discover-events"
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90 sm:w-auto"
            >
              Browse events
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}