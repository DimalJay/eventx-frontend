"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  Clock,
  Compass,
  MapPin,
  Sparkles,
  Ticket,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { getMyEvents } from "@/service/eventService";
import { IEvent } from "@/types";
import { cn, encodeEventId, formatPrice } from "@/lib/utils";
import ShaderBackground from "../landing/ShaderBackground";
import { EventHistoryLoadingSkeleton } from "../skeleton/EventHistoryLoadingSkeleton";

type Filter = "upcoming" | "past" | "all";

type JoinedEvent = IEvent & {
  registeredAt?: string;
  registrationStatus?: string;
  ticketCode?: string;
};

function isUpcoming(event: IEvent): boolean {
  if (!event.startDate) return false;
  return new Date(event.startDate).getTime() > Date.now();
}

function isLive(event: IEvent): boolean {
  if (!event.startDate) return false;
  const start = new Date(event.startDate).getTime();
  const end = event.endDate ? new Date(event.endDate).getTime() : start;
  return Date.now() >= start && Date.now() <= end;
}

function formatDateRange(event: IEvent): string {
  const start = new Date(event.startDate);
  const end = event.endDate ? new Date(event.endDate) : null;
  const startLine = start.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const startTime = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  if (!end || end.getTime() === start.getTime()) {
    return `${startLine} · ${startTime}`;
  }
  const sameDay =
    end.toDateString() === start.toDateString();
  const endTime = end.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const endLine = sameDay
    ? endTime
    : end.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
  return `${startLine} · ${startTime} – ${endLine}`;
}

