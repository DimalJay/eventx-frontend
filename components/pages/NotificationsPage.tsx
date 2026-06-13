import Link from "next/link";
import { cn } from "@/lib/utils";
import { notifications } from "@/lib/notifications";

export default function NotificationsPage() {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="relative flex flex-1 justify-center overflow-hidden bg-[#f5f1ea]">
      <div className="pointer-events-none absolute -left-24 top-10 h-52 w-52 rounded-full bg-[#ffc9a7] opacity-35 blur-3xl" />
      <div className="pointer-events-none absolute right-8 top-20 h-60 w-60 rounded-full bg-[#9fd3ff] opacity-35 blur-3xl" />

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
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.`
                : "You're all caught up."}
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-11 w-fit items-center justify-center rounded-full border border-black/15 bg-white/80 px-5 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
          >
            Mark all read
          </button>
        </header>

        <section className="overflow-hidden rounded-3xl border border-black/10 bg-white/85 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.35)] backdrop-blur">
          {notifications.length === 0 ? (
            <p className="px-6 py-16 text-center text-sm text-black/50">
              You&apos;re all caught up.
            </p>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-start gap-4 border-b border-black/5 px-6 py-5 transition last:border-b-0 hover:bg-black/5",
                  item.unread && "bg-black/[0.03]"
                )}
              >
                <span
                  className={cn(
                    "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
                    item.unread ? "bg-red-500" : "bg-black/15"
                  )}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-black">{item.title}</p>
                  <p className="mt-1 text-xs text-black/50">{item.meta}</p>
                </div>
                {item.unread && (
                  <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
                    New
                  </span>
                )}
              </div>
            ))
          )}
        </section>

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
