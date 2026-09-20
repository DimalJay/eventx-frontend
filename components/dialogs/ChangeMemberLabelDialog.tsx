"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTeamLabels, updateTeamMemberLabel } from "@/service/teamService";
import { toast } from "sonner";
import Dialog from "@/components/widgets/Dialog";
import Select from "@/components/widgets/Select";
import type { TeamMember } from "@/types/team";

type Props = {
  eventId: string;
  member: TeamMember;
  open: boolean;
  onClose: () => void;
};

function parseLabels(labels: string | undefined | null): string[] {
  if (!labels || !labels.trim()) return [];
  return labels
    .split(",")
    .map((label) => label.trim())
    .filter(Boolean);
}

export default function ChangeMemberLabelDialog({ eventId, member, open, onClose }: Props) {
  const queryClient = useQueryClient();
  const [label, setLabel] = useState<string>(member?.label ?? "");

  const { data: labelsData } = useQuery({
    queryKey: ["team-labels", eventId],
    queryFn: async () => {
      const res = await getTeamLabels({ eventId });
      return res.data?.labels ?? "";
    },
    enabled: open && !!eventId,
    retry: false,
  });

  const eventLabels = open ? parseLabels(labelsData) : [];

  const mutation = useMutation({
    mutationFn: async (nextLabel: string) => {
      return updateTeamMemberLabel({ id: member.id, label: nextLabel.trim() });
    },
    onSuccess: (res) => {
      if (res?.success) {
        queryClient.invalidateQueries({ queryKey: ["team-members", eventId] });
        toast.success("Member label updated successfully.");
        onClose();
      } else {
        toast.error(res?.message || "Failed to update label.");
      }
    },
    onError: (err: Error) => {
      toast.error(err?.message || "Error updating label.");
    },
  });

  if (!open || !member) return null;

  const isOrganizer = member.isOrganizer === true || member.role === "ORGANIZER";

  const currentLabel = member.label ?? "";
  const hasCurrentLabel = eventLabels.some(
    (eventLabel) => eventLabel.toLowerCase() === currentLabel.toLowerCase()
  );

  const options: { value: string; label: string }[] = [
    { value: "", label: "No label" },
    ...eventLabels.map((eventLabel) => ({ value: eventLabel, label: eventLabel })),
  ];
  if (currentLabel && !hasCurrentLabel) {
    options.push({ value: currentLabel, label: currentLabel });
  }

  return (
    <Dialog
      open={open}
      eyebrow="Member label"
      title={`Label for ${member.name}`}
      description="Assign a label to this team member."
    >
      <div className="mt-5">
        <Select
          name="label"
          ariaLabel="Member label"
          value={label}
          onChange={setLabel}
          className="mt-2 h-11 w-full px-4"
          options={options}
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={mutation.isPending}
          className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900 disabled:opacity-50"
          onClick={onClose}
        >
          Cancel
        </button>
        {!isOrganizer && (
          <button
            type="button"
            disabled={mutation.isPending}
            className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => mutation.mutate(label)}
          >
            {mutation.isPending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              "Save label"
            )}
          </button>
        )}
      </div>
    </Dialog>
  );
}