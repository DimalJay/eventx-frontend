"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getPublicEvents } from "@/service/eventService";
import { IEvent, WithID } from "@/service/types";
import Select from "../widgets/Select";
import Logo from "../widgets/Logo";
import { FiSearch, FiCalendar, FiMapPin, FiInfo } from "react-icons/fi";

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

  // Safe typed list of events (only show public events by default for discovery)
  const events = useMemo(() => {
    return (rawEvents as WithID<IEvent>[]).filter(
      (event) => event.isPublic !== false && String(event.isPublic) !== "false"
    );
  }, [rawEvents]);

  // Handle filtering logic
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // 1. Search Query Filter (Title, Description, Location)
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        event.title.toLowerCase().includes(query) ||
        (event.description && event.description.toLowerCase().includes(query)) ||
        (event.location && event.location.toLowerCase().includes(query));

      // 2. Price Filter
      let matchesPrice = true;
      const price = Number(event.ticketPrice) || 0;
      if (priceFilter === "free") {
        matchesPrice = price === 0;
      } else if (priceFilter === "paid") {
        matchesPrice = price > 0;
      }

      // 3. Date Filter
      let matchesDate = true;
      if (dateFilter !== "all") {
        const now = new Date();
        const eventDate = new Date(event.startDate);

        // Reset time parts for date comparison
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

  // Reset filters handler
  const handleResetFilters = () => {
    setSearchQuery("");
    setDateFilter("all");
    priceFilter !== "all" && setPriceFilter("all");
    setSortBy("date-asc");
  };

  return (
    <div className="relative flex flex-1 justify-center overflow-hidden bg-[#f5f1ea]">
      {/* Decorative blurred backdrop elements */}
      <div className="pointer-events-none absolute -left-28 top-12 h-56 w-56 rounded-full bg-[#ffc9a7] opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-24 h-64 w-64 rounded-full bg-[#9fd3ff] opacity-35 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#ffe8a3] opacity-45 blur-3xl" />

      <main className="relative flex w-full max-w-6xl flex-col gap-10 px-6 py-20 sm:px-10 sm:py-24">
        {/* Header section */}
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Logo />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/50">
                  Explore events
                </p>
                <p className="text-2xl font-semibold tracking-tight text-black">
                  Discover Events
                </p>
              </div>
            </div>
            <p className="max-w-2xl text-base leading-7 text-black/70">
              Find and register for workshops, summits, and experiences near you or online.
            </p>
          </div>
        </header>

        {/* Filter controls panel */}
        <section className="relative z-10 flex flex-col gap-4 rounded-3xl border border-black/10 bg-white/85 p-5 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.35)] backdrop-blur xl:flex-row xl:items-center">
          {/* Search bar */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
            <input
              type="text"
              placeholder="Search by title, description or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 rounded-xl border border-black/10 bg-white py-2 pl-11 pr-4 text-sm text-black outline-none transition focus:border-black/40 focus:ring-2 focus:ring-black/5 placeholder:text-black/35"
            />
          </div>

          {/* Filtering and Sorting dropdowns */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-black/45">Date</span>
              <Select
                value={dateFilter}
                onChange={setDateFilter}
                className="px-3 py-2 h-11 min-w-[130px] rounded-xl"
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
              <span className="text-xs font-semibold uppercase tracking-wider text-black/45">Price</span>
              <Select
                value={priceFilter}
                onChange={priceFilter => setPriceFilter(priceFilter)}
                className="px-3 py-2 h-11 min-w-[130px] rounded-xl"
                options={[
                  { value: "all", label: "All Prices" },
                  { value: "free", label: "Free" },
                  { value: "paid", label: "Paid" },
                ]}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-black/45">Sort By</span>
              <Select
                value={sortBy}
                onChange={setSortBy}
                className="px-3 py-2 h-11 min-w-[170px] rounded-xl"
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
            {(searchQuery || dateFilter !== "all" || priceFilter !== "all" || sortBy !== "date-asc") && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="ml-auto text-xs font-semibold uppercase tracking-wider text-black/60 hover:text-black transition underline underline-offset-4 xl:ml-2"
              >
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
                  className="animate-pulse rounded-3xl border border-black/10 bg-white/80 p-5 flex flex-col gap-4 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.15)]"
                >
                  <div className="h-44 w-full rounded-2xl bg-black/5" />
                  <div className="h-6 w-3/4 rounded-md bg-black/5" />
                  <div className="h-4 w-1/2 rounded-md bg-black/5" />
                  <div className="h-4 w-full rounded-md bg-black/5" />
                  <div className="h-9 w-full rounded-full bg-black/5 mt-auto" />
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-black/10 bg-white/85 p-12 text-center backdrop-blur shadow-[0_25px_70px_-45px_rgba(0,0,0,0.35)]">
              <FiInfo className="h-10 w-10 text-red-500/80 mb-4" />
              <h3 className="text-lg font-semibold text-black">Failed to load events</h3>
              <p className="mt-2 text-sm text-black/60 max-w-sm">
                There was an error communicating with the backend. Please try again.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
              >
                Retry
              </button>
            </div>
          )}

          {!isLoading && !isError && sortedEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-black/10 bg-white/85 p-12 text-center backdrop-blur shadow-[0_25px_70px_-45px_rgba(0,0,0,0.35)]">
              <div className="rounded-full bg-black/5 p-4 mb-4">
                <FiSearch className="h-8 w-8 text-black/45" />
              </div>
              <h3 className="text-lg font-semibold text-black">No events found</h3>
              <p className="mt-2 text-sm text-black/60 max-w-sm">
                We couldn&apos;t find any events matching your current search query or filter selection.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
              >
                Reset Filters
              </button>
            </div>
          )}

          {!isLoading && !isError && sortedEvents.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedEvents.map((event) => {
                const eventId = (event as any).id || event._id;
                const isFree = Number(event.ticketPrice) === 0 || !event.ticketPrice;
                const displayPrice = isFree ? "Free" : `$${event.ticketPrice}`;

                const eventDate = new Date(event.startDate);
                const displayDate = eventDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });

                const isOnline =
                  event.location?.toLowerCase().includes("online") ||
                  event.location?.toLowerCase().includes("zoom") ||
                  event.location?.toLowerCase().includes("http");

                // Get cover image path from database or mockup
                const rawImg = (event as any).coverImage || event.imageUrl;
                const backendBaseUrl = process.env.NEXT_PUBLIC_EVENTX_BACKEND_URL?.replace("/api/v1", "") || "";
                const imageUrl = (rawImg && rawImg !== "null" && rawImg !== "undefined" && rawImg.trim() !== "")
                  ? (rawImg.startsWith("http") ? rawImg : `${backendBaseUrl}${rawImg}`)
                  : "/images/default-event.jpg";

                return (
                  <article
                    key={eventId}
                    className="group relative flex flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_15px_40px_-25px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-[0_20px_50px_-30px_rgba(0,0,0,0.3)]"
                  >
                    {/* Event image or stylized gradient placeholder */}
                    <div className="relative h-44 w-full overflow-hidden bg-linear-to-br from-[#ffe8a3] via-[#ffc9a7] to-[#9fd3ff]">
                      {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imageUrl}
                          alt={event.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-[0.3em] text-black/35 select-none">
                          {event.title.charAt(0)}
                        </div>
                      )}

                      {/* Price Badge */}
                      <div className="absolute left-3 top-3">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase shadow-xs ${isFree ? "bg-emerald-500 text-white" : "bg-black text-white"
                            }`}
                        >
                          {displayPrice}
                        </span>
                      </div>

                      {/* Online vs Offline Badge */}
                      {event.location && (
                        <div className="absolute right-3 top-3">
                          <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-black shadow-xs backdrop-blur-xs">
                            {isOnline ? "Online" : "In Person"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Content details */}
                    <div className="flex flex-1 flex-col p-5 gap-3">
                      <h3 className="text-lg font-semibold leading-tight text-black group-hover:text-black/80 transition line-clamp-1">
                        {event.title}
                      </h3>

                      {event.description && (
                        <p className="text-xs leading-relaxed text-black/60 line-clamp-2">
                          {event.description}
                        </p>
                      )}

                      <div className="mt-2 flex flex-col gap-2 text-xs text-black/70">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="h-4 w-4 shrink-0 text-black/40" />
                          <span>{displayDate}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <FiMapPin className="h-4 w-4 shrink-0 text-black/40" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Capacity details and CTA */}
                      <div className="mt-auto flex items-center justify-between border-t border-black/5 pt-4">
                        <div>
                          {event.capacity > 0 ? (
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-black/45">
                              Cap: {event.capacity}
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-black/45">
                              Open spots
                            </span>
                          )}
                        </div>

                        <Link
                          href={`/event/${eventId}`}
                          className="inline-flex h-9 items-center justify-center rounded-full bg-black px-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
                        >
                          View details
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
