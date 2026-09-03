"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { sendFeedbackEmails } from "@/service/feedbackService";
import Dialog from "@/components/widgets/Dialog";

type Props = {
  open: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle?: string;
  goingCount: number;
};

export default function SendFeedbackDialog({ open, onClose, eventId, eventTitle, goingCount }: Props) {
  const mutation = useMutation({
    mutationFn: async () => {
      return sendFeedbackEmails(eventId);
    },
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(`Sent ${res.data?.emailsSent || 0} feedback request emails.`);
        onClose();
      } else {
        toast.error(res?.message || "Failed to send feedback emails.");
      }
    },
    onError: (err: Error) => {
      toast.error(err?.message || "Error sending feedback emails.");
    },
  });

  if (!open) return null;

  return (
    <Dialog
      open={open}
      eyebrow="Feedback"
      title="Send feedback requests?"
      description={
        <>
          {goingCount > 0 ? (
            <>
              <span className="font-semibold text-foreground">{goingCount} attendee{goingCount !== 1 ? "s" : ""}</span>{" "}
              going to &quot;{eventTitle || "this event"}&quot; will receive an email with a link to rate and review
              the event.
            </>
          ) : (
            <>
              No attendees are currently marked as &quot;Going&quot; for &quot;{eventTitle || "this event"}.
              Feedback requests are only sent to attendees going to the event.
            </>
          )}
        </>
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
          disabled={mutation.isPending || goingCount === 0}
        >
          {mutation.isPending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Sending...
            </>
          ) : (
            "Send feedback"
          )}
        </button>
      </div>
    </Dialog>
  );
}