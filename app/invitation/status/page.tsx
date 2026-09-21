"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import ShaderBackground from "@/components/landing/ShaderBackground";
import { encodeEventId } from "@/lib/utils";

function StatusContent() {
  const searchParams = useSearchParams();
  const response = searchParams.get("response"); // accept or decline
  const eventTitle = searchParams.get("eventTitle") || "the event";
  const eventId = searchParams.get("eventId") || "";
  const type = searchParams.get("type"); // 'team' or undefined
  const isAccept = response === "accept";
  const isTeam = type === "team";

  const titleText = isTeam
    ? isAccept
      ? "Team Invitation Accepted!"
      : "Team Invitation Declined"
    : isAccept
      ? "Attendance Confirmed!"
      : "Invitation Declined";

  const descriptionText = isTeam
    ? isAccept
      ? `You have joined the team for "${eventTitle}". You now have operator access to manage this event.`
      : `You have declined the team invitation for "${eventTitle}".`
    : isAccept
      ? `Thank you! Your attendance for "${eventTitle}" has been successfully recorded. We look forward to seeing you.`
      : `You have declined the invitation for "${eventTitle}". Thank you for letting us know.`;

  const buttonHref = isTeam && isAccept && eventId
    ? `/event/manage/${encodeEventId(eventId)}/team`
    : eventId
      ? `/event/${encodeEventId(eventId)}`
      : "/";

  const buttonText = isTeam && isAccept && eventId
    ? "Go to Team Management"
    : eventId
      ? "View Event"
      : "Go to Homepage";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4">
      <ShaderBackground />

      <main className="relative w-full max-w-md rounded-3xl border border-black/10 bg-white/80 p-8 text-center shadow-[0_25px_70px_-45px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <div className="flex justify-center">
          {isAccept ? (
            <div className="rounded-full bg-emerald-100 p-3 text-emerald-600">
              <CheckCircle2 size={40} />
            </div>
          ) : (
            <div className="rounded-full bg-rose-100 p-3 text-rose-600">
              <XCircle size={40} />
            </div>
          )}
        </div>

        <h2 className="mt-6 text-2xl font-bold tracking-tight text-black">
          {titleText}
        </h2>

        <p className="mt-4 text-sm text-black/70 leading-relaxed">
          {descriptionText}
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href={buttonHref}
            className="flex h-11 w-full items-center justify-center rounded-full bg-black text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
          >
            {buttonText}
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function InvitationStatusPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-white text-black/50">Loading...</div>}>
      <StatusContent />
    </Suspense>
  );
}
