'use client'
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getPublicEvents } from "@/service/eventService";
import { IEvent } from "@/types";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  ChevronDown,
  CreditCard,
  ListChecks,
  ScanLine,
  Users,
} from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const clubs = [
  { name: "IEEE Student Branch", initials: "IS" },
  { name: "Gavel Club", initials: "GC" },
  { name: "Rotaract Club", initials: "RC" },
  { name: "Aero Society", initials: "AS" },
  { name: "CS Student Union", initials: "CS" },
];

const steps = [
  {
    step: "01",
    title: "Create Event",
    desc: "Set event details, schedule, location and branding.",
  },
  {
    step: "02",
    title: "Sell Tickets",
    desc: "Accept registrations and manage attendees easily.",
  },
  {
    step: "03",
    title: "Run & Engage",
    desc: "Track attendance, polls and audience engagement.",
  },
];

const features = [
  {
    icon: CreditCard,
    title: "Registration & ticketing",
    body: "Free or paid tickets with capacity limits, registration deadlines, and a waitlist when seats run out.",
    cell: "rounded-3xl bg-amber-400 p-7 text-[#17130e] shadow-[0_25px_70px_-40px_rgba(255,180,84,0.45)] lg:col-span-2",
    chip: "bg-black/10",
    iconClass: "text-[#17130e]",
    titleClass: "text-[#17130e]",
    bodyClass: "text-[#17130e]/75",
  },
  {
    icon: ScanLine,
    title: "QR check-in",
    body: "Scan tickets at the door and watch attendance fill in live.",
    cell: "rounded-3xl border border-white/10 bg-[#141311] p-7",
    chip: "bg-white/10",
    iconClass: "text-white",
    titleClass: "text-white",
    bodyClass: "text-white/60",
  },
  {
    icon: CalendarDays,
    title: "Agenda builder",
    body: "Lay out sessions, times, and locations into a shareable run of show.",
    cell: "rounded-3xl border border-white/10 bg-[#141311] p-7",
    chip: "bg-white/10",
    iconClass: "text-white",
    titleClass: "text-white",
    bodyClass: "text-white/60",
  },
  {
    icon: Users,
    title: "Team roles",
    body: "Invite co-organizers with roles, from admin to volunteer, so everyone sees what they need.",
    cell: "rounded-3xl border border-white/10 bg-white/[0.06] p-7 lg:col-span-2",
    chip: "bg-white/10",
    iconClass: "text-white",
    titleClass: "text-white",
    bodyClass: "text-white/60",
  },
  {
    icon: ListChecks,
    title: "Task tracking",
    body: "Assign prep work with owners and due dates so nothing slips before doors open.",
    cell: "rounded-3xl bg-amber-400 p-7 text-[#17130e] shadow-[0_25px_70px_-40px_rgba(255,180,84,0.45)] lg:col-span-2",
    chip: "bg-black/10",
    iconClass: "text-[#17130e]",
    titleClass: "text-[#17130e]",
    bodyClass: "text-[#17130e]/75",
  },
  {
    icon: BarChart3,
    title: "Insights",
    body: "See registrations, capacity, and check-ins at a glance.",
    cell: "rounded-3xl border border-white/10 bg-[#141311] p-7",
    chip: "bg-white/10",
    iconClass: "text-white",
    titleClass: "text-white",
    bodyClass: "text-white/60",
  },
];

