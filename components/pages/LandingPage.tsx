'use client'
import Link from "next/link";
import UserProfile from "../widgets/UserProfile";
import Logo from "../widgets/Logo";

export default function LandingPage() {
  
  return (
    <div className="flex flex-1 items-center justify-center bg-linear-to-br from-[#f7efe2] via-white to-[#e5f4ff]">
      <main className="flex w-full max-w-5xl flex-col gap-12 px-8 py-24 sm:px-14">
        <div className="flex items-center gap-3 justify-between">
          
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="flex flex-col gap-6">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black">
              The modern event engine
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-black sm:text-5xl">
              Launch unforgettable experiences with EventX.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-black/70">
              EventX powers the full event lifecycle in one place: registration, ticketing, agenda design, and real-time engagement.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                className="flex h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
                href="#get-started"
              >
                Start an Event
              </a>
              <a
                className="flex h-12 items-center justify-center rounded-full border border-black/20 px-6 text-sm font-semibold uppercase tracking-widest text-black transition hover:border-black hover:bg-black/5"
                href="#experiences"
              >
                Explore Experiences
              </a>
            </div>
          </div>

          <div className="grid gap-4 rounded-3xl border border-black/10 bg-white/70 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.3)] backdrop-blur">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-black/60">
              <span>Live dashboard</span>
              <span>EventX HQ</span>
            </div>
            <div className="grid gap-4">
              <div className="rounded-2xl border border-black/10 bg-[#f2f6ff] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">Registrations</p>
                <p className="mt-3 text-3xl font-semibold text-black">12,482</p>
                <p className="text-sm text-black/60">+18% week over week</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">Engagement Pulse</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-3xl font-semibold text-black">94%</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                    On track
                  </span>
                </div>
                <p className="text-sm text-black/60">Real-time audience energy</p>
              </div>
            </div>
          </div>
        </div>

        <div
          id="experiences"
          className="grid gap-6 border-t border-black/10 pt-10 sm:grid-cols-3"
        >
          {[
            {
              title: "Design the agenda",
              body: "Build multi-track schedules with speakers, sessions, and live updates.",
            },
            {
              title: "Unify ticketing",
              body: "Tiered access, promo codes, and instant insights in one checkout flow.",
            },
            {
              title: "Engage every guest",
              body: "Push polls, Q&A, and networking prompts directly into the experience.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-black/10 bg-white/80 p-5"
            >
              <h3 className="text-lg font-semibold text-black">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-black/60">{item.body}</p>
            </div>
          ))}
        </div>

        <div
          id="get-started"
          className="flex flex-col items-start gap-3 rounded-3xl border border-black/10 bg-black px-6 py-8 text-white sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              Ready to launch?
            </p>
            <p className="mt-2 text-2xl font-semibold">Your next event starts in EventX.</p>
          </div>
          <Link
            className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold uppercase tracking-widest text-black"
            href="/register"
          >
            Create workspace
          </Link>
        </div>
      </main>
    </div>
  );
}
