import {
  SkeletonGroup,
  SkeletonCard,
  SkeletonLine,
  SkeletonFaintLine,
  SkeletonInput,
  SkeletonButton,
  SkeletonCardHeader,
  SkeletonFormFooter,
} from "./primitive";

export function EventSettingsLoadingSkeleton() {
  return (
    <SkeletonGroup ariaLabel="Loading event settings">
      {/* General */}
      <SkeletonCard>
        <SkeletonCardHeader />
        <div className="mt-6 grid gap-4">
          <div>
            <SkeletonLine className="h-3 w-20" />
            <SkeletonInput className="mt-2" />
          </div>
          <div>
            <SkeletonLine className="h-3 w-20" />
            <div className="animate-pulse mt-2 h-24 rounded-xl bg-zinc-100" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <SkeletonLine className="h-3 w-20" />
              <SkeletonInput className="mt-2" />
            </div>
            <div>
              <SkeletonLine className="h-3 w-20" />
              <SkeletonInput className="mt-2" />
            </div>
          </div>
          <SkeletonFormFooter />
        </div>
      </SkeletonCard>

      {/* Schedule */}
      <SkeletonCard>
        <SkeletonCardHeader titleWidth="w-52" descriptionWidth="w-2/3" />
        <div className="mt-6 grid gap-3">
          <SkeletonInput />
          <SkeletonInput />
          <SkeletonInput />
          <SkeletonFormFooter className="w-full" />
        </div>
      </SkeletonCard>

      {/* Options */}
      <SkeletonCard>
        <SkeletonCardHeader titleWidth="w-56" descriptionWidth="w-4/5" />
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[240px_1fr]">
          <div className="animate-pulse h-40 rounded-xl bg-zinc-100" />
          <div className="grid gap-4">
            <div>
              <SkeletonLine className="h-3 w-16" />
              <SkeletonInput className="mt-2" />
            </div>
            <div>
              <SkeletonLine className="h-3 w-16" />
              <SkeletonInput className="mt-2" />
            </div>
            <SkeletonFormFooter />
          </div>
        </div>
      </SkeletonCard>

      {/* Status */}
      <SkeletonCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <SkeletonLine className="h-3 w-14" />
            <SkeletonLine className="mt-3 h-6 w-40" />
            <SkeletonFaintLine className="mt-3 h-3 w-2/3" />
          </div>
          <SkeletonButton className="w-28 shrink-0" />
        </div>
      </SkeletonCard>

      {/* Danger zone */}
      <SkeletonCard className="border-danger-soft bg-danger-soft/40">
        <SkeletonLine className="h-3 w-20" />
        <SkeletonLine className="mt-3 h-6 w-40" />
        <SkeletonFaintLine className="mt-3 h-3 w-3/4" />
        <SkeletonButton className="mt-4 w-32" />
      </SkeletonCard>
    </SkeletonGroup>
  );
}
