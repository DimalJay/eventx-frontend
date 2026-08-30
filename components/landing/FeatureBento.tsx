"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Ticket, ScanLine, Activity } from "lucide-react";

const BENTO_TALL = "https://picsum.photos/seed/eventx-workshop/760/880";
const BENTO_SQUARE = "https://picsum.photos/seed/eventx-conference/640/640";

const features = [
  {
    title: "Ticketing that sells out",
    body: "Paid or free, with a checkout that matches your club. No paper, no clipboard.",
    icon: Ticket,
  },
  {
    title: "Check-in at the door",
    body: "Scan QR codes and know exactly who is in the room, in real time.",
    icon: ScanLine,
  },
  {
    title: "Live engagement",
    body: "Polls, Q&A and reactions that keep the crowd in the moment.",
    icon: Activity,
  },
];

export default function FeatureBento() {
  const reduce = useReducedMotion();
  const reveal = {
    initial: reduce ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:py-28">
        <motion.div {...reveal} className="max-w-2xl">
          <h2 className="font-display text-4xl font-medium tracking-tight text-zinc-900 md:text-5xl">
            One workspace for every moving part.
          </h2>
          <p className="mt-5 max-w-[58ch] text-lg leading-8 text-zinc-600">
            Design the event, sell tickets, brief your team, then run it live.
            EventX keeps every piece in sync, so nothing falls between the gaps.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:auto-rows-fr">
          <motion.div
            {...reveal}
            transition={{ ...reveal.transition, delay: 0.05 }}
            className="relative min-h-64 overflow-hidden rounded-2xl sm:col-span-2 lg:col-span-2 lg:row-span-2 lg:h-full"
          >
            <img
              src={BENTO_TALL}
              alt="Students building things together in a workshop"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </motion.div>

          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              {...reveal}
              transition={{ ...reveal.transition, delay: 0.05 * (idx + 2) }}
              className={`flex flex-col justify-between rounded-2xl p-6 ${
                idx === 1
                  ? "bg-primary-faint ring-1 ring-primary/10"
                  : "bg-white ring-1 ring-zinc-200/70"
              } ${idx === 2 ? "sm:col-span-2" : ""} lg:col-span-2`}
            >
              <div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <feature.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 font-display text-xl font-medium text-zinc-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {feature.body}
                </p>
              </div>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                {["create", "attend", "engage"][idx]}
              </p>
            </motion.div>
          ))}

          <motion.div
            {...reveal}
            transition={{ ...reveal.transition, delay: 0.25 }}
            className="relative min-h-56 overflow-hidden rounded-2xl sm:col-span-2 lg:col-span-2 lg:h-full"
          >
            <img
              src={BENTO_SQUARE}
              alt="A speaker on stage addressing a conference hall"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}