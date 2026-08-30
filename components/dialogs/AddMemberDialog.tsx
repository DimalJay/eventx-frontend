"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addTeamMember } from "@/service/teamService";
import { toast } from "sonner";
import HelpTooltip from "@/components/widgets/HelpTooltip";
import Select from "@/components/widgets/Select";
import Dialog from "@/components/widgets/Dialog";

type Props = {
  eventId: string;
  open: boolean;
  onClose: () => void;
};

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  role: z.string().min(1, "Role is required"),
});

type FormValues = z.infer<typeof schema>;

const roleOptions = ["Member", "Coordinator"] as const;

export default function AddMemberDialog({ eventId, open, onClose }: Props) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", role: roleOptions[0] },
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: string }) => {
      return addTeamMember({ eventId, email, role: role.toUpperCase() });
    },
    onSuccess: (res) => {
      if (res?.success) {
        onClose();
        reset();
        queryClient.invalidateQueries({ queryKey: ["team-members", eventId] });
        toast.success("Member invited successfully.");
      } else {
        toast.error(res?.message || "Failed to add member.");
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error adding member.");
    },
  });

  return (
    <Dialog
      open={open}
      eyebrow="Add member"
      title="Invite a team member"
      description="Enter an email and assign a role for event access."
    >
      <form onSubmit={handleSubmit(({ email, role }) => mutation.mutate({ email, role }))}>
          <label className="mt-5 grid gap-2 text-sm font-semibold text-zinc-900">
            Email address
            <input
              type="email"
              autoComplete="email"
              placeholder="person@eventx.com"
              {...register("email")}
              className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-primary/60 focus:ring-primary/20"
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            )}
          </label>

          <div className="mt-4">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-zinc-900">
              Role
              <HelpTooltip text="Coordinators can edit event details and manage attendees. Members can view event data but cannot change settings." side="bottom" />
            </div>
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
                  options={roleOptions.map((role) => ({ value: role, label: role }))}
                />
              )}
            />
          </div>

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
              Send invite
            </button>
          </div>
        </form>
    </Dialog>
  );
}
