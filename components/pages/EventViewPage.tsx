"use client";

import Link from "next/link";
import AddToCalendar from "../widgets/AddToCalendar";
import { useQuery } from "@tanstack/react-query";
import { getEventById } from "@/service/eventService";
import { toast } from "sonner";

const highlights = [
  { label: "Attending", value: "540" },
  { label: "Sessions", value: "18" },
  { label: "Speakers", value: "24" },
];

const included = [
  "Access to all sessions & keynotes",
  "Hands-on workshops",
  "Lunch & refreshments",
  "Networking social",
];

export default function EventViewPage({ id }: { id?: string }) {
  // Fetching data from backend using React Query
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEventById(id as string),
    enabled: !!id,
  });

  // දත්ත එනකන් Loading State එක
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7efe2]">
        <p className="text-lg font-semibold text-black/50 tracking-widest uppercase">Loading event details...</p>
      </div>
    );
  }

  // දත්ත ආවේ නැත්නම් හෝ වැරදි ID එකක් නම් පෙන්වන Error State එක
  if (isError || !response?.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7efe2]">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-500 uppercase tracking-widest mb-2">Error loading event</p>
          <p className="text-black/60">Please check if the Event ID ({id}) exists in the database.</p>
        </div>
      </div>
    );
  }

  const backendEvent = response.data;

  // Formatting Dates safely
  const startDateObj = backendEvent.startDate ? new Date(backendEvent.startDate) : new Date();
  const endDateObj = backendEvent.endDate ? new Date(backendEvent.endDate) : new Date();

  // Mapping Backend Data to Frontend Variables
  const event = {
    name: backendEvent.title || "Untitled Event",
    tagline: backendEvent.description || "No description provided.",
    status: backendEvent.isPaid || backendEvent.ticketPrice > 0 ? "Tickets live" : "Free Event",
    date: startDateObj.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }),
    time: `${startDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${endDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    start: backendEvent.startDate || startDateObj.toISOString(),
    end: backendEvent.endDate || endDateObj.toISOString(),
    timezone: "Asia/Colombo",
    venue: backendEvent.location || "TBA",
    location: backendEvent.location || "TBA",
    organizer: "EventX Studio",
    cover: (() => {
      const coverPath = backendEvent.imageUrl || backendEvent.coverImage || "";
      if (!coverPath) return "";
      // Image path එක already full URL එකක් නම් (e.g. http://...) එය කෙලින්ම යොදයි.
      if (coverPath.startsWith("http")) return coverPath;

      // NEXT_PUBLIC_EVENTX_BACKEND_URL එකෙන් '/api/v1' කොටස ඉවත් කර Base URL එක ලබා ගනී (e.g. http://localhost/eventx)
      const backendBase = (process.env.NEXT_PUBLIC_EVENTX_BACKEND_URL || "").replace("/api/v1", "");
      return `${backendBase}${coverPath}`;
    })(),
    price: backendEvent.ticketPrice && backendEvent.ticketPrice > 0 ? `$${backendEvent.ticketPrice}` : "Free",
    seatsLeft: backendEvent.capacity || 0,
    capacity: backendEvent.capacity || 0,
  };

  // Parsing Agenda (assuming backend returns it as a JSON string)
  let agenda = [];
  try {
    agenda = backendEvent.agenda && typeof backendEvent.agenda === "string" ? JSON.parse(backendEvent.agenda) : [];
    if (!Array.isArray(agenda)) agenda = [];
  } catch (e) {
    agenda = [];
  }

  return (
    <div className="relative flex flex-1 justify-center overflow-hidden bg-linear-to-br from-[#f7efe2] via-white to-[#e5f4ff]">
      <div className="pointer-events-none absolute -left-28 top-12 h-56 w-56 rounded-full bg-[#ffc9a7] opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-24 h-64 w-64 rounded-full bg-[#9fd3ff] opacity-35 blur-3xl" />

      <main className="relative flex w-full max-w-5xl flex-col gap-10 px-5 py-12 sm:gap-12 sm:px-10 sm:py-16 lg:px-14">
        {/* Cover */}
        <section className="relative flex h-44 items-end overflow-hidden rounded-3xl border border-black/10 bg-linear-to-br from-[#1c1c1c] via-[#2d2d2d] to-[#444] shadow-[0_30px_80px_-50px_rgba(0,0,0,0.6)] sm:h-64 lg:h-72">
          {event.cover ? (
            <img src={event.cover} alt="Event Cover" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs font-semibold uppercase tracking-[0.3em] text-white/30">
              Event cover
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          <div className="relative flex items-center gap-3 p-5 sm:p-6 z-10">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sm font-semibold uppercase tracking-widest text-black">
              {event.name.charAt(0)}
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
              {event.organizer}
            </span>
          </div>
        </section>

        {/* Hero */}
        <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start lg:gap-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                {event.status}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                Hosted by {event.organizer}
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl lg:text-5xl">
              {event.name}
            </h1>
            <p className="max-w-xl text-base leading-7 text-black/70 sm:text-lg sm:leading-8">
              {event.tagline}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="#tickets"
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90 sm:w-auto"
              >
                Get tickets
              </Link>
              <AddToCalendar
                title={event.name}
                description={event.tagline}
                location={`${event.venue}, ${event.location}`}
                start={event.start}
                end={event.end}
                timezone={event.timezone}
                className="w-full sm:w-auto"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Event link copied!");
                }}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-black/15 px-5 text-sm font-semibold uppercase tracking-widest text-black transition hover:border-black/40 sm:w-auto"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                  <path d="M6 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 6a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 18a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="m8.6 13.5 6.8 3.1M15.4 7.4 8.6 10.5" strokeLinecap="round" />
                </svg>
                Share
              </button>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-3 sm:gap-4">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-black/10 bg-white/70 px-3 py-3 backdrop-blur sm:px-4"
                >
                  <p className="text-2xl font-semibold text-black">{item.value}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-black/40">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Details card */}
          <aside className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.35)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
              Event details
            </p>
            <div className="mt-5 grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-black/40">Date</p>
                <p className="mt-1 font-semibold text-black">{event.date}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-black/40">Time</p>
                <p className="mt-1 font-semibold text-black">{event.time}</p>
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <p className="text-xs uppercase tracking-[0.18em] text-black/40">Venue</p>
                <p className="mt-1 font-semibold text-black">{event.venue}</p>
                <p className="text-black/60">{event.location}</p>
              </div>
            </div>
            <div className="mt-6 flex h-32 items-center justify-center rounded-2xl border border-black/10 bg-[#f2f6ff] text-xs font-semibold uppercase tracking-[0.2em] text-black/40">
              Map preview
            </div>
          </aside>
        </section>

        {/* About */}
        <section className="rounded-3xl border border-black/10 bg-white/70 p-6 backdrop-blur sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
            About this event
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-black/70 whitespace-pre-wrap">
            {event.tagline}
          </p>
        </section>

        {/* Agenda */}
        {agenda && agenda.length > 0 && (
          <section className="flex flex-col gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                Agenda
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-black">
                What the day looks like
              </h2>
            </div>
            <div className="grid gap-3">
              {agenda.map((slot: any, index: number) => (
                <article
                  key={index}
                  className="grid gap-2 rounded-2xl border border-black/10 bg-white/80 px-5 py-4 sm:grid-cols-[160px_1fr_auto] sm:items-center"
                >
                  <span className="text-sm font-semibold text-black whitespace-nowrap">{slot.time}</span>
                  <h3 className="text-base font-semibold text-black">{slot.title || slot.task}</h3>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/40">
                    {slot.location || slot.track || "Main Session"}
                  </span>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Tickets */}
        <section id="tickets" className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
              Tickets
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-black">
              Get your ticket
            </h2>
          </div>
          <div className="grid gap-6 rounded-3xl border border-black/10 bg-white/80 p-6 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.35)] backdrop-blur sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex flex-col gap-5">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-semibold text-black sm:text-5xl">{event.price}</span>
                <span className="pb-1 text-sm text-black/50">per ticket</span>
              </div>
              <ul className="grid gap-3 text-sm text-black/70 sm:grid-cols-2">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-stretch gap-3 lg:w-56">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/40">
                {event.seatsLeft} of {event.capacity} seats left
              </p>
              <div className="h-2 overflow-hidden rounded-full bg-black/10">
                <div
                  className="h-full rounded-full bg-black"
                  style={{
                    width: `${event.capacity > 0
                      ? Math.round(((event.capacity - event.seatsLeft) / event.capacity) * 100)
                      : 0
                      }%`,
                  }}
                />
              </div>
              <button
                type="button"
                className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
              >
                Register
              </button>
            </div>
          </div>
        </section>

        {/* Register CTA */}
        <section className="flex flex-col items-start gap-3 rounded-3xl border border-black/10 bg-black px-6 py-8 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              Don&apos;t miss it
            </p>
            <p className="mt-2 text-2xl font-semibold">
              Save your spot at {event.name}.
            </p>
          </div>
          <Link
            href="#tickets"
            className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold uppercase tracking-widest text-black"
          >
            Register now
          </Link>
        </section>
      </main>
    </div>
  );
}
