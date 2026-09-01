import { SkeletonLine, SkeletonFaintLine } from "./primitive";

export function NotificationsLoadingSkeleton() {
  return (
    <div className="animate-pulse divide-y divide-black/10">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-start gap-4 px-6 py-5">
          <div className="h-10 w-10 shrink-0 rounded-full bg-black/10" />
          <div className="flex-1">
            <SkeletonLine className="h-4 w-2/5" />
            <SkeletonFaintLine className="mt-2 h-3 w-full" />
            <SkeletonFaintLine className="mt-1.5 h-3 w-3/4" />
          </div>
          <SkeletonLine className="mt-1 h-3 w-16" />
        </div>
      ))}
    </div>
  );
}
