import {
  SkeletonGroup,
  SkeletonLine,
  SkeletonFaintLine,
  SkeletonHeader,
  SkeletonStatCard,
} from "./primitive";

export function EventHistoryLoadingSkeleton() {
  return (
    <div className="relative flex flex-1 justify-center overflow-hidden bg-white">
      <main className="flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:py-20">
        <SkeletonGroup ariaLabel="Loading event history">
          <SkeletonHeader hasActions />

          <section className="grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <SkeletonStatCard key={i} />
            ))}
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-zinc-200 bg-white p-6"
              >
                <div className="flex gap-2">
                  <SkeletonLine className="h-5 w-16 rounded-full" />
                  <SkeletonLine className="h-5 w-16 rounded-full" />
                </div>
                <SkeletonLine className="mt-4 h-5 w-2/3" />
                <SkeletonFaintLine className="mt-3 h-3 w-full" />
                <SkeletonFaintLine className="mt-2 h-3 w-1/2" />
                <div className="mt-5 flex items-end justify-between border-t border-zinc-200 pt-4">
                  <div>
                    <SkeletonLine className="h-3 w-10" />
                    <SkeletonLine className="mt-2 h-5 w-16" />
                  </div>
                  <SkeletonLine className="h-9 w-28 rounded-full" />
                </div>
              </div>
            ))}
          </section>
        </SkeletonGroup>
      </main>
    </div>
  );
}