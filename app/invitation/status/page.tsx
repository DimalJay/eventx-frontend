"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import ShaderBackground from "@/components/landing/ShaderBackground";

function StatusContent() {
  const searchParams = useSearchParams();
  const response = searchParams.get("response"); // accept or decline
  const eventTitle = searchParams.get("eventTitle") || "the event";
  const eventId = searchParams.get("eventId") || "";
  const isAccept = response === "accept";

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
          {isAccept ? "Attendance Confirmed!" : "Invitation Declined"}
        </h2>

        <p className="mt-4 text-sm text-black/70 leading-relaxed">
          {isAccept
            ? `Thank you! Your attendance for "${eventTitle}" has been successfully recorded. We look forward to seeing you.`
            : `You have declined the invitation for "${eventTitle}". Thank you for letting us know.`}
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href={eventId ? `/event/${eventId}` : "/"}
            className="flex h-11 w-full items-center justify-center rounded-full bg-black text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
          >
            {eventId ? "View Event" : "Go to Homepage"}
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
