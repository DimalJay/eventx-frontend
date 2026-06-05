const participants = [
  {
    name: "Avery Lin",
    email: "avery@studio.com",
    ticket: "VIP",
    status: "Checked in",
  },
  {
    name: "Jules Grant",
    email: "jules@northwind.io",
    ticket: "General",
    status: "Onsite",
  },
  {
    name: "Ravi Patel",
    email: "ravi@pulse.ai",
    ticket: "Sponsor",
    status: "Registered",
  },
];

export default function EventParticipantsSection() {
  return (
    <section className="rounded-3xl border border-black/10 bg-white/85 p-7 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.35)] backdrop-blur">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
            Participants
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-black">
            Attendee overview
          </h2>
        </div>
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center rounded-full bg-black px-5 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
        >
          Export list
        </button>
      </div>

      <div className="mt-6 grid gap-4">
        {participants.map((participant) => (
          <div
            key={participant.email}
            className="grid gap-4 rounded-2xl border border-black/10 bg-white px-5 py-4 sm:grid-cols-[1.4fr_1fr_auto] sm:items-center"
          >
            <div>
              <p className="text-base font-semibold text-black">{participant.name}</p>
              <p className="text-sm text-black/60">{participant.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">
                Ticket
              </p>
              <p className="mt-1 text-sm font-semibold text-black">{participant.ticket}</p>
            </div>
            <span className="inline-flex items-center justify-center rounded-full border border-black/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-black/70">
              {participant.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
