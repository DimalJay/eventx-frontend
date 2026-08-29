"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle, ShieldCheck, ShieldAlert, RefreshCw, ArrowRight } from "lucide-react";
import { verifyEmail, resendVerification } from "@/service/userService";
import { toast } from "sonner";

type Status = "pending" | "success" | "error";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [status, setStatus] = useState<Status>(token ? "pending" : "error");
  const [message, setMessage] = useState(
    token ? "Verifying your email address..." : "Missing verification token.",
  );
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) return;
    let active = true;
    verifyEmail(token)
      .then((res) => {
        if (!active) return;
        if (res?.success) {
          setStatus("success");
          setMessage("Your email has been verified. You can now log in.");
        } else {
          setStatus("error");
          setMessage(res?.message || "We could not verify your email.");
        }
      })
      .catch((err: any) => {
        if (!active) return;
        setStatus("error");
        setMessage(err?.response?.data?.message || err?.message || "We could not verify your email.");
      });
    return () => {
      active = false;
    };
  }, [token]);

  const handleResend = async () => {
    if (!email || resending) return;
    setResending(true);
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
      setResending(false);
    }
  };

  const icon =
    status === "pending" ? (
      <LoaderCircle className="h-8 w-8 animate-spin" strokeWidth={1.5} />
    ) : status === "success" ? (
      <ShieldCheck className="h-8 w-8" strokeWidth={1.5} />
    ) : (
      <ShieldAlert className="h-8 w-8" strokeWidth={1.5} />
    );

  return (
    <div className="flex flex-1 items-center justify-center bg-linear-to-br from-[#f7efe2] via-white to-[#e5f4ff] px-6">
      <main className="w-full max-w-md py-24">
        <section className="rounded-3xl border border-black/10 bg-white/80 p-8 text-center shadow-[0_20px_60px_-40px_rgba(0,0,0,0.3)] backdrop-blur">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
              status === "error" ? "bg-red-50 text-red-500" : "bg-black/5 text-black"
            }`}
          >
            {icon}
          </div>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black">
            {status === "success" ? "Verified" : status === "error" ? "Verification failed" : "Verifying"}
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-black">
            {status === "success" ? "Email verified" : status === "error" ? "Unable to verify" : "Verifying email"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-black/70">{message}</p>

          {status === "success" && (
            <Link
              href="/login"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
            >
              Go to login <ArrowRight className="h-4 w-4" />
            </Link>
          )}

          {status === "error" && email && (
            <button
              onClick={handleResend}
              disabled={resending}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-widest text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${resending ? "animate-spin" : ""}`} strokeWidth={2} />
              {resending ? "Sending..." : "Resend verification email"}
            </button>
          )}

          {status === "error" && (
            <button
              onClick={() => router.push("/login")}
              className="mt-3 text-xs font-semibold text-black"
            >
              Back to login
            </button>
          )}
        </section>
      </main>
    </div>
  );
}
