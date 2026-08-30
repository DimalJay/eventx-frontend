"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle,
  LayoutDashboard,
  Target,
  Ticket,
  Users,
} from "lucide-react";
import Logo from "@/components/widgets/Logo";
import TiltCard from "@/components/landing/TiltCard";
import ShaderBackground from "@/components/landing/ShaderBackground";

const HERO_IMAGE = "https://picsum.photos/seed/eventx-campus/880/1100";

const intent = [
  {
    title: "Who we are",
    body: "EventX is built for modern universities and their clubs. It brings administrators, organizers, coordinators, and participants together on one platform instead of a tangle of spreadsheets and temporary sites.",
  },
  {
    title: "Our mission",
    body: "To give every campus event team a simple, reliable workspace for planning, ticketing, and live engagement, so running a great event is the default, not the exception.",
  },
  {
    title: "Our vision",
    body: "To become the shared operating system for university events, where every institution plans, runs, and understands its events in one place.",
  },
];

const pillars = [
  {
    icon: LayoutDashboard,
    title: "Event planning",
    desc: "Create and manage events with capacity, venue, dates, and custom registration forms.",
  },
  {
    icon: Ticket,
    title: "QR ticketing",
    desc: "Issue instant digital tickets by email for fast, paperless check-in at the door.",
  },
  {
    icon: CheckCircle,
    title: "Attendance tracking",
    desc: "Scan codes for accurate, real-time attendance records that need no cleanup.",
  },
  {
    icon: Target,
    title: "Team coordination",
    desc: "Assign tasks to your organizing team and track progress without status meetings.",
  },
  {
    icon: Users,
    title: "Capacity & waitlists",
    desc: "Handle oversubscribed events with automatic waitlists and role-based access.",
  },
  {
    icon: BrainCircuit,
    title: "Feedback & analytics",
    desc: "Collect ratings, read AI-powered sentiment, and export clear reports after the event.",
  },
];

export default function AboutUsPage() {
  const reduce = useReducedMotion();

  const fade: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden pt-12">
        <ShaderBackground />

        <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 px-6 pb-16 pt-20 md:pt-24 lg:grid-cols-12 lg:gap-10 lg:pb-24 lg:pt-20">
          <motion.div
            className="flex flex-col gap-7 lg:col-span-7"
            initial={reduce ? false : "hidden"}
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.09 } },
            }}
          >
            <motion.p
              variants={fade}
              className="text-sm font-semibold uppercase tracking-[0.16em] text-primary"
            >
              About EventX
            </motion.p>

            <motion.h1
              variants={fade}
              className="max-w-[16ch] font-display text-5xl font-medium leading-[1.02] tracking-tight text-zinc-900 sm:text-6xl xl:text-7xl"
            >
              One workspace, every campus event.
            </motion.h1>

            <motion.p
              variants={fade}
              className="max-w-[46ch] text-lg leading-8 text-zinc-600"
            >
              EventX is a modern platform that brings organizers, participants,
              and administrators together to plan, ticket, and run events on
              campus, from the first RSVP to the final report.
            </motion.p>

            <motion.div variants={fade}>
              <Link
                href="/discover-events"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-white transition hover:bg-primary-strong active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Explore events
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:col-span-5"
            initial={reduce ? false : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            <div className="relative mx-auto w-full max-w-104 lg:max-w-none">
              <TiltCard className="group" max={6} scaleHover={1.015}>
                <div
                  className="aspect-4/5 max-h-120 w-full"
                  style={{ transform: "translateZ(36px)" }}
                >
                  <img
                    src={HERO_IMAGE}
                    alt="Students gathered at a campus event"
                    className="h-full w-full rounded-2xl object-cover ring-1 ring-zinc-200/70 transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </TiltCard>

              <div className="absolute -bottom-6 left-6 z-10 rounded-2xl bg-white p-4 shadow-xl shadow-zinc-900/10 ring-1 ring-zinc-200/80">
                <div className="flex items-center gap-2">
                  <Logo className="h-5 w-5" />
                  <span className="font-display text-sm font-medium text-zinc-900">
                    EventX
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  One platform for your campus event team
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section>
        <motion.div
          className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-12 lg:gap-16 lg:py-24"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="lg:col-span-5">
            <h2 className="font-display text-3xl font-medium tracking-tight text-zinc-900 sm:text-4xl">
              A single home for campus events
            </h2>
            <p className="mt-4 max-w-[42ch] text-lg leading-8 text-zinc-600">
              Fragmented spreadsheets, temporary sites, and scattered sign-up
              links. EventX replaces the chaos with one workflow every role can
              share.
            </p>
          </div>

          <div className="lg:col-span-7">
            {intent.map((item) => (
              <div
                key={item.title}
                className="border-t border-zinc-200 py-8"
              >
                <h3 className="text-lg font-semibold text-zinc-900">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-[52ch] text-base leading-7 text-zinc-600">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="border-y border-zinc-200/80 bg-zinc-50/70">
        <motion.div
          className="mx-auto w-full max-w-6xl px-6 py-20 lg:py-24"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-col gap-3">
            <h2 className="font-display text-3xl font-medium tracking-tight text-zinc-900 sm:text-4xl">
              Everything a campus event needs
            </h2>
            <p className="max-w-[52ch] text-base leading-7 text-zinc-600">
              One platform that covers the whole lifecycle, from planning to the
              post-event report.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-900/5"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary transition-transform duration-300 group-hover:scale-110">
                  <pillar.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="text-base font-semibold text-zinc-900">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="bg-white">
        <motion.div
          className="mx-auto w-full max-w-6xl px-6 pb-24"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary to-primary-strong px-6 py-16 text-center md:px-16 md:py-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-8 top-8 flex gap-2"
            >
              {Array.from({ length: 7 }).map((_, i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full bg-white/30" />
              ))}
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-8 right-8 flex gap-2"
            >
              {Array.from({ length: 7 }).map((_, i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full bg-white/30" />
              ))}
            </div>

            <h2 className="mx-auto max-w-2xl font-display text-3xl font-medium tracking-tight text-white md:text-5xl">
              Your club&apos;s next big night starts here.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/85">
              Pick a date, add your lineup, and share the link with your
              members.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-semibold text-primary transition hover:bg-primary-soft active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get started free
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}