"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { toast } from "sonner";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

type ApiError = Error & {
  response?: {
    data?: { message?: string; unverified?: boolean; email?: string };
  };
};

const highlights = [
  {
    title: "Saved event presets",
    body: "Reuse your best registration and agenda templates.",
  },
  {
    title: "Live attendee pulse",
    body: "Track engagement metrics as soon as doors open.",
  },
  {
    title: "Team-ready spaces",
    body: "Keep operators aligned with shared task boards.",
  },
];

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, googleLogin } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      return login(data);
    },
    onSuccess: () => {
      setFormError(null);
      toast.success("Login successful.");
      router.replace("/home");
    },
    onError: (error: ApiError) => {
      if (error?.response?.data?.unverified && error?.response?.data?.email) {
        toast.error(error?.response?.data?.message || "Please verify your email address.");
        router.push(`/check-email?email=${encodeURIComponent(error.response.data.email)}`);
        return;
      }
      const message = error?.response?.data?.message || error?.message || "Login failed. Please try again.";
      setFormError(message);
    },
  });

  const googleMutation = useMutation({
    mutationFn: async (credential: string) => {
      return googleLogin(credential);
    },
    onSuccess: () => {
      toast.success("Google Login successful.");
      router.replace("/home");
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.message || error?.message || "Google Login failed. Please try again.";
      toast.error(message);
    },
  });

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      googleMutation.mutate(credentialResponse.credential);
    } else {
      toast.error("Google authentication failed.");
    }
  };

  const onSubmit = (data: LoginFormValues) => {
    setFormError(null);
    mutation.mutate(data);
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-white max-w-5xl mx-auto">
      <main className="flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:py-20">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              EventX
            </p>
            <p className="text-lg font-semibold tracking-wide text-zinc-900">
              Login to your account
            </p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-3">
              <p className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                Sign in
              </p>
              <h1 className="font-display text-3xl font-medium leading-[1.1] tracking-tight text-zinc-900 sm:text-4xl">
                Keep every event in motion.
              </h1>
              <p className="text-base leading-7 text-zinc-600">
                Log in to manage event operations, ticketing insights, and
                onsite engagement.
              </p>
            </div>

            <form className="mt-8 grid gap-5" onSubmit={handleSubmit(onSubmit)}>
              <label className="grid gap-2 text-sm font-semibold text-zinc-900">
                Email address
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="jordan@eventx.com"
                  {...register("email", { onChange: () => setFormError(null) })}
                  className="h-12 rounded-xl border border-zinc-200 bg-white px-4 text-base text-zinc-900 outline-none transition placeholder:text-zinc-500 focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                />
                {errors.email && (
                  <span className="text-xs font-normal text-red-600">
                    {errors.email.message}
                  </span>
                )}
              </label>
              <label className="grid gap-2 text-sm font-semibold text-zinc-900">
                Password
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    {...register("password", { onChange: () => setFormError(null) })}
                    className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 pr-12 text-base text-zinc-900 outline-none transition placeholder:text-zinc-500 focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-zinc-400 transition hover:text-zinc-600 focus-visible:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-xs font-normal text-red-600">
                    {errors.password.message}
                  </span>
                )}
              </label>

              <div className="flex justify-end -mt-1">
                <Link
                  className="rounded-sm text-xs font-semibold text-primary transition hover:text-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  href="/forgot-password"
                >
                  Forgot password?
                </Link>
              </div>

              {formError && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                >
                  {formError}
                </div>
              )}

              <button
                type="submit"
                className="flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-strong active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-primary/60"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Signing in..." : "Sign in"}
              </button>

              <div className="relative flex items-center py-1">
                <div className="grow border-t border-zinc-200"></div>
                <span className="mx-4 shrink-0 text-xs font-medium uppercase tracking-widest text-zinc-500">
                  or
                </span>
                <div className="grow border-t border-zinc-200"></div>
              </div>

              <div className="flex w-full justify-center">
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={() => {
                    toast.error("Google Login failed");
                  }}
                  theme="outline"
                  size="large"
                  shape="pill"
                  text="continue_with"
                />
              </div>

              <div className="flex flex-col gap-2 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
                <span>Need access? Create an EventX account.</span>
                <Link
                  className="rounded-sm font-semibold text-primary transition hover:text-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  href="/register"
                >
                  Create account
                </Link>
              </div>
            </form>
          </section>

          <section className="grid gap-4">
            <div className="rounded-2xl bg-zinc-900 px-6 py-8 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Returning teams
              </p>
              <p className="mt-2 text-2xl font-medium tracking-tight">
                Your event command center awaits.
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                EventX keeps every session, speaker, and attendee detail in
                sync.
              </p>
            </div>
            <div className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-6">
              {highlights.map((highlight) => (
                <div
                  key={highlight.title}
                  className="border-t border-zinc-200 pt-4 first:border-t-0 first:pt-0"
                >
                  <h2 className="text-base font-semibold text-zinc-900">
                    {highlight.title}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-zinc-600">
                    {highlight.body}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}