"use client";

import { useState } from "react";
import EventOperationsSection from "./EventOperationsSection";
import EventParticipantsSection from "./EventParticipantsSection";
import Logo from "../widgets/Logo";



export default function EventDashboardPage() {
  const [activeTab, setActiveTab] = useState<"operations" | "participants">("operations");

  return (
    <div className="relative flex flex-1 justify-center overflow-hidden bg-[#f5f1ea]">
      <div className="pointer-events-none absolute -left-24 top-10 h-52 w-52 rounded-full bg-[#ffc9a7] opacity-35 blur-3xl" />
      <div className="pointer-events-none absolute right-8 top-16 h-64 w-64 rounded-full bg-[#9fd3ff] opacity-35 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#ffe8a3] opacity-40 blur-3xl" />

      <main className="relative flex w-full max-w-6xl flex-col gap-10 px-8 py-16 sm:px-12">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Logo />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/50">
                  EventX live dashboard
                </p>
                <p className="text-2xl font-semibold tracking-tight text-black">
                  Signal Summit 2026
                </p>
              </div>
            </div>
            <p className="max-w-2xl text-base leading-7 text-black/70">
              Monitor attendee flow, session health, and real-time alerts during your event day.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
            >
              Open comms
            </button>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-full border border-black/15 bg-white/80 px-6 text-sm font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
            >
              Export report
            </button>
          </div>
        </header>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("operations")}
            className={`inline-flex h-10 items-center justify-center rounded-full border px-5 text-xs font-semibold uppercase tracking-widest transition ${
              activeTab === "operations"
                ? "border-black bg-black text-white"
                : "border-black/15 bg-white/80 text-black hover:border-black/40"
            }`}
          >
            Operations
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("participants")}
            className={`inline-flex h-10 items-center justify-center rounded-full border px-5 text-xs font-semibold uppercase tracking-widest transition ${
              activeTab === "participants"
                ? "border-black bg-black text-white"
                : "border-black/15 bg-white/80 text-black hover:border-black/40"
            }`}
          >
            Participants
          </button>
        </div>

        {activeTab === "operations" ? (
          <EventOperationsSection />
        ) : (
          <EventParticipantsSection />
        )}
      </main>
    </div>
  );
}
