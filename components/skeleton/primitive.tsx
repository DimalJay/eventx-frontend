import { cn } from "@/lib/utils";

export function SkeletonGroup({
  className,
  children,
  ariaLabel,
}: {
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <div className={cn("flex animate-pulse flex-col gap-6", className)} aria-label={ariaLabel}>
      {children}
    </div>
  );
}

export function SkeletonCard({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-2xl border border-zinc-200 bg-white p-7", className)}>
      {children}
    </div>
  );
}

export function SkeletonLine({
  className,
}: {
  className?: string;
}) {
  return <div className={cn("animate-pulse rounded bg-zinc-200", className)} />;
}

export function SkeletonFaintLine({
  className,
}: {
  className?: string;
}) {
  return <div className={cn("animate-pulse rounded bg-zinc-100", className)} />;
}

export function SkeletonInput({
  className,
}: {
  className?: string;
}) {
  return <div className={cn("animate-pulse h-11 rounded-xl bg-zinc-100", className)} />;
}

export function SkeletonButton({
  className,
}: {
  className?: string;
}) {
  return <div className={cn("animate-pulse h-10 rounded-full bg-zinc-200", className)} />;
}

export function SkeletonCardHeader({
  labelWidth = "w-16",
  titleWidth = "w-44",
  descriptionWidth = "w-3/4",
}: {
  labelWidth?: string;
  titleWidth?: string;
  descriptionWidth?: string;
}) {
  return (
    <>
      <SkeletonLine className={cn("h-3", labelWidth)} />
      <SkeletonLine className={cn("mt-3 h-6", titleWidth)} />
      <SkeletonFaintLine className={cn("mt-3 h-3", descriptionWidth)} />
    </>
  );
}

export function SkeletonFormFooter({ className }: { className?: string }) {
  return (
    <div className={cn("flex justify-end border-t border-zinc-200 pt-4", className)}>
      <SkeletonButton className="w-32" />
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <SkeletonLine className="h-3 w-20" />
      <SkeletonLine className="mt-4 h-8 w-14 rounded-lg" />
      <SkeletonFaintLine className="mt-2 h-3 w-24" />
    </div>
  );
}

export function SkeletonHeader({ hasActions = false }: { hasActions?: boolean }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <SkeletonLine className="h-3 w-16" />
        <SkeletonLine className="mt-2 h-6 w-40" />
      </div>
      {hasActions && (
        <div className="flex flex-wrap gap-2">
          {[0, 1, 2].map((i) => (
            <SkeletonButton key={i} className="w-32" />
          ))}
        </div>
      )}
    </div>
  );
}

export function SkeletonTableRows({ rows = 4 }: { rows?: number }) {
  return (
    <div className="mt-6 grid gap-3">
      {[0, 1, 2, 3, 4, 5].slice(0, rows).map((i) => (
        <div key={i} className="rounded-2xl border border-zinc-200 bg-white px-5 py-4">
          <SkeletonLine className="h-4 w-1/3" />
          <SkeletonFaintLine className="mt-2 h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}
