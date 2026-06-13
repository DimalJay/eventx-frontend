"use client";

type AddToCalendarProps = {
  title: string;
  description?: string;
  location?: string;
  /** Local wall time, e.g. "2026-06-18T09:00:00" */
  start: string;
  /** Local wall time, e.g. "2026-06-18T17:00:00" */
  end: string;
  /** IANA timezone, e.g. "America/New_York" */
  timezone: string;
};

// "2026-06-18T09:00:00" -> "20260618T090000"
const compact = (iso: string) => iso.replace(/[-:]/g, "").slice(0, 15);

// Escape text for ICS fields (RFC 5545).
const escapeIcs = (text: string) =>
  text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

const slug = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Build a universal .ics file — works with Apple Calendar, Google, Outlook, and any RFC 5545 client.
function icsContent({ title, description, location, start, end, timezone }: AddToCalendarProps) {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const uid = `${compact(start)}-${slug(title)}@eventx`;
  // TZID uses the IANA zone name, which all major calendar clients resolve for well-known zones.
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EventX//Add to Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=${timezone}:${compact(start)}`,
    `DTEND;TZID=${timezone}:${compact(end)}`,
    `SUMMARY:${escapeIcs(title)}`,
    description ? `DESCRIPTION:${escapeIcs(description)}` : "",
    location ? `LOCATION:${escapeIcs(location)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

export default function AddToCalendar(props: AddToCalendarProps) {
  const downloadIcs = () => {
    const blob = new Blob([icsContent(props)], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slug(props.title)}.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={downloadIcs}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-black/20 px-6 text-sm font-semibold uppercase tracking-widest text-black transition hover:border-black hover:bg-black/5"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4" />
      </svg>
      Add to calendar
    </button>
  );
}
