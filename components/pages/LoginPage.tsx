"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/AuthContext";
import { toast } from "sonner";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { GoogleLogin } from "@react-oauth/google";


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

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });
    const mutation = useMutation({
        mutationFn: async (data: LoginFormValues) => {
            return login(data);
        },
        onSuccess: () => {
            toast.success("Login successful.");
            router.replace("/home");
        },
        onError: (error: any) => {
            if (error?.response?.data?.unverified && error?.response?.data?.email) {
                toast.error(error?.response?.data?.message || "Please verify your email address.");
                router.push(`/check-email?email=${encodeURIComponent(error.response.data.email)}`);
                return;
            }
            const message = error?.response?.data?.message || error?.message || "Login failed. Please try again.";
            toast.error(message);
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
        onError: (error: any) => {
            const message = error?.response?.data?.message || error?.message || "Google Login failed. Please try again.";
            toast.error(message);
        },
    });

    const handleSuccess = (credentialResponse: any) => {
        if (credentialResponse.credential) {
            googleMutation.mutate(credentialResponse.credential);
        } else {
            toast.error("Google authentication failed.");
        }
    };

    const onSubmit = (data: LoginFormValues) => {
        mutation.mutate(data);
    };

    return (
        <div className="flex flex-1 items-center justify-center bg-linear-to-br from-[#f7efe2] via-white to-[#e5f4ff]">
            <main className="flex w-full max-w-5xl flex-col gap-10 px-8 py-20 sm:px-14">
                <div className="flex items-center gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/60">
                            EventX
                        </p>
                        <p className="text-lg font-semibold tracking-wide text-black">
                            Login to your account
                        </p>
                    </div>
                </div>

                <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
                    <section className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.3)] backdrop-blur sm:p-8">
                        <div className="flex flex-col gap-3">
                            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black">
                                Sign in
                            </p>
                            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl">
                                Keep every event in motion.
                            </h1>
                            <p className="text-sm leading-6 text-black/70">
                                Log in to manage event operations, ticketing insights, and onsite engagement.
                            </p>
                        </div>

                        <form className="mt-8 grid gap-5" onSubmit={handleSubmit(onSubmit)}>
                            <label className="grid gap-2 text-sm font-semibold text-black">
                                Email address
                                <input
                                    type="email"
                                    autoComplete="email"
                                    placeholder="jordan@eventx.com"
                                    {...register("email")}
                                    className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
                                />
                                {errors.email && <span className="text-red-500 text-xs font-normal">{errors.email.message}</span>}
                            </label>
                            <label className="grid gap-2 text-sm font-semibold text-black">
                                Password
                                <input
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    {...register("password")}
                                    className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
                                />
                                {errors.password && <span className="text-red-500 text-xs font-normal">{errors.password.message}</span>}
                            </label>

                            <div className="flex justify-end -mt-1">
                                <Link className="text-xs font-semibold text-black/70 hover:text-black" href="/forgot-password">
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="mt-2 flex h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-black/60"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? "Signing in..." : "Sign in"}
                            </button>

                            <div className="relative flex py-1 items-center">
                                <div className="grow border-t border-black/10"></div>
                                <span className="shrink mx-4 text-black/40 text-xs font-semibold uppercase tracking-widest">or</span>
                                <div className="grow border-t border-black/10"></div>
                            </div>

                            <div className="flex justify-center w-full">
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

                            <div className="flex flex-col gap-2 text-xs text-black/60 sm:flex-row sm:items-center sm:justify-between">
                                <span>Need access? Create an EventX account.</span>
                                <Link className="font-semibold text-black" href="/register">
                                    Create account
                                </Link>
                            </div>
                        </form>
                    </section>

                    <section className="grid gap-4">
                        <div className="rounded-3xl border border-black/10 bg-black px-6 py-8 text-white">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                                Returning teams
                            </p>
                            <p className="mt-2 text-2xl font-semibold">
                                Your event command center awaits.
                            </p>
                            <p className="mt-3 text-sm text-white/70">
                                EventX keeps every session, speaker, and attendee detail in sync.
                            </p>
                        </div>
                        <div className="grid gap-4 rounded-3xl border border-black/10 bg-white/80 p-6">
                            {highlights.map((highlight) => (
                                <div key={highlight.title} className="border-b border-black/10 pb-4 last:border-b-0 last:pb-0">
                                    <h2 className="text-base font-semibold text-black">{highlight.title}</h2>
                                    <p className="mt-1 text-sm text-black/60">{highlight.body}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
