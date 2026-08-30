import Link from "next/link";
import AddToCalendar from "../widgets/AddToCalendar";
import { ReactQRCode } from "@lglab/react-qr-code";
import Logo from "../widgets/Logo";

const ticket = {
  event: "Astra Product Summit",
  organizer: "EventX Studio",
  status: "Valid",
  date: "Thu, Jun 18, 2026",
  time: "9:00 AM - 5:00 PM",
  venue: "Brooklyn Expo Center",
  location: "Brooklyn, NY",
  holder: "Avery Lin",
  type: "General admission",
  code: "EVX-7F3K-2208",
  orderId: "#10482",
  price: "LKR 49,000",
  // Machine-readable times for the calendar link
  start: "2026-06-18T09:00:00",
  end: "2026-06-18T17:00:00",
  timezone: "America/New_York",
};

export default function ViewTicketPage() {
  return (
    <div className="relative flex flex-1 justify-center overflow-hidden bg-[#f5f1ea]">
      <div className="pointer-events-none absolute -left-24 top-10 h-52 w-52 rounded-full bg-[#ffc9a7] opacity-35 blur-3xl" />
      <div className="pointer-events-none absolute right-8 top-20 h-60 w-60 rounded-full bg-[#9fd3ff] opacity-35 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[#ffe8a3] opacity-40 blur-3xl" />

      <main className="relative flex w-full max-w-md flex-col gap-8 px-5 py-12 sm:px-6 sm:py-16 my-7">

        {/* Ticket */}
        <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_30px_80px_-50px_rgba(0,0,0,0.5)]">
          {/* Top - event info */}
          <div className="flex flex-col gap-5 p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                {ticket.organizer}
              </span>
              <span className="inline-flex items-center gap-1.5 uppercase rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"  />
                {ticket.status}
              </span>
            </div>

            <h1 className="text-2xl font-semibold leading-tight tracking-tight text-black">
              {ticket.event}
            </h1>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-black/40">Date</p>
                <p className="mt-1 font-semibold text-black">{ticket.date}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-black/40">Time</p>
                <p className="mt-1 font-semibold text-black">{ticket.time}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs uppercase tracking-[0.18em] text-black/40">Venue</p>
                <p className="mt-1 font-semibold text-black">{ticket.venue}</p>
                <p className="text-black/60">{ticket.location}</p>
              </div>
            </div>
          </div>

          {/* Perforated divider */}
          <div className="relative">
            <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#f5f1ea]" />
            <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#f5f1ea]" />
            <div className="mx-6 border-t border-dashed border-black/20" />
          </div>

          {/* Bottom - QR + holder */}
          <div className="flex flex-col items-center gap-5 p-6 sm:p-7">
            <div className="rounded-3xl border border-black/10">
              <ReactQRCode
                value={ticket.code}
                size={Math.min(255, typeof window !== "undefined" ? window.innerWidth - 96 : 255)}
                dataModulesSettings={{
                  style: "rounded"
                }}
                finderPatternInnerSettings={{
                  style: "rounded"
                }}
                finderPatternOuterSettings={{
                  style: "rounded"
                }}
                marginSize={3}
              />
            </div>
            <p className="font-mono text-sm font-semibold tracking-[0.2em] text-black">
              {ticket.code}
            </p>
            <p className="text-center text-xs text-black/50">
              Show this code at the entrance for check-in.
            </p>

            <div className="grid w-full grid-cols-2 gap-4 border-t border-black/10 pt-5 text-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-black/40">
                  Ticket holder
                </p>
                <p className="mt-1 font-semibold text-black">{ticket.holder}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-black/40">Paid</p>
                <p className="mt-1 font-semibold text-black">{ticket.price}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <AddToCalendar
            title={ticket.event}
            description={`Your ${ticket.type} ticket - ${ticket.code}`}
            location={`${ticket.venue}, ${ticket.location}`}
            start={ticket.start}
            end={ticket.end}
            timezone={ticket.timezone}
            className="w-full"
          />
          <Link
            href={`/event/${ticket.orderId}`}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
          >
            View event
          </Link>
        </div>
      </main>
    </div>
  );
}
