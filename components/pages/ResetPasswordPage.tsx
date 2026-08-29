"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { KeyRound, Lock, LoaderCircle, ShieldCheck } from "lucide-react";
import { resetPasswordRequest } from "@/service/userService";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const resetSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormValues>({ resolver: zodResolver(resetSchema) });

  useEffect(() => {
    if (done) {
      toast.success("Password reset successfully. You can now log in.");
    }
  }, [done]);

  const onSubmit = async (data: ResetFormValues) => {
    try {
      const res = await resetPasswordRequest({
        token,
        email,
        newPassword: data.newPassword,
      });
      if (res?.success) {
        setDone(true);
      } else {
        toast.error(res?.message || "Could not reset your password.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Could not reset your password.");
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-linear-to-br from-[#f7efe2] via-white to-[#e5f4ff] px-6">
      <main className="w-full max-w-md py-24">
        <section className="rounded-3xl border border-black/10 bg-white/80 p-8 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.3)] backdrop-blur">
          {!token || !email ? (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
                <KeyRound className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h1 className="mt-6 text-center text-3xl font-semibold leading-tight tracking-tight text-black">
                Invalid reset link
              </h1>
              <p className="mt-3 text-center text-sm leading-6 text-black/70">
                This password reset link is missing required information. Please request a new password
                reset.
              </p>
              <Link
                href="/forgot-password"
                className="mt-6 flex w-full items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
              >
                Request a new link
              </Link>
            </>
          ) : done ? (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black/5 text-black">
                <ShieldCheck className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h1 className="mt-6 text-center text-3xl font-semibold leading-tight tracking-tight text-black">
                Password updated
              </h1>
              <p className="mt-3 text-center text-sm leading-6 text-black/70">
                Your password has been changed successfully. You can now log in with your new password.
              </p>
              <Link
                href="/login"
                className="mt-6 flex w-full items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
              >
                Go to login
              </Link>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black/5 text-black">
                <KeyRound className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black">
                New password
              </p>
              <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-black">
                Choose a new password
              </h1>
              <p className="mt-3 text-sm leading-6 text-black/70">
                Set a new password for <span className="font-semibold text-black">{email}</span>.
              </p>

              <form className="mt-6 grid gap-5" onSubmit={handleSubmit(onSubmit)}>
                <label className="grid gap-2 text-sm font-semibold text-black">
                  New password
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" strokeWidth={2} />
                    <input
                      type="password"
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      {...register("newPassword")}
                      className="h-12 w-full rounded-2xl border border-black/10 bg-white pl-11 pr-4 text-base text-black outline-none transition focus:border-black/40"
                    />
                  </div>
                  {errors.newPassword && <span className="text-xs font-normal text-red-500">{errors.newPassword.message}</span>}
                </label>

                <label className="grid gap-2 text-sm font-semibold text-black">
                  Confirm new password
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" strokeWidth={2} />
                    <input
                      type="password"
                      autoComplete="new-password"
                      placeholder="Re-enter your new password"
                      {...register("confirmPassword")}
                      className="h-12 w-full rounded-2xl border border-black/10 bg-white pl-11 pr-4 text-base text-black outline-none transition focus:border-black/40"
                    />
                  </div>
                  {errors.confirmPassword && <span className="text-xs font-normal text-red-500">{errors.confirmPassword.message}</span>}
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-1 flex h-12 items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-black/60"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" /> Updating...
                    </>
                  ) : (
                    "Reset password"
                  )}
                </button>
              </form>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
