import SettingsSidebar from "@/components/settings/SettingsSidebar";
import ShaderBackground from "@/components/landing/ShaderBackground";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-1 justify-center overflow-hidden bg-white">
      <ShaderBackground />

      <main className="relative z-10 flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:py-20">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            EventX account
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-zinc-900">
            Settings
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
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