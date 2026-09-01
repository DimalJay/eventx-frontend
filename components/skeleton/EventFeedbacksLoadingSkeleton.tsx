import {
  SkeletonGroup,
  SkeletonLine,
  SkeletonFaintLine,
  SkeletonStatCard,
  SkeletonHeader,
  SkeletonTableRows,
} from "./primitive";

export function EventFeedbacksLoadingSkeleton() {
  return (
    <SkeletonGroup ariaLabel="Loading event feedback">
      <SkeletonHeader hasActions />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonStatCard key={i} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1.6fr]">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <SkeletonLine className="h-3 w-24" />
          <div className="mt-4 grid gap-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <SkeletonLine className="h-4 w-8" />
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-100" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <SkeletonLine className="h-3 w-20" />
          <SkeletonFaintLine className="mt-3 h-3 w-2/3" />
          <div className="mt-4 h-40 rounded-xl bg-zinc-100" />
        </div>
      </section>

      <SkeletonTableRows rows={3} />
    </SkeletonGroup>
  );
}
