import {
  SkeletonGroup,
  SkeletonLine,
  SkeletonFaintLine,
  SkeletonStatCard,
  SkeletonHeader,
} from "./primitive";

export function EventRegistrationsLoadingSkeleton() {
  return (
    <SkeletonGroup ariaLabel="Loading event registrations">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonStatCard key={i} />
        ))}
      </section>

      <div className="rounded-2xl border border-zinc-200 bg-white p-7">
        <SkeletonHeader hasActions />
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50">
          <div className="grid grid-cols-4 gap-4 px-5 py-3">
            {[0, 1, 2, 3].map((i) => (
              <SkeletonLine key={i} className="h-3 w-20" />
            ))}
          </div>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="grid grid-cols-4 gap-4 border-t border-zinc-200 px-5 py-4"
            >
              <div>
                <SkeletonLine className="h-4 w-24" />
                <SkeletonFaintLine className="mt-1.5 h-3 w-16" />
              </div>
              <div className="flex items-center">
                <SkeletonLine className="h-4 w-20" />
              </div>
              <div className="flex items-center">
                <SkeletonLine className="h-5 w-16 rounded-full" />
              </div>
              <div className="flex items-center justify-end gap-2">
                <SkeletonLine className="h-8 w-8 rounded-full" />
                <SkeletonLine className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonGroup>
  );
}
