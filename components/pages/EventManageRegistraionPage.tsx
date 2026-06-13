const stats = [
  { label: "Total registered", value: "1,284", delta: "+48 today" },
  { label: "Checked in", value: "0", delta: "Opens on event day" },
  { label: "Revenue", value: "$48,180", delta: "1,284 × $49" },
  { label: "Seats left", value: "76", delta: "of 1,360 capacity" },
];

const registrations = [
  {
    name: "Avery Lin",
    email: "avery@studio.com",
    registered: "Jun 12, 2026",
    amount: "$49",
    status: "Confirmed",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  {
    name: "Jules Grant",
    email: "jules@northwind.io",
    registered: "Jun 11, 2026",
    amount: "$49",
    status: "Confirmed",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  {
    name: "Ravi Patel",
    email: "ravi@pulse.ai",
    registered: "Jun 10, 2026",
    amount: "Pending",
    status: "Awaiting payment",
    tone: "border-amber-200 bg-amber-50 text-amber-800",
  },
  {
    name: "Mara Okafor",
    email: "mara@brightlabs.co",
    registered: "Jun 9, 2026",
    amount: "$49",
    status: "Confirmed",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  {
    name: "Theo Park",
    email: "theo@driftmail.com",
    registered: "Jun 8, 2026",
    amount: "Refunded",
    status: "Cancelled",
    tone: "border-black/15 bg-black/5 text-black/60",
  },
];

export default function EventManageRegistraionPage() {
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

      <section className="rounded-3xl border border-black/10 bg-white/85 p-7 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.35)] backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
              Registrations
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-black">
              Who&apos;s coming
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              placeholder="Search name or email"
              className="h-11 w-full rounded-full border border-black/10 bg-white px-5 text-sm text-black outline-none transition focus:border-black/40 sm:w-64"
            />
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-full bg-black px-5 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
            >
              Export list
            </button>
          </div>
        </div>

        <div className="mt-6 hidden grid-cols-[1.6fr_1fr_0.8fr_auto] gap-4 px-5 text-xs font-semibold uppercase tracking-[0.18em] text-black/40 sm:grid">
          <span>Attendee</span>
          <span>Registered</span>
          <span>Amount</span>
          <span>Status</span>
        </div>

        <div className="mt-3 grid gap-3">
          {registrations.map((reg) => (
            <div
              key={reg.email}
              className="grid gap-3 rounded-2xl border border-black/10 bg-white px-5 py-4 sm:grid-cols-[1.6fr_1fr_0.8fr_auto] sm:items-center"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs font-semibold uppercase text-white">
                  {reg.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-black">{reg.name}</p>
                  <p className="text-sm text-black/60">{reg.email}</p>
                </div>
              </div>
              <p className="text-sm text-black/70">{reg.registered}</p>
              <p className="text-sm font-semibold text-black">{reg.amount}</p>
              <span
                className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold ${reg.tone}`}
              >
                {reg.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
