"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateEventStatusRequest } from "@/service/eventService";
import { HTTPError } from "@/lib/request";
import Dialog from "@/components/widgets/Dialog";

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
    <Dialog
      open={open}
      eyebrow={closing ? "Close event" : "Reopen event"}
      title={closing ? "Close this event?" : "Reopen this event?"}
      description={
        closing ? (
          <>
            &quot;{eventTitle || "This event"}&quot; will be marked as closed. Attendees will see it as closed and no
            further changes are expected. You can reopen it at any time from Settings.
          </>
        ) : (
          <>
            &quot;{eventTitle || "This event"}&quot; will be marked as active again.
          </>
        )
      }
    >
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </button>

          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              closing ? "Close event" : "Reopen event"
            )}
          </button>
        </div>
    </Dialog>
  );
}
