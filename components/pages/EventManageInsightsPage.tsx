"use client";

import { useMemo, type ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { Users, ScanLine, Wallet, Download, UserX, Sparkles, Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { getEventById } from "@/service/eventService";
import { getEventRegistrations } from "@/service/registrationService";
import { getFeedbacks } from "@/service/feedbackService";
import { getTasksRequest } from "@/service/taskService";
import { getTeamMembers } from "@/service/teamService";
import { IRegistration, IEvent, ITask, IFeedback } from "@/types";
import { TeamMember } from "@/types/team";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { registrationCSVRows, downloadCSV } from "@/lib/utils";
import { decodeEventId, encodeEventId } from "@/lib/utils";
import HelpTooltip from "@/components/widgets/HelpTooltip";
import DonutChart from "@/components/widgets/charts/DonutChart";
import VerticalBars from "@/components/widgets/charts/VerticalBars";
import SegmentBar from "@/components/widgets/charts/SegmentBar";
import ProgressRow from "@/components/widgets/charts/ProgressRow";
import { EventInsightsLoadingSkeleton } from "@/components/skeleton/EventInsightsLoadingSkeleton";

const STATUS_LABELS: Record<string, string> = {
  GOING: "Going",
  WAITLIST: "Waitlist",
  NOT_GOING: "Not going",
  PENDING: "Pending",
};

const STATUS_COLORS: Record<string, string> = {
  GOING: "#7c3aed",
  WAITLIST: "#f59e0b",
  NOT_GOING: "#a1a1aa",
  PENDING: "#3b82f6",
};

const dayMs = 24 * 60 * 60 * 1000;
const NOW_TS = Date.now();

export default function EventManageInsightsPage() {
  const { id } = useParams() as { id: string };
  const eventId = decodeEventId(id);
  const reducedMotion = useReducedMotion();

  const { data: event } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const res = await getEventById(eventId);
      return res.data as IEvent;
    },
    enabled: !!eventId,
    retry: false,
  });

  const {
    data: registrations = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["manage-registrations", eventId],
    queryFn: async () => {
      const res = await getEventRegistrations({ data: { eventId } });
      return (res.data || []) as IRegistration[];
    },
    enabled: !!eventId,
    retry: false,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks-event-" + eventId],
    queryFn: async () => {
      const res = await getTasksRequest({ eventId });
      return (res.data || []) as ITask[];
    },
    enabled: !!eventId,
    retry: false,
  });

  const { data: teamMembers = [] } = useQuery({
    queryKey: ["team-members", eventId],
    queryFn: async () => {
      const res = await getTeamMembers({ eventId });
      return (res.data || []) as TeamMember[];
    },
    enabled: !!eventId,
    retry: false,
  });

  const { data: rawFeedbacks = [] } = useQuery({
    queryKey: ["manage-feedbacks", eventId],
    queryFn: async () => {
      const res = await getFeedbacks(eventId);
      return (res.data || []) as IFeedback[];
    },
    enabled: !!eventId,
    retry: false,
  });

  const total = registrations.length;
  const going = registrations.filter((r) => r.status === "GOING").length;
  const waitlist = registrations.filter((r) => r.status === "WAITLIST").length;
  const notGoing = registrations.filter((r) => r.status === "NOT_GOING").length;
  const pending = registrations.filter((r) => r.status === "PENDING").length;
  const checkedIn = registrations.filter(
    (r) => Boolean(r.chekingTime) || Boolean(r.checkingTime)
  ).length;
  const notCheckedIn = Math.max(0, total - checkedIn);

  const checkedInPct = total > 0 ? Math.round((checkedIn / total) * 100) : 0;
  const notCheckedInPct = total > 0 ? Math.round((notCheckedIn / total) * 100) : 0;

  const capacity = event?.capacity ?? 0;
  const capacityPct = capacity > 0 ? Math.min(Math.round((total / capacity) * 100), 100) : 0;

  const revenue = event && event.ticketPrice > 0 ? total * event.ticketPrice : 0;

  // Feedback & AI Sentiment Analytics Summary
  const feedbackAnalytics = useMemo(() => {
    const count = rawFeedbacks.length;
    if (count === 0) {
      return {
        count: 0,
        avgScore: 0,
        posCount: 0,
        neuCount: 0,
        negCount: 0,
        posPct: 0,
        neuPct: 0,
        negPct: 0,
      };
    }

    const totalScore = rawFeedbacks.reduce((acc, f) => {
      const org = Number(f.organizationRating) || 0;
      const con = Number(f.contentRating) || 0;
      const exp = Number(f.experienceRating) || 0;
      return acc + (org + con + exp) / 3;
    }, 0);

    const avgScore = Math.round((totalScore / count) * 10) / 10;

    const posCount = rawFeedbacks.filter((f) => String(f.sentiment).toLowerCase() === "positive").length;
    const neuCount = rawFeedbacks.filter((f) => String(f.sentiment).toLowerCase() === "neutral").length;
    const negCount = rawFeedbacks.filter((f) => String(f.sentiment).toLowerCase() === "negative").length;
    const totalSent = posCount + neuCount + negCount;

    const posPct = totalSent > 0 ? Math.round((posCount / totalSent) * 100) : 0;
    const neuPct = totalSent > 0 ? Math.round((neuCount / totalSent) * 100) : 0;
    const negPct = totalSent > 0 ? Math.round((negCount / totalSent) * 100) : 0;

    return {
      count,
      avgScore,
      posCount,
      neuCount,
      negCount,
      posPct,
      neuPct,
      negPct,
    };
  }, [rawFeedbacks]);
  const recentCount = useMemo(
    () =>
      registrations.filter((r) => {
        const d = new Date(r.registeredAt);
        return !Number.isNaN(d.getTime()) && NOW_TS - d.getTime() <= 7 * dayMs;
      }).length,
    [registrations]
  );

  const timeline = useMemo(() => {
    const times = registrations
      .map((r) => {
        if (!r.registeredAt) return null;
        const str = String(r.registeredAt).trim();
        const d = new Date(str.includes(" ") ? str.replace(" ", "T") : str);
        return Number.isNaN(d.getTime()) ? null : d;
      })
      .filter((d): d is Date => d !== null);

    if (times.length === 0) return [];

    const min = new Date(Math.min(...times.map((t) => t.getTime())));
    min.setHours(0, 0, 0, 0);
    const max = new Date(NOW_TS);
    max.setHours(0, 0, 0, 0);
    const spanDays = Math.round((max.getTime() - min.getTime()) / dayMs);
    const weekly = spanDays > 45;

    const keyOf = (d: Date) => {
      const start = new Date(d);
      start.setHours(0, 0, 0, 0);
      if (weekly) {
        const dow = (start.getDay() + 6) % 7;
        start.setDate(start.getDate() - dow);
      }
      return start.getTime();
    };

    const counts = new Map<number, number>();
    for (const t of times) {
      const k = keyOf(t);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }

    const bucketKeys: number[] = [];
    const cursor = new Date(min);
    while (cursor.getTime() <= max.getTime()) {
      const k = keyOf(cursor);
      if (!bucketKeys.includes(k)) bucketKeys.push(k);
      cursor.setDate(cursor.getDate() + 1);
    }

    const lastKey = keyOf(max);
    const buckets = bucketKeys
      .filter((k) => k <= lastKey)
      .map((k) => {
        const d = new Date(k);
        return {
          label: `${d.getMonth() + 1}/${d.getDate()}`,
          value: counts.get(k) ?? 0,
        };
      });

    while (buckets.length > 1 && buckets[buckets.length - 1].value === 0) {
      buckets.pop();
    }
    return buckets;
  }, [registrations]);

  const busiestDay = useMemo(() => {
    if (timeline.length === 0) return null;
    const sorted = [...timeline].sort((a, b) => b.value - a.value);
    return sorted[0] && sorted[0].value > 0 ? sorted[0] : null;
  }, [timeline]);

  const statusSlices = (["GOING", "WAITLIST", "NOT_GOING", "PENDING"] as const)
    .map((s) => ({
      label: STATUS_LABELS[s],
      value: registrations.filter((r) => r.status === s).length,
      color: STATUS_COLORS[s],
    }))
    .filter((s) => s.value > 0);

  const checkedInSlices = [
    { label: "Checked in", value: checkedIn, color: "#10b981" },
    {
      label: "Not Checked in",
      value: notCheckedIn,
      color: "#f59e0b",
    },
  ];

  const speakerCount = registrations.filter((r) =>
    r.ticketCode?.startsWith("INVITE-GUEST_SPEAKER-")
  ).length;
  const vipCount = registrations.filter((r) =>
    r.ticketCode?.startsWith("INVITE-VVIP_VIP-")
  ).length;
  const generalCount = Math.max(total - speakerCount - vipCount, 0);
  const guestMix = [
    { label: "General", value: generalCount, color: "#7c3aed" },
    { label: "Speakers", value: speakerCount, color: "#f59e0b" },
    { label: "VIP", value: vipCount, color: "#10b981" },
  ].sort((a, b) => b.value - a.value);
  const guestMixMax = Math.max(1, ...guestMix.map((g) => g.value));

  const tasksDone = tasks.filter((t) => t.status === "DONE").length;
  const tasksInProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const tasksTodo = tasks.filter((t) => t.status === "TODO").length;
  const taskCompletionPct = tasks.length
    ? Math.round((tasksDone / tasks.length) * 100)
    : 0;
  const taskSegments = [
    { label: "Done", value: tasksDone, color: "#10b981" },
    { label: "In progress", value: tasksInProgress, color: "#7c3aed" },
    { label: "To do", value: tasksTodo, color: "#e4e4e7" },
  ];

  const memberNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const tm of teamMembers) map.set(String(tm.id), tm.name);
    return map;
  }, [teamMembers]);

  const workload = useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of tasks) {
      const name = memberNameById.get(String(t.assignedTo));
      const key = name ?? (t.assignedTo ? `User ${t.assignedTo}` : "Unassigned");
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [tasks, memberNameById]);
  const workloadMax = Math.max(1, ...workload.map((w) => w.value));

  const recent = useMemo(() => {
    return [...registrations]
      .sort(
        (a, b) =>
          new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
      )
      .slice(0, 4);
  }, [registrations]);

  const handleExport = () => {
    const isFree = !event || event.ticketPrice === 0;

    const rows = [
      {
        Category: "Executive KPI Summary",
        Metric: "Event Title",
        Value: event?.title || "N/A",
        Details: "",
      },
      {
        Category: "Executive KPI Summary",
        Metric: "Total Registrations",
        Value: total.toLocaleString(),
        Details: `${recentCount} registered in the last 7 days`,
      },
      {
        Category: "Executive KPI Summary",
        Metric: "Capacity Limit",
        Value: capacity === 0 ? "Unlimited" : capacity.toLocaleString(),
        Details: capacity === 0 ? "No capacity cap" : `${capacityPct}% seats filled`,
      },
      {
        Category: "Executive KPI Summary",
        Metric: "Estimated Revenue",
        Value: isFree ? "Free event" : formatPrice(revenue, true),
        Details: isFree ? "No ticket charge" : `${total} tickets × ${formatPrice(event?.ticketPrice ?? 0)}`,
      },
      {
        Category: "Attendance Flow",
        Metric: "Checked In Attendees",
        Value: checkedIn.toLocaleString(),
        Details: `${checkedInPct}% of registered attendees`,
      },
      {
        Category: "Attendance Flow",
        Metric: "Not Checked In Attendees",
        Value: notCheckedIn.toLocaleString(),
        Details: `${notCheckedInPct}% awaiting check-in`,
      },
      {
        Category: "Feedback & AI Sentiment Summary",
        Metric: "Feedback Response Count",
        Value: feedbackAnalytics.count.toLocaleString(),
        Details: total > 0 ? `${Math.round((feedbackAnalytics.count / total) * 100)}% response rate` : "0% response rate",
      },
      {
        Category: "Feedback & AI Sentiment Summary",
        Metric: "Average Satisfaction Rating",
        Value: feedbackAnalytics.avgScore > 0 ? `${feedbackAnalytics.avgScore.toFixed(1)} / 5.0` : "No Ratings Yet",
        Details: "Combined Organization, Content & Experience rating average",
      },
      {
        Category: "Feedback & AI Sentiment Summary",
        Metric: "AI Positive Sentiment",
        Value: `${feedbackAnalytics.posCount} (${feedbackAnalytics.posPct}%)`,
        Details: "AI classified positive feedback count",
      },
      {
        Category: "Feedback & AI Sentiment Summary",
        Metric: "AI Neutral Sentiment",
        Value: `${feedbackAnalytics.neuCount} (${feedbackAnalytics.neuPct}%)`,
        Details: "AI classified neutral feedback count",
      },
      {
        Category: "Feedback & AI Sentiment Summary",
        Metric: "AI Negative Sentiment",
        Value: `${feedbackAnalytics.negCount} (${feedbackAnalytics.negPct}%)`,
        Details: "AI classified negative feedback count",
      },
      {
        Category: "Registration Breakdown",
        Metric: "Going Status Count",
        Value: going.toLocaleString(),
        Details: total > 0 ? `${Math.round((going / total) * 100)}% of total` : "0%",
      },
      {
        Category: "Registration Breakdown",
        Metric: "Waitlist Status Count",
        Value: waitlist.toLocaleString(),
        Details: total > 0 ? `${Math.round((waitlist / total) * 100)}% of total` : "0%",
      },
      {
        Category: "Registration Breakdown",
        Metric: "Not Going Status Count",
        Value: notGoing.toLocaleString(),
        Details: total > 0 ? `${Math.round((notGoing / total) * 100)}% of total` : "0%",
      },
      {
        Category: "Registration Breakdown",
        Metric: "Pending Status Count",
        Value: pending.toLocaleString(),
        Details: total > 0 ? `${Math.round((pending / total) * 100)}% of total` : "0%",
      },
      {
        Category: "Task & Operations Overview",
        Metric: "Total Team Tasks",
        Value: tasks.length.toLocaleString(),
        Details: `${tasksDone} Done (${taskCompletionPct}%), ${tasksInProgress} In progress, ${tasksTodo} To do`,
      },
    ];

    const filename = `insights-analytics-${eventId}-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCSV(filename, rows);
    toast.success(`Exported Event Executive Insights report.`);
  };

  if (isLoading) {
    return <EventInsightsLoadingSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-danger">Failed to load insights.</p>
      </div>
    );
  }

  const isFree = !event || event.ticketPrice === 0;

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Reports
          </p>
          <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-zinc-900">
            Event insights
          </h2>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:border-primary/50 hover:text-primary disabled:opacity-50 disabled:pointer-events-none"
          onClick={handleExport}
          disabled={total === 0}
        >
          <Download className="h-4 w-4" strokeWidth={1.8} />
          Export CSV
        </button>
      </div>

      {/* KPI cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Registrations"
          value={total.toLocaleString()}
          delta={
            total === 0
              ? "No sign-ups yet"
              : `${recentCount} in the last 7 days`
          }
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          label="Checked in"
          value={checkedIn.toLocaleString()}
          delta={
            total === 0 ? "Opens on event day" : `${checkedInPct}% of registered`
          }
          icon={<ScanLine className="h-4 w-4" />}
        />
        <StatCard
          label="Not Checked in"
          value={notCheckedIn.toLocaleString()}
          delta={
            total === 0 ? "No pending arrivals" : `${notCheckedInPct}% awaiting check-in`
          }
          icon={<UserX className="h-4 w-4" />}
        />
        <StatCard
          label="Estimated revenue"
          value={isFree ? "Free event" : formatPrice(revenue, true)}
          delta={
            isFree
              ? "No ticket charge"
              : `${total} × ${formatPrice(event?.ticketPrice ?? 0)}`
          }
          icon={<Wallet className="h-4 w-4" />}
        />
      </section>

      {/* Compact Feedback & AI Sentiment Summary Card */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 border border-amber-200">
              <Sparkles className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-zinc-900">
                Feedback & AI Sentiment Summary
              </h3>
              <p className="text-xs text-zinc-500">
                Attendee ratings overview and AI classified sentiment leaning
              </p>
            </div>
          </div>

          <Link
            href={`/event/manage/${encodeEventId(eventId)}/feedbacks`}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            <span>View detailed feedbacks page</span>
            <span>→</span>
          </Link>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {/* Rating Score */}
          <div className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/60 p-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100/80 text-amber-700">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">
                Avg Satisfaction
              </p>
              <p className="font-display text-lg font-extrabold text-zinc-900 tabular-nums">
                {feedbackAnalytics.avgScore > 0 ? `${feedbackAnalytics.avgScore.toFixed(1)} / 5.0` : "No Ratings Yet"}
              </p>
              <p className="text-[11px] font-medium text-amber-700">
                {feedbackAnalytics.count} attendee{feedbackAnalytics.count === 1 ? "" : "s"} submitted ratings
              </p>
            </div>
          </div>

          {/* AI Sentiment Index */}
          <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100/80 text-emerald-700">
              <Sparkles className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
                AI Sentiment Index
              </p>
              <p className="font-display text-lg font-extrabold text-zinc-900 tabular-nums">
                {feedbackAnalytics.count > 0 ? `${feedbackAnalytics.posPct}% Positive` : "No AI Data"}
              </p>
              <p className="text-[11px] font-medium text-emerald-700">
                {feedbackAnalytics.posCount} Pos · {feedbackAnalytics.neuCount} Neu · {feedbackAnalytics.negCount} Neg
              </p>
            </div>
          </div>

          {/* Response Ratio */}
          <div className="flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100/80 text-indigo-700">
              <MessageSquare className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-800">
                Feedback Response Rate
              </p>
              <p className="font-display text-lg font-extrabold text-zinc-900 tabular-nums">
                {total > 0 ? `${Math.round((feedbackAnalytics.count / total) * 100)}%` : "0%"}
              </p>
              <p className="text-[11px] font-medium text-indigo-700">
                {feedbackAnalytics.count} of {total} registered attendees
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Capacity + recent flow */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
                  Capacity Utilization
                </p>
                <p className="mt-1 font-display text-lg font-bold text-zinc-900">
                  {capacity === 0 ? "Unlimited Capacity" : `${total} / ${capacity} seats filled`}
                </p>
              </div>

              {capacity === 0 ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                  <span className="text-sm">∞</span> Unlimited Seats
                </span>
              ) : (
                <span className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold",
                  capacityPct >= 90 ? "bg-rose-50 text-rose-700 border-rose-200" :
                  capacityPct >= 75 ? "bg-amber-50 text-amber-700 border-amber-200" :
                  "bg-emerald-50 text-emerald-700 border-emerald-200"
                )}>
                  {capacityPct}% Filled
                </span>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    capacity === 0
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                      : capacityPct >= 90
                      ? "bg-rose-500"
                      : capacityPct >= 75
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  )}
                  style={{ width: `${capacity === 0 ? 100 : capacityPct}%` }}
                />
              </div>
              <span className="w-16 shrink-0 text-right text-xs font-bold tabular-nums text-zinc-700">
                {capacity === 0 ? `${total} Registered` : `${capacityPct}%`}
              </span>
            </div>
          </div>

          <p className="mt-4 text-xs font-medium text-zinc-500 leading-relaxed border-t border-zinc-100 pt-3">
            {capacity === 0
              ? `This event has no capacity restriction. Total registered: ${total} attendees.`
              : total === 0
              ? `No seats claimed yet out of ${capacity} total capacity.`
              : `${Math.max(capacity - total, 0)} seat${capacity - total === 1 ? "" : "s"} remaining out of ${capacity}.`}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Attendee flow
              </p>
              <h2 className="mt-2 flex items-center gap-2 font-display text-xl font-medium tracking-tight text-zinc-900">
                Registered · Checked in · Not Checked in
                <HelpTooltip
                  text="Check-in progression of registered attendees: scanned at door vs awaiting arrival."
                  side="bottom"
                />
              </h2>
            </div>
          </div>
          <div className="mt-6 flex items-end gap-3">
            {[
              { label: "Registered", value: total, color: "#7c3aed", max: total, pct: 100 },
              { label: "Checked in", value: checkedIn, color: "#10b981", max: total, pct: checkedInPct },
              { label: "Not Checked in", value: notCheckedIn, color: "#f59e0b", max: total, pct: notCheckedInPct },
            ].map((stage) => {
              const heightPct = stage.max > 0 ? (stage.value / stage.max) * 100 : 0;
              return (
                <div key={stage.label} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-40 w-full items-end justify-center rounded-xl bg-zinc-50">
                    <div
                      className="w-full max-w-[3rem] rounded-t-xl transition-all"
                      style={{ height: `${Math.max(heightPct, 3)}%`, background: stage.color }}
                    />
                  </div>
                  <span className="text-xs font-bold text-zinc-900 tabular-nums">
                    {stage.value.toLocaleString()} <span className="text-[11px] font-semibold text-zinc-500">({total > 0 ? stage.pct : 0}%)</span>
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline + status */}
      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <ChartCard
          eyebrow="Trend"
          title="Registrations over time"
          tooltip="Registration sign-ups bucketed by day. The darkest bar is your busiest day."
          action={
            <div className="flex items-center gap-2">
              {busiestDay && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-700">
                  🔥 Busiest: {busiestDay.label} ({busiestDay.value})
                </span>
              )}
              {total > 0 && (
                <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                  {total} total
                </span>
              )}
            </div>
          }
        >
          {timeline.length === 0 ? (
            <EmptyState text="Registrations will show up here over time as attendees sign up." />
          ) : (
            <div className="pt-6">
              <VerticalBars data={timeline} height={240} barClassName="bg-purple-600 hover:bg-purple-700 shadow-xs" />
            </div>
          )}
        </ChartCard>

        <ChartCard
          eyebrow="Breakdown"
          title="Invitation status"
          tooltip="How attendees answered your invitation."
        >
          <div className="flex flex-col items-center gap-6">
            <DonutChart
              data={statusSlices}
              centerTitle="Registered"
              centerValue={total.toLocaleString()}
              centerSub={total === 1 ? "attendee" : "attendees"}
            />
            <div className="grid w-full gap-2.5">
              {[
                { key: "GOING", count: going },
                { key: "WAITLIST", count: waitlist },
                { key: "NOT_GOING", count: notGoing },
                { key: "PENDING", count: pending },
              ].map(({ key, count }) => (
                <LegendRow
                  key={key}
                  color={STATUS_COLORS[key]}
                  label={STATUS_LABELS[key]}
                  count={count}
                  total={total}
                />
              ))}
            </div>
          </div>
        </ChartCard>
      </section>

      {/* Check-in + guest mix + tasks */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ChartCard
          eyebrow="Attendance"
          title="Check-in"
          tooltip="Attendees who physically arrived and checked in with their ticket."
        >
          <div className="flex items-center gap-6">
            <DonutChart
              data={checkedInSlices}
              size={150}
              thickness={20}
              centerTitle="Checked in"
              centerValue={total > 0 ? `${checkedInPct}%` : "0%"}
              centerSub={`of ${total} registered`}
            />
            <div className="grid flex-1 gap-2.5">
              <LegendRow color="#10b981" label="Checked in" count={checkedIn} total={total} />
              <LegendRow color="#f59e0b" label="Not Checked in" count={notCheckedIn} total={total} />
            </div>
          </div>
        </ChartCard>

        <ChartCard
          eyebrow="Audience"
          title="Guest mix"
          tooltip="Invite categories based on the invitation sent."
          action={
            total > 0 ? (
              <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                {total} invited
              </span>
            ) : null
          }
        >
          {total === 0 ? (
            <EmptyState text="Invite speakers and VIP guests to see the mix." />
          ) : (
            <div className="grid gap-5">
              {guestMix.map((g) => (
                <ProgressRow
                  key={g.label}
                  label={g.label}
                  value={g.value}
                  max={guestMixMax}
                  color={g.color}
                  valueLabel={g.value.toLocaleString()}
                />
              ))}
            </div>
          )}
        </ChartCard>

        <ChartCard
          eyebrow="Readiness"
          title="Task progress"
          tooltip="Tasks assigned to your team ahead of the event."
          action={
            tasks.length > 0 ? (
              <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                {taskCompletionPct}% done
              </span>
            ) : null
          }
        >
          {tasks.length === 0 ? (
            <EmptyState
              text="No tasks yet."
              action={
                <Link
                  href={`/event/manage/${encodeEventId(eventId)}/tasks`}
                  className="mt-4 inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:border-primary/50 hover:text-primary"
                >
                  Assign tasks
                </Link>
              }
            />
          ) : (
            <div className="grid gap-5">
              <SegmentBar segments={taskSegments} />
              <div className="grid grid-cols-3 gap-2">
                <MiniStat label="Done" value={tasksDone} color="#10b981" />
                <MiniStat label="In progress" value={tasksInProgress} color="#7c3aed" />
                <MiniStat label="To do" value={tasksTodo} color="#a1a1aa" />
              </div>
            </div>
          )}
        </ChartCard>
      </section>

      {/* Workload + recent registrations */}
      <section className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          eyebrow="Capacity"
          title="Workload by member"
          tooltip="Open tasks assigned to each team member. Keep the load balanced as the event approaches."
          className="flex flex-col justify-between h-full"
        >
          {workload.length === 0 ? (
            <EmptyState text="No tasks assigned yet." />
          ) : (
            <div className="grid gap-5">
              {workload.map((w) => (
                <ProgressRow
                  key={w.name}
                  label={w.name}
                  value={w.value}
                  max={workloadMax}
                  color="#7c3aed"
                  valueLabel={w.value === 1 ? "1 task" : `${w.value} tasks`}
                />
              ))}
            </div>
          )}
        </ChartCard>

        <ChartCard
          eyebrow="Live"
          title="Recent registrations"
          tooltip="The latest people to register for this event."
          className="flex flex-col justify-between h-full"
        >
          {recent.length === 0 ? (
            <EmptyState text="No registrations yet." />
          ) : (
            <div className="grid gap-2.5">
              {recent.map((r) => {
                const name =
                  `${r.firstName ?? ""} ${r.lastName ?? ""}`.trim() ||
                  "Unknown attendee";
                const date = r.registeredAt
                  ? new Date(r.registeredAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })
                  : "—";
                return (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold uppercase text-primary">
                      {name.charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-zinc-900">
                        {name}
                      </p>
                      <p className="truncate text-xs text-zinc-500">{r.email}</p>
                    </div>
                    <span className="text-xs text-zinc-400">{date}</span>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                        statusPill(r.status)
                      )}
                    >
                      {STATUS_LABELS[r.status] ?? r.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </ChartCard>
      </section>
    </motion.div>
  );
}

function statusPill(status: string) {
  switch (status) {
    case "GOING":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "WAITLIST":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "NOT_GOING":
      return "border-zinc-200 bg-zinc-100 text-zinc-600";
    default:
      return "border-blue-200 bg-blue-50 text-blue-800";
  }
}

function StatCard({
  label,
  value,
  delta,
  icon,
}: {
  label: string;
  value: string;
  delta: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
          {label}
        </p>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary">
          {icon}
        </span>
      </div>
      <p className="mt-4 text-3xl font-semibold tabular-nums text-zinc-900">
        {value}
      </p>
      <p className="mt-2 text-sm text-zinc-600">{delta}</p>
    </div>
  );
}

function ChartCard({
  eyebrow,
  title,
  tooltip,
  action,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  tooltip?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-zinc-200 bg-white p-7", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
            {eyebrow}
          </p>
          <h2 className="mt-2 flex items-center gap-2 font-display text-xl font-medium tracking-tight text-zinc-900">
            {title}
            {tooltip && <HelpTooltip text={tooltip} side="bottom" />}
          </h2>
        </div>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function LegendRow({
  color,
  label,
  count,
  total,
}: {
  color: string;
  label: string;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2.5 text-sm">
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ background: color }}
      />
      <span className="flex-1 text-zinc-600">{label}</span>
      <span className="font-semibold tabular-nums text-zinc-900">{count}</span>
      <span className="w-10 text-right text-xs tabular-nums text-zinc-400">
        {pct}%
      </span>
    </div>
  );
}

function MiniStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-3 text-center">
      <span
        className="mx-auto block h-1.5 w-6 rounded-full"
        style={{ background: color }}
      />
      <p className="mt-2 text-lg font-semibold tabular-nums text-zinc-900">
        {value}
      </p>
      <p className="text-[11px] font-medium text-zinc-500">{label}</p>
    </div>
  );
}

function EmptyState({ text, action }: { text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
      <svg
        className="h-10 w-10 text-zinc-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 20V10" />
        <path d="M12 20V4" />
        <path d="M6 20v-6" />
      </svg>
      <p className="mt-3 text-sm text-zinc-500">{text}</p>
      {action}
    </div>
  );
}