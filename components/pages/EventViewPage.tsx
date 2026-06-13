import Link from "next/link";

const event = {
  name: "Astra Product Summit",
  tagline: "A full day of keynotes, hands-on sessions, and networking for product teams.",
  status: "Tickets live",
  date: "Thursday, Jun 18, 2026",
  time: "9:00 AM – 5:00 PM",
  // Machine-readable times for calendar links (local wall time + IANA tz)
  start: "2026-06-18T09:00:00",
  end: "2026-06-18T17:00:00",
  timezone: "America/New_York",
  venue: "Brooklyn Expo Center",
  location: "Brooklyn, NY",
  organizer: "EventX Studio",
  cover: "", // image URL — empty shows the placeholder cover
  price: "$49",
  seatsLeft: 820,
  capacity: 1360,
};

// Builds a Google Calendar "add event" link (prefilled template).
// dates expect the compact form YYYYMMDDTHHMMSS; ctz keeps the wall time correct.
function googleCalendarUrl() {
  const compact = (iso: string) => iso.replace(/[-:]/g, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.name,
    dates: `${compact(event.start)}/${compact(event.end)}`,
    ctz: event.timezone,
    details: event.tagline,
    location: `${event.venue}, ${event.location}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const highlights = [
  { label: "Attending", value: "540" },
  { label: "Sessions", value: "18" },
  { label: "Speakers", value: "24" },
];

const agenda = [
  { time: "9:00 AM", title: "Doors open & coffee", track: "Lobby" },
  { time: "10:00 AM", title: "Opening keynote: The next product era", track: "Main stage" },
  { time: "11:30 AM", title: "Hands-on: Designing for momentum", track: "Workshop A" },
  { time: "1:00 PM", title: "Lunch & networking", track: "Atrium" },
  { time: "2:30 PM", title: "Panel: Scaling teams that ship", track: "Main stage" },
  { time: "4:00 PM", title: "Closing remarks & social", track: "Main stage" },
];

const included = [
  "Access to all sessions & keynotes",
  "Hands-on workshops",
  "Lunch & refreshments",
  "Networking social",
];


export default function EventViewPage() {
  return (
    <div className="relative flex flex-1 justify-center overflow-hidden bg-linear-to-br from-[#f7efe2] via-white to-[#e5f4ff]">
      <div className="pointer-events-none absolute -left-28 top-12 h-56 w-56 rounded-full bg-[#ffc9a7] opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-24 h-64 w-64 rounded-full bg-[#9fd3ff] opacity-35 blur-3xl" />

      <main className="relative flex w-full max-w-5xl flex-col gap-12 px-8 py-16 sm:px-14">
        {/* Cover */}
        <section className="relative flex h-56 items-end overflow-hidden rounded-3xl border border-black/10 bg-linear-to-br from-[#1c1c1c] via-[#2d2d2d] to-[#444] shadow-[0_30px_80px_-50px_rgba(0,0,0,0.6)] sm:h-72">
          {/* Replace this block with <Image src={event.cover} ... /> once a cover is uploaded */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs font-semibold uppercase tracking-[0.3em] text-white/30">
            Event cover
          </div>
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          <div className="relative flex items-center gap-3 p-6">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sm font-semibold uppercase tracking-widest text-black">
              {event.name.charAt(0)}
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
              {event.organizer}
            </span>
          </div>
        </section>

        {/* Hero */}
        <section className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                {event.status}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                Hosted by {event.organizer}
              </span>
            </div>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-black sm:text-5xl">
              {event.name}
            </h1>
            <p className="max-w-xl text-lg leading-8 text-black/70">
              {event.tagline}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="#tickets"
                className="inline-flex h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
              >
                Get tickets
              </Link>
              <a
                href={googleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-black/20 px-6 text-sm font-semibold uppercase tracking-widest text-black transition hover:border-black hover:bg-black/5"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4" />
                </svg>
                Add to calendar
              </a>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-4">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 backdrop-blur"
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
            <div className="mt-5 grid gap-5 text-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-black/40">Date</p>
                <p className="mt-1 font-semibold text-black">{event.date}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-black/40">Time</p>
                <p className="mt-1 font-semibold text-black">{event.time}</p>
              </div>
              <div>
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
        <section className="rounded-3xl border border-black/10 bg-white/70 p-7 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
            About this event
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-black/70">
            The Astra Product Summit gathers product, design, and engineering
            leaders for a single day of sharp talks and practical workshops.
            Expect real stories from teams shipping at scale, hands-on sessions
            you can apply on Monday, and plenty of room to meet the people
            building alongside you.
          </p>
        </section>

        {/* Agenda */}
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
            {agenda.map((slot) => (
              <article
                key={slot.title}
                className="grid gap-2 rounded-2xl border border-black/10 bg-white/80 px-5 py-4 sm:grid-cols-[120px_1fr_auto] sm:items-center"
              >
                <span className="text-sm font-semibold text-black">{slot.time}</span>
                <h3 className="text-base font-semibold text-black">{slot.title}</h3>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/40">
                  {slot.track}
                </span>
              </article>
            ))}
          </div>
        </section>

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
          <div className="grid gap-6 rounded-3xl border border-black/10 bg-white/80 p-7 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.35)] backdrop-blur sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex flex-col gap-5">
              <div className="flex items-end gap-2">
                <span className="text-5xl font-semibold text-black">{event.price}</span>
                <span className="pb-1 text-sm text-black/50">per ticket</span>
              </div>
              <ul className="grid gap-3 text-sm text-black/70 sm:grid-cols-2">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-black" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:w-56">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/40">
                {event.seatsLeft} of {event.capacity} seats left
              </p>
              <div className="h-2 overflow-hidden rounded-full bg-black/10">
                <div
                  className="h-full rounded-full bg-black"
                  style={{
                    width: `${Math.round(
                      ((event.capacity - event.seatsLeft) / event.capacity) * 100
                    )}%`,
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
