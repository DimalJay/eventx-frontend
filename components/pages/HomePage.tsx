'use client'
import { useAuth } from "../auth/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/service/eventService";
import { IEvent } from "@/service/types";

const highlights = [
  {
    label: "Registrations",
    value: "1,284",
    delta: "+12% this week",
  },
  {
    label: "Events in flight",
    value: "7",
    delta: "3 in build mode",
  },
  {
    label: "Team tasks",
    value: "14",
    delta: "5 due today",
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const { data: events = [], isLoading, isError } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      try {
        const response = await getEvents();
        return response.data;
      } catch (error) {
        return null;
      }
    },
    retry: false,
  })
  return (
    <div className="relative flex flex-1 justify-center overflow-hidden bg-[#f5f1ea]">
      <div className="pointer-events-none absolute -left-28 top-12 h-56 w-56 rounded-full bg-[#ffc9a7] opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-24 h-64 w-64 rounded-full bg-[#9fd3ff] opacity-35 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#ffe8a3] opacity-45 blur-3xl" />

      <main className="relative flex w-full max-w-6xl flex-col gap-10 px-8 py-16 sm:px-12">
        <header className="flex flex-col">
          <div className="flex items-center gap-3 flex-row justify-between">
            <div className="flex flex-col">
    
              
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/50">
                  EventX workspace
                </p>
                <p className="text-2xl font-semibold tracking-tight text-black">
                  Welcome back, {user?.firstName}.
                </p>
              

            </div>
          
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
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

        <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-3xl border border-black/10 bg-white/85 p-7 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.35)] backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                  Recently created events
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-black">
                  Fresh builds from your team
                </h2>
              </div>
              <button
                type="button"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-black/60 transition hover:text-black"
              >
                View all
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              {events.map((event:IEvent) => (
                <article
                  key={event.id}
                  className="grid gap-4 rounded-2xl border border-black/10 bg-white px-5 py-4 sm:grid-cols-[1.4fr_1fr_auto] sm:items-center"
                >
                  <div>
                   <div className="flex items-center gap-2">
                   <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${event.title}`}>
                   {event.title}
                   </span>
                   </div>
                    <h3 className="mt-3 text-lg font-semibold text-black">{event.title}</h3>
                    <p className="mt-1 text-sm text-black/60 truncate">{event.location}</p>                 
                   </div>
                  <div className="flex items-center justify-between gap-6 text-sm text-black/70 sm:justify-start">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-black/40">Date</p>
                      <p className="mt-1 font-semibold text-black">
                      {new Date(event.startDate).toLocaleDateString('en-US', {
                       year: 'numeric',
                       month: 'short',
                       day: 'numeric',
                       })}
                       </p>
                    </div>
                    {event.capacity <= 10 && (
                    <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-orange-500/80">Hurry</p>
                    <p className="mt-1 font-semibold text-orange-600">Only {event.capacity} Spots Left</p>
                    </div>
                  )} 
                  </div>
                 <div className="flex flex-col items-end gap-2 sm:items-center">
                   <span className={`text-xs ${event.ticketPrice === 0 || !event.ticketPrice ? 'font-bold text-green-600' : 'text-black/50'}`}>
                    {event.ticketPrice === 0 || !event.ticketPrice ? "Free" : `$${event.ticketPrice}`}
                    </span>

                   <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
                  >
                View details
                  </button>
                 </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="grid gap-4">
            <div className="rounded-3xl border border-black/10 bg-black p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                Next milestone
              </p>
              <p className="mt-3 text-2xl font-semibold">
                Finalize keynote line-up
              </p>
              <p className="mt-3 text-sm text-white/70">
                You have 3 pending speaker confirmations and 1 agenda slot left to fill.
              </p>
              <button
                type="button"
                className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-xs font-semibold uppercase tracking-widest text-black"
              >
                Review agenda
              </button>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white/80 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                Team activity
              </p>
              <div className="mt-4 grid gap-4 text-sm text-black/70">
                <div className="rounded-2xl border border-black/5 bg-white px-4 py-3">
                  <p className="font-semibold text-black">New sponsor deck uploaded</p>
                  <p className="mt-1 text-xs text-black/50">2 hours ago · Marketing</p>
                </div>
                <div className="rounded-2xl border border-black/5 bg-white px-4 py-3">
                  <p className="font-semibold text-black">Registration email approved</p>
                  <p className="mt-1 text-xs text-black/50">Yesterday · Comms</p>
                </div>
                <div className="rounded-2xl border border-black/5 bg-white px-4 py-3">
                  <p className="font-semibold text-black">Venue walkthrough scheduled</p>
                  <p className="mt-1 text-xs text-black/50">Mon · Ops</p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
