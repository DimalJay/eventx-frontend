export default function EventManageInsightsPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="rounded-3xl border border-black/10 bg-white/80 p-12 text-center shadow-[0_25px_70px_-45px_rgba(0,0,0,0.35)] backdrop-blur">
        <svg className="mx-auto h-16 w-16 text-black/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 20V10" />
          <path d="M12 20V4" />
          <path d="M6 20v-6" />
        </svg>
        <h2 className="mt-6 text-2xl font-semibold text-black">Coming Soon</h2>
        <p className="mt-2 text-sm text-black/60">
          Insights and analytics are on their way.
        </p>
      </div>
    </div>
  );
}
