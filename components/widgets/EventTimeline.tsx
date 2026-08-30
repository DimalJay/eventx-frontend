import { IEvent } from "@/types";
import { Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface EventTimelineProps {
  events: IEvent[];
  nodeRing?: string;
}

export default function EventTimeline({
  events,
  nodeRing = "ring-4 ring-white",
}: EventTimelineProps) {
  const sorted = [...events].sort(
    (a: IEvent, b: IEvent) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  return (
    <div className="relative">
      <div className="absolute bottom-2 left-[5.75rem] top-2 w-px bg-zinc-200 sm:left-[8.75rem]" />

      <div className="space-y-6">
        {sorted.map((event) => {
          const start = new Date(event.startDate);
          const isPast = start < new Date();
          const lowCapacity =
            event.capacity > 0 && event.capacity <= 10 && !isPast;

          const day = start.toLocaleDateString("en-US", { day: "numeric" });
          const month = start
            .toLocaleDateString("en-US", { month: "short" })
            .toUpperCase();
          const year = start.getFullYear();
          const time = start.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          });

          const isFree = event.ticketPrice === 0;

          return (
            <div
              key={event.id}
              className="grid items-start gap-x-4 gap-y-1 grid-cols-[5rem_1.5rem_1fr] sm:grid-cols-[8rem_1.5rem_1fr]"
            >
              <div className="text-right pt-1">
                <p className="text-2xl font-bold leading-none tracking-tight text-zinc-900 tabular-nums">
                  {day}
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-zinc-500 tabular-nums">
                  {month} {year}
                </p>
                <p className="mt-1 text-[11px] font-medium text-zinc-400 tabular-nums">
                  {time}
                </p>
              </div>

              <div className="flex justify-center pt-3.5">
                <span
                  className={`h-3 w-3 rounded-full ${nodeRing} ${
                    isPast ? "bg-zinc-300" : "bg-primary"
                  }`}
                />
              </div>

              <Link
                href={`/event/manage/${event.id}`}
                className={`group min-w-0 rounded-2xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary-faint/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                  isPast ? "opacity-75 hover:opacity-90" : ""
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  {isPast ? (
                    <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                      Ended
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                      Upcoming
                    </span>
                  )}
                  {lowCapacity && (
                    <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-orange-700">
                      {event.capacity} left
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-lg font-semibold tracking-tight text-zinc-900">
                  {event.title}
                </h3>

                <div className="mt-3 space-y-1.5 text-sm text-zinc-600">
                  <p className="flex items-center gap-2">
                    <span className="text-zinc-400">
                      <MapPin size={15} />
                    </span>
                    <span className="truncate">{event.location}</span>
                  </p>
                  <p className="flex items-center gap-2 text-zinc-600 tabular-nums">
                    <span className="text-zinc-400">
                      <Clock size={15} />
                    </span>
                    {time}
                    {event.endDate && (
                      <>
                        <span className="text-zinc-400">to</span>
                        {new Date(event.endDate).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </>
                    )}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                      Ticket
                    </p>
                    <p
                      className={`mt-0.5 text-lg font-semibold tabular-nums ${
                        isFree ? "text-emerald-600" : "text-zinc-900"
                      }`}
                    >
                      {formatPrice(event.ticketPrice)}
                    </p>
                  </div>
                  <span className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-primary-strong">
                    View details
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-0.5">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}