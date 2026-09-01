import { SkeletonLine, SkeletonFaintLine } from "./primitive";

export function EventAgendaLoadingSkeleton() {
  return (
    <div className="grid animate-pulse gap-4" aria-label="Loading event agenda">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="grid gap-4 rounded-2xl border border-zinc-200 bg-white px-5 py-4 sm:grid-cols-[1.4fr_auto] sm:items-center"
        >
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 shrink-0 rounded-xl bg-zinc-200" />
            <div className="flex-1">
              <SkeletonLine className="h-4 w-1/2" />
              <SkeletonFaintLine className="mt-2 h-3 w-full" />
              <SkeletonFaintLine className="mt-1.5 h-3 w-2/3" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <SkeletonLine className="h-8 w-8 rounded-full" />
            <SkeletonLine className="h-8 w-8 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
