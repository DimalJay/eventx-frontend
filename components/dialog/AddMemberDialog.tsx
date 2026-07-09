"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addTeamMember } from "@/service/teamService";
import { toast } from "sonner";

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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
          Add member
        </p>
        <h3 className="mt-2 text-xl font-semibold text-black">
          Invite a team member
        </h3>
        <p className="mt-2 text-sm text-black/60">
          Enter an email and assign a role for event access.
        </p>

        <form onSubmit={handleSubmit(({ email, role }) => mutation.mutate({ email, role }))}>
          <label className="mt-5 grid gap-2 text-sm font-semibold text-black">
            Email address
            <input
              type="email"
              autoComplete="email"
              placeholder="person@eventx.com"
              {...register("email")}
              className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
            />
            {errors.email && (
              <p className="text-xs text-rose-600">{errors.email.message}</p>
            )}
          </label>

          <label className="mt-4 grid gap-2 text-sm font-semibold text-black">
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
              Send invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