const landingFaqs = [
  {
    question: "How do I register for an event?",
    answer:
      "Open the event and click Register Now, review your details, and confirm. You receive a confirmation email immediately.",
  },
  {
    question: "What happens if I miss the registration deadline?",
    answer:
      "You may still be able to register on-site depending on availability. Check the event details or contact the organizer about walk-ins.",
  },
  {
    question: "Can I add an event to my calendar?",
    answer:
      "Yes. Use the Add to Calendar button on any event page. It works with Google Calendar, Outlook, Apple Calendar, or an ICS download.",
  },
  {
    question: "How do I contact support?",
    answer:
      "Reach the team through Help & Support in your account or email support@eventx.com. Responses typically arrive within 24 hours.",
  },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const reduceMotion = useReducedMotion();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const { data: rawEvents = [], isLoading } = useQuery({
    queryKey: ["public-events"],
    queryFn: async () => {
      try {
        const response = await getPublicEvents();
        return response.data || [];
      } catch (error) {
        console.error("Failed to fetch public events", error);
        return [];
      }
    },
  });

  const featuredEvents = rawEvents
    .filter((e: IEvent) => e.startDate && new Date(e.startDate) > new Date())
    .sort((a: IEvent, b: IEvent) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);

  const showUpcomingSection = isLoading || featuredEvents.length > 0;
  const discoverHref = featuredEvents.length > 0 ? "#discover" : "/discover-events";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE }
    }
  };

  const reveal = reduceMotion ? {} : { initial: "hidden" as const, whileInView: "visible" as const, viewport: { once: true, margin: "-80px" } };
  const primaryHref = isAuthenticated ? "/home" : "/register";
  const primaryLabel = isAuthenticated ? "Go to Dashboard" : "Start an Event";

  return (
    <div className="bg-[#0b0a09] text-[#f5f2ec]">
      {/* Hero: full-bleed stage */}
      <section className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1600&fit=crop"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#0b0a09] via-[#0b0a09]/85 to-[#0b0a09]/25" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-linear-to-t from-[#0b0a09] to-transparent" />

        <div className="relative mx-auto flex min-h-[86dvh] w-full max-w-6xl flex-col justify-center px-6 pb-20 pt-32 sm:px-10">
          <motion.div
            className="flex max-w-2xl flex-col gap-6"
            variants={containerVariants}
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
          >
            <motion.h1
              variants={itemVariants}
              className="text-balance text-5xl font-semibold leading-[1.02] tracking-tighter text-white sm:text-6xl lg:text-7xl"
            >
              Put your event in the spotlight.
            </motion.h1>

            <motion.p variants={itemVariants} className="max-w-xl text-lg leading-8 text-white/65">
              Registration, ticketing, agendas, door check-in, and insights.
              EventX runs the mechanics so you can run the show.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Link
                className="flex h-12 items-center justify-center whitespace-nowrap rounded-full bg-amber-400 px-7 text-sm font-semibold uppercase tracking-widest text-[#17130e] transition-colors hover:bg-amber-300 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-400 active:scale-[0.98]"
                href={primaryHref}
              >
                {primaryLabel}
              </Link>
              <a
                className="flex h-12 items-center justify-center whitespace-nowrap rounded-full border border-white/25 px-7 text-sm font-semibold uppercase tracking-widest text-white backdrop-blur-sm transition-colors hover:border-white/60 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-400 active:scale-[0.98]"
                href={discoverHref}
              >
                Browse Events
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-24 sm:px-10">

        {/* Trusted by */}
        <section className="pt-4">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
            Trusted by leading student organizations
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:justify-between">
            {clubs.map((club) => (
              <div key={club.name} className="flex items-center gap-2.5 opacity-75 transition-opacity hover:opacity-100">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-[11px] font-bold text-white/85"
                  aria-hidden="true"
                >
                  {club.initials}
                </span>
                <span className="whitespace-nowrap text-xs font-bold uppercase tracking-widest text-white/60">
                  {club.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming events (hidden when there is nothing upcoming) */}
        {showUpcomingSection && (
          <motion.section
            id="discover"
            {...reveal}
            variants={containerVariants}
            className="border-t border-white/10 pt-14"
          >
            <div className="mb-8 flex flex-col gap-3">
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-white">
                Upcoming campus events
              </h2>
              <Link
                href="/discover-events"
                className="group inline-flex w-fit items-center gap-1.5 rounded-sm text-sm font-semibold text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-amber-400 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                Browse Events
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </Link>
            </div>

            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#141311] p-5 animate-pulse">
                    <div>
                      <div className="h-40 w-full rounded-2xl bg-white/5" />
                      <div className="mt-4 h-6 w-3/4 rounded bg-white/5" />
                      <div className="mt-2 h-4 w-1/2 rounded bg-white/5" />
                      <div className="mt-3 h-4 w-5/6 rounded bg-white/5" />
                    </div>
                    <div className="mt-6 h-10 w-full rounded-full bg-white/5" />
                  </div>
                ))}
              </div>
            ) : featuredEvents.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-3">
                {featuredEvents.map((event: IEvent) => {
                  const formattedDate = new Date(event.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  });
                  const isFree = event.ticketPrice === 0;

                  const rawImg = (event as IEvent & { coverImage?: string }).coverImage || event.imageUrl;
                  let eventImgUrl = null;

                  if (rawImg && rawImg !== "null" && rawImg !== "undefined" && rawImg.trim() !== "") {
                    if (rawImg.startsWith("http")) {
                      eventImgUrl = rawImg;
                    } else {
                      const backendBase = (process.env.NEXT_PUBLIC_EVENTX_BACKEND_URL || "").replace("/api/v1", "");
                      eventImgUrl = `${backendBase}${rawImg.startsWith("/") ? "" : "/"}${rawImg}`;
                    }
                  }

                  return (
                    <motion.article
                      variants={itemVariants}
                      key={event.id}
                      className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#141311] transition-all duration-300 hover:-translate-y-1.5 hover:border-white/25 hover:shadow-[0_30px_70px_-40px_rgba(255,180,84,0.25)]"
                    >
                      <div className="relative h-40 w-full overflow-hidden bg-white/5">
                        {eventImgUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={eventImgUrl}
                            alt={event.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-white/10 to-white/[0.03] transition-transform duration-700 ease-out group-hover:scale-105">
                            <span className="text-2xl font-bold tracking-[0.3em] text-white/15">EVENTX</span>
                          </div>
                        )}

                        <div className="absolute right-4 top-4">
                          <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${isFree ? "bg-white/90 text-[#17130e]" : "bg-amber-400/90 text-[#17130e]"}`}>
                            {isFree ? "Free Entry" : `$${event.ticketPrice} Ticket`}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col justify-between p-6">
                        <div>
                          <h3 className="text-xl font-semibold leading-tight text-white line-clamp-2">
                            {event.title}
                          </h3>
                          <p className="mt-3 text-xs font-medium text-white/50">
                            {formattedDate} · {event.location || "Online"}
                          </p>
                          <p className="mt-3 text-sm leading-relaxed text-white/60 line-clamp-2">
                            {event.description || "No description provided."}
                          </p>
                        </div>
                        <Link
                          href={`/event/${event.id}`}
                          className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-full bg-white/10 text-xs font-semibold uppercase tracking-widest text-white transition-colors group-hover:bg-white group-hover:text-[#17130e] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-400"
                        >
                          View Details
                        </Link>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            ) : null}
          </motion.section>
        )}

        {/* How it works */}
        <section
          id="experiences"
          className="grid gap-12 border-t border-white/10 pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16"
        >
          <div className="flex flex-col gap-6">
            <h2 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tighter text-white sm:text-5xl">
              Launch your event in three simple steps.
            </h2>
            <p className="max-w-md text-base leading-7 text-white/60">
              From the first draft to the last check-in, EventX keeps your team
              and your audience on the same page.
            </p>
            <motion.figure
              initial={reduceMotion ? false : { clipPath: "inset(6% 5% 10% 5% round 24px)" }}
              whileInView={{ clipPath: "inset(0% 0% 0% 0% round 24px)" }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="overflow-hidden rounded-3xl border border-white/10 bg-[#141311]"
            >
              {/* TODO: replace with real event photography, landscape ~800x600 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&h=560&fit=crop"
                alt="Organizers planning an event schedule together around a table"
                loading="lazy"
                className="aspect-[10/7] w-full object-cover"
              />
            </motion.figure>
          </div>

          <ol className="divide-y divide-white/10 border-y border-white/10 lg:py-2">
            {steps.map((item) => (
              <li key={item.step} className="flex gap-7 py-9 first:pt-0 last:pb-0 lg:first:py-9">
                <span aria-hidden="true" className="text-5xl font-bold leading-none text-white/15">
                  {item.step}
                </span>
                <div className="pt-1">
                  <h3 className="text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-sm text-sm leading-7 text-white/60">
                    {item.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Features */}
        <section className="border-t border-white/10 pt-16">
          <div className="mb-10 flex max-w-2xl flex-col gap-3">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Everything you need to run the day
            </h2>
            <p className="text-base leading-7 text-white/60">
              One workspace covers the whole lifecycle, from the first ticket
              sold to the last guest scanned in.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className={feature.cell}>
                <span className={`inline-flex w-fit rounded-xl p-2.5 ${feature.chip}`} aria-hidden="true">
                  <feature.icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <h3 className={`mt-4 text-lg font-semibold ${feature.titleClass}`}>
                  {feature.title}
                </h3>
                <p className={`mt-2 max-w-md text-sm leading-6 ${feature.bodyClass}`}>
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ preview */}
        <section className="grid gap-10 border-t border-white/10 pt-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="flex flex-col items-start gap-4">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Questions, answered.
            </h2>
            <p className="max-w-sm text-base leading-7 text-white/60">
              The short version for newcomers. The full library covers
              payments, refunds, tickets, and account help.
            </p>
            <Link
              href="/faq"
              className="group mt-2 inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-amber-400 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              Read all questions
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="divide-y divide-white/10 border-y border-white/10">
            {landingFaqs.map((faq, index) => {
              const open = openFaq === index;
              return (
                <div key={faq.question}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : index)}
                    aria-expanded={open}
                    aria-controls={`landing-faq-${index}`}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    <span className="text-base font-semibold text-white">
                      {faq.question}
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-4 w-4 shrink-0 text-white/50 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    id={`landing-faq-${index}`}
                    role="region"
                    aria-label={faq.question}
                    className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-xl pb-5 pr-8 text-sm leading-6 text-white/65">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Get started */}
        <div
          id="get-started"
          className="flex flex-col gap-5 rounded-3xl bg-amber-400 px-7 py-9 text-[#17130e] sm:flex-row sm:items-center sm:justify-between sm:px-10"
        >
          <p className="text-balance text-2xl font-semibold tracking-tight sm:text-[1.7rem]">
            Your next event starts in EventX.
          </p>
          <Link
            className="inline-flex h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-black px-7 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-black/85 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black active:scale-[0.98]"
            href={primaryHref}
          >
            {primaryLabel}
          </Link>
        </div>
      </main>
    </div>
  );
}
