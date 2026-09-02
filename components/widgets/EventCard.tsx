import { IEvent } from "@/types";
import { CalendarCheck, MapPin, Video } from "lucide-react";
import Link from "next/link";
import { formatPrice, encodeEventId } from "@/lib/utils";

interface EventCardProps {
  event: IEvent;
  variant?: "horizontal" | "vertical";
}

export default function EventCard({ event, variant = "horizontal" }: EventCardProps) {
  const formattedDate = new Date(event.startDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const isFree = event.ticketPrice === 0;
  const lowCapacity = event.capacity > 0 && event.capacity <= 10;
  const isPast = event.startDate ? new Date(event.startDate) < new Date() : false;
  const isOnline = event.eventType === "online" || (!!event.location && /^(https?:\/\/|zoom\.us|meet\.google|teams\.microsoft)/i.test(event.location));

  if (variant === "vertical") {
    return (
      <article className={`flex flex-col justify-between rounded-3xl border border-black/10 bg-white/90 p-5 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.35)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_22px_60px_-35px_rgba(0,0,0,0.4)] h-full ${isPast ? "opacity-75 hover:opacity-90" : ""}`}>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {isPast ? (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-600">
                Ended
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Upcoming
              </span>
            )}
            {lowCapacity && !isPast && (
              <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-700">
                {event.capacity} left
              </span>
            )}
          </div>

          <h3 className="mt-4 text-base font-semibold text-black line-clamp-2 min-h-[3rem]">
            {event.title}
          </h3>

          <div className="mt-3 space-y-2 text-sm text-black/70">
            <p className="flex items-center gap-2">
              <span className="text-black/50">{isOnline ? <Video size={16} /> : <MapPin size={16} />}</span>
              <span className="truncate">{isOnline ? (event.location ? "Online Event" : "Online Event") : (event.location || "TBA")}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-black/50"><CalendarCheck size={16}/></span>
              <span>{formattedDate}</span>
            </p>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-black/5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/45">
              Ticket
            </p>
            <p
              className={`mt-0.5 text-lg font-semibold ${
                isFree ? "text-emerald-600" : "text-black"
              }`}
            >
              {formatPrice(event.ticketPrice)}
            </p>
          </div>

          <Link
            href={`/event/manage/${encodeEventId(event.id)}`}
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-black/90"
          >
            View details
          </Link>
        </div>
      </article>
    );
  }

  // Horizontal variant (default) - Previous design
  return (
    <article className={`rounded-3xl border border-black/10 bg-white/90 p-5 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.35)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_22px_60px_-35px_rgba(0,0,0,0.4)] ${isPast ? "opacity-75 hover:opacity-90" : ""}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {isPast ? (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-600">
                Ended
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Upcoming
              </span>
            )}
            {lowCapacity && !isPast && (
              <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-700">
                {event.capacity} left
              </span>
            )}
          </div>

          <h3 className="mt-3 text-lg font-semibold text-black">
            {event.title}
          </h3>

          <div className="mt-3 space-y-2 text-sm text-black/70">
            <p className="flex items-center gap-2">
              <span className="text-black/50">{isOnline ? <Video size={18} /> : <MapPin size={18} />}</span>
              <span className="truncate">{isOnline ? (event.location ? "Online Event" : "Online Event") : (event.location || "TBA")}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-black/50"><CalendarCheck size={18}/></span>
              <span>{formattedDate}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <div className="text-left sm:text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/45">
              From
            </p>
            <p
              className={`mt-1 text-xl font-semibold ${
                isFree ? "text-emerald-600" : "text-black"
              }`}
            >
              {formatPrice(event.ticketPrice)}
            </p>
          </div>

          <Link
            href={`/event/manage/${encodeEventId(event.id)}`}
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/90"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}