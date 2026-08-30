const clubs: { name: string; mark: string }[] = [
  { name: "IEEE Student Branch", mark: "IE" },
  { name: "Gavel Club", mark: "GC" },
  { name: "Rotaract Club", mark: "RC" },
  { name: "Aero Society", mark: "AS" },
  { name: "CS Student Union", mark: "CS" },
];

function Mark({ letters }: { letters: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className="h-9 w-9 shrink-0"
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="10" className="fill-zinc-900" />
      <text
        x="20"
        y="26"
        textAnchor="middle"
        className="fill-white font-sans text-[15px] font-bold"
      >
        {letters}
      </text>
    </svg>
  );
}

export default function LogoWall() {
  return (
    <section className="border-t border-transparent bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-14 lg:py-16">
        <p className="text-center text-base text-zinc-500">
          Trusted by student organizations across campus.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {clubs.map((club) => (
            <div
              key={club.name}
              className="flex items-center gap-2.5 text-zinc-500"
            >
              <Mark letters={club.mark} />
              <span className="text-sm font-medium text-zinc-600">
                {club.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}