"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Star,
  MessageSquareText,
  Sparkles,
  Megaphone,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Building2,
  BookOpen,
  HeartHandshake,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";
import { getFeedbacks } from "@/service/feedbackService";
import { getEventById } from "@/service/eventService";
import { IFeedback, IEvent } from "@/types";
import { cn } from "@/lib/utils";
import { decodeEventId, encodeEventId } from "@/lib/utils";
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
  return `${f.firstName ?? ""} ${f.lastName ?? ""}`.trim() || "Guest Attendee";
}

const SENTIMENT_META: Record<
  string,
  { label: string; icon: React.ReactNode; badge: string; bg: string; text: string }
> = {
  positive: {
    label: "Positive",
    icon: <ThumbsUp className="h-3.5 w-3.5" />,
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    bg: "bg-emerald-500",
    text: "text-emerald-700",
  },
  negative: {
    label: "Negative",
    icon: <ThumbsDown className="h-3.5 w-3.5" />,
    badge: "border-rose-200 bg-rose-50 text-rose-700",
    bg: "bg-rose-500",
    text: "text-rose-700",
  },
  neutral: {
    label: "Neutral",
    icon: <Minus className="h-3.5 w-3.5" />,
    badge: "border-zinc-200 bg-zinc-100 text-zinc-600",
    bg: "bg-zinc-400",
    text: "text-zinc-600",
  },
};

function sentimentMeta(value?: string) {
  const key = String(value ?? "").toLowerCase();
  return (
    SENTIMENT_META[key] || {
      ...SENTIMENT_META.neutral,
      icon: <Minus className="h-3.5 w-3.5" />,
    }
  );
}

