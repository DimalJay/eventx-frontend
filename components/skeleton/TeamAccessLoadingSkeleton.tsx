import { SkeletonLine, SkeletonFaintLine } from "./primitive";

export function TeamAccessLoadingSkeleton() {
  return (
    <div className="grid animate-pulse gap-4" aria-label="Loading team members">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="grid gap-4 rounded-2xl border border-zinc-200 bg-white px-5 py-4 sm:grid-cols-[1.4fr_auto] sm:items-center"
        >
          <div>
            <SkeletonLine className="h-4 w-40" />
            <SkeletonFaintLine className="mt-1.5 h-3 w-56" />
            <SkeletonLine className="mt-2 h-3 w-16 rounded-full" />
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
