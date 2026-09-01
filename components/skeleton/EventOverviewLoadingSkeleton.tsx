import {
  SkeletonGroup,
  SkeletonLine,
  SkeletonFaintLine,
} from "./primitive";

export function EventOverviewLoadingSkeleton() {
  return (
    <SkeletonGroup ariaLabel="Loading event overview">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-6">
            <SkeletonLine className="h-3 w-20" />
            <SkeletonLine className="mt-4 h-8 w-14 rounded-lg" />
            <SkeletonFaintLine className="mt-2 h-3 w-24" />
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-zinc-200 bg-white p-7">
          <SkeletonLine className="h-3 w-24" />
          <SkeletonLine className="mt-3 h-7 w-52 rounded-lg" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4">
                <SkeletonLine className="h-3 w-20" />
                <SkeletonFaintLine className="mt-2 h-4 w-28" />
              </div>
            ))}
          </div>
          <SkeletonFaintLine className="mt-6 h-3 w-full" />
          <SkeletonFaintLine className="mt-2 h-3 w-2/3" />
        </div>

        <aside className="grid gap-4">
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-900">
            <div className="animate-pulse aspect-video w-full bg-zinc-700/50" />
            <div className="p-6">
              <div className="animate-pulse h-3 w-24 rounded bg-zinc-700/70" />
              <div className="animate-pulse mt-3 h-6 w-32 rounded bg-zinc-700/70" />
              <div className="animate-pulse mt-3 h-3 w-3/4 rounded bg-zinc-700/70" />
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <SkeletonLine className="h-3 w-24" />
            <div className="animate-pulse mt-4 h-12 rounded-2xl bg-zinc-100" />
            <div className="animate-pulse mt-2 h-12 rounded-2xl bg-zinc-100" />
          </div>
        </aside>
      </section>
    </SkeletonGroup>
  );
}
