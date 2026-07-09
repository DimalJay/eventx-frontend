'use client'
import { useAuth } from "../auth/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/service/eventService";
import { IEvent } from "@/service/types";
import EventCard from "../widgets/EventCard";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Trophy, Users } from "lucide-react";

const highlights = [
  {
    label: "Registrations",
    value: "1,284",
    delta: "+12% this week",
  },
  {
    label: "Events in flight",
    value: "7",
    delta: "3 in build mode",
  },
  {
    label: "Team tasks",
    value: "14",
    delta: "5 due today",
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const { data: events = [], isLoading, isError } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      try {
        const response = await getEvents();
        return response.data;
      } catch (error) {
        return null;
      }
    },
    retry: false,
  })

  const upcomingEvents = events
    ? [...events]
      .filter((e: IEvent) => e.startDate && new Date(e.startDate) > new Date())
      .sort((a: IEvent, b: IEvent) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    : [];

  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;
  const subsequentEvents = upcomingEvents.slice(1, 3);

  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    if (!nextEvent) {
      setTimeLeft(null);
      return;
    }

    const calculateTime = () => {
      const difference = new Date(nextEvent.startDate).getTime() - new Date().getTime();
      if (difference <= 0) return null;
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTime());
    const interval = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [nextEvent]);

  return (
    <div className="relative flex flex-1 justify-center overflow-hidden bg-[#f5f1ea]">
      <div className="pointer-events-none absolute -left-28 top-12 h-56 w-56 rounded-full bg-[#ffc9a7] opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-24 h-64 w-64 rounded-full bg-[#9fd3ff] opacity-35 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#ffe8a3] opacity-45 blur-3xl" />

      <main className="relative flex w-full max-w-6xl flex-col gap-10 px-8 py-16 sm:px-12">
        <header className="flex flex-col">
          <div className="flex items-center gap-3 flex-row justify-between">
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/50">
                EventX workspace
              </p>
              <p className="text-2xl font-semibold tracking-tight text-black">
                Welcome back, {user?.firstName}.
              </p>


            </div>

          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.35)] backdrop-blur"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                {item.label}
              </p>
              <p className="mt-4 text-3xl font-semibold text-black">{item.value}</p>
              <p className="mt-2 text-sm text-black/60">{item.delta}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-3xl border border-black/10 bg-white/85 p-7 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.35)] backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                  Recently created events
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-black">
                  Fresh builds from your team
                </h2>
              </div>
              <button
                type="button"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-black/60 transition hover:text-black"
              >
                View all
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              {events.map((event: IEvent) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>

          <aside className="grid gap-4">

            {/* 1. Next Upcoming Event & Countdown */}
            <div className="rounded-3xl border border-black/10 bg-black p-6 text-white shadow-[0_20px_50px_-30px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                <Clock size={14} className="text-orange-400 animate-pulse" />
                <span>Next Upcoming Event</span>
              </div>

              {nextEvent ? (
                <>
                  <p className="mt-3 text-2xl font-semibold tracking-tight">{nextEvent.title}</p>
                  <p className="text-xs text-white/50 mt-1">
                    {new Date(nextEvent.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })} · {nextEvent.location}
                  </p>

                  {timeLeft ? (
                    <div className="mt-5 grid grid-cols-4 gap-2 text-center">
                      <div className="rounded-2xl bg-white/10 p-2 backdrop-blur-sm">
                        <span className="block text-lg font-bold">{timeLeft.days}</span>
                        <span className="text-[10px] uppercase tracking-wider text-white/40">Days</span>
                      </div>
                      <div className="rounded-2xl bg-white/10 p-2 backdrop-blur-sm">
                        <span className="block text-lg font-bold">{timeLeft.hours}</span>
                        <span className="text-[10px] uppercase tracking-wider text-white/40">Hrs</span>
                      </div>
                      <div className="rounded-2xl bg-white/10 p-2 backdrop-blur-sm">
                        <span className="block text-lg font-bold">{timeLeft.minutes}</span>
                        <span className="text-[10px] uppercase tracking-wider text-white/40">Mins</span>
                      </div>
                      <div className="rounded-2xl bg-white/10 p-2 backdrop-blur-sm">
                        <span className="block text-lg font-bold">{timeLeft.seconds}</span>
                        <span className="text-[10px] uppercase tracking-wider text-white/40">Secs</span>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-emerald-400 font-semibold">Event is happening now!</p>
                  )}

                  {subsequentEvents.length > 0 && (
                    <div className="mt-5 border-t border-white/10 pt-4">
                      <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/40">Also coming up</p>
                      <div className="grid gap-2">
                        {subsequentEvents.map((ev: IEvent) => (
                          <Link
                            href={`/event/manage/${ev.id}`}
                            key={ev.id}
                            className="group flex flex-col rounded-xl bg-white/5 px-3 py-2.5 transition hover:bg-white/10"
                          >
                            <p className="text-sm font-semibold truncate group-hover:text-emerald-400 transition-colors">
                              {ev.title}
                            </p>
                            <p className="text-[11px] text-white/50 mt-0.5 truncate">
                              {new Date(ev.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {ev.location}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/event/manage/${nextEvent.id}`}
                    className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-full bg-white px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-white/90"
                  >
                    Manage Event
                  </Link>
                </>
              ) : (
                <>
                  <p className="mt-3 text-xl font-semibold text-white/95">No upcoming events</p>
                  <p className="mt-2 text-sm text-white/60">
                    Get started by creating your next event and setting up its agenda.
                  </p>
                </>
              )}
            </div>

            {/* 2. Lifetime Stats / Workspace Impact */}
            <div className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.35)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                Workspace Impact
              </p>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/5 text-black">
                    <Trophy size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-black/50">Total Events Hosted</p>
                    <p className="text-lg font-semibold text-black">{events?.length || 0}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/5 text-black">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-black/50">Total Attendees Reached</p>
                    <p className="text-lg font-semibold text-black">12,840</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Team Activity */}
            <div className="rounded-3xl border border-black/10 bg-white/80 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                Team Activity
              </p>
              <div className="mt-4 grid gap-3 text-sm text-black/70">
                <div className="rounded-2xl border border-black/5 bg-white px-4 py-2.5">
                  <p className="font-semibold text-black">New sponsor deck uploaded</p>
                  <p className="mt-0.5 text-xs text-black/50">2 hours ago · Marketing</p>
                </div>
                <div className="rounded-2xl border border-black/5 bg-white px-4 py-2.5">
                  <p className="font-semibold text-black">Registration email approved</p>
                  <p className="mt-0.5 text-xs text-black/50">Yesterday · Comms</p>
                </div>
              </div>
            </div>

          </aside>
        </section>
      </main>
    </div>
  );
}
