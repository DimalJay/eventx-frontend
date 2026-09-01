"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Star, MessageSquareText, Users, Sparkles, Megaphone } from "lucide-react";
import { getFeedbacks } from "@/service/feedbackService";
import { getEventById } from "@/service/eventService";
import { IFeedback, IEvent } from "@/types";
import { cn } from "@/lib/utils";
import { EventFeedbacksLoadingSkeleton } from "@/components/skeleton/EventFeedbacksLoadingSkeleton";

function parseFeedbackDate(value?: string): string {
  if (!value) return "";
  const d = new Date(value.includes(" ") ? value.replace(" ", "T") : value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function nameOf(f: IFeedback): string {
  return `${f.firstName ?? ""} ${f.lastName ?? ""}`.trim() || "Guest";
}

export default function EventManageFeedbacksPage() {
  const { id: eventId } = useParams() as { id: string };

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
    data: feedbacks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["feedbacks", eventId],
    queryFn: async () => {
      const res = await getFeedbacks(eventId);
      return (res.data || []) as IFeedback[];
    },
    enabled: !!eventId,
    retry: false,
  });

  const stats = useMemo(() => {
    const avg = (values: number[]) => {
      if (values.length === 0) return 0;
      const sum = values.reduce((a, b) => a + b, 0);
      return Math.round((sum / values.length) * 10) / 10;
    };
    return {
      responses: feedbacks.length,
      experience: avg(feedbacks.map((f) => Number(f.experienceRating) || 0)),
      organization: avg(feedbacks.map((f) => Number(f.organizationRating) || 0)),
      content: avg(feedbacks.map((f) => Number(f.contentRating) || 0)),
    };
  }, [feedbacks]);

  const distribution = useMemo(() => {
    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: feedbacks.filter((f) => Number(f.experienceRating) === star).length,
    }));
  }, [feedbacks]);
  const distributionMax = Math.max(1, ...distribution.map((d) => d.count));

  if (isLoading) {
    return <EventFeedbacksLoadingSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-danger">Failed to load feedback.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Feedback
          </p>
          <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-zinc-900">
            Attendee feedback
          </h2>
        </div>
        <Link
          href={`/event/manage/${eventId}/registration`}
          className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:border-primary/50 hover:text-primary"
        >
          <Megaphone className="h-4 w-4" strokeWidth={1.8} />
          Request feedback
        </Link>
      </div>

      {/* KPI cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Responses"
          value={stats.responses.toLocaleString()}
          delta={
            stats.responses === 0
              ? "No feedback yet"
              : `${stats.responses} rating${stats.responses === 1 ? "" : "s"}`
          }
          icon={<MessageSquareText className="h-4 w-4" />}
        />
        <StatCard
          label="Avg experience"
          value={stats.responses === 0 ? "—" : stats.experience.toFixed(1)}
          delta="Overall event rating"
          icon={<Sparkles className="h-4 w-4" />}
          starred
        />
        <StatCard
          label="Avg organization"
          value={stats.responses === 0 ? "—" : stats.organization.toFixed(1)}
          delta="Setup & logistics"
          icon={<Star className="h-4 w-4" />}
          starred
        />
        <StatCard
          label="Avg content"
          value={stats.responses === 0 ? "—" : stats.content.toFixed(1)}
          delta="Sessions & value"
          icon={<Users className="h-4 w-4" />}
          starred
        />
      </section>

      {/* Experience distribution + list */}
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_1.7fr] lg:items-start">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Experience rating
          </p>
          <h3 className="mt-2 font-display text-xl font-medium tracking-tight text-zinc-900">
            Star distribution
          </h3>
          <div className="mt-6 grid gap-4">
            {distribution.map((d) => (
              <div key={d.star} className="grid grid-cols-[2.75rem_1fr] items-center gap-3 text-sm">
                <span className="inline-flex items-center justify-end gap-1 font-semibold tabular-nums text-zinc-900">
                  {d.star}
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex h-2.5 items-center overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${(d.count / distributionMax) * 100}%` }}
                  />
                </div>
                <span className="text-xs tabular-nums text-zinc-400">{d.count}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          {feedbacks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white px-6 py-14 text-center">
              <svg
                className="h-10 w-10 text-zinc-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z" />
                <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
              </svg>
              <p className="mt-3 text-sm text-zinc-500">No feedback yet.</p>
              <p className="mt-1 max-w-xs text-xs text-zinc-400">
                {event?.title
                  ? `Send feedback requests to attendees of "${event.title}" and responses will appear here.`
                  : "Send feedback requests to your attendees and responses will appear here."}
              </p>
              <Link
                href={`/event/manage/${eventId}/registration`}
                className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-strong"
              >
                Request feedback
              </Link>
            </div>
          ) : (
            feedbacks.map((f) => <FeedbackCard key={f.id} feedback={f} />)
          )}
        </section>
      </div>
    </div>
  );
}

function FeedbackCard({ feedback }: { feedback: IFeedback }) {
  const name = nameOf(feedback);
  const experience = Number(feedback.experienceRating) || 0;

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold uppercase text-primary">
            {name.charAt(0)}
          </span>
          <div>
            <p className="text-sm font-semibold text-zinc-900">{name}</p>
            <p className="truncate text-xs text-zinc-500">
              {feedback.email || "Event attendee"}
              {feedback.createdAt ? ` · ${parseFeedbackDate(feedback.createdAt)}` : ""}
            </p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          {experience} {experience === 1 ? "star" : "stars"}
        </span>
      </div>

      <div className="mt-5 grid gap-2.5">
        <RatingRow label="Organization" value={Number(feedback.organizationRating) || 0} />
        <RatingRow label="Content" value={Number(feedback.contentRating) || 0} />
        <RatingRow label="Experience" value={experience} />
      </div>

      {feedback.comment ? (
        <blockquote className="mt-5 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm leading-relaxed text-zinc-700">
          “{feedback.comment}”
        </blockquote>
      ) : null}
    </article>
  );
}

function RatingRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-zinc-50 px-4 py-2.5">
      <span className="text-sm text-zinc-600">{label}</span>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-4 w-4",
              star <= value ? "fill-amber-400 text-amber-400" : "text-zinc-300"
            )}
          />
        ))}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  delta,
  icon,
  starred,
}: {
  label: string;
  value: string;
  delta: string;
  icon: React.ReactNode;
  starred?: boolean;
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
      <p className="mt-4 flex items-center gap-1.5 text-3xl font-semibold tabular-nums text-zinc-900">
        {value}
        {starred && value !== "—" && (
          <Star className="mb-1 h-4 w-4 fill-amber-400 text-amber-400" />
        )}
      </p>
      <p className="mt-2 text-sm text-zinc-600">{delta}</p>
    </div>
  );
}