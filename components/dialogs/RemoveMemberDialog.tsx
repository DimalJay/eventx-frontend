"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeTeamMember } from "@/service/teamService";
import { toast } from "sonner";
import Dialog from "@/components/widgets/Dialog";

type TeamMember = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type Props = {
  eventId: string;
  member: TeamMember;
  open: boolean;
  onClose: () => void;
};

export default function RemoveMemberDialog({ eventId, member, open, onClose }: Props) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: number) => {
      return removeTeamMember({ id });
    },
    onSuccess: (res) => {
      if (res?.success) {
        onClose();
        queryClient.invalidateQueries({ queryKey: ["team-members", eventId] });
        toast.success("Member removed.");
      } else {
        toast.error(res?.message || "Failed to remove member.");
      }
    },
    onError: (err: Error) => {
      toast.error(err?.message || "Error removing member.");
    },
  });

  if (!open || !member) return null;

  return (
    <Dialog
      open={open}
      eyebrow="Remove member"
      title={`Remove ${member.name}?`}
      description="This member will lose access to event operations immediately."
    >
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-full bg-danger px-4 text-sm font-semibold text-white transition hover:bg-red-600"
            onClick={() => mutation.mutate(member.id)}
          >
            Yes, remove
          </button>
        </div>
    </Dialog>
  );
}
