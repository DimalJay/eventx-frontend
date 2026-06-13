import Logo from "../widgets/Logo";

const steps = [
  {
    title: "Choose the experience",
    body: "Start from a template or craft a custom flow that fits your audience.",
  },
  {
    title: "Add ticketing rules",
    body: "Define capacity, tiers, and pricing with instant guardrails.",
  },
  {
    title: "Invite your team",
    body: "Assign owners to programming, ops, and guest communications.",
  },
];

export default function CreateEventPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-linear-to-br from-[#f7efe2] via-white to-[#e5f4ff]">
      <main className="flex w-full max-w-5xl flex-col gap-10 px-8 py-20 sm:px-14">
        <div className="flex items-center gap-3">
          <Logo />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/60">
              EventX
            </p>
            <p className="text-lg font-semibold tracking-wide text-black">
              Create a new event
            </p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
          <section className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.3)] backdrop-blur sm:p-8">
            <div className="flex flex-col gap-3">
              <p className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black">
                Event setup
              </p>
              <h1 className="text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl">
                Shape the next experience.
              </h1>
              <p className="text-sm leading-6 text-black/70">
                Capture the essentials now and refine sessions, speakers, and ticketing later.
              </p>
            </div>

            <form className="mt-8 grid gap-5">
              <label className="grid gap-2 text-sm font-semibold text-black">
                Event name
                <input
                  type="text"
                  name="eventName"
                  autoComplete="off"
                  placeholder="Signal Summit 2026"
                  className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-black">
                Event type
                <select
                  name="eventType"
                  className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
                >
                  <option>Conference</option>
                  <option>Workshop</option>
                  <option>Networking</option>
                  <option>Launch</option>
                </select>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-black">
                  Event date
                  <input
                    type="date"
                    name="eventDate"
                    className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-black">
                  Start time
                  <input
                    type="time"
                    name="eventTime"
                    className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
                  />
                </label>
              </div>
              <label className="grid gap-2 text-sm font-semibold text-black">
                Location
                <input
                  type="text"
                  name="location"
                  autoComplete="off"
                  placeholder="Brooklyn Navy Yard"
                  className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-black">
                Estimated capacity
                <input
                  type="number"
                  name="capacity"
                  min={1}
                  placeholder="350"
                  className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-black">
                Event summary
                <textarea
                  name="summary"
                  rows={4}
                  placeholder="Describe the audience, goals, and main outcomes."
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-base text-black outline-none transition focus:border-black/40"
                />
              </label>

              <button
                type="button"
                className="mt-2 flex h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
              >
                Save event draft
              </button>
              <p className="text-xs text-black/60">
                You can finalize ticketing and publish when the details are ready.
              </p>
            </form>
          </section>

          <section className="grid gap-4">
            <div className="rounded-3xl border border-black/10 bg-black px-6 py-8 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                Next up
              </p>
              <p className="mt-2 text-2xl font-semibold">
                Draft the agenda and speaker flow.
              </p>
              <p className="mt-3 text-sm text-white/70">
                EventX will guide you through tracks, sessions, and speaker confirmations.
              </p>
            </div>
            <div className="grid gap-4 rounded-3xl border border-black/10 bg-white/80 p-6">
              {steps.map((step) => (
                <div key={step.title} className="border-b border-black/10 pb-4 last:border-b-0 last:pb-0">
                  <h2 className="text-base font-semibold text-black">{step.title}</h2>
                  <p className="mt-1 text-sm text-black/60">{step.body}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
