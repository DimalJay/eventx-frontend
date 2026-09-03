"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import AddToCalendar from "../widgets/AddToCalendar";
import { ReactQRCode } from "@lglab/react-qr-code";
import { getTicketDetails } from "@/service/registrationService";
import { formatPrice, encodeEventId } from "@/lib/utils";
import { ITicketDetails } from "@/types";
import ShaderBackground from "../landing/ShaderBackground";

const formatTicketDate = (value?: string | Date) => {
  if (!value) return "TBA";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "TBA";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Colombo",
  });
};

const formatTicketTime = (start?: string | Date, end?: string | Date) => {
  const format = (value?: string | Date) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Asia/Colombo",
    });
  };
  const s = format(start);
  const e = format(end);
  return s ? (e && e !== s ? `${s} - ${e}` : s) : "";
};

const statusLabel = (status?: string) =>
  status === "WAITLIST" ? "Waitlisted" : "Valid";

export default function ViewTicketPage() {
  const params = useParams<{ id: string }>();
  const code = params?.id ?? "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["ticket", code],
    queryFn: async () => {
      const res = await getTicketDetails(code);
      return res.data;
    },
    enabled: !!code,
  });

  const ticket: ITicketDetails | undefined = data;

  if (isLoading) {
    return (
      <div className="relative flex flex-1 justify-center overflow-hidden bg-[#f5f1ea]">
        <main className="relative flex w-full max-w-md flex-col gap-8 px-5 py-12 sm:px-6 my-7">
          <div className="animate-pulse rounded-3xl border border-black/10 bg-white/70 p-7">
            <div className="h-3 w-24 rounded bg-black/10" />
            <div className="mt-6 h-7 w-3/4 rounded bg-black/10" />
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="h-3 w-20 rounded bg-black/10" />
              <div className="h-3 w-28 rounded bg-black/10" />
              <div className="h-3 w-32 rounded bg-black/10" />
            </div>
          </div>
          <div className="h-12 rounded-full bg-black/10" />
        </main>
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="relative flex flex-1 justify-center overflow-hidden bg-[#f5f1ea]">
        <main className="relative flex w-full max-w-md flex-col items-center gap-6 px-5 py-16 text-center sm:px-6 my-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
            Ticket
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-black">
            Ticket not found
          </h1>
          <p className="text-sm leading-6 text-black/60">
            We couldn&apos;t find a ticket with code{" "}
            <span className="font-mono font-semibold text-black">{code}</span>.
            Please check the link from your confirmation email.
          </p>
          <Link
            href="/discover-events"
            className="inline-flex h-12 items-center justify-center rounded-full bg-black px-7 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
          >
            Browse events
          </Link>
        </main>
      </div>
    );
  }

  const event = ticket.event ?? {};
  const holder = ticket.holder;
  const holderName = holder
    ? `${holder.firstName} ${holder.lastName}`.trim()
    : "Unknown";
  const status = statusLabel(ticket.status);
  const type = event.eventType || "General admission";
  const venue = event.location || "TBA";
  const start = event.startDate ? String(event.startDate) : "";
  const end = event.endDate ? String(event.endDate) : "";
  const ticketUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/ticket/${encodeURIComponent(ticket.ticketCode)}`
      : ticket.ticketCode;

  return (
    <div className="relative flex flex-1 justify-center overflow-hidden bg-white">
      <ShaderBackground />

      <main className="relative flex w-full max-w-md flex-col gap-8 px-5 py-12 sm:px-6 sm:py-16 my-7">

        {/* Ticket */}
        <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_30px_80px_-50px_rgba(0,0,0,0.5)]">
          {/* Top - event info */}
          <div className="flex flex-col gap-5 p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                {ticket.organizer || "EventX Studio"}
              </span>
              <span className="inline-flex items-center gap-1.5 uppercase rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                <span className={`h-1.5 w-1.5 rounded-full ${ticket.status === "WAITLIST" ? "bg-amber-500" : "bg-emerald-500"}`} />
                {status}
              </span>
            </div>

            <h1 className="text-2xl font-semibold leading-tight tracking-tight text-black">
              {event.title || "Untitled Event"}
            </h1>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-black/40">Date</p>
                <p className="mt-1 font-semibold text-black">{formatTicketDate(event.startDate)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-black/40">Time</p>
                <p className="mt-1 font-semibold text-black">{formatTicketTime(event.startDate, event.endDate)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs uppercase tracking-[0.18em] text-black/40">Venue</p>
                <p className="mt-1 font-semibold text-black">{venue}</p>
              </div>
            </div>
          </div>

          {/* Perforated divider */}
          <div className="relative">
            <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-white" />
            <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-white" />
            <div className="mx-6 border-t border-dashed border-black/20" />
          </div>

          {/* Bottom - QR + holder */}
          <div className="flex flex-col items-center gap-5 p-6 sm:p-7">
            <div className="rounded-3xl border border-black/10">
              <ReactQRCode
                value={ticketUrl}
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
              {ticket.ticketCode}
            </p>
            <p className="text-center text-xs text-black/50">
              Show this code at the entrance for check-in.
            </p>

            <div className="grid w-full grid-cols-2 gap-4 border-t border-black/10 pt-5 text-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-black/40">
                  Ticket holder
                </p>
                <p className="mt-1 font-semibold text-black">{holderName}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-black/40">Paid</p>
                <p className="mt-1 font-semibold text-black">{formatPrice(event.ticketPrice)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <AddToCalendar
            title={event.title || "Untitled Event"}
            description={`Your ${type} ticket - ${ticket.ticketCode}`}
            location={venue}
            start={start}
            end={end}
            timezone="Asia/Colombo"
            className="w-full"
          />
          <Link
            href={`/event/${encodeEventId(ticket.eventId)}`}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
          >
            View event
          </Link>
        </div>
      </main>
    </div>
  );
}