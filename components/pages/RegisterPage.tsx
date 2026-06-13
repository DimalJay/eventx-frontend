"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerRequest } from "@/service/userService";
import { toast } from "sonner";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

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

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });
    const mutation = useMutation({
        mutationFn: async (data: RegisterFormValues) => {
            return registerRequest(data);
        },
        onSuccess: () => {
            toast.success("Registration Successfull!")         
            router.push("/login");
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || error?.message || "Registration failed. Please try again.";
            toast.error(message);
        },
    });

    const onSubmit = (data: RegisterFormValues) => {
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
                            Create your workspace
                        </p>
                    </div>
                </div>

                <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
                    <section className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.3)] backdrop-blur sm:p-8">
                        <div className="flex flex-col gap-3">
                            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black">
                                Start in minutes
                            </p>
                            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl">
                                Bring your next event to life.
                            </h1>
                            <p className="text-sm leading-6 text-black/70">
                                Create an EventX account to manage registrations, schedules, and guest engagement.
                            </p>
                        </div>

                        <form className="mt-8 grid gap-5" onSubmit={handleSubmit(onSubmit)}>
                            <label className="grid gap-2 text-sm font-semibold text-black">
                                First name
                                <input
                                    type="text"
                                    autoComplete="given-name"
                                    placeholder="Jordan"
                                    {...register("firstName")}
                                    className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
                                />
                                {errors.firstName && <span className="text-red-500 text-xs font-normal">{errors.firstName.message}</span>}
                            </label>
                            <label className="grid gap-2 text-sm font-semibold text-black">
                                Last name
                                <input
                                    type="text"
                                    autoComplete="family-name"
                                    placeholder="Lee"
                                    {...register("lastName")}
                                    className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
                                />
                                {errors.lastName && <span className="text-red-500 text-xs font-normal">{errors.lastName.message}</span>}
                            </label>
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
                                    autoComplete="new-password"
                                    placeholder="Create a secure password"
                                    {...register("password")}
                                    className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
                                />
                                {errors.password && <span className="text-red-500 text-xs font-normal">{errors.password.message}</span>}
                            </label>

                            <button
                                type="submit"
                                className="mt-2 flex h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-black/60"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? "Creating account..." : "Create account"}
                            </button>
                            <p className="text-xs text-black/60">
                                By continuing you agree to EventX terms and privacy policy.
                            </p>
                            <div className="text-xs text-black/60">
                                Already have an account?{" "}
                                <Link className="font-semibold text-black" href="/login">
                                    Sign in
                                </Link>
                            </div>
                        </form>
                    </section>

                    <section className="grid gap-4">
                        <div className="rounded-3xl border border-black/10 bg-black px-6 py-8 text-white">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                                Trusted by event teams
                            </p>
                            <p className="mt-2 text-2xl font-semibold">
                                Plan every moment with clarity.
                            </p>
                            <p className="mt-3 text-sm text-white/70">
                                EventX keeps your registrations, agendas, and onsite moments in sync.
                            </p>
                        </div>
                        <div className="grid gap-4 rounded-3xl border border-black/10 bg-white/80 p-6">
                            {perks.map((perk) => (
                                <div key={perk.title} className="border-b border-black/10 pb-4 last:border-b-0 last:pb-0">
                                    <h2 className="text-base font-semibold text-black">{perk.title}</h2>
                                    <p className="mt-1 text-sm text-black/60">{perk.body}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
