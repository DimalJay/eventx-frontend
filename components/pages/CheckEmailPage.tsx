"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MailCheck, RefreshCw, ArrowRight } from "lucide-react";
import { resendVerification } from "@/service/userService";
import { toast } from "sonner";

export default function CheckEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (email) {
      toast.success("We've sent a verification link to your email.");
    }
  }, [email]);

  const handleResend = async () => {
    if (!email || sending) return;
    setSending(true);
    try {
      const res = await resendVerification(email);
      if (res?.success) {
        toast.success("Verification email sent. Check your inbox.");
      } else {
        toast.error(res?.message || "Could not resend the email.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Could not resend the email.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-linear-to-br from-[#f7efe2] via-white to-[#e5f4ff] px-6">
      <main className="w-full max-w-md py-24">
        <section className="rounded-3xl border border-black/10 bg-white/80 p-8 text-center shadow-[0_20px_60px_-40px_rgba(0,0,0,0.3)] backdrop-blur">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black/5 text-black">
            <MailCheck className="h-8 w-8" strokeWidth={1.5} />
          </div>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black">
            Confirm your email
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-black">
            Check your inbox
          </h1>
          <p className="mt-3 text-sm leading-6 text-black/70">
            We&apos;ve sent a verification link to{" "}
            <span className="font-semibold text-black">{email || "your email"}</span>. Click the link
            in the email to activate your account before logging in.
          </p>

          <button
            onClick={handleResend}
            disabled={!email || sending}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-black/60"
          >
            <RefreshCw className={`h-4 w-4 ${sending ? "animate-spin" : ""}`} strokeWidth={2} />
            {sending ? "Sending..." : "Resend email"}
          </button>

          <Link
            href="/login"
            className="mt-4 flex items-center justify-center gap-1 text-xs font-semibold text-black"
          >
            Back to login <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <div className="mt-6 text-xs text-black/60">
            Didn&apos;t create an account? You can ignore this email.
          </div>
        </section>
      </main>
    </div>
  );
}
