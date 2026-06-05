const pastEvents = [
  {
    title: "Signal Summit 2025",
    date: "Oct 11, 2025",
    location: "Seattle, WA",
    attendees: "860",
    status: "Completed",
  },
  {
    title: "Design Ops Workshop",
    date: "Aug 29, 2025",
    location: "Denver, CO",
    attendees: "220",
    status: "Completed",
  },
  {
    title: "Launch Night Live",
    date: "Jun 07, 2025",
    location: "New York, NY",
    attendees: "540",
    status: "Completed",
  },
];

const milestones = [
  {
    label: "Total events",
    value: "18",
  },
  {
    label: "Avg attendance",
    value: "640",
  },
  {
    label: "Last event NPS",
    value: "62",
  },
];

export default function EventHistoryPage() {
  return (
    <div className="relative flex flex-1 justify-center overflow-hidden bg-[#f5f1ea]">
      <div className="pointer-events-none absolute -left-24 top-10 h-52 w-52 rounded-full bg-[#ffc9a7] opacity-35 blur-3xl" />
      <div className="pointer-events-none absolute right-8 top-16 h-64 w-64 rounded-full bg-[#9fd3ff] opacity-35 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#ffe8a3] opacity-40 blur-3xl" />

      <main className="relative flex w-full max-w-6xl flex-col gap-10 px-8 py-16 sm:px-12">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black text-sm font-semibold uppercase tracking-widest text-white">
                EX
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/50">
                  EventX archives
                </p>
                <p className="text-2xl font-semibold tracking-tight text-black">
                  Event history
                </p>
              </div>
            </div>
            <p className="max-w-2xl text-base leading-7 text-black/70">
              Review past events, attendance trends, and performance highlights.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
            >
              Export history
            </button>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-full border border-black/15 bg-white/80 px-6 text-sm font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
            >
              View insights
            </button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {milestones.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.35)] backdrop-blur"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                {item.label}
              </p>
              <p className="mt-4 text-3xl font-semibold text-black">{item.value}</p>
              <p className="mt-2 text-sm text-black/60">Rolling 12 months</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-black/10 bg-white/85 p-7 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.35)] backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                Completed events
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-black">
                Recent history
              </h2>
            </div>
            <button
              type="button"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-black/60 transition hover:text-black"
            >
              Filter view
            </button>
          </div>

          <div className="mt-6 grid gap-4">
            {pastEvents.map((event) => (
              <article
                key={event.title}
                className="grid gap-4 rounded-2xl border border-black/10 bg-white px-5 py-4 sm:grid-cols-[1.4fr_1fr_auto] sm:items-center"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                    {event.status}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-black">{event.title}</h3>
                  <p className="mt-1 text-sm text-black/60">{event.location}</p>
                </div>
                <div className="flex items-center justify-between gap-6 text-sm text-black/70 sm:justify-start">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-black/40">Date</p>
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
                  View recap
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
