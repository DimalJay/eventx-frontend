'use client'
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { IoNotificationsOutline } from "react-icons/io5";
import { notifications } from "@/lib/notifications";

export default function NotificationsMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => n.unread).length;
  const recent = notifications.slice(0, 4);

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
            className="absolute right-0 top-full z-20 mt-2 w-80 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_25px_70px_-35px_rgba(0,0,0,0.45)]"
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
                recent.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex gap-3 px-4 py-3 transition hover:bg-black/5",
                      item.unread && "bg-black/[0.03]"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                        item.unread ? "bg-red-500" : "bg-transparent"
                      )}
                    />
                    <div>
                      <p className="text-sm font-medium text-black">{item.title}</p>
                      <p className="mt-0.5 text-xs text-black/50">{item.meta}</p>
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
