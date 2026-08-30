const items = [
  "Tech talks",
  "Live music",
  "Workshops",
  "Hackathons",
  "Fundraisers",
  "Art shows",
  "Sport days",
  "Guest lectures",
];

function Strip() {
  return (
    <div className="flex shrink-0 items-center">
      {items.map((item) => (
        <span
          key={item}
          className="mx-6 flex items-center gap-3 whitespace-nowrap"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-700">
            {item}
          </span>
          <span className="h-1.5 w-1.5 rotate-45 bg-primary" />
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="overflow-hidden border-y border-zinc-200/80 bg-zinc-50 py-5">
      <div className="taste-marquee-track flex w-max">
        <Strip />
        <div aria-hidden="true" className="flex">
          <Strip />
        </div>
      </div>
    </div>
  );
}