'use client';
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getEventById } from "@/service/eventService";
import { getEventRegistrations } from "@/service/registrationService";
import { IRegistration } from "@/types";
import { formatPrice } from "@/lib/utils";
import { EventOverviewLoadingSkeleton } from "@/components/skeleton/EventOverviewLoadingSkeleton";

export default function EventManageOverviewPage() {
  const params = useParams();
  const eventId = params.id as string;

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) return null;
      const res = await getEventById(eventId);
      return res.data;
    },
    enabled: !!eventId,
  });

  const { data: registrations = [] } = useQuery({
    queryKey: ["manage-registrations", eventId],
    queryFn: async () => {
      const res = await getEventRegistrations({ data: { eventId } });
      return (res.data || []) as IRegistration[];
    },
    enabled: !!eventId,
  });

  const totalRegs = registrations.length;
  const checkedInCount = registrations.filter((r) => !!r.chekingTime).length;

  if (isLoading) {
    return <EventOverviewLoadingSkeleton />;
  }


  if (!event) {
    return <div className="p-8 text-center text-danger">Failed to load event details.</div>;
  }

  const coverUrl = (() => {
    const coverPath = event.imageUrl || event.coverImage || "";
    if (!coverPath) return "";
    if (coverPath.startsWith("http")) return coverPath;

    const backendBase = (process.env.NEXT_PUBLIC_EVENTX_BACKEND_URL || "").replace("/api/v1", "");
    return `${backendBase}${coverPath}`;
  })();

  const formattedStartDate = new Date(event.startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const formattedEndDate = new Date(event.endDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const formattedStartTime = new Date(event.startDate).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });

  const formattedEndTime = new Date(event.endDate).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });

  const isFree = event.ticketPrice === 0;

  const stats = [
    { label: "Registrations", value: String(totalRegs), delta: `${totalRegs} registered` },
    { label: "Capacity filled", value: event.capacity === 0 ? "Unlimited" : `${event.capacity} seats`, delta: "Total spots available" },
    { label: "Ticket Price", value: formatPrice(event.ticketPrice), delta: isFree ? "No cost" : "Paid event" },
    { label: "Check-ins", value: String(checkedInCount), delta: checkedInCount === 0 ? "Opens on event day" : `${checkedInCount} checked in` },
  ];

  const isOnlineEvent =
    event.eventType === "online" ||
    (!!event.location && /^(https?:\/\/|zoom\.us|meet\.google|teams\.microsoft)/i.test(event.location));

  const formatUrl = (url?: string) => {
    if (!url) return "#";
    const trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
    return trimmed;
  };

  const details = [
    { label: "Start Date", value: formattedStartDate },
    { label: "End Date", value: formattedEndDate },
    { label: "Start Time", value: formattedStartTime },
    { label: "End Time", value: formattedEndTime },
    {
      label: isOnlineEvent ? "Online Link" : "Location",
      value: isOnlineEvent && event.location ? (
        <a
          href={formatUrl(event.location)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
        >
          <span>{event.location.startsWith("http") || event.location.includes("/") ? "Join Meeting Link" : event.location}</span>
          <span className="text-xs">↗</span>
        </a>
      ) : (
        event.location || (isOnlineEvent ? "Online Event" : "TBA")
      ),
    },
    { label: "Visibility", value: event.isPublic ? "Public Event" : "Private Event" },
  ];

  interface ActivityItem {
    title: string;
    meta: string;
  }

  const activity: ActivityItem[] = [];

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-zinc-200 bg-white p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              {item.label}
            </p>
            <p className="mt-4 text-3xl font-semibold text-zinc-900">{item.value}</p>
            <p className="mt-2 text-sm text-zinc-600">{item.delta}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-zinc-200 bg-white p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Event details
              </p>
              <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-zinc-900">
                {event.title}
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {details.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4"
              >
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                  {item.label}
                </p>
                <p className="mt-1 font-semibold text-zinc-900">{item.value}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm leading-7 text-zinc-600">
            {event.description || "No description provided for this event."}
          </p>
        </div>

        <aside className="grid gap-4">
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-900 text-white">
            {coverUrl ? (
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverUrl}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-900 flex items-center justify-center text-white/35 text-xs font-medium">
                No cover image
              </div>
            )}
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                Next milestone
              </p>
              <p className="mt-3 font-display text-2xl font-medium">Event Status</p>
              <p className="mt-3 text-sm text-white/70">
                {new Date(event.startDate) > new Date()
                  ? "This event is scheduled for the future. Prepare your agenda and invite speakers."
                  : "This event has already started or passed."}
              </p>
              <Link
                href={`/event/manage/${eventId}/agenda`}
                className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-sm font-semibold text-zinc-900"
              >
                Review agenda
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Recent activity
            </p>
            <div className="mt-4 grid gap-4 text-sm text-zinc-600">
              {activity.length > 0 ? (
                activity.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
                  >
                    <p className="font-semibold text-zinc-900">{item.title}</p>
                    <p className="mt-1 text-xs text-zinc-500">{item.meta}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500 p-2">No recent activity recorded yet.</p>
              )}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
