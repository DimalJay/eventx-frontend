"use client";

import { useMemo, type ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { Users, CalendarCheck, ScanLine, Wallet, Download } from "lucide-react";
import { toast } from "sonner";
import { getEventById } from "@/service/eventService";
import { getEventRegistrations } from "@/service/registrationService";
import { getTasksRequest } from "@/service/taskService";
import { getTeamMembers } from "@/service/teamService";
import { IRegistration, IEvent, ITask } from "@/types";
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

  const total = registrations.length;
  const going = registrations.filter((r) => r.status === "GOING").length;
  const waitlist = registrations.filter((r) => r.status === "WAITLIST").length;
  const notGoing = registrations.filter((r) => r.status === "NOT_GOING").length;
  const pending = registrations.filter((r) => r.status === "PENDING").length;
  const checkedIn = registrations.filter(
    (r) => Boolean(r.chekingTime) || Boolean(r.checkingTime)
  ).length;

  const attendancePct = total > 0 ? Math.round((going / total) * 100) : 0;
  const checkInPct = going > 0 ? Math.round((checkedIn / going) * 100) : 0;

  const capacity = event?.capacity ?? 0;
  const capacityPct = capacity > 0 ? Math.min(Math.round((total / capacity) * 100), 100) : 0;

  const revenue = event && event.ticketPrice > 0 ? going * event.ticketPrice : 0;
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
      .map((r) => new Date(r.registeredAt))
      .filter((d) => !Number.isNaN(d.getTime()));
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
      label: "Not yet",
      value: Math.max(going - checkedIn, 0),
      color: "#e4e4e7",
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
      .slice(0, 6);
  }, [registrations]);

  const handleExport = () => {
    if (registrations.length === 0) return;
    const rows = registrationCSVRows(registrations);
    const filename = `insights-${eventId}-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCSV(filename, rows);
    toast.success(`Exported ${rows.length} registrations.`);
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
          label="Attending"
          value={going.toLocaleString()}
          delta={`${attendancePct}% of registered`}
          icon={<CalendarCheck className="h-4 w-4" />}
        />
        <StatCard
          label="Checked in"
          value={checkedIn.toLocaleString()}
          delta={
            going === 0 ? "Opens on event day" : `${checkInPct}% of attendees`
          }
          icon={<ScanLine className="h-4 w-4" />}
        />
        <StatCard
          label="Estimated revenue"
          value={isFree ? "Free event" : formatPrice(revenue, true)}
          delta={
            isFree
              ? "No ticket charge"
              : `${going} × ${formatPrice(event?.ticketPrice ?? 0)}`
          }
          icon={<Wallet className="h-4 w-4" />}
        />
      </section>

      {/* Capacity + recent flow */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Capacity
            </p>
            <span className="text-sm font-semibold tabular-nums text-zinc-900">
              {capacity === 0 ? "Unlimited" : `${total} / ${capacity}`}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
              <div
                className={cn(
                  "h-full rounded-full",
                  capacityPct >= 90 ? "bg-danger" : capacityPct >= 75 ? "bg-warning" : "bg-primary"
                )}
                style={{ width: `${capacityPct}%` }}
              />
            </div>
            <span className="w-12 shrink-0 text-right text-sm font-semibold tabular-nums text-zinc-900">
              {capacity === 0 ? "—" : `${capacityPct}%`}
            </span>
          </div>
          <p className="mt-3 text-sm text-zinc-600">
            {total === 0
              ? "Registrations will fill capacity here."
              : capacity === 0
                ? "This event has unlimited capacity."
                : `${Math.max(capacity - total, 0)} seat${capacity - total === 1 ? "" : "s"} remaining.`}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Attendee flow
              </p>
              <h2 className="mt-2 flex items-center gap-2 font-display text-xl font-medium tracking-tight text-zinc-900">
                Registered · Attending · Checked in
                <HelpTooltip
                  text="How far attendees have progressed: signing up, confirming attendance, then arriving at the venue."
                  side="bottom"
                />
              </h2>
            </div>
          </div>
          <div className="mt-6 flex items-end gap-3">
            {[
              { label: "Registered", value: total, color: "#a1a1aa", max: total },
              { label: "Attending", value: going, color: "#7c3aed", max: total },
              { label: "Checked in", value: checkedIn, color: "#10b981", max: total },
            ].map((stage) => {
              const pct = stage.max > 0 ? (stage.value / stage.max) * 100 : 0;
              return (
                <div key={stage.label} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-40 w-full items-end justify-center rounded-xl bg-zinc-50">
                    <div
                      className="w-full max-w-[3rem] rounded-t-xl transition-all"
                      style={{ height: `${Math.max(pct, 3)}%`, background: stage.color }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-zinc-700">
                    {stage.value.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
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
            total > 0 && (
              <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                {total} total
              </span>
            )
          }
        >
          {timeline.length === 0 ? (
            <EmptyState text="Registrations will show up here over time." />
          ) : (
            <div className="pt-6">
              <VerticalBars data={timeline} height={240} />
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
              centerValue={going > 0 ? `${checkInPct}%` : "0%"}
              centerSub={`of ${going} attending`}
            />
            <div className="grid flex-1 gap-2.5">
              <LegendRow color="#10b981" label="Checked in" count={checkedIn} total={going} />
              <LegendRow color="#e4e4e7" label="Not yet" count={Math.max(going - checkedIn, 0)} total={going} />
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