"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateEventStatusRequest } from "@/service/eventService";
import { HTTPError } from "@/lib/request";

type Props = {
  open: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle?: string;
  targetStatus: "CLOSED" | "ACTIVE";
};

export default function CloseEventDialog({ open, onClose, eventId, eventTitle, targetStatus }: Props) {
  const queryClient = useQueryClient();
  const closing = targetStatus === "CLOSED";

  const mutation = useMutation({
    mutationFn: async () => {
      return updateEventStatusRequest(eventId, targetStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      toast.success(closing ? "Event closed." : "Event reopened.");
      onClose();
    },
    onError: (error: HTTPError) => {
      const message = error?.response?.data?.message || error?.message || "Failed to update event status. Please try again.";
      toast.error(message);
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
          {closing ? "Close event" : "Reopen event"}
        </p>

        <h3 className="mt-2 text-xl font-semibold text-black">
          {closing ? "Close this event?" : "Reopen this event?"}
        </h3>

        {closing ? (
          <p className="mt-2 text-sm text-black/60">
            &quot;{eventTitle || "This event"}&quot; will be marked as closed. Attendees will see it as closed and no
            further changes are expected. You can reopen it at any time from Settings.
          </p>
        ) : (
          <p className="mt-2 text-sm text-black/60">
            &quot;{eventTitle || "This event"}&quot; will be marked as active again.
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </button>

          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-full bg-black px-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-black/60"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : closing ? "Close event" : "Reopen event"}
          </button>
        </div>
      </div>
    </div>
  );
}
