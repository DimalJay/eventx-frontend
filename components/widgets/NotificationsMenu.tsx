'use client'
import { useState } from "react";
import Link from "next/link";
import { cn, timeAgo } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { IoNotificationsOutline } from "react-icons/io5";
import { getNotifications } from "@/service/notificationService";
import type { INotification } from "@/types/notifications";
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
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {notificationIcon(item.type)}
                        <p className="text-sm font-medium text-black truncate">{item.title}</p>
                      </div>
                      {item.message && (
                        <p className="mt-0.5 text-xs text-black/60 line-clamp-2">{item.message}</p>
                      )}
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
