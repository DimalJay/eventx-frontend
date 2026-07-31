import { IEvent } from "@/types";
import { CalendarCheck, MapPin } from "lucide-react";
import Link from "next/link";


export default function EventCard({ event }: { event: IEvent }) {
  const formattedDate = new Date(event.startDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const isFree = event.ticketPrice === 0;
  const lowCapacity = event.capacity > 0 && event.capacity <= 10;

  return (
    <article className="rounded-3xl border border-black/10 bg-white/90 p-5 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.35)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_22px_60px_-35px_rgba(0,0,0,0.4)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-[#f5f1ea] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/70">
              Event
            </span>
            {lowCapacity && (
              <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-700">
                {event.capacity} spots left
              </span>
            )}
          </div>

          <h3 className="mt-3 text-lg font-semibold text-black">
            {event.title}
          </h3>

          <div className="mt-3 space-y-2 text-sm text-black/70">
            <p className="flex items-center gap-2">
              <span className="text-black/50"><MapPin size={18}/></span>
              <span className="truncate">{event.location}</span>
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
              Starting from
            </p>
            <p
              className={`mt-1 text-xl font-semibold ${
                isFree ? "text-emerald-600" : "text-black"
              }`}
            >
              {isFree ? "Free" : `$${event.ticketPrice}`}
            </p>
          </div>

          <Link
            href={`/event/manage/${event.id}`}
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/90"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}