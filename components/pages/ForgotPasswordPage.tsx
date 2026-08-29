"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, KeyRound, Mail, LoaderCircle } from "lucide-react";
import { forgotPasswordRequest } from "@/service/userService";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  useEffect(() => {
    if (submittedEmail) {
      toast.success("If that account exists, a reset link has been sent to your email.");
    }
  }, [submittedEmail]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormValues>({ resolver: zodResolver(forgotSchema) });

  const onSubmit = async (data: ForgotFormValues) => {
    try {
      await forgotPasswordRequest(data.email);
      setSubmittedEmail(data.email);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || "Something went wrong. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-linear-to-br from-[#f7efe2] via-white to-[#e5f4ff] px-6">
      <main className="w-full max-w-md py-24">
        <section className="rounded-3xl border border-black/10 bg-white/80 p-8 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.3)] backdrop-blur">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black/5 text-black">
            <KeyRound className="h-8 w-8" strokeWidth={1.5} />
          </div>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black">
            Reset password
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-black">
            {submittedEmail ? "Check your email" : "Forgot your password?"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-black/70">
            {submittedEmail
              ? `If an account exists for ` +
                `"${submittedEmail}"` +
                `, we've emailed you a link to reset your password. It expires in 1 hour.`
              : `Enter the email address linked to your account and we'll send you a password reset link.`}
          </p>

          {!submittedEmail && (
            <form className="mt-6 grid gap-5" onSubmit={handleSubmit(onSubmit)}>
              <label className="grid gap-2 text-sm font-semibold text-black">
                Email address
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" strokeWidth={2} />
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="jordan@eventx.com"
                    {...register("email")}
                    className="h-12 w-full rounded-2xl border border-black/10 bg-white pl-11 pr-4 text-base text-black outline-none transition focus:border-black/40"
                  />
                </div>
                {errors.email && <span className="text-xs font-normal text-red-500">{errors.email.message}</span>}
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 flex h-12 items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-black/60"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    Send reset link <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-black/60">
            Remembered your password?{" "}
            <Link className="font-semibold text-black" href="/login">
              Back to login
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
