const kpis = [
  { label: "Total registrations", value: "1,284", delta: "+12% week over week" },
  { label: "Conversion rate", value: "38%", delta: "+4 pts vs. last event" },
  { label: "Avg. ticket value", value: "$37.50", delta: "+$2.10" },
  { label: "Refund rate", value: "1.2%", delta: "-0.3 pts" },
];

const trend = [
  { label: "Mon", value: 42 },
  { label: "Tue", value: 65 },
  { label: "Wed", value: 58 },
  { label: "Thu", value: 80 },
  { label: "Fri", value: 96 },
  { label: "Sat", value: 74 },
  { label: "Sun", value: 88 },
];

const ticketTypes = [
  { label: "General admission", value: 62 },
  { label: "VIP", value: 24 },
  { label: "Student", value: 14 },
];

const sources = [
  { label: "Direct", value: 41 },
  { label: "Social", value: 33 },
  { label: "Email", value: 18 },
  { label: "Referral", value: 8 },
];

export default function EventManageInsightsPage() {
  const peak = Math.max(...trend.map((point) => point.value));

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((item) => (
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
            Registrations this week
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-black">503 new sign-ups</h2>

          <div className="mt-8 flex h-48 items-end justify-between gap-3">
            {trend.map((point) => (
              <div
                key={point.label}
                className="flex flex-1 flex-col items-center gap-3"
              >
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-xl bg-black/80 transition-all"
                    style={{ height: `${(point.value / peak) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-black/50">
                  {point.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white/80 p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
            Ticket mix
          </p>
          <div className="mt-5 grid gap-5">
            {ticketTypes.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-black">{item.label}</span>
                  <span className="text-black/50">{item.value}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/10">
                  <div
                    className="h-full rounded-full bg-black"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white/80 p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
          Traffic sources
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sources.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-black/10 bg-white px-5 py-4"
            >
              <p className="text-2xl font-semibold text-black">{item.value}%</p>
              <p className="mt-1 text-sm text-black/60">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
