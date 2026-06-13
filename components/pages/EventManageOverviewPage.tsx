import Link from "next/link";

const stats = [
  { label: "Registrations", value: "1,284", delta: "+12% this week" },
  { label: "Capacity filled", value: "64%", delta: "820 seats left" },
  { label: "Revenue", value: "$48.2k", delta: "+$6.1k this week" },
  { label: "Check-ins", value: "0", delta: "Opens on event day" },
];

const details = [
  { label: "Date", value: "Jun 18, 2026" },
  { label: "Time", value: "9:00 AM – 5:00 PM" },
  { label: "Venue", value: "Brooklyn Expo Center" },
  { label: "Location", value: "Brooklyn, NY" },
];

const activity = [
  { title: "Registration email approved", meta: "2 hours ago · Comms" },
  { title: "New sponsor deck uploaded", meta: "Yesterday · Marketing" },
  { title: "Venue walkthrough scheduled", meta: "Mon · Ops" },
];

export default function EventManageOverviewPage() {
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
                Astra Product Summit
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
            A full-day summit bringing product, design, and engineering leaders
            together for keynotes, hands-on sessions, and networking.
          </p>
        </div>

        <aside className="grid gap-4">
          <div className="rounded-3xl border border-black/10 bg-black p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              Next milestone
            </p>
            <p className="mt-3 text-2xl font-semibold">Finalize keynote line-up</p>
            <p className="mt-3 text-sm text-white/70">
              3 speaker confirmations pending and 1 agenda slot left to fill.
            </p>
            <Link
              href="#"
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
