"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { registerRequest } from "@/service/userService";
import { toast } from "sonner";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

type ApiError = Error & {
  response?: { data?: { message?: string } };
};

const perks = [
  {
    title: "Instant setup",
    body: "Launch a branded registration flow in minutes.",
  },
  {
    title: "Smart check-in",
    body: "Keep arrivals smooth with real-time attendee insights.",
  },
  {
    title: "Team ready",
    body: "Invite your crew and assign roles from day one.",
  },
];

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const mutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      return registerRequest(data);
    },
    onSuccess: (_data, variables) => {
      toast.success("Account created! Check your email to verify your account.");
      router.push(`/check-email?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.message || error?.message || "Registration failed. Please try again.";
      toast.error(message);
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-1 items-center justify-center bg-white">
      <main className="flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:py-20">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              EventX
            </p>
            <p className="text-lg font-semibold tracking-wide text-zinc-900">
              Create your workspace
            </p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-3">
              <p className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                Start in minutes
              </p>
              <h1 className="font-display text-3xl font-medium leading-[1.1] tracking-tight text-zinc-900 sm:text-4xl">
                Bring your next event to life.
              </h1>
              <p className="text-base leading-7 text-zinc-600">
                Create an EventX account to manage registrations, schedules,
                and guest engagement.
              </p>
            </div>

            <form className="mt-8 grid gap-5" onSubmit={handleSubmit(onSubmit)}>
              <label className="grid gap-2 text-sm font-semibold text-zinc-900">
                First name
                <input
                  type="text"
                  autoComplete="given-name"
                  placeholder="Jordan"
                  {...register("firstName")}
                  className="h-12 rounded-xl border border-zinc-200 bg-white px-4 text-base text-zinc-900 outline-none transition placeholder:text-zinc-500 focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                />
                {errors.firstName && (
                  <span className="text-xs font-normal text-red-600">
                    {errors.firstName.message}
                  </span>
                )}
              </label>
              <label className="grid gap-2 text-sm font-semibold text-zinc-900">
                Last name
                <input
                  type="text"
                  autoComplete="family-name"
                  placeholder="Lee"
                  {...register("lastName")}
                  className="h-12 rounded-xl border border-zinc-200 bg-white px-4 text-base text-zinc-900 outline-none transition placeholder:text-zinc-500 focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                />
                {errors.lastName && (
                  <span className="text-xs font-normal text-red-600">
                    {errors.lastName.message}
                  </span>
                )}
              </label>
              <label className="grid gap-2 text-sm font-semibold text-zinc-900">
                Email address
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="jordan@eventx.com"
                  {...register("email")}
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
                    autoComplete="new-password"
                    placeholder="Create a secure password"
                    {...register("password")}
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

              <button
                type="submit"
                className="flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-strong active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-primary/60"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Creating account..." : "Create account"}
              </button>
              <p className="text-xs leading-5 text-zinc-500">
                By continuing you agree to EventX{" "}
                <Link
                  className="rounded-sm font-semibold text-primary transition hover:text-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  href="/terms"
                >
                  terms
                </Link>{" "}
                and{" "}
                <Link
                  className="rounded-sm font-semibold text-primary transition hover:text-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  href="/privacy"
                >
                  privacy policy
                </Link>
                .
              </p>
              <div className="text-sm text-zinc-600">
                Already have an account?{" "}
                <Link
                  className="rounded-sm font-semibold text-primary transition hover:text-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  href="/login"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </section>

          <section className="grid gap-4">
            <div className="rounded-2xl bg-zinc-900 px-6 py-8 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Trusted by event teams
              </p>
              <p className="mt-2 text-2xl font-medium tracking-tight">
                Plan every moment with clarity.
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                EventX keeps your registrations, agendas, and onsite moments
                in sync.
              </p>
            </div>
            <div className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-6">
              {perks.map((perk) => (
                <div
                  key={perk.title}
                  className="border-t border-zinc-200 pt-4 first:border-t-0 first:pt-0"
                >
                  <h2 className="text-base font-semibold text-zinc-900">
                    {perk.title}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-zinc-600">
                    {perk.body}
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