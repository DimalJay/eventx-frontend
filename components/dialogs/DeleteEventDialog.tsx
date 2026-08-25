"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteEventRequest } from "@/service/eventService";
import { HTTPError } from "@/lib/request";

type Props = {
  open: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle?: string;
};

export default function DeleteEventDialog({ open, onClose, eventId, eventTitle }: Props) {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      return deleteEventRequest(eventId);
    },
    onSuccess: () => {
      toast.success("Event deleted.");
      router.push("/home");
    },
    onError: (error: HTTPError) => {
      const message = error?.response?.data?.message || error?.message || "Failed to delete event. Please try again.";
      toast.error(message);
    },
  });

  if (!open) return null;

  const confirmationMatches =
    confirmation.trim().length > 0 && confirmation.trim() === (eventTitle || "").trim();

  const handleClose = () => {
    setConfirmation("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
          Delete event
        </p>

        <h3 className="mt-2 text-xl font-semibold text-black">
          Delete this event permanently?
        </h3>

        <p className="mt-2 text-sm text-black/60">
          This will permanently delete &quot;{eventTitle || "this event"}&quot; along with its registrations,
          agenda, and tasks. This action cannot be undone.
        </p>

        <label
          htmlFor="delete-event-confirmation"
          className="mt-4 block text-xs font-semibold uppercase tracking-[0.18em] text-black/50"
        >
          Type &quot;{eventTitle || "the event name"}&quot; to confirm
        </label>
        <input
          id="delete-event-confirmation"
          type="text"
          autoComplete="off"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          placeholder={eventTitle || "Event name"}
          className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-500/10"
        />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
            onClick={handleClose}
            disabled={mutation.isPending}
          >
            Cancel
          </button>

          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-full bg-red-500 px-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-500/50"
            onClick={() => mutation.mutate()}
            disabled={!confirmationMatches || mutation.isPending}
          >
            {mutation.isPending ? "Deleting..." : "Delete forever"}
          </button>
        </div>
      </div>
    </div>
  );
}
