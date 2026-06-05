const quickStats = [
  {
    label: "Checked in",
    value: "312",
    delta: "+28 in last hour",
  },
  {
    label: "Live sessions",
    value: "4",
    delta: "2 up next",
  },
  {
    label: "Support tickets",
    value: "6",
    delta: "3 awaiting reply",
  },
];

const agenda = [
  {
    time: "09:30",
    title: "Opening keynote",
    location: "Main Hall",
    status: "Live",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  {
    time: "10:45",
    title: "Product roadmap",
    location: "Studio A",
    status: "Up next",
    tone: "border-amber-200 bg-amber-50 text-amber-800",
  },
  {
    time: "12:00",
    title: "Lunch + networking",
    location: "Atrium",
    status: "Scheduled",
    tone: "border-sky-200 bg-sky-50 text-sky-800",
  },
];

const alerts = [
  {
    title: "VIP arrival",
    body: "Two keynote guests just checked in and need escorts.",
  },
  {
    title: "Room change",
    body: "Studio B session moved to Main Hall due to overflow.",
  },
  {
    title: "Streaming health",
    body: "Audio levels stable across all live streams.",
  },
];

export default function EventDashboardPage() {
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
                  EventX live dashboard
                </p>
                <p className="text-2xl font-semibold tracking-tight text-black">
                  Signal Summit 2026
                </p>
              </div>
            </div>
            <p className="max-w-2xl text-base leading-7 text-black/70">
              Monitor attendee flow, session health, and real-time alerts during your event day.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
            >
              Open comms
            </button>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-full border border-black/15 bg-white/80 px-6 text-sm font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
            >
              Export report
            </button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {quickStats.map((item) => (
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

        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl border border-black/10 bg-white/85 p-7 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.35)] backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                  Session flow
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-black">
                  Agenda pulse
                </h2>
              </div>
              <button
                type="button"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-black/60 transition hover:text-black"
              >
                View agenda
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              {agenda.map((item) => (
                <article
                  key={`${item.time}-${item.title}`}
                  className="grid gap-4 rounded-2xl border border-black/10 bg-white px-5 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"
                >
                  <div className="text-sm font-semibold text-black/70">{item.time}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${item.tone}`}>
                        {item.status}
                      </span>
                      <span className="text-xs text-black/50">{item.location}</span>
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-black">{item.title}</h3>
                  </div>
                  <button
                    type="button"
                    className="inline-flex h-9 items-center justify-center rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
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
                Live alert
              </p>
              <p className="mt-3 text-2xl font-semibold">
                Check-in line moving fast.
              </p>
              <p className="mt-3 text-sm text-white/70">
                Average wait time is down to 4 minutes after opening a new entrance.
              </p>
              <button
                type="button"
                className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-xs font-semibold uppercase tracking-widest text-black"
              >
                Notify team
              </button>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white/80 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                Ops alerts
              </p>
              <div className="mt-4 grid gap-4 text-sm text-black/70">
                {alerts.map((alert) => (
                  <div key={alert.title} className="rounded-2xl border border-black/5 bg-white px-4 py-3">
                    <p className="font-semibold text-black">{alert.title}</p>
                    <p className="mt-1 text-xs text-black/50">{alert.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
