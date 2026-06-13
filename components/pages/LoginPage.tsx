"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/AuthContext";
import { toast } from "react-hot-toast";


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

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            await login({ email, password });
            toast.success("Login successful.");
            router.replace("/home");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Login failed";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-1 items-center justify-center bg-linear-to-br from-[#f7efe2] via-white to-[#e5f4ff]">
            <main className="flex w-full max-w-5xl flex-col gap-10 px-8 py-20 sm:px-14">
                <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black text-sm font-semibold uppercase tracking-widest text-white">
                        EX
                    </span>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/60">
                            EventX
                        </p>
                        <p className="text-lg font-semibold tracking-wide text-black">
                            Welcome back
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

                        <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
                            <label className="grid gap-2 text-sm font-semibold text-black">
                                Email address
                                <input
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    placeholder="jordan@eventx.com"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
                                />
                            </label>
                            <label className="grid gap-2 text-sm font-semibold text-black">
                                Password
                                <input
                                    type="password"
                                    name="password"
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
                                />
                            </label>

                            <button
                                type="submit"
                                className="mt-2 flex h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-black/60"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Signing in..." : "Sign in"}
                            </button>

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
