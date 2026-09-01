"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MapPin, CalendarDays } from "lucide-react";
import { IEvent } from "@/types";
import { formatPrice, encodeEventId } from "@/lib/utils";

type UpcomingEventsProps = {
  events: IEvent[];
  isLoading: boolean;
};

function eventImage(event: IEvent): string | null {
  const rawImg =
    (event as IEvent & { coverImage?: string }).coverImage || event.imageUrl;

  if (!rawImg || rawImg === "null" || rawImg === "undefined" || rawImg.trim() === "") {
    return null;
  }

  if (rawImg.startsWith("http")) {
    return rawImg;
  }

  const backendBase = (process.env.NEXT_PUBLIC_EVENTX_BACKEND_URL || "").replace(
    "/api/v1",
    ""
  );
  return `${backendBase}${rawImg.startsWith("/") ? "" : "/"}${rawImg}`;
}

function placeholderImage(title: string): string {
  const seed = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `https://picsum.photos/seed/eventx-${seed}/720/400`;
}

export default function UpcomingEvents({ events, isLoading }: UpcomingEventsProps) {
  const reduce = useReducedMotion();
  const reveal = {
    initial: reduce ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <section id="events" className="scroll-mt-24 bg-zinc-50/70">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:py-28">
        <motion.div {...reveal} className="max-w-2xl">
          <h2 className="font-display text-4xl font-medium tracking-tight text-zinc-900 md:text-5xl">
            Coming up on campus.
          </h2>
          <p className="mt-5 max-w-[58ch] text-lg leading-8 text-zinc-600">
            Organizers are already taking signups. Grab a spot while it lasts.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((n) => (
              <div
                key={n}
                className="overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200/70"
              >
                <div className="h-44 animate-pulse bg-zinc-100" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-100" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-100" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-100" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, idx) => {
              const formattedDate = new Date(event.startDate).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric", year: "numeric" }
              );
              const image = eventImage(event) || placeholderImage(event.title);

              return (
                <motion.div
                  key={event.id}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: idx * 0.06 }}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200/70 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-900/5"
                >
                  <div className="relative h-44 overflow-hidden bg-zinc-100">
                    <img
                      src={image}
                      alt={event.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-zinc-900">
                      {event.title}
                    </h3>

                    <div className="mt-3 flex flex-col gap-1.5 text-sm text-zinc-500">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-zinc-400" strokeWidth={1.75} />
                        {formattedDate}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-zinc-400" strokeWidth={1.75} />
                        {event.location || "Online"}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4">
                      <span className="text-sm font-semibold text-primary">
                        {event.ticketPrice === 0
                          ? "Free entry"
                          : formatPrice(event.ticketPrice)}
                      </span>
                      <Link
                        href={`/event/${encodeEventId(event.id)}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-700 transition hover:text-primary"
                      >
                        View details
                        <ArrowRight
                          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                          strokeWidth={1.75}
                        />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border border-dashed border-zinc-300 py-16 text-center">
            <p className="text-sm text-zinc-500">
              No upcoming campus events at the moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}