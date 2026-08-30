"use client";

import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateTeamMemberRole } from "@/service/teamService";
import { toast } from "sonner";
import Select from "@/components/widgets/Select";
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

const schema = z.object({
  role: z.enum(["MEMBER", "COORDINATOR"])
});

type FormValues = z.infer<typeof schema>;

const roleOptions = ["MEMBER", "COORDINATOR"] as const;

export default function RoleChangeDialog({ eventId, member, open, onClose }: Props) {
  const { handleSubmit, control, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: member?.role.toLowerCase() === "member" ? "MEMBER" : "COORDINATOR" },
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, role }: { id: number; role: string }) => {
      return updateTeamMemberRole({ id, role: role.toUpperCase() });
    },
    onSuccess: (res) => {
      if (res?.success) {
        onClose();
        queryClient.invalidateQueries({ queryKey: ["team-members", eventId] });
        toast.success("Role updated successfully.");
      } else {
        toast.error(res?.message || "Failed to update role.");
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error updating role.");
    },
  });

  useEffect(() => {
    if (member) {
      setValue("role", member.role.toLowerCase() === "member" ? "MEMBER" : "COORDINATOR");
    }
  }, [member, setValue]);

  if (!open || !member) return null;

  return (
    <Dialog
      open={open}
      eyebrow="Update role"
      title={`Change role for ${member.name}`}
      description="Select the new role and confirm to update team access."
    >
      <form onSubmit={handleSubmit(({ role }) => mutation.mutate({ id: member.id, role }))}>
          <label className="mt-5 grid gap-2 text-sm font-semibold text-zinc-900">
            Role
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  name={field.name}
                  ariaLabel="Role"
                  value={field.value}
                  onChange={field.onChange}
                  className="mt-2 h-11 w-full px-4"
                  options={roleOptions.map((role) => ({ value: role, label: role.charAt(0) + role.slice(1).toLowerCase() }))}
                />
              )}
            />
          </label>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              Update role
            </button>
          </div>
        </form>
    </Dialog>
  );
}
