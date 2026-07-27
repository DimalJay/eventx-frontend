"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeTeamMember } from "@/service/teamService";
import { toast } from "sonner";

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
    onError: (err: any) => {
      toast.error(err?.message || "Error removing member.");
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
          Remove member
        </p>
        <h3 className="mt-2 text-xl font-semibold text-black">
          Remove {member.name}?
        </h3>
        <p className="mt-2 text-sm text-black/60">
          This member will lose access to event operations immediately.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-full border border-rose-200 px-4 text-xs font-semibold uppercase tracking-widest text-rose-700 transition hover:border-rose-300"
            onClick={() => mutation.mutate(member.id)}
          >
            Yes, remove
          </button>
        </div>
      </div>
    </div>
  );
}