export default function EventManageFeedbacksPage() {
  const { id } = useParams() as { id: string };
  const eventId = decodeEventId(id);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSentiment, setSelectedSentiment] = useState<string>("all");

  const { data: event } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const res = await getEventById(eventId);
      return res.data as IEvent;
    },
    enabled: !!eventId,
    retry: false,
  });

  // Enable live polling every 5 seconds for real-time live updates
  const {
    data: feedbacks = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["feedbacks", eventId],
    queryFn: async () => {
      const res = await getFeedbacks(eventId);
      return (res.data || []) as IFeedback[];
    },
    enabled: !!eventId,
    retry: false,
    refetchInterval: 5000,
  });

  // Overall Statistics & Category Breakdown
  const analytics = useMemo(() => {
    const total = feedbacks.length;
    const avg = (values: number[]) => {
      if (values.length === 0) return 0;
      const sum = values.reduce((a, b) => a + b, 0);
      return Math.round((sum / values.length) * 10) / 10;
    };

    const categories = [
      {
        key: "organizationRating",
        title: "Organization",
        subtitle: "Logistics, venue & schedule",
        icon: <Building2 className="h-5 w-5 text-primary" />,
        color: "from-purple-500 to-indigo-600",
        ratings: feedbacks.map((f) => Number(f.organizationRating) || 0),
      },
      {
        key: "contentRating",
        title: "Content & Value",
        subtitle: "Speaker quality & materials",
        icon: <BookOpen className="h-5 w-5 text-indigo-600" />,
        color: "from-blue-500 to-indigo-600",
        ratings: feedbacks.map((f) => Number(f.contentRating) || 0),
      },
      {
        key: "experienceRating",
        title: "Overall Experience",
        subtitle: "General attendee satisfaction",
        icon: <HeartHandshake className="h-5 w-5 text-amber-500" />,
        color: "from-amber-500 to-orange-500",
        ratings: feedbacks.map((f) => Number(f.experienceRating) || 0),
      },
    ];

    const categoryStats = categories.map((cat) => {
      const score = avg(cat.ratings);
      const dist = [5, 4, 3, 2, 1].map((star) => {
        const count = cat.ratings.filter((r) => r === star).length;
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return { star, count, pct };
      });

      return {
        ...cat,
        score,
        dist,
      };
    });

    // AI Sentiment statistics
    const sentiments = {
      positive: feedbacks.filter((f) => String(f.sentiment).toLowerCase() === "positive").length,
      neutral: feedbacks.filter((f) => String(f.sentiment).toLowerCase() === "neutral").length,
      negative: feedbacks.filter((f) => String(f.sentiment).toLowerCase() === "negative").length,
    };

    const commentsCount = feedbacks.filter((f) => f.comment && f.comment.trim() !== "").length;

    const allScores = categoryStats.map((c) => c.score).filter((s) => s > 0);
    const overallScore = avg(allScores);

    return {
      total,
      categoryStats,
      sentiments,
      commentsCount,
      overallScore,
    };
  }, [feedbacks]);

  // Filtered comments for text search & sentiment dropdown
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((f) => {
      const matchesSearch =
        searchTerm === "" ||
        nameOf(f).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.email && f.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (f.comment && f.comment.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesSentiment =
        selectedSentiment === "all" ||
        String(f.sentiment ?? "").toLowerCase() === selectedSentiment;

      return matchesSearch && matchesSentiment;
    });
  }, [feedbacks, searchTerm, selectedSentiment]);

  if (isLoading) {
    return <EventFeedbacksLoadingSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm font-semibold text-rose-600">Failed to load feedback analytics.</p>
        <button
          onClick={() => refetch()}
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Top Bar Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Live Feedback Analytics
            </p>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-medium text-emerald-600">Live Updating</span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-medium tracking-tight text-zinc-900 sm:text-3xl">
            Attendee Ratings & Sentiment
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-4 text-xs font-semibold text-zinc-700 transition hover:border-zinc-300 active:scale-[0.98]"
            title="Refresh feed"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin text-primary")} />
            Refresh
          </button>
          <Link
            href={`/event/manage/${encodeEventId(eventId)}/registration`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-strong active:scale-[0.98]"
          >
            <Megaphone className="h-4 w-4" strokeWidth={2} />
            Request feedback
          </Link>
        </div>
      </div>

      {/* Top Banner Overview Card */}
      <section className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid gap-6 md:grid-cols-4 md:divide-x md:divide-zinc-100">
          <div className="flex flex-col justify-between pr-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                Total Submissions
              </p>
              <p className="mt-1 text-3xl font-semibold tabular-nums text-zinc-900 sm:text-4xl">
                {analytics.total}
              </p>
            </div>

            {/* AI Sentiment 3-Color Donut Pie Chart */}
            {(() => {
              const pos = analytics.sentiments.positive;
              const neu = analytics.sentiments.neutral;
              const neg = analytics.sentiments.negative;
              const totalSent = pos + neu + neg;

              const posPct = totalSent > 0 ? Math.round((pos / totalSent) * 100) : 0;
              const neuPct = totalSent > 0 ? Math.round((neu / totalSent) * 100) : 0;
              const negPct = totalSent > 0 ? Math.round((neg / totalSent) * 100) : 0;

              const radius = 36;
              const C = 2 * Math.PI * radius;

              const posLen = totalSent > 0 ? (pos / totalSent) * C : 0;
              const neuLen = totalSent > 0 ? (neu / totalSent) * C : 0;
              const negLen = totalSent > 0 ? (neg / totalSent) * C : 0;

              return (
                <div className="mt-4 flex flex-col items-center justify-center text-center rounded-2xl border border-zinc-100 bg-zinc-50/60 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Sentiment Breakdown Pie
                  </p>

                  {/* 3-Segment SVG Donut Chart */}
                  <div className="relative flex items-center justify-center my-1">
                    <svg className="h-28 w-28 -rotate-90 transform" viewBox="0 0 90 90">
                      {/* Empty Background Ring when totalSent is 0 */}
                      {totalSent === 0 && (
                        <circle
                          cx="45"
                          cy="45"
                          r={radius}
                          className="stroke-zinc-200"
                          strokeWidth="9"
                          fill="transparent"
                        />
                      )}

                      {/* Positive Segment (Emerald) */}
                      {posLen > 0 && (
                        <circle
                          cx="45"
                          cy="45"
                          r={radius}
                          className="stroke-emerald-500 transition-all duration-700 ease-out"
                          strokeWidth="9"
                          strokeDasharray={`${posLen} ${C - posLen}`}
                          strokeDashoffset={0}
                          fill="transparent"
                        />
                      )}

                      {/* Neutral Segment (Zinc) */}
                      {neuLen > 0 && (
                        <circle
                          cx="45"
                          cy="45"
                          r={radius}
                          className="stroke-zinc-400 transition-all duration-700 ease-out"
                          strokeWidth="9"
                          strokeDasharray={`${neuLen} ${C - neuLen}`}
                          strokeDashoffset={-posLen}
                          fill="transparent"
                        />
                      )}

                      {/* Negative Segment (Rose) */}
                      {negLen > 0 && (
                        <circle
                          cx="45"
                          cy="45"
                          r={radius}
                          className="stroke-rose-500 transition-all duration-700 ease-out"
                          strokeWidth="9"
                          strokeDasharray={`${negLen} ${C - negLen}`}
                          strokeDashoffset={-(posLen + neuLen)}
                          fill="transparent"
                        />
                      )}
                    </svg>

                    {/* Center Text inside Donut */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-semibold text-emerald-600 tabular-nums">
                        {posPct}%
                      </span>
                      <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-400">
                        Positive
                      </span>
                    </div>
                  </div>

                  {/* Mini Sentiment Legend */}
                  <div className="mt-3 flex flex-col gap-1.5 w-full text-xs font-semibold text-zinc-700 border-t border-zinc-200/60 pt-2.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1.5 text-emerald-700">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Positive
                      </span>
                      <span className="font-bold text-zinc-900 tabular-nums">{posPct}% ({pos})</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1.5 text-zinc-600">
                        <span className="h-2.5 w-2.5 rounded-full bg-zinc-400" /> Neutral
                      </span>
                      <span className="font-bold text-zinc-900 tabular-nums">{neuPct}% ({neu})</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1.5 text-rose-700">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Negative
                      </span>
                      <span className="font-bold text-zinc-900 tabular-nums">{negPct}% ({neg})</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* AI Sentiment Overview: Bi-polar Spectrum Line & 3-Part Percentage Breakdown */}
          <div className="flex flex-col justify-between md:col-span-3 md:pl-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                  AI Sentiment Overview & Analysis
                </p>
                <p className="text-xs font-medium text-zinc-500 mt-0.5">
                  Overall audience perception leaning & exact sentiment distribution
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" /> AI Sentiment Index
              </span>
            </div>

            {analytics.total === 0 ? (
              <p className="mt-4 text-sm text-zinc-400">
                No feedback received yet. Send feedback invitations to your attendees to gather sentiment data.
              </p>
            ) : (() => {
              const pos = analytics.sentiments.positive;
              const neu = analytics.sentiments.neutral;
              const neg = analytics.sentiments.negative;
              const totalSent = pos + neu + neg;

              // Calculate Sentiment Leaning Score (0 = Fully Negative, 50 = Balanced, 100 = Fully Positive)
              const score = totalSent > 0 ? Math.round(((pos * 100) + (neu * 50) + (neg * 0)) / totalSent) : 50;

              // Determine Leaning Status
              let leanLabel = "Balanced / Neutral";
              let leanBadge = "bg-amber-50 text-amber-700 border-amber-200";
              let pointerColor = "bg-amber-500 ring-amber-200";
              if (score >= 65) {
                leanLabel = "Leaning Positive";
                leanBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";
                pointerColor = "bg-emerald-500 ring-emerald-200";
              } else if (score < 45) {
                leanLabel = "Leaning Negative";
                leanBadge = "bg-rose-50 text-rose-700 border-rose-200";
                pointerColor = "bg-rose-500 ring-rose-200";
              }

              const posPct = totalSent > 0 ? Math.round((pos / totalSent) * 100) : 0;
              const neuPct = totalSent > 0 ? Math.round((neu / totalSent) * 100) : 0;
              const negPct = totalSent > 0 ? Math.round((neg / totalSent) * 100) : 0;

              return (
                <div className="mt-6 flex flex-col gap-6">
                  {/* 1. Dynamic Sentiment Spectrum Bar (Positive vs Negative Line) */}
                  <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4">
                    <div className="flex items-center justify-between text-xs font-bold mb-3">
                      <div className="flex items-center gap-1.5 text-rose-600">
                        <ThumbsDown className="h-4 w-4" />
                        <span>Negative Side</span>
                      </div>
                      <div className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${leanBadge}`}>
                        <span>{leanLabel}</span>
                        <span className="font-bold">({score}%)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-600">
                        <span>Positive Side</span>
                        <ThumbsUp className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Gradient Spectrum Track with Indicator Marker */}
                    <div className="relative my-3">
                      {/* Track background with gradient */}
                      <div className="h-4 w-full rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 p-0.5 shadow-inner opacity-90" />
                      
                      {/* Center Midpoint Tick */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-0.5 bg-white/80 rounded-full" title="Neutral Midpoint (50%)" />

                      {/* Animated Pointer Needle */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-out z-10"
                        style={{ left: `calc(${score}% - 10px)` }}
                      >
                        <div className={`h-5 w-5 rounded-full border-2 border-white shadow-md ring-4 ${pointerColor} transition-transform hover:scale-125`} />
                      </div>
                    </div>

                    <div className="flex justify-between text-[11px] font-semibold text-zinc-400">
                      <span>0% (Strong Negative)</span>
                      <span>50% (Neutral)</span>
                      <span>100% (Strong Positive)</span>
                    </div>
                  </div>

                  {/* 2. Separate 3-Part Sentiment Percentages Chart */}
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2.5">
                      Detailed Percentage Breakdown
                    </p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {/* Positive Card */}
                      <div className="flex flex-col justify-between rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
                          <span className="flex items-center gap-1.5">
                            <ThumbsUp className="h-3.5 w-3.5 text-emerald-600" /> Positive
                          </span>
                          <span className="text-emerald-700 font-bold">{posPct}%</span>
                        </div>
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-emerald-200/60">
                          <div
                            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                            style={{ width: `${posPct}%` }}
                          />
                        </div>
                        <p className="mt-1.5 text-[11px] font-medium text-emerald-600 tabular-nums">
                          {pos} attendee{pos === 1 ? "" : "s"}
                        </p>
                      </div>

                      {/* Neutral Card */}
                      <div className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-zinc-800">
                          <span className="flex items-center gap-1.5">
                            <Minus className="h-3.5 w-3.5 text-zinc-500" /> Neutral
                          </span>
                          <span className="text-zinc-700 font-bold">{neuPct}%</span>
                        </div>
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
                          <div
                            className="h-full rounded-full bg-zinc-400 transition-all duration-500"
                            style={{ width: `${neuPct}%` }}
                          />
                        </div>
                        <p className="mt-1.5 text-[11px] font-medium text-zinc-500 tabular-nums">
                          {neu} attendee{neu === 1 ? "" : "s"}
                        </p>
                      </div>

                      {/* Negative Card */}
                      <div className="flex flex-col justify-between rounded-xl border border-rose-100 bg-rose-50/50 p-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-rose-800">
                          <span className="flex items-center gap-1.5">
                            <ThumbsDown className="h-3.5 w-3.5 text-rose-600" /> Negative
                          </span>
                          <span className="text-rose-700 font-bold">{negPct}%</span>
                        </div>
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-rose-200/60">
                          <div
                            className="h-full rounded-full bg-rose-500 transition-all duration-500"
                            style={{ width: `${negPct}%` }}
                          />
                        </div>
                        <p className="mt-1.5 text-[11px] font-medium text-rose-600 tabular-nums">
                          {neg} attendee{neg === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* 3 Main Category Breakdown Cards (Organization, Content, Experience) */}
      <div>
        <div className="mb-4">
          <h3 className="font-display text-xl font-medium text-zinc-900">Category Evaluation</h3>
          <p className="text-xs text-zinc-500">Summary & Star Distribution for Organization, Content, and Overall Experience</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {analytics.categoryStats.map((cat) => (
            <div
              key={cat.key}
              className="flex flex-col justify-between rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100">
                    {cat.icon}
                  </div>
                  <div className="flex items-baseline gap-1 rounded-2xl bg-amber-50 px-3 py-1 text-amber-900 border border-amber-200/60">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400 self-center" />
                    <span className="text-lg font-semibold tabular-nums">
                      {cat.score > 0 ? cat.score.toFixed(1) : "—"}
                    </span>
                    <span className="text-xs text-amber-700/80">/5</span>
                  </div>
                </div>

                <h4 className="mt-4 font-display text-lg font-medium text-zinc-900">{cat.title}</h4>
                <p className="text-xs text-zinc-500">{cat.subtitle}</p>

                {/* Rating Distribution Bar Chart */}
                <div className="mt-6 grid gap-2.5">
                  {cat.dist.map((d) => (
                    <div key={d.star} className="grid grid-cols-[1.5rem_1fr_2.5rem] items-center gap-2 text-xs">
                      <span className="font-semibold tabular-nums text-zinc-700 flex items-center gap-0.5">
                        {d.star} <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      </span>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${d.pct}%` }}
                        />
                      </div>
                      <span className="text-right text-[11px] font-medium tabular-nums text-zinc-400">
                        {d.count} ({d.pct}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}