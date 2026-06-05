const recentEvents = [
  {
    title: "Astra Product Summit",
    location: "Brooklyn, NY",
    created: "Created 2 days ago",
    date: "Jun 18, 2026",
    attendees: "540",
    status: "Tickets live",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  {
    title: "Night Market Sessions",
    location: "Austin, TX",
    created: "Created 4 days ago",
    date: "Jun 26, 2026",
    attendees: "220",
    status: "Drafting agenda",
    tone: "border-amber-200 bg-amber-50 text-amber-800",
  },
  {
    title: "Pulse Design Retreat",
    location: "Big Sur, CA",
    created: "Created 1 week ago",
    date: "Jul 04, 2026",
    attendees: "86",
    status: "Venue hold",
    tone: "border-sky-200 bg-sky-50 text-sky-800",
  },
];

const highlights = [
  {
    label: "Registrations",
    value: "1,284",
    delta: "+12% this week",
  },
  {
    label: "Events in flight",
    value: "7",
    delta: "3 in build mode",
  },
  {
    label: "Team tasks",
    value: "14",
    delta: "5 due today",
  },
];

export default function HomePage() {
  return (
    <div className="relative flex flex-1 justify-center overflow-hidden bg-[#f5f1ea]">
      <div className="pointer-events-none absolute -left-28 top-12 h-56 w-56 rounded-full bg-[#ffc9a7] opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-24 h-64 w-64 rounded-full bg-[#9fd3ff] opacity-35 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#ffe8a3] opacity-45 blur-3xl" />

      <main className="relative flex w-full max-w-6xl flex-col gap-10 px-8 py-16 sm:px-12">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black text-sm font-semibold uppercase tracking-widest text-white">
                EX
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/50">
                  EventX workspace
                </p>
                <p className="text-2xl font-semibold tracking-tight text-black">
                  Welcome back, Dana.
                </p>
              </div>
            </div>
            <p className="max-w-2xl text-base leading-7 text-black/70">
              Your home base for launches, ticketing, and attendee journeys. Pick up where your team left off.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
            >
              Create event
            </button>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-full border border-black/15 bg-white/80 px-6 text-sm font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
            >
              Invite team
            </button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
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
                  Recently created events
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-black">
                  Fresh builds from your team
                </h2>
              </div>
              <button
                type="button"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-black/60 transition hover:text-black"
              >
                View all
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              {recentEvents.map((event) => (
                <article
                  key={event.title}
                  className="grid gap-4 rounded-2xl border border-black/10 bg-white px-5 py-4 sm:grid-cols-[1.4fr_1fr_auto] sm:items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${event.tone}`}>
                        {event.status}
                      </span>
                      <span className="text-xs text-black/50">{event.created}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-black">{event.title}</h3>
                    <p className="mt-1 text-sm text-black/60">{event.location}</p>
                  </div>
                  <div className="flex items-center justify-between gap-6 text-sm text-black/70 sm:justify-start">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-black/40">Launch</p>
                      <p className="mt-1 font-semibold text-black">{event.date}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-black/40">Attendees</p>
                      <p className="mt-1 font-semibold text-black">{event.attendees}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
                  >
                    Open
                  </button>
                </article>
              ))}
            </div>
          </div>

          <aside className="grid gap-4">
            <div className="rounded-3xl border border-black/10 bg-black p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                Next milestone
              </p>
              <p className="mt-3 text-2xl font-semibold">
                Finalize keynote line-up
              </p>
              <p className="mt-3 text-sm text-white/70">
                You have 3 pending speaker confirmations and 1 agenda slot left to fill.
              </p>
              <button
                type="button"
                className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-xs font-semibold uppercase tracking-widest text-black"
              >
                Review agenda
              </button>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white/80 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                Team activity
              </p>
              <div className="mt-4 grid gap-4 text-sm text-black/70">
                <div className="rounded-2xl border border-black/5 bg-white px-4 py-3">
                  <p className="font-semibold text-black">New sponsor deck uploaded</p>
                  <p className="mt-1 text-xs text-black/50">2 hours ago · Marketing</p>
                </div>
                <div className="rounded-2xl border border-black/5 bg-white px-4 py-3">
                  <p className="font-semibold text-black">Registration email approved</p>
                  <p className="mt-1 text-xs text-black/50">Yesterday · Comms</p>
                </div>
                <div className="rounded-2xl border border-black/5 bg-white px-4 py-3">
                  <p className="font-semibold text-black">Venue walkthrough scheduled</p>
                  <p className="mt-1 text-xs text-black/50">Mon · Ops</p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