export default function EventHistoryPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<Filter>("upcoming");

  const { data: events = [], isLoading, isError } = useQuery({
    queryKey: ["my-events"],
    queryFn: async () => {
      const response = await getMyEvents();
      return (response.data || []) as JoinedEvent[];
    },
    retry: false,
  });

  const sorted = useMemo(() => {
    return [...events].sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
  }, [events]);

  const stats = useMemo(() => {
    const upcoming = events.filter(isUpcoming).length;
    const attended = events.filter((e) => !isUpcoming(e)).length;
    const joined = events.length;
    return { joined, upcoming, attended };
  }, [events]);

  const filtered = sorted.filter((event) => {
    if (filter === "upcoming" || filter === "past") {
      return isUpcoming(event) === (filter === "upcoming");
    }
    return true;
  });

  if (isLoading) {
    return <EventHistoryLoadingSkeleton />;
  }

  return (
    <div className="relative flex flex-1 justify-center overflow-hidden bg-white">
      <ShaderBackground />
      <main className="relative z-10 flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:py-20">
        {/* Header */}
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              My events
            </p>
            <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-zinc-900 sm:text-4xl">
              Event history
            </h1>
            {user && (
              <p className="mt-2 text-sm text-zinc-600">
                Every event {user.firstName} {user.lastName} has joined.
              </p>
            )}
          </div>

          <Link
            href="/discover-events"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:border-primary/50 hover:text-primary"
          >
            <Compass className="h-4 w-4" strokeWidth={1.8} />
            Discover more events
          </Link>
        </header>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-3">
          <HistoryStat
            label="Joined"
            value={stats.joined.toLocaleString()}
            icon={<CalendarDays className="h-4 w-4" />}
          />
          <HistoryStat
            label="Upcoming"
            value={stats.upcoming.toLocaleString()}
            icon={<Sparkles className="h-4 w-4" />}
          />
          <HistoryStat
            label="Attended"
            value={stats.attended.toLocaleString()}
            icon={<Ticket className="h-4 w-4" />}
          />
        </section>

        {isError ? (
          <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-16 text-center">
            <p className="text-sm text-danger">Failed to load your events.</p>
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            onDiscover={
              <Link
                href="/discover-events"
                className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-strong active:scale-[0.98]"
              >
                Browse events
              </Link>
            }
          />
        ) : (
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-xl font-medium tracking-tight text-zinc-900">
                {filter === "upcoming"
                  ? "Upcoming events"
                  : filter === "past"
                  ? "Past events"
                  : "All joined events"}
              </h2>
              <div className="flex w-fit gap-1 rounded-full border border-zinc-200 bg-white p-1">
                {(["upcoming", "past", "all"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFilter(type)}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-all",
                      filter === type
                        ? "bg-primary text-white"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filtered.map((event) => (
                  <EventHistoryCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-12 text-center">
                {filter === "upcoming" ? (
                  <>
                    <p className="text-sm font-medium text-zinc-500">
                      No upcoming events.
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
                      Join a public event and it will show up here.
                    </p>
                  </>
                ) : (
                  <p className="text-sm font-medium text-zinc-500">
                    No {filter} events found.
                  </p>
                )}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

function EventHistoryCard({ event }: { event: JoinedEvent }) {
  const upcoming = isUpcoming(event);
  const live = isLive(event);
  const isFree = Number(event.ticketPrice) === 0;
  const location = event.location?.trim();
  const online = event.eventType === "online" && !location;
  const joinedAt = event.registeredAt
    ? new Date(event.registeredAt.replace(" ", "T")).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="group flex min-w-0 flex-col rounded-2xl border border-zinc-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card">
      <div className="flex flex-wrap items-center gap-2">
        {live ? (
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
            <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600" />
            Live now
          </span>
        ) : upcoming ? (
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Upcoming
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
            Ended
          </span>
        )}
        {event.category && (
          <span className="inline-flex items-center rounded-full bg-primary-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            {event.category}
          </span>
        )}
      </div>

      <Link
        href={`/event/${encodeEventId(event.id)}`}
        className="mt-4 font-display text-lg font-medium tracking-tight text-zinc-900 transition group-hover:text-primary"
      >
        {event.title}
      </Link>

      <div className="mt-3 space-y-1.5 text-sm text-zinc-600">
        <p className="flex items-center gap-2 tabular-nums">
          <CalendarDays className="h-4 w-4 shrink-0 text-zinc-400" />
          {formatDateRange(event)}
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-zinc-400" />
          <span className="truncate">
            {online ? "Online event" : location || "Location TBA"}
          </span>
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-zinc-200 pt-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
            Ticket
          </p>
          <p
            className={cn(
              "mt-0.5 text-lg font-semibold tabular-nums",
              isFree ? "text-emerald-600" : "text-zinc-900"
            )}
          >
            {formatPrice(event.ticketPrice)}
          </p>
        </div>
        <span className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
          View event
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="ml-2 h-3 w-3"
          >
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-100 pt-3.5">
        <p className="text-xs text-zinc-400">
          {joinedAt ? `Joined ${joinedAt}` : "Joined"}
          {event.registrationStatus ? (
            <>
              <span className="text-zinc-300"> · </span>
              <span className="capitalize">{event.registrationStatus.toLowerCase()}</span>
            </>
          ) : null}
        </p>
        {event.ticketCode && (
          <Link
            href={`/ticket/${encodeURIComponent(event.ticketCode)}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition hover:text-primary-strong"
          >
            <Ticket className="h-3.5 w-3.5" />
            View ticket
          </Link>
        )}
      </div>
    </div>
  );
}

function HistoryStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
          {label}
        </p>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary">
          {icon}
        </span>
      </div>
      <p className="mt-4 text-3xl font-semibold tabular-nums text-zinc-900">
        {value}
      </p>
    </div>
  );
}

function EmptyState({
  onDiscover,
}: {
  onDiscover: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-zinc-200 bg-white px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
        <Clock className="h-6 w-6" />
      </span>
      <h2 className="mt-4 font-display text-xl font-medium tracking-tight text-zinc-900">
        No events joined yet
      </h2>
      <p className="mt-1.5 max-w-sm text-sm text-zinc-500">
        Join a public event and it will appear here as your event history.
      </p>
      {onDiscover}
    </div>
  );
}