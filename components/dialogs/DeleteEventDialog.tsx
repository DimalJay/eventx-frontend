"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteEventRequest } from "@/service/eventService";
import { HTTPError } from "@/lib/request";
import Dialog from "@/components/widgets/Dialog";

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
    confirmation.trim().length > 0 &&
    confirmation.trim().toLowerCase() === (eventTitle || "").trim().toLowerCase();

  const handleClose = () => {
    setConfirmation("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      eyebrow="Delete event"
      eyebrowTone="danger"
      title="Delete this event permanently?"
      description={
        <>
          This will permanently delete &quot;{eventTitle || "this event"}&quot; along with its registrations,
          agenda, and tasks. This action cannot be undone.
        </>
      }
    >
      <label
        htmlFor="delete-event-confirmation"
        className="mt-4 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500"
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
        className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-500/10"
      />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
            onClick={handleClose}
            disabled={mutation.isPending}
          >
            Cancel
          </button>

          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-danger px-4 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => mutation.mutate()}
            disabled={!confirmationMatches || mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </>
            ) : (
              "Delete forever"
            )}
          </button>
        </div>
    </Dialog>
  );
}
