export function EventViewLoadingSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7efe2]">
      <div className="w-full max-w-5xl animate-pulse px-6">
        <div className="aspect-21/9 w-full rounded-2xl bg-black/10" />
        <div className="mt-8 h-4 w-32 rounded-full bg-black/10" />
        <div className="mt-3 h-8 w-2/3 rounded-lg bg-black/10" />
        <div className="mt-3 h-5 w-1/2 rounded bg-black/10" />
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="h-24 rounded-2xl bg-black/10" />
          <div className="h-24 rounded-2xl bg-black/10" />
        </div>
        <div className="mt-6 h-24 rounded-2xl bg-black/10" />
      </div>
    </div>
  );
}
