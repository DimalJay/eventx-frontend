"use client";

import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateTeamMemberRole } from "@/service/teamService";
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

const schema = z.object({
  role: z.enum(["MEMBER", "COORDINATOR"])
});

type FormValues = z.infer<typeof schema>;

const roleOptions = ["MEMBER", "COORDINATOR"] as const;

export default function RoleChangeDialog({ eventId, member, open, onClose }: Props) {
  const { register, handleSubmit, setValue } = useForm<FormValues>({
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
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
          Update role
        </p>
        <h3 className="mt-2 text-xl font-semibold text-black">
          Change role for {member.name}
        </h3>
        <p className="mt-2 text-sm text-black/60">
          Select the new role and confirm to update team access.
        </p>

        <form onSubmit={handleSubmit(({ role }) => mutation.mutate({ id: member.id, role }))}>
          <label className="mt-5 grid gap-2 text-sm font-semibold text-black">
            Role
            <select
              {...register("role")}
              className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-full bg-black px-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
            >
              Update role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
