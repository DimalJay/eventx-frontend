'use client';
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getEventById } from "@/service/eventService";

const activity = [
  { title: "Registration email approved", meta: "2 hours ago · Comms" },
  { title: "New sponsor deck uploaded", meta: "Yesterday · Marketing" },
  { title: "Venue walkthrough scheduled", meta: "Mon · Ops" },
];

export default function EventManageOverviewPage() {
  const params = useParams();
  const eventId = params.id as string;

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) return null;
      const res = await getEventById(eventId);
      return res.data;
    },
    enabled: !!eventId,
  });

  if (isLoading) {
    return <div className="p-8 text-center text-black/50">Loading event details...</div>;
  }

  if (!event) {
    return <div className="p-8 text-center text-red-500">Failed to load event details.</div>;
  }

  const formattedDate = new Date(event.startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const formattedTime = new Date(event.startDate).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });

  const isFree = event.ticketPrice === 0;

  const stats = [
    { label: "Registrations", value: "1,284", delta: "+12% this week" }, // Still dummy as there's no attendees in backend yet
    { label: "Capacity filled", value: `${event.capacity} seats`, delta: "Total spots available" },
    { label: "Ticket Price", value: isFree ? "Free" : `$${event.ticketPrice}`, delta: isFree ? "No cost" : "Paid event" },
    { label: "Check-ins", value: "0", delta: "Opens on event day" },
  ];

  const details = [
    { label: "Date", value: formattedDate },
    { label: "Time", value: formattedTime },
    { label: "Location", value: event.location || "TBA" },
    { label: "Visibility", value: event.isPublic ? "Public Event" : "Private Event" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
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
                Event details
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-black">
                {event.title}
              </h2>
            </div>
            <Link
              href="#"
              className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
            >
              Edit
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {details.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-black/10 bg-white px-5 py-4"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                  {item.label}
                </p>
                <p className="mt-1 font-semibold text-black">{item.value}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm leading-7 text-black/70">
            {event.description || "No description provided for this event."}
          </p>
        </div>

        <aside className="grid gap-4">
          <div className="rounded-3xl border border-black/10 bg-black p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              Next milestone
            </p>
            <p className="mt-3 text-2xl font-semibold">Finalize event agenda</p>
            <p className="mt-3 text-sm text-white/70">
              Review and finalize your event agenda items.
            </p>
            <Link
              href={`/event/manage/${eventId}/agenda`}
              className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-xs font-semibold uppercase tracking-widest text-black"
            >
              Review agenda
            </Link>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white/80 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
              Recent activity
            </p>
            <div className="mt-4 grid gap-4 text-sm text-black/70">
              {activity.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-black/5 bg-white px-4 py-3"
                >
                  <p className="font-semibold text-black">{item.title}</p>
                  <p className="mt-1 text-xs text-black/50">{item.meta}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
