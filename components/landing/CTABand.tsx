import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTABand() {
  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary to-primary-strong px-6 py-16 text-center md:px-16 md:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-8 top-8 flex gap-2"
          >
            {Array.from({ length: 7 }).map((_, i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-white/30"
              />
            ))}
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-8 right-8 flex gap-2"
          >
            {Array.from({ length: 7 }).map((_, i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-white/30"
              />
            ))}
          </div>

          <h2 className="mx-auto max-w-2xl font-display text-3xl font-medium tracking-tight text-white md:text-5xl">
            Your club&apos;s next big night starts here.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/85">
            Pick a date, add your lineup, and share the link with your members.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-semibold text-primary transition hover:bg-primary-soft active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Get started free
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}