"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getPublicEvents } from "@/service/eventService";
import { IEvent, WithID } from "@/types";
import Select from "../widgets/Select";
import { formatPrice } from "@/lib/utils";
import { Search, CalendarDays, MapPin, ArrowRight, RotateCcw, AlertCircle, Video } from "lucide-react";
import ShaderBackground from "../landing/ShaderBackground";

export default function DiscoverEvents() {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-asc");

  // Fetch events from backend
  const { data: rawEvents = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["public-events"],
    queryFn: async () => {
      try {
        const response = await getPublicEvents();
        return response.data || [];
      } catch (error) {
        throw error;
      }
    },
    retry: false,
  });

  // Safe typed list of events (only show public events)
  const events = useMemo(() => {
    return (rawEvents as WithID<IEvent>[]).filter(
      (event) => event.isPublic !== false && String(event.isPublic) !== "false"
    );
  }, [rawEvents]);

  // Handle filtering logic
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        event.title.toLowerCase().includes(query) ||
        (event.description && event.description.toLowerCase().includes(query)) ||
        (event.location && event.location.toLowerCase().includes(query));

      let matchesPrice = true;
      const price = Number(event.ticketPrice) || 0;
      if (priceFilter === "free") {
        matchesPrice = price === 0;
      } else if (priceFilter === "paid") {
        matchesPrice = price > 0;
      }

      let matchesDate = true;
      if (dateFilter !== "all") {
        const now = new Date();
        const eventDate = new Date(event.startDate);
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const eventDateStart = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

        if (dateFilter === "today") {
          matchesDate = todayStart.getTime() === eventDateStart.getTime();
        } else if (dateFilter === "week") {
          const sevenDaysLater = new Date(todayStart);
          sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
          matchesDate = eventDate >= todayStart && eventDate <= sevenDaysLater;
        } else if (dateFilter === "month") {
          matchesDate =
            eventDate.getFullYear() === now.getFullYear() &&
            eventDate.getMonth() === now.getMonth();
        } else if (dateFilter === "upcoming") {
          matchesDate = eventDate >= now;
        }
      }

      return matchesSearch && matchesPrice && matchesDate;
    });
  }, [events, searchQuery, priceFilter, dateFilter]);

  // Handle sorting logic
  const sortedEvents = useMemo(() => {
    const sorted = [...filteredEvents];
    sorted.sort((a, b) => {
      if (sortBy === "date-asc") {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      } else if (sortBy === "date-desc") {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      } else if (sortBy === "price-asc") {
        return (Number(a.ticketPrice) || 0) - (Number(b.ticketPrice) || 0);
      } else if (sortBy === "price-desc") {
        return (Number(b.ticketPrice) || 0) - (Number(a.ticketPrice) || 0);
      } else if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
    return sorted;
  }, [filteredEvents, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setDateFilter("all");
    setPriceFilter("all");
    setSortBy("date-asc");
  };

  const isFiltered = searchQuery || dateFilter !== "all" || priceFilter !== "all" || sortBy !== "date-asc";

  return (
    <div className="relative flex flex-1 justify-center overflow-hidden bg-white">
      <ShaderBackground />

      <main className="relative flex w-full max-w-6xl flex-col gap-10 px-6 py-16 sm:px-10 sm:py-20">
        {/* Header section matching landing style */}
        <header className="flex flex-col gap-4">
          <div>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Discover
            </span>
          </div>
          <h1 className="font-display text-4xl font-medium tracking-tight text-zinc-900 md:text-5xl">
            Explore campus events.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600">
            Find and register for workshops, summits, and experiences near you or online.
          </p>
        </header>

        {/* Filter controls panel */}
        <section className="flex flex-col gap-4 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs lg:flex-row lg:items-center">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by title, description, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Filtering and Sorting dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-500">Date:</span>
              <Select
                value={dateFilter}
                onChange={setDateFilter}
                className="h-11 min-w-[130px] rounded-xl px-3 py-2 text-xs"
                options={[
                  { value: "all", label: "All Dates" },
                  { value: "today", label: "Today" },
                  { value: "week", label: "This Week" },
                  { value: "month", label: "This Month" },
                  { value: "upcoming", label: "Upcoming" },
                ]}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-500">Price:</span>
              <Select
                value={priceFilter}
                onChange={(p) => setPriceFilter(p)}
                className="h-11 min-w-[120px] rounded-xl px-3 py-2 text-xs"
                options={[
                  { value: "all", label: "All Prices" },
                  { value: "free", label: "Free" },
                  { value: "paid", label: "Paid" },
                ]}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-500">Sort:</span>
              <Select
                value={sortBy}
                onChange={setSortBy}
                className="h-11 min-w-[170px] rounded-xl px-3 py-2 text-xs"
                options={[
                  { value: "date-asc", label: "Date: Soonest first" },
                  { value: "date-desc", label: "Date: Latest first" },
                  { value: "price-asc", label: "Price: Low to High" },
                  { value: "price-desc", label: "Price: High to Low" },
                  { value: "title-asc", label: "Name: A to Z" },
                ]}
              />
            </div>

            {/* Clear button */}
            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            )}
          </div>
        </section>

        {/* Content Area */}
        <section className="min-h-[300px] w-full">
          {isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200/70 shadow-xs"
                >
                  <div className="h-44 animate-pulse bg-zinc-100" />
                  <div className="space-y-3 p-5">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-100" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-100" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-100" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center shadow-xs">
              <AlertCircle className="mb-3 h-10 w-10 text-red-500" />
              <h3 className="text-base font-semibold text-zinc-900">Failed to load events</h3>
              <p className="mt-1 text-sm text-zinc-500 max-w-sm">
                There was an error communicating with the backend. Please try again.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-zinc-900 px-6 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-zinc-800"
              >
                Retry
              </button>
            </div>
          )}

          {!isLoading && !isError && sortedEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center shadow-xs">
              <div className="mb-3 rounded-full bg-zinc-100 p-4 text-zinc-400">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900">No events found</h3>
              <p className="mt-1 text-sm text-zinc-500 max-w-sm">
                We couldn&apos;t find any events matching your current search query or filter selection.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-zinc-900 px-6 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-zinc-800"
              >
                Reset Filters
              </button>
            </div>
          )}

          {!isLoading && !isError && sortedEvents.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedEvents.map((event) => {
                const eventId = event.id || (event as WithID<IEvent>)._id;
                const isFree = Number(event.ticketPrice) || 0;
                const displayPrice = isFree === 0 ? "Free entry" : formatPrice(event.ticketPrice);

                const eventDate = new Date(event.startDate);
                const displayDate = eventDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });

                const isOnline =
                  event.eventType === "online" ||
                  event.location?.toLowerCase().includes("online") ||
                  event.location?.toLowerCase().includes("zoom") ||
                  event.location?.toLowerCase().includes("http");

                // Get cover image path from database or mockup
                const rawImg = (event as IEvent & { coverImage?: string }).coverImage || event.imageUrl;
                const backendBaseUrl = process.env.NEXT_PUBLIC_EVENTX_BACKEND_URL?.replace("/api/v1", "") || "";
                const imageUrl = (rawImg && rawImg !== "null" && rawImg !== "undefined" && rawImg.trim() !== "")
                  ? (rawImg.startsWith("http") ? rawImg : `${backendBaseUrl}${rawImg}`)
                  : `https://picsum.photos/seed/eventx-${eventId}/720/400`;

                return (
                  <article
                    key={eventId}
                    className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200/70 shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-900/5"
                  >
                    {/* Event cover image */}
                    <div className="relative h-44 w-full overflow-hidden bg-zinc-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />

                      {/* Online badge */}
                      {isOnline && (
                        <div className="absolute right-3 top-3">
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-zinc-800 shadow-xs backdrop-blur-xs">
                            <Video className="h-3 w-3 text-primary" />
                            Online
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Content details */}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-zinc-900 transition-colors group-hover:text-primary">
                        {event.title}
                      </h3>

                      {event.description && (
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-600">
                          {event.description}
                        </p>
                      )}

                      <div className="mt-4 flex flex-col gap-1.5 text-sm text-zinc-500">
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-zinc-400" strokeWidth={1.75} />
                          {displayDate}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          {isOnline ? (
                            <Video className="h-4 w-4 text-zinc-400" strokeWidth={1.75} />
                          ) : (
                            <MapPin className="h-4 w-4 text-zinc-400" strokeWidth={1.75} />
                          )}
                          <span className="truncate">
                            {event.location || (isOnline ? "Online Event" : "Location TBA")}
                          </span>
                        </span>
                      </div>

                      {/* Capacity details and CTA */}
                      <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4">
                        <span className="text-sm font-semibold text-primary">
                          {displayPrice}
                        </span>

                        <Link
                          href={`/event/${eventId}`}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-700 transition hover:text-primary"
                        >
                          <span>View details</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
