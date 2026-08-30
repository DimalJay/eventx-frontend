export default function EventManageInsightsPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
        <svg className="mx-auto h-16 w-16 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 20V10" />
          <path d="M12 20V4" />
          <path d="M6 20v-6" />
        </svg>
        <h2 className="mt-6 font-display text-2xl font-medium tracking-tight text-zinc-900">Coming soon</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Insights and analytics are on their way.
        </p>
      </div>
    </div>
  );
}
