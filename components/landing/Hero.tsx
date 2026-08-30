"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { IEvent } from "@/types";
import TiltCard from "./TiltCard";
import ShaderBackground from "./ShaderBackground";

const HERO_MAIN = "https://picsum.photos/seed/eventx-stage-lights/820/1024";
const HERO_SUB = "https://picsum.photos/seed/eventx-audience/640/640";

type HeroProps = {
  isAuthenticated: boolean;
  featuredEvent?: IEvent;
};

export default function Hero({ isAuthenticated, featuredEvent }: HeroProps) {
  const reduce = useReducedMotion();

  const headline = (
    <>
      Run events people{" "}
      <span className="text-primary">show up</span> for.
    </>
  );

  const primaryHref = isAuthenticated ? "/event/create" : "/register";

  return (
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
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="max-w-[14ch] font-display text-5xl font-medium leading-[1.02] tracking-tight text-zinc-900 sm:text-6xl xl:text-7xl"
          >
            {headline}
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="max-w-[46ch] text-lg leading-8 text-zinc-600"
          >
            One workspace for campus clubs to plan, ticket, and run events with
            live engagement, from RSVP to encore.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link
              href={primaryHref}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-white transition hover:bg-primary-strong active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Create an event
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
            <a
              href="#events"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-zinc-300 px-7 text-sm font-semibold text-zinc-800 transition hover:border-primary hover:text-primary active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Explore events
              <ArrowDown className="h-4 w-4" strokeWidth={2} />
            </a>
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
                  src={HERO_MAIN}
                  alt="Stage lights over a packed campus event"
                  className="h-full w-full rounded-2xl object-cover ring-1 ring-zinc-200/70 transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </TiltCard>

            <div className="absolute -bottom-8 -left-4 z-10 w-2/5 lg:-left-8">
              <TiltCard className="group" max={11} scaleHover={1.03}>
                <div
                  className="aspect-square overflow-hidden rounded-2xl border-[5px] border-white shadow-lg shadow-zinc-900/10"
                  style={{ transform: "translateZ(28px)" }}
                >
                  <img
                    src={HERO_SUB}
                    alt="Audience during a live talk"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </TiltCard>
            </div>

            {featuredEvent && (
              <div className="absolute -top-6 right-4 w-56 rotate-1 rounded-2xl bg-white/95 p-4 shadow-xl shadow-zinc-900/10 ring-1 ring-zinc-200/80 backdrop-blur lg:-right-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Next up
                </p>
                <p className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-zinc-900">
                  {featuredEvent.title}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {new Date(featuredEvent.startDate).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric" }
                  )}
                </p>
                <Link
                  href={`/event/${featuredEvent.id}`}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-strong"
                >
                  View details
                  <ArrowRight className="h-3 w-3" strokeWidth={2} />
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}