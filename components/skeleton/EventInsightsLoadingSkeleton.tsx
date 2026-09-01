import {
  SkeletonGroup,
  SkeletonLine,
  SkeletonFaintLine,
  SkeletonStatCard,
  SkeletonHeader,
  SkeletonTableRows,
} from "./primitive";

export function EventInsightsLoadingSkeleton() {
  return (
    <SkeletonGroup ariaLabel="Loading event insights">
      <SkeletonHeader hasActions />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonStatCard key={i} />
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <SkeletonLine className="h-3 w-20" />
            <SkeletonLine className="h-4 w-16" />
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-zinc-100">
            <div className="h-full w-2/3 rounded-full bg-primary/60" />
          </div>
          <SkeletonFaintLine className="mt-3 h-3 w-3/4" />
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <SkeletonLine className="h-3 w-24" />
          <div className="mt-4 grid gap-3">
            <SkeletonLine className="h-9 rounded-xl" />
            <SkeletonLine className="h-9 rounded-xl" />
          </div>
        </div>
      </section>

      <div className="rounded-2xl border border-zinc-200 bg-white p-7">
        <SkeletonLine className="h-3 w-20" />
        <SkeletonLine className="mt-2 h-6 w-40" />
        <SkeletonFaintLine className="mt-3 h-3 w-2/3" />
      </div>

      <SkeletonTableRows rows={4} />
    </SkeletonGroup>
  );
}
