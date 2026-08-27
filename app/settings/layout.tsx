import SettingsSidebar from "@/components/settings/SettingsSidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-1 justify-center overflow-hidden bg-[#f5f1ea]">
      <div className="pointer-events-none absolute -left-28 top-12 h-56 w-56 rounded-full bg-[#ffc9a7] opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-24 h-64 w-64 rounded-full bg-[#9fd3ff] opacity-35 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#ffe8a3] opacity-45 blur-3xl" />

      <main className="relative flex w-full max-w-5xl flex-col gap-8 px-8 py-16 sm:px-12">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-black">
            Settings
          </h1>
          <p className="mt-3 text-base leading-7 text-black/70">
            Manage your profile, payment gateway, and account details.
          </p>
        </header>

        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-6">
          <aside className="w-full shrink-0 sm:w-52">
            <SettingsSidebar />
          </aside>
          <div className="flex min-w-0 flex-1 flex-col gap-8">{children}</div>
        </div>
      </main>
    </div>
  );
}