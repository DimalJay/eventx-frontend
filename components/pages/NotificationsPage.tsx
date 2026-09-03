"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { cn, timeAgo } from "@/lib/utils";
import { toast } from "sonner";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/service/notificationService";
import type { INotification } from "@/types/notifications";
import { NotificationsLoadingSkeleton } from "@/components/skeleton/NotificationsLoadingSkeleton";
import { UserPlus, UserMinus, ArrowUpCircle, Users, ClipboardList, RefreshCw, Bell } from "lucide-react";

function notificationIcon(type: INotification["type"]) {
  switch (type) {
    case "team_access":
      return <UserPlus className="h-4 w-4 text-emerald-600" />;
    case "team_removed":
      return <UserMinus className="h-4 w-4 text-red-500" />;
    case "team_role_changed":
      return <ArrowUpCircle className="h-4 w-4 text-blue-600" />;
    case "team_update":
      return <Users className="h-4 w-4 text-violet-600" />;
    case "task_assignment":
      return <ClipboardList className="h-4 w-4 text-amber-600" />;
    case "task_update":
      return <RefreshCw className="h-4 w-4 text-amber-500" />;
    case "Registration":
      return <ClipboardList className="h-4 w-4 text-emerald-600" />;
    default:
      return <Bell className="h-4 w-4 text-zinc-500" />;
  }
}

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["notifications", page],
    queryFn: () => getNotifications(page, limit),
    retry: false,
  });

  const notifications = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const unreadCount = notifications.filter(
    (n: INotification) => !n.isRead
  ).length;

  const readMutation = useMutation({
    mutationFn: (id: number) => markNotificationAsRead({ id }),
    onSuccess: (res) => {
      if (res?.success) {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      } else {
        toast.error(res?.message || "Failed to mark notification as read.");
      }
    },
    onError: (err: Error) => {
      toast.error(err?.message || "Error marking notification as read.");
    },
  });

  const readAllMutation = useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: (res) => {
      if (res?.success) {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      } else {
        toast.error(res?.message || "Failed to mark all as read.");
      }
    },
    onError: (err: Error) => {
      toast.error(err?.message || "Error marking all as read.");
    },
  });

  return (
    <div className="relative flex flex-1 justify-center overflow-hidden bg-white">
      <ShaderBackground />

      <main className="relative flex w-full max-w-3xl flex-col gap-8 px-5 py-12 sm:px-8 sm:py-16">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/50">
              Inbox
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black">
              Notifications
            </h1>
            <p className="mt-2 text-sm text-black/60">
              {isLoading
                ? "Loading..."
                : unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.`
                  : "You're all caught up."}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => readAllMutation.mutate()}
              disabled={readAllMutation.isPending}
              className="inline-flex h-11 w-fit items-center justify-center rounded-full border border-black/15 bg-white/80 px-5 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40 disabled:opacity-50"
            >
              {readAllMutation.isPending ? "Marking..." : "Mark all read"}
            </button>
          )}
        </header>

        <section className="overflow-hidden rounded-3xl border border-black/10 bg-white/85 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.35)] backdrop-blur">
          {isLoading ? (
            <NotificationsLoadingSkeleton />
          ) : isError ? (
            <div className="px-6 py-16 text-center">
              <p className="text-sm text-black/50">Failed to load notifications.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-3 text-xs font-semibold uppercase tracking-widest text-black/60 underline transition hover:text-black"
              >
                Try again
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <p className="px-6 py-16 text-center text-sm text-black/50">
              You&apos;re all caught up.
            </p>
          ) : (
            <>
              {notifications.map((item: INotification) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (!item.isRead) {
                      readMutation.mutate(item.id);
                    }
                  }}
                  className={cn(
                    "flex items-start gap-4 border-b border-black/5 px-6 py-5 transition last:border-b-0",
                    !item.isRead
                      ? "bg-black/3 cursor-pointer hover:bg-black/6"
                      : "hover:bg-black/5"
                  )}
                >
                  <span
                    className={cn(
                      "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
                      !item.isRead ? "bg-red-500" : "bg-black/15"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {notificationIcon(item.type)}
                      <p className="text-sm font-medium text-black">{item.title}</p>
                    </div>
                    {item.message && (
                      <p className="mt-1 text-xs text-black/60 line-clamp-2">{item.message}</p>
                    )}
                    <p className="mt-1 text-xs text-black/50">
                      {timeAgo(item.createdAt)}
                    </p>
                  </div>
                  {!item.isRead && (
                    <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
                      New
                    </span>
                  )}
                </div>
              ))}
            </>
          )}
        </section>

        {totalPages > 1 && (
          <div className="flex items-center justify-between text-sm text-black/60">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="font-semibold transition hover:text-black disabled:opacity-30"
            >
              ← Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="font-semibold transition hover:text-black disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        )}

        <Link
          href="/home"
          className="text-sm font-semibold text-black/60 transition hover:text-black"
        >
          ← Back to dashboard
        </Link>
      </main>
    </div>
  );
}
