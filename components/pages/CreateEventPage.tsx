"use client";

import { useState } from "react";
import Logo from "../widgets/Logo";

const steps = [
  {
    title: "Choose the experience",
    body: "Start from a template or craft a custom flow that fits your audience.",
  },
  {
    title: "Add ticketing rules",
    body: "Define capacity, tiers, and pricing with instant guardrails.",
  },
  {
    title: "Invite your team",
    body: "Assign owners to programming, ops, and guest communications.",
  },
];

export default function CreateEventPage() {
  const [category, setCategory] = useState("Online");
  const isPhysical = category === "Physical";

  const [paymentType, setPaymentType] = useState("Unpaid");
  const isPaid = paymentType === "Paid";

  const [hasLimit, setHasLimit] = useState(false);
  const [capacity, setCapacity] = useState("");
  const [waitlistEnabled, setWaitlistEnabled] = useState(false);

  return (
    <div className="flex flex-1 items-center justify-center bg-linear-to-br from-[#f7efe2] via-white to-[#e5f4ff]">
      <main className="flex w-full max-w-5xl flex-col gap-10 px-8 py-20 sm:px-14">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/60">
              EventX
            </p>
            <p className="text-lg font-semibold tracking-wide text-black">
              Create a new event
            </p>
          </div>
        </div>

        <form className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
          <section className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.3)] backdrop-blur sm:p-8">
            <div className="flex flex-col gap-3">
              <div className="relative w-fit">
                <select
                  name="isPublic"
                  defaultValue="true"
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white pl-4 pr-8 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black outline-none cursor-pointer appearance-none"
                >
                  <option value="true">Public Event</option>
                  <option value="false">Private Event</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-black/60">
                  ▼
                </span>
              </div>
              <h1 className="text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl">
                Shape the next experience.
              </h1>
              <p className="text-sm leading-6 text-black/70">
                Capture the essentials now and refine sessions, speakers, and ticketing later.
              </p>
            </div>

            <div className="mt-8 grid gap-5">
              <label className="grid gap-2 text-sm font-semibold text-black">
                Event name
                <input
                  type="text"
                  name="eventName"
                  autoComplete="off"
                  placeholder="Signal Summit 2026"
                  className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-black">
                Event summary
                <textarea
                  name="summary"
                  rows={4}
                  placeholder="Describe the audience, goals, and main outcomes."
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-base text-black outline-none transition focus:border-black/40"
                />
              </label>
              <div className={`flex flex-col sm:flex-row w-full overflow-hidden transition-all duration-500 ${isPhysical ? "gap-4" : "gap-0"}`}>
                <div className={`transition-all duration-500 ease-in-out ${isPhysical ? "sm:w-1/2 w-full" : "w-full"}`}>
                  <label className="grid gap-2 text-sm font-semibold text-black">
                    Category
                    <select
                      name="eventType"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40 w-full"
                    >
                      <option value="Online">Online</option>
                      <option value="Physical">Physical</option>
                    </select>
                  </label>
                </div>

                <div
                  className={`transition-all duration-500 ease-in-out ${isPhysical
                    ? "sm:w-1/2 w-full max-h-24 opacity-100 scale-100"
                    : "sm:w-0 w-full max-h-0 opacity-0 overflow-hidden scale-95 pointer-events-none"
                    }`}
                >
                  <label className="grid gap-2 text-sm font-semibold text-black">
                    Location
                    <input
                      type="text"
                      name="location"
                      autoComplete="off"
                      placeholder="Brooklyn Navy Yard"
                      className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40 w-full"
                    />
                  </label>
                </div>
              </div>

              <div className={`flex flex-col sm:flex-row w-full overflow-hidden transition-all duration-500 ${isPaid ? "gap-4" : "gap-0"}`}>
                <div className={`transition-all duration-500 ease-in-out ${isPaid ? "sm:w-1/2 w-full" : "w-full"}`}>
                  <label className="grid gap-2 text-sm font-semibold text-black">
                    Payment type
                    <select
                      name="paymentType"
                      value={paymentType}
                      onChange={(e) => setPaymentType(e.target.value)}
                      className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40 w-full"
                    >
                      <option value="Unpaid">Free</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </label>
                </div>

                <div
                  className={`transition-all duration-500 ease-in-out ${isPaid
                    ? "sm:w-1/2 w-full max-h-24 opacity-100 scale-100"
                    : "sm:w-0 w-full max-h-0 opacity-0 overflow-hidden scale-95 pointer-events-none"
                    }`}
                >
                  <label className="grid gap-2 text-sm font-semibold text-black">
                    Ticket price ($)
                    <input
                      type="number"
                      name="ticketPrice"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40 w-full"
                    />
                  </label>
                </div>
              </div>
              <label className="grid gap-2 text-sm font-semibold text-black">
                Start
                <input
                  type="datetime-local"
                  name="startDate"
                  className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-black">
                End
                <input
                  type="datetime-local"
                  name="endDate"
                  className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-black">
                Registration deadline
                <input
                  type="datetime-local"
                  name="registrationDeadline"
                  className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
                />
              </label>

              <div className="relative w-full overflow-hidden transition-all duration-500">
                {/* Unlimited Mode */}
                <div
                  className={`h-12 flex items-center justify-between rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-black transition-all duration-500 ease-in-out ${!hasLimit
                    ? "opacity-100 max-h-12"
                    : "opacity-0 max-h-0 overflow-hidden pointer-events-none"
                    }`}
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] text-black/50 uppercase tracking-wider leading-none">Estimated capacity</span>
                    <span className="text-base font-semibold mt-1">Unlimited</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHasLimit(true)}
                    className="text-xs font-semibold uppercase tracking-wider text-black/60 hover:text-black transition underline underline-offset-4"
                  >
                    Limit Capacity
                  </button>
                </div>

                {/* Limit Mode (Capacity + Waitlist) */}
                <div
                  className={`flex flex-col sm:flex-row gap-4 w-full overflow-hidden transition-all duration-500 ease-in-out ${hasLimit
                    ? "opacity-100 max-h-40 sm:max-h-24"
                    : "opacity-0 max-h-0 overflow-hidden pointer-events-none"
                    }`}
                >
                  <div className="flex-1">
                    <label className="grid gap-2 text-sm font-semibold text-black">
                      <div className="flex justify-between items-center">
                        <span className="truncate">Estimated capacity</span>
                        <button
                          type="button"
                          onClick={() => {
                            setHasLimit(false);
                            setCapacity("");
                            setWaitlistEnabled(false);
                          }}
                          className="text-[10px] uppercase tracking-wider text-black/40 hover:text-black/60 transition underline shrink-0 ml-2"
                        >
                          Unlimited
                        </button>
                      </div>
                      <input
                        type="number"
                        name="capacity"
                        min={1}
                        placeholder="350"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40 w-full"
                      />
                    </label>
                  </div>

                  <div className="sm:w-1/2 w-full">
                    <label className="grid gap-2 text-sm font-semibold text-black">
                      <span className="flex items-center">Waitlist</span>
                      <div className="flex items-center gap-3 h-12 rounded-2xl border border-black/10 bg-white px-4 cursor-pointer select-none transition hover:bg-black/5">
                        <input
                          type="checkbox"
                          name="waitlistEnabled"
                          checked={waitlistEnabled}
                          onChange={(e) => setWaitlistEnabled(e.target.checked)}
                          className="h-5 w-5 rounded border-black/10 accent-black cursor-pointer"
                        />
                        <div className="grid">
                          <span className="text-sm font-semibold text-black">Enable Waitlist</span>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 flex h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
              >
                Save event draft
              </button>
              <p className="text-xs text-black/60">
                You can finalize ticketing and publish when the details are ready.
              </p>
            </div>
          </section>

          <section className="grid gap-4">
            <div className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.3)] backdrop-blur sm:p-8 flex flex-col gap-3">
              <span className="text-sm font-semibold text-black">Event cover</span>
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-black/10 bg-white p-6 transition hover:border-black/30 cursor-pointer relative min-h-24">
                <input
                  type="file"
                  name="cover"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <span className="text-sm text-black/60 text-center">Click or drag image to upload</span>
                <span className="text-xs text-black/40 mt-1 text-center">PNG, JPG, or WEBP up to 5MB</span>
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-black px-6 py-8 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                Next up
              </p>
              <p className="mt-2 text-2xl font-semibold">
                Draft the agenda and speaker flow.
              </p>
              <p className="mt-3 text-sm text-white/70">
                EventX will guide you through tracks, sessions, and speaker confirmations.
              </p>
            </div>
            <div className="grid gap-4 rounded-3xl border border-black/10 bg-white/80 p-6">
              {steps.map((step) => (
                <div key={step.title} className="border-b border-black/10 pb-4 last:border-b-0 last:pb-0">
                  <h2 className="text-base font-semibold text-black">{step.title}</h2>
                  <p className="mt-1 text-sm text-black/60">{step.body}</p>
                </div>
              ))}
            </div>
          </section>
        </form>
      </main>
    </div>
  );
}
