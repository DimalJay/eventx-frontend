'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  UserPlus,
  UserCheck,
  MessageSquare,
  Clock,
  ArrowRight,
} from "lucide-react";
import { getEventById } from "@/service/eventService";
import { getEventRegistrations } from "@/service/registrationService";
import { getFeedbacks } from "@/service/feedbackService";
import { IRegistration, IFeedback } from "@/types";
import { formatPrice, decodeEventId, encodeEventId, getEventCoverUrl } from "@/lib/utils";
import { EventOverviewLoadingSkeleton } from "@/components/skeleton/EventOverviewLoadingSkeleton";
import EventCoverPlaceholder from "@/components/widgets/EventCoverPlaceholder";

function timeAgo(dateValue?: string | Date): string {
  if (!dateValue) return "Recently";
  const date = typeof dateValue === "string"
    ? new Date(dateValue.includes(" ") ? dateValue.replace(" ", "T") : dateValue)
    : new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Recently";
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffSec < 60) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function EventManageOverviewPage() {
  const params = useParams();
  const eventId = decodeEventId(params.id as string);

  // Live Timer for Countdown
  const [nowTime, setNowTime] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
    refetchInterval: 5000,
  });

  const { data: rawFeedbacks = [] } = useQuery({
    queryKey: ["feedbacks", eventId],
    queryFn: async () => {
      const res = await getFeedbacks(eventId);
      return (res.data || []) as IFeedback[];
    },
    enabled: !!eventId,
    refetchInterval: 5000,
  });

  const totalRegs = registrations.length;
  const checkedInCount = registrations.filter((r) => !!r.chekingTime).length;

  // Recent Activity - Latest 4 items
  const activities = useMemo(() => {
    const list: {
      id: string;
      title: string;
      meta: string;
      date: Date;
      icon: React.ReactNode;
      color: string;
    }[] = [];

    registrations.forEach((r, idx) => {
      const name = `${r.firstName ?? ""} ${r.lastName ?? ""}`.trim() || "Attendee";
      const regDate = r.registeredAt ? new Date(r.registeredAt) : new Date(0);

      list.push({
        id: `reg-${r.id || idx}`,
        title: `${name} registered`,
        meta: timeAgo(r.registeredAt),
        date: regDate,
        icon: <UserPlus className="h-3.5 w-3.5 text-blue-600" />,
        color: "bg-blue-50 border-blue-100",
      });

      if (r.chekingTime) {
        const checkDate = new Date(r.chekingTime);
        list.push({
          id: `check-${r.id || idx}`,
          title: `${name} checked in`,
          meta: timeAgo(r.chekingTime),
          date: checkDate,
          icon: <UserCheck className="h-3.5 w-3.5 text-emerald-600" />,
          color: "bg-emerald-50 border-emerald-100",
        });
      }
    });

    rawFeedbacks.forEach((f, idx) => {
      const name = `${f.firstName ?? ""} ${f.lastName ?? ""}`.trim() || "Attendee";
      const fbDate = f.createdAt
        ? new Date(f.createdAt.includes(" ") ? f.createdAt.replace(" ", "T") : f.createdAt)
        : new Date(0);

      list.push({
        id: `fb-${f.id || idx}`,
        title: `${name} submitted feedback`,
        meta: `${f.experienceRating || 5}★ (${f.sentiment || "Neutral"}) • ${timeAgo(f.createdAt)}`,
        date: fbDate,
        icon: <MessageSquare className="h-3.5 w-3.5 text-amber-600" />,
        color: "bg-amber-50 border-amber-100",
      });
    });

    list.sort((a, b) => b.date.getTime() - a.date.getTime());
    return list.slice(0, 4);
  }, [registrations, rawFeedbacks]);

  // Live Countdown & Status Logic
  const eventStatusInfo = useMemo(() => {
    if (!event) return null;

    const start = new Date(event.startDate).getTime();
    const end = new Date(event.endDate).getTime();

    if (nowTime < start) {
      const diff = start - nowTime;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return {
        stage: "upcoming",
        badge: "Upcoming Event",
        badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
        countdownText: `${String(days).padStart(2, '0')}d : ${String(hours).padStart(2, '0')}h : ${String(minutes).padStart(2, '0')}m : ${String(seconds).padStart(2, '0')}s`,
        linkText: "Review agenda",
        href: `/event/manage/${encodeEventId(eventId)}/agenda`,
      };
    } else if (nowTime >= start && nowTime <= end) {
      return {
        stage: "live",
        badge: "Live Now",
        badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        countdownText: "Event is Live!",
        linkText: "Manage attendees & QR",
        href: `/event/manage/${encodeEventId(eventId)}/registration`,
      };
    } else {
      return {
        stage: "completed",
        badge: "Completed",
        badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        countdownText: "Event Finished",
        linkText: "View Feedback & AI",
        href: `/event/manage/${encodeEventId(eventId)}/feedbacks`,
      };
    }
  }, [event, eventId, nowTime]);

  if (isLoading) {
    return <EventOverviewLoadingSkeleton />;
  }

  if (!event) {
    return <div className="p-8 text-center text-danger">Failed to load event details.</div>;
  }

  const coverUrl = getEventCoverUrl(event.coverImage);

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

  return (
    <div className="flex flex-col gap-6">
      {/* 4 Stats Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              {item.label}
            </p>
            <p className="mt-4 text-3xl font-semibold text-zinc-900">{item.value}</p>
            <p className="mt-2 text-sm text-zinc-600">{item.delta}</p>
          </div>
        ))}
      </section>

      {/* Main Grid Section with Equal Height Alignment */}
      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr] items-stretch">
        {/* Left Card: Event Details */}
        <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-7 shadow-2xs max-h-[868px] overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Event details
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-zinc-900">
              {event.title}
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {details.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-zinc-200/80 bg-zinc-50/80 px-5 py-3.5"
                >
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                    {item.label}
                  </p>
                  <p className="mt-1 font-semibold text-zinc-900">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 mb-2">
                Description
              </p>
              <p className="text-sm leading-7 text-zinc-600 whitespace-pre-line">
                {event.description || "No description provided for this event."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="flex flex-col gap-5 max-h-[868px]">
          {/* Top Sidebar Box: Cover Image + Next Milestone */}
          <div className="overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900 text-white shadow-sm flex flex-col justify-between h-[488px] shrink-0">
            {coverUrl ? (
              <div className="relative h-80 w-full shrink-0 overflow-hidden bg-zinc-900">
                <img
                  src={coverUrl}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="relative h-[304px] w-full shrink-0 overflow-hidden">
                <EventCoverPlaceholder title={event.title} category={event.category} />
              </div>
            )}

            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                    Next milestone
                  </p>
                  {eventStatusInfo && (
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${eventStatusInfo.badgeColor}`}>
                      {eventStatusInfo.stage === "live" && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      )}
                      <span>{eventStatusInfo.badge}</span>
                    </span>
                  )}
                </div>

                <div className="mt-2">
                  <p className="text-xs font-medium text-white/50 uppercase tracking-wider">
                    {eventStatusInfo?.stage === "upcoming" ? "Time Until Launch" : "Current Status"}
                  </p>
                  <p className="mt-0.5 font-display text-xl font-bold tracking-tight text-white tabular-nums">
                    {eventStatusInfo?.countdownText}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <Link
                  href={eventStatusInfo?.href || `#`}
                  className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-bold text-zinc-900 hover:bg-zinc-100 transition active:scale-[0.98]"
                >
                  <span>{eventStatusInfo?.linkText}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Sidebar Box: Recent Activity */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs flex flex-col justify-between flex-1 min-h-0">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Recent activity
                </p>
                <span className="text-[11px] font-semibold text-zinc-400">
                  {activities.length} latest
                </span>
              </div>

              <div className="mt-3 grid gap-2.5">
                {activities.length > 0 ? (
                  activities.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/80 px-3.5 py-2.5 transition hover:bg-zinc-100/60"
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${item.color}`}>
                        {item.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-zinc-900">
                          {item.title}
                        </p>
                        <p className="text-[11px] font-medium text-zinc-500">
                          {item.meta}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <Clock className="h-6 w-6 text-zinc-300" />
                    <p className="mt-2 text-xs font-medium text-zinc-400">
                      No recent activity recorded yet.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={`/event/manage/${encodeEventId(eventId)}/registration`}
                className="text-[11px] font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>View all attendees</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
