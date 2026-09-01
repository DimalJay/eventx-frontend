import Link from "next/link";
import Logo from "../components/widgets/Logo";
import ShaderBackground from "../components/landing/ShaderBackground";

export default function NotFound() {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-white">
      <ShaderBackground />

      <main className="relative flex w-full max-w-xl flex-col items-center gap-8 px-6 py-20 text-center">
        <Logo className="h-12 w-12" />

        <div className="flex flex-col items-center gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
            Error 404
          </p>
          <h1 className="text-7xl font-semibold tracking-tight text-black sm:text-8xl">
            404
          </h1>
          <h2 className="text-2xl font-semibold tracking-tight text-black">
            This page took a different route.
          </h2>
          <p className="max-w-md text-base leading-7 text-black/60">
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved. Let&apos;s get you back on track.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
          >
            Back to home
          </Link>
          <Link
            href="/home"
            className="inline-flex h-12 items-center justify-center rounded-full border border-black/20 px-6 text-sm font-semibold uppercase tracking-widest text-black transition hover:border-black hover:bg-black/5"
          >
            Go to dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
