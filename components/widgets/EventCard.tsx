import { IEvent } from "@/service/types";
import Link from "next/link";

export default function EventCard({ event }: { event: IEvent }) {
    return (
        <article
            className="grid gap-4 rounded-2xl border border-black/10 bg-white px-5 py-4 sm:grid-cols-[1.4fr_1fr_auto] sm:items-center"
        >
            <div>
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${event.title}`}>
                        {event.title}
                    </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-black">{event.title}</h3>
                <p className="mt-1 text-sm text-black/60 truncate">{event.location}</p>
            </div>
            <div className="flex items-center justify-between gap-6 text-sm text-black/70 sm:justify-start">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-black/40">Date</p>
                    <p className="mt-1 font-semibold text-black">
                        {new Date(event.startDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </p>
                </div>
                {event.capacity <= 10 && (
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-orange-500/80">Hurry</p>
                        <p className="mt-1 font-semibold text-orange-600">Only {event.capacity} Spots Left</p>
                    </div>
                )}
            </div>
            <div className="flex flex-col items-end gap-2 sm:items-center">
                <span className={`text-xs ${event.ticketPrice === 0 || !event.ticketPrice ? 'font-bold text-green-600' : 'text-black/50'}`}>
                    {event.ticketPrice === 0 || !event.ticketPrice ? "Free" : `$${event.ticketPrice}`}
                </span>

                <Link
                    href={"/event/manage/" + event.id}
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
                >
                    View details
                </Link>
            </div>
        </article>)
}