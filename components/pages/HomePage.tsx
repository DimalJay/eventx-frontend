'use client'
import { useAuth } from "../auth/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/service/eventService";
import { IEvent } from "@/types";
import EventTimeline from "../widgets/EventTimeline";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, MapPin, Settings } from "lucide-react";
import ShaderBackground from "../landing/ShaderBackground";
import { getTasksRequest } from "@/service/taskService";
import { getEventRegistrations } from "@/service/registrationService";
import { formatPrice, encodeEventId } from "@/lib/utils";




export default function HomePage() {
  const { user } = useAuth();
  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      try {
        const response = await getEvents();
        return response.data;
      } catch {
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
  const subsequentEvents = upcomingEvents.slice(1, 5);

  const [now, setNow] = useState(() => Date.now());
  const [eventFilter, setEventFilter] = useState<'all' | 'upcoming' | 'ended'>('upcoming');

  useEffect(() => {
    if (!nextEvent) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [nextEvent]);

  const timeLeft = nextEvent
    ? (() => {
      const difference = new Date(nextEvent.startDate).getTime() - now;
      if (difference <= 0) return null;
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    })()
    : null;

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks', nextEvent?.id],
    queryFn: async () => {
      if (!nextEvent?.id) return [];
      const response = await getTasksRequest({ eventId: String(nextEvent.id) });
      return response.data;
    },
    enabled: !!nextEvent?.id,
  });

  const { data: registrations = [] } = useQuery({
    queryKey: ['registrations', nextEvent?.id],
    queryFn: async () => {
      if (!nextEvent?.id) return [];
      const response = await getEventRegistrations({ data: { eventId: String(nextEvent.id) } });
      return response.data || [];
    },
    enabled: !!nextEvent?.id,
  });

  const highlights = [
    {
      label: "Registrations",
      value: nextEvent ? String(registrations.length) : "0",
      delta: nextEvent ? `For: ${nextEvent.title}` : "No active registrations",
    },
    {
      label: "Events in flight",
      value: String(events.length),
      delta: `${events.filter((e: IEvent) => !e.isPublic).length} in build mode`,
    },
    {
      label: "Team tasks",
      value: String(tasks.length),
      delta: nextEvent ? `For: ${nextEvent.title}` : "No upcoming tasks",
    },
  ];

  const featuredDate = nextEvent ? new Date(nextEvent.startDate) : null;
  const featuredTime = featuredDate?.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const featuredEndTime = nextEvent?.endDate
    ? new Date(nextEvent.endDate).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : null;
  const featuredIsFree = nextEvent ? nextEvent.ticketPrice === 0 : false;
  const featuredDateLine = featuredDate?.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const countValue = (value: number) => String(Math.max(0, value)).padStart(2, "0");

  const filteredEvents = events.filter((event: IEvent) => {
    const isPast = event.startDate
      ? new Date(event.startDate) < new Date()
      : false;
    if (eventFilter === "upcoming") return !isPast;
    if (eventFilter === "ended") return isPast;
    return true;
  });


  return (
    <div className="relative flex flex-1 justify-center overflow-hidden bg-white">
      <ShaderBackground />
      <main className="relative z-10 flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:py-20">
        <header className="flex flex-col">
          <div className="flex items-center gap-3 flex-row justify-between">
            <div className="flex flex-col">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                EventX workspace
              </p>
              <p className="mt-2 font-display text-3xl font-medium tracking-tight text-zinc-900">
                Welcome back, {user?.firstName}.
              </p>


            </div>
            <Link
              href="/settings"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:border-primary/50 hover:text-primary"
            >
              <Settings size={16} />
              Settings
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-zinc-200 bg-white p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                {item.label}
              </p>
              <p className="mt-4 text-3xl font-semibold text-zinc-900">{item.value}</p>
              <p className="mt-2 text-sm text-zinc-600">{item.delta}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-7 sm:p-9">
          {nextEvent ? (
            <>
              <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    Up next
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-zinc-900 sm:text-3xl">
                    {nextEvent.title}
                  </h2>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-zinc-600">
                    <span className="tabular-nums">
                      {featuredDateLine}
                    </span>
                    <span className="inline-flex min-w-0 items-center gap-1.5">
                      <MapPin size={15} className="shrink-0 text-zinc-400" />
                      <span className="truncate">{nextEvent.location}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 tabular-nums">
                      <Clock size={15} className="shrink-0 text-zinc-400" />
                      {featuredTime}
                      {nextEvent.endDate && featuredEndTime && (
                        <span className="text-zinc-400">to {featuredEndTime}</span>
                      )}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-5">
                    <span className={`text-xl font-semibold tabular-nums ${featuredIsFree ? "text-emerald-600" : "text-zinc-900"}`}>
                      {formatPrice(nextEvent.ticketPrice)}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                      Upcoming
                    </span>
                  </div>
                </div>

                <div className="shrink-0 border-t border-zinc-200 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    Starts in
                  </p>

                  {timeLeft ? (
                    <div className="mt-4 flex divide-x divide-zinc-200">
                      {[
                        { value: countValue(timeLeft.days), label: "Days" },
                        { value: countValue(timeLeft.hours), label: "Hours" },
                        { value: countValue(timeLeft.minutes), label: "Mins" },
                        { value: countValue(timeLeft.seconds), label: "Secs" },
                      ].map((part) => (
                        <div key={part.label} className="min-w-0 px-4 first:pl-0 last:pr-0">
                          <p className="text-3xl font-semibold leading-none tracking-tight text-zinc-900 tabular-nums">
                            {part.value}
                          </p>
                          <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                            {part.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm font-semibold text-emerald-600">
                      Starting now
                    </p>
                  )}

                  <Link
                    href={`/event/manage/${encodeEventId(nextEvent.id)}`}
                    className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-strong active:scale-[0.98]"
                  >
                    Manage event
                  </Link>
                </div>
              </div>

              {subsequentEvents.length > 0 && (
                <div className="mt-8 border-t border-zinc-200 pt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    Also coming up
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {subsequentEvents.map((ev: IEvent) => (
                      <Link
                        href={`/event/manage/${encodeEventId(ev.id)}`}
                        key={ev.id}
                        className="group flex min-w-0 flex-col gap-1 rounded-2xl border border-zinc-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary-faint/60"
                      >
                        <p className="truncate text-sm font-semibold text-zinc-900 group-hover:underline underline-offset-2">
                          {ev.title}
                        </p>
                        <p className="truncate text-[11px] text-zinc-500 tabular-nums">
                          {new Date(ev.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                          <span className="text-zinc-400"> · </span>
                          {ev.location}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-start gap-5">
              <p className="text-sm font-medium text-zinc-500">
                No upcoming events yet. Create one to get started.
              </p>
              <Link
                href="/event/create"
                className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-strong active:scale-[0.98]"
              >
                Create event
              </Link>
            </div>
          )}
        </section>

        <section className="mt-6">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Workspace Events
                </p>
                <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-zinc-900">
                  All events in your workspace
                </h2>
              </div>

              <div className="flex w-fit gap-1 rounded-full border border-zinc-200 bg-white p-1">
                {(["upcoming", "ended"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setEventFilter(type)}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-all ${
                      eventFilter === type
                        ? "bg-primary text-white"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {filteredEvents.length > 0 ? (
              <EventTimeline events={filteredEvents} />
            ) : (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-12 text-center">
                <p className="text-sm font-medium text-zinc-500">
                  No {eventFilter} events found.
                </p>
              </div>
            )}
          </section>
      </main>
    </div>
  );
}
