'use client'
import Link from "next/link";
import React from "react";
import { useAuth } from "../auth/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getPublicEvents } from "@/service/eventService";
import { IEvent } from "@/service/types";
import { motion } from "framer-motion";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" as const }
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-linear-to-br from-[#f7efe2] via-white to-[#e5f4ff] overflow-hidden">
      <main className="flex w-full max-w-5xl flex-col gap-12 px-8 py-24 sm:px-14">

        {/* --- Hero Section (Animated) --- */}
        <motion.div
          className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col gap-6">
            <motion.p variants={itemVariants} className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black shadow-sm">
              The modern event engine
            </motion.p>
            <motion.h1 variants={itemVariants} className="text-4xl font-semibold leading-tight tracking-tight text-black sm:text-5xl">
              Launch unforgettable experiences with EventX.
            </motion.h1>
            <motion.p variants={itemVariants} className="max-w-xl text-lg leading-8 text-black/70">
              EventX powers the full event lifecycle in one place: registration, ticketing, agenda design, and real-time engagement.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row">
              {isAuthenticated ? (
                <Link
                  className="flex h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition-all hover:bg-black/80 hover:scale-105 active:scale-95 shadow-lg"
                  href="/home"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <a
                  className="flex h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition-all hover:bg-black/80 hover:scale-105 active:scale-95 shadow-lg"
                  href="#get-started"
                >
                  Start an Event
                </a>
              )}
              <a
                className="flex h-12 items-center justify-center rounded-full border border-black/20 px-6 text-sm font-semibold uppercase tracking-widest text-black transition-all hover:border-black hover:bg-black/5 hover:scale-105 active:scale-95"
                href="#experiences"
              >
                Explore Experiences
              </a>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="grid gap-4 rounded-3xl border border-black/10 bg-white/70 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.3)] backdrop-blur transition-transform hover:-translate-y-2 hover:shadow-[0_30px_70px_-40px_rgba(0,0,0,0.4)] duration-500"
          >
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-black/60">
              <span>Live dashboard</span>
              <span>EventX HQ</span>
            </div>
            <div className="grid gap-4">
              <div className="rounded-2xl border border-black/10 bg-[#f2f6ff] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">Registrations</p>
                <p className="mt-3 text-3xl font-semibold text-black">12,482</p>
                <p className="text-sm text-black/60">+18% week over week</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">Engagement Pulse</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-3xl font-semibold text-black">94%</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                    On track
                  </span>
                </div>
                <p className="text-sm text-black/60">Real-time audience energy</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="border-t border-black/10 pt-10 text-center"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
            Trusted by leading student organizations
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-sm font-semibold tracking-wider text-black/50">
            {["IEEE Student Branch", "Gavel Club", "Rotaract Club", "Aero Society", "CS Student Union"].map((club, idx) => (
              <motion.span
                key={idx}
                whileHover={{ scale: 1.1, color: "#000" }}
                className="transition-colors cursor-default"
              >
                {club}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="border-t border-black/10 pt-10"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <motion.div variants={itemVariants}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                Discover
              </p>
              <h2 className="text-2xl font-semibold text-black tracking-tight mt-1">
                Upcoming Campus Events
              </h2>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                href="/discover-events"
                className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 px-5 text-xs font-semibold uppercase tracking-widest text-black transition-all hover:border-black/40 hover:scale-105 active:scale-95"
              >
                Explore All Events
              </Link>
            </motion.div>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex flex-col justify-between rounded-[24px] border border-black/5 bg-white/40 p-6 animate-pulse">
                  <div>
                    {/* Image Area Skeleton */}
                    <div className="h-36 w-full rounded-[16px] bg-black/5" />
                    {/* Title Skeleton */}
                    <div className="mt-4 h-6 w-3/4 rounded bg-black/5" />
                    {/* Date/Location Skeleton */}
                    <div className="mt-2 h-4 w-1/2 rounded bg-black/5" />
                    {/* Description Skeleton */}
                    <div className="mt-3 h-4 w-5/6 rounded bg-black/5" />
                  </div>
                  <div className="mt-6 h-10 w-full rounded-full bg-black/5" />
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
                    // අනිත් පිටු වල මෙන් '/api/v1' කොටස ඉවත් කර Base URL එක ගැනීම
                    const backendBase = (process.env.NEXT_PUBLIC_EVENTX_BACKEND_URL || "").replace("/api/v1", "");
                    eventImgUrl = `${backendBase}${rawImg.startsWith("/") ? "" : "/"}${rawImg}`;
                  }
                }


                return (
                  <motion.div
                    variants={itemVariants}
                    key={event.id}
                    className="group flex flex-col overflow-hidden rounded-[24px] border border-black/10 bg-white/70 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.2)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_60px_-25px_rgba(0,0,0,0.3)]"
                  >
                    <div className="relative h-36 w-full overflow-hidden bg-black/5">

                      {eventImgUrl ? (
                        <img
                          src={eventImgUrl}
                          alt={event.title}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-black/5 to-black/10 transition-transform duration-700 ease-out group-hover:scale-110">
                          <span className="text-2xl font-bold tracking-[0.3em] text-black/10">EVENTX</span>
                        </div>
                      )}

                      <div className="absolute right-4 top-4">
                        <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-black shadow-sm backdrop-blur-md">
                          {isFree ? "Free Entry" : `$${event.ticketPrice} Ticket`}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <h3 className="text-xl font-semibold leading-tight text-black line-clamp-2">
                          {event.title}
                        </h3>
                        <p className="mt-3 text-xs font-medium text-black/50">
                          {formattedDate} · {event.location || "Online"}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-black/60 line-clamp-2">
                          {event.description || "No description provided."}
                        </p>
                      </div>
                      <Link
                        href={`/event/${event.id}`}
                        className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-full bg-black/5 text-xs font-semibold uppercase tracking-widest text-black transition-all group-hover:bg-black group-hover:text-white"
                      >
                        View Details
                      </Link>
                    </div>
                  </motion.div>

                );
              })}
            </div>
          ) : (
            <motion.div variants={itemVariants} className="rounded-2xl border border-black/10 border-dashed py-12 text-center text-sm text-black/50">
              No upcoming campus events at the moment.
            </motion.div>
          )}
        </motion.div>

        {/* --- How EventX Works --- */}
        <motion.section
          id="experiences"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="border-t border-black/10 pt-16"
        >
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
              How It Works
            </p>

            <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-black">
              Launch your event
              <span className="block text-black/50">
                in three simple steps.
              </span>
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-2">
            {[
              {
                step: "01",
                title: "Create Event",
                desc: "Set event details, schedule, location and branding."
              },
              {
                step: "02",
                title: "Sell Tickets",
                desc: "Accept registrations and manage attendees easily."
              },
              {
                step: "03",
                title: "Run & Engage",
                desc: "Track attendance, polls and audience engagement."
              }
            ].map((item, idx) => (
              <React.Fragment key={item.step}>

                {/* Card */}
                <motion.div
                  variants={itemVariants}
                  whileHover={{
                    y: -12,
                    scale: 1.03,
                  }}
                  className="group relative flex-1 w-full rounded-[28px] border border-black/10 bg-white/80 p-8 backdrop-blur-sm overflow-hidden"
                >
                  {/* Glow */}
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      delay: idx,
                    }}
                    className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-black/[0.04] blur-3xl"
                  />

                  <div className="relative z-10">
                    <span className="text-5xl font-bold text-black/10">
                      {item.step}
                    </span>

                    <h3 className="mt-6 text-xl font-semibold text-black">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-black/60">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>

                {/* Connector */}
                {idx !== 2 && (
                  <div className="hidden lg:flex flex-1 items-center justify-center relative min-w-[140px] max-w-[240px]">
                    <div className="w-full h-[2px] rounded-full bg-gradient-to-r from-black/5 via-black/15 to-black/5 relative overflow-hidden">

                      <motion.div
                        animate={{
                          x: ["-300%", "400%"]
                        }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: idx * 0.6,
                        }}
                        className="absolute top-0 bottom-0 left-0 w-[50px] bg-black rounded-full"
                      />
                    </div>
                  </div>
                )}


              </React.Fragment>
            ))}
          </div>
        </motion.section>



        {/* --- 4. Get Started Section (Animated on Scroll) --- */}
        <motion.div
          id="get-started"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-start gap-3 rounded-3xl border border-black/10 bg-black px-6 py-8 text-white sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              Ready to launch?
            </p>
            <p className="mt-2 text-2xl font-semibold">Your next event starts in EventX.</p>
          </div>
          <Link
            className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold uppercase tracking-widest text-black transition-transform hover:scale-105 active:scale-95"
            href={isAuthenticated ? "/event/create" : "/register"}
          >
            Create workspace
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
