"use client";

import { useAuth } from "../auth/AuthContext";
import AddToCalendar from "../widgets/AddToCalendar";
import { useQuery } from "@tanstack/react-query";
import { getEventById } from "@/service/eventService";
import { getEventRegistrations } from "@/service/registrationService";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import { IRegistration } from "@/types";
import ShareButton from "../widgets/ShareButton";
import RegisterEventDialog from "../dialogs/RegisterEventDialog";
import PaymentCheckoutDialog from "../dialogs/PaymentCheckoutDialog";
import LoginPromptDialog from "../dialogs/LoginPromptDialog";
import { EventViewLoadingSkeleton } from "@/components/skeleton/EventViewLoadingSkeleton";

const EASE = [0.16, 1, 0.3, 1] as const;

const coverContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const coverItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

function getInitialTimeLeft(targetDate: string | Date) {
  const difference = +new Date(targetDate) - +new Date();
  if (difference <= 0) {
    return null;
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function CountdownTimer({ targetDate }: { targetDate: string | Date }) {
  const [timeLeft, setTimeLeft] = useState(() => getInitialTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getInitialTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/50">
        Starts in
      </span>
      <div className="flex items-center gap-1.5 font-semibold tracking-tight text-black">
        <span className="tabular-nums">{timeLeft.days}d</span>
        <span className="text-black/25">:</span>
        <span className="tabular-nums">{timeLeft.hours}h</span>
        <span className="text-black/25">:</span>
        <span className="tabular-nums">{timeLeft.minutes}m</span>
        <span className="text-black/25">:</span>
        <span className="tabular-nums">{timeLeft.seconds}s</span>
      </div>
    </div>
  );
}

const included = [
  "Access to all sessions & keynotes",
  "Reserved Seating",
  "Interactive Q&A Session",
  "Networking social",
];

export default function EventViewPage({ id }: { id?: string }) {
  const { user } = useAuth();
  const reduce = useReducedMotion();
  const [registerOpen, setRegisterOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [joinedEmail, setJoinedEmail] = useState<string | null>(() => {
    if (typeof window === "undefined" || !id) return null;
    try {
      const map = JSON.parse(localStorage.getItem("eventx_joined_emails") || "{}");
      return typeof map[id] === "string" ? map[id] : null;
    } catch {
      return null;
    }
  });

  const rememberJoined = (email: string) => {
    if (!id) return;
    setJoinedEmail(email);
    try {
      const map = JSON.parse(localStorage.getItem("eventx_joined_emails") || "{}");
      map[id] = email;
      localStorage.setItem("eventx_joined_emails", JSON.stringify(map));
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    if (payment === "success") {
      toast.success("Payment received. Check your email for the confirmation.");
      window.history.replaceState({}, "", window.location.pathname);
    } else if (payment === "cancelled") {
      toast.info("Payment cancelled.");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const { data: backendEvent, isLoading, isError } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const res = await getEventById(id as string);
      return res.data;
    },
    enabled: !!id,
  });

  const { data: registrationsResponse } = useQuery({
    queryKey: ["registrations", id],
    queryFn: () => getEventRegistrations({ data: { eventId: id as string } }),
    enabled: !!id,
  });

  if (isLoading) {
    return <EventViewLoadingSkeleton />;
  }


  if (isError || !backendEvent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50/70">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-500 uppercase tracking-widest mb-2">Error loading event</p>
          <p className="text-black/60">Please check if the Event ID ({id}) exists in the database.</p>
        </div>
      </div>
    );
  }

  // Formatting Dates safely
  const startDateObj = backendEvent.startDate ? new Date(backendEvent.startDate) : new Date();
  const endDateObj = backendEvent.endDate ? new Date(backendEvent.endDate) : new Date();

  const formattedStartDate = startDateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const formattedEndDate = endDateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const formattedStartTime = startDateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });

  const formattedEndTime = endDateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });

  const visibilityText = backendEvent.isPublic ? "Public Event" : "Private Event";

  // Fetch registrations count
  const totalRegistered = registrationsResponse?.data?.length || 0;
  const seatsLeftText = backendEvent.capacity === 0 ? "Unlimited" : String(Math.max(0, backendEvent.capacity - totalRegistered));

  // Mapping Backend Data to Frontend Variables
  const event = {
    name: backendEvent.title || "Untitled Event",
    tagline: backendEvent.description || "No description provided.",
    status: backendEvent.isPaid || backendEvent.ticketPrice > 0 ? "Tickets live" : "Free Event",
    date: startDateObj.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }),
    time: `${startDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Colombo', hour12: true })} - ${endDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Colombo', hour12: true })}`,
    start: backendEvent.startDate || startDateObj.toISOString(),
    end: backendEvent.endDate || endDateObj.toISOString(),
    timezone: "Asia/Colombo",
    venue: backendEvent.location || "TBA",
    location: backendEvent.location || "TBA",
    organizer: "EventX Studio",
    cover: (() => {
      const coverPath = backendEvent.imageUrl || backendEvent.coverImage || "";
      if (!coverPath) return "";
      if (coverPath.startsWith("http")) return coverPath;

      const backendBase = (process.env.NEXT_PUBLIC_EVENTX_BACKEND_URL || "").replace("/api/v1", "");
      return `${backendBase}${coverPath}`;
    })(),
    price: formatPrice(backendEvent.ticketPrice),
    seatsLeft: backendEvent.capacity === 0 ? 999999 : Math.max(0, backendEvent.capacity - totalRegistered),
    capacity: backendEvent.capacity || 0,
  };

  let agenda = [];
  try {
    agenda = backendEvent.agenda && typeof backendEvent.agenda === "string" ? JSON.parse(backendEvent.agenda) : [];
    if (!Array.isArray(agenda)) agenda = [];
  } catch {
    agenda = [];
  }

  const isPaid = backendEvent.isPaid || backendEvent.ticketPrice > 0;

  const hasRegistered =
    (registrationsResponse?.data ?? []).some(
      (r: IRegistration) => r.userId === String(user?.id),
    ) ||
    (!!joinedEmail &&
      (registrationsResponse?.data ?? []).some(
        (r: IRegistration) =>
          String(r.email ?? "").toLowerCase() === joinedEmail.toLowerCase(),
      ));

  const openTicket = () => {
    if (isPaid && !user) {
      setLoginPromptOpen(true);
      return;
    }
    if (isPaid) {
      setCheckoutOpen(true);
    } else {
      setRegisterOpen(true);
    }
  };

  const isOnlineEvent =
    backendEvent.eventType === "online" ||
    (!!backendEvent.location && /^(https?:\/\/|zoom\.us|meet\.google|teams\.microsoft)/i.test(backendEvent.location));

  const formatOnlineLink = (url?: string) => {
    if (!url) return "#";
    const trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return trimmed;
  };

  return (
    <div className="relative flex min-h-screen flex-1 justify-center overflow-hidden bg-zinc-50/70">
      <main className="relative w-full max-w-6xl flex-1 px-5 py-12 sm:px-10 sm:py-16 lg:px-14">
        {/* Hero - asymmetric split cover + title */}
        <motion.section
          className="grid items-center gap-10 lg:grid-cols-[minmax(0,400px)_1fr] lg:gap-16"
          variants={coverContainer}
          initial={reduce ? false : "hidden"}
          animate="show"
        >
          {/* Cover - portrait 4:5 frame, matching the creation page */}
          <motion.div
            variants={coverItem}
            className="relative aspect-4/5 overflow-hidden rounded-[1.75rem] bg-linear-to-br from-[#1c1c1c] via-[#2d2d2d] to-[#444]"
          >
            {event.cover ? (
              <img src={event.cover} alt={`${event.name} cover`} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center px-8 text-center text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
                {event.name}
              </div>
            )}
          </motion.div>

          {/* Title block */}
          <motion.div variants={coverItem} className="flex flex-col items-start gap-7">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-bold text-black">
                <span className={`h-1.5 w-1.5 rounded-full ${event.status === "Tickets live" ? "bg-emerald-500" : "bg-sky-500"}`} />
                {event.status}
              </span>
              <span className="text-sm font-medium text-black/55">{event.date}</span>
            </div>

            <h1 className="max-w-xl text-balance text-4xl font-semibold leading-[1.04] tracking-tight text-black sm:text-5xl lg:text-6xl">
              {event.name}
            </h1>

            <p className="line-clamp-3 max-w-xl text-base leading-7 text-black/65 sm:text-lg sm:leading-8">
              {event.tagline}
            </p>

            <CountdownTimer targetDate={backendEvent.startDate} />

            {/* Facts - slim definition list, no boxes */}
            <dl className="grid w-full grid-cols-2 gap-x-6 gap-y-6 border-t border-black/10 pt-7 sm:grid-cols-4">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">Starts</dt>
                <dd className="mt-1 text-sm font-semibold text-black">{formattedStartDate}</dd>
                <dd className="text-sm text-black/60">{formattedStartTime}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">Ends</dt>
                <dd className="mt-1 text-sm font-semibold text-black">{formattedEndDate}</dd>
                <dd className="text-sm text-black/60">{formattedEndTime}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
                  {isOnlineEvent ? "Event Link" : "Where"}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-black">
                  {isOnlineEvent ? (
                    backendEvent.location ? (
                      <a
                        href={formatOnlineLink(backendEvent.location)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <span>Join Online Event</span>
                        <span className="text-xs">↗</span>
                      </a>
                    ) : (
                      <span>Online Event</span>
                    )
                  ) : (
                    event.venue
                  )}
                </dd>
                <dd className="text-sm text-black/60">{visibilityText}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">Capacity</dt>
                <dd className="mt-1 text-sm font-semibold text-black">
                  {backendEvent.capacity === 0 ? "Unlimited" : `${seatsLeftText} left`}
                </dd>
                <dd className="text-sm text-black/60">{totalRegistered} registered</dd>
              </div>
            </dl>

            {/* Actions - one primary, two quiet utilities */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#tickets"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-black px-7 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90 active:scale-[0.98]"
              >
                {isPaid ? "Get your ticket" : "Register free"}
              </a>
              <AddToCalendar
                title={event.name}
                description={event.tagline}
                location={`${event.venue}, ${event.location}`}
                start={event.start}
                end={event.end}
                timezone={event.timezone}
                className="inline-flex h-12 items-center justify-center rounded-full border border-black/15 px-5 text-sm font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
              />
              <ShareButton
                title={event.name}
                text={event.tagline}
              />
            </div>
          </motion.div>
        </motion.section>

        {/* About - generous editorial prose */}
        <section className="mt-20 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
            About this event
          </h2>
          <p className="mt-5 text-base leading-8 text-black/70 sm:text-lg">{event.tagline}</p>
        </section>

        {/* Agenda - ruled timeline, no cards */}
        {agenda && agenda.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">Agenda</h2>
            <ol className="mt-7 divide-y divide-black/10 border-y border-black/10">
              {agenda.map((slot: { time?: string; task?: string; title?: string; location?: string; track?: string }, index: number) => (
                <li key={index} className="grid gap-1 py-5 sm:grid-cols-[120px_1fr_auto] sm:items-baseline sm:gap-6">
                  <span className="text-sm font-semibold tabular-nums text-black">{slot.time}</span>
                  <span className="text-base font-medium text-black">{slot.title || slot.task}</span>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black/40 sm:text-right">
                    {slot.location || slot.track || "Main Session"}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Tickets - single focused feature card */}
        <section id="tickets" className="mt-20">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-black/10 bg-white/80 p-7 backdrop-blur sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
              <div className="flex flex-col gap-6">
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-semibold tracking-tight text-black sm:text-6xl">
                    {isPaid ? event.price : "Free"}
                  </span>
                  {isPaid && <span className="pb-1.5 text-sm text-black/50">per ticket</span>}
                </div>
                <ul className="grid gap-x-8 gap-y-3 text-sm text-black/70 sm:grid-cols-2">
                  {included.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex w-full flex-col items-stretch gap-4 lg:w-60">
                {event.capacity === 0 ? (
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-black/45">
                    Unlimited seats available
                  </p>
                ) : (
                  <>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-black/45">
                      {event.seatsLeft} of {event.capacity} seats left
                    </p>
                    <div className="h-1.5 overflow-hidden rounded-full bg-black/10">
                      <div
                        className="h-full rounded-full bg-black"
                        style={{
                          width: `${event.capacity > 0
                            ? Math.round(((event.capacity - event.seatsLeft) / event.capacity) * 100)
                            : 0
                            }%`,
                        }}
                      />
                    </div>
                  </>
                )}
                {hasRegistered ? (
                  <span className="inline-flex h-12 w-full items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-6 text-sm font-semibold uppercase tracking-widest text-emerald-700">
                    You&apos;re registered
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={openTicket}
                    className="inline-flex h-12 w-full items-center justify-center rounded-full bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90 active:scale-[0.98]"
                  >
                    {isPaid ? "Register & pay" : "Register"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
        {id && (
          isPaid ? (
            <PaymentCheckoutDialog
              eventId={id}
              title={backendEvent.title || "Untitled Event"}
              price={backendEvent.ticketPrice || 0}
              seatsLeft={event.seatsLeft}
              capacity={backendEvent.capacity || 0}
              open={checkoutOpen}
              onClose={() => setCheckoutOpen(false)}
            />
          ) : (
            <RegisterEventDialog
              eventId={id}
              open={registerOpen}
              onClose={() => setRegisterOpen(false)}
              onRegistered={rememberJoined}
            />
          )
        )}
        <LoginPromptDialog
          eventName={event.name}
          open={loginPromptOpen}
          onClose={() => setLoginPromptOpen(false)}
        />
      </main>
    </div>
  );
}
