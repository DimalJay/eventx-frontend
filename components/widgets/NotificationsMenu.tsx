'use client'
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { IoNotificationsOutline } from "react-icons/io5";
import { getNotifications } from "@/service/notificationService";
import type { INotification } from "@/types/notifications";

function timeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function NotificationsMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["notifications", 1],
    queryFn: () => getNotifications(1, 10),
    staleTime: 30_000,
  });

  const allNotifications = data?.data ?? [];
  const unreadCount = allNotifications.filter(
    (n: INotification) => !n.isRead
  ).length;
  const recent = allNotifications.slice(0, 4);

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Notifications"
        className="relative flex items-center text-black/60 transition hover:text-black"
      >
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
        )}
        <IoNotificationsOutline className="h-5 w-5" />
      </button>

      {open && (
        <>
          {/* Click-away backdrop */}
          <button
            type="button"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div
            role="menu"
            className="absolute right-0 top-full z-20 mt-2 w-80 max-w-[90vw] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_25px_70px_-35px_rgba(0,0,0,0.45)]"
          >
            <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
              <p className="text-sm font-semibold text-black">Notifications</p>
              {unreadCount > 0 && (
                <span className="rounded-full bg-black px-2 py-0.5 text-xs font-semibold text-white">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {recent.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-black/50">
                  You&apos;re all caught up.
                </p>
              ) : (
                recent.map((item: INotification) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex gap-3 px-4 py-3 transition hover:bg-black/5",
                      !item.isRead && "bg-black/3"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                        !item.isRead ? "bg-red-500" : "bg-transparent"
                      )}
                    />
                    <div>
                      <p className="text-sm font-medium text-black">{item.title}</p>
                      <p className="mt-0.5 text-xs text-black/50">{timeAgo(item.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="block border-t border-black/10 px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-black/60 transition hover:text-black"
            >
              View all
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
