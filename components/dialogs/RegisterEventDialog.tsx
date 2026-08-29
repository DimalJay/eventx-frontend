"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerForEvent } from "@/service/registrationService";
import { toast } from "sonner";

type Props = {
  eventId: string;
  open: boolean;
  onClose: () => void;
  onRegistered?: (email: string) => void;
};

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterEventDialog({ eventId, open, onClose, onRegistered }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", firstName: "", lastName: "" },
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return registerForEvent({ eventId, ...data });
    },
    onSuccess: (res, variables) => {
      const email = variables.email.toLowerCase().trim();
      if (res?.success) {
        onClose();
        reset();
        queryClient.invalidateQueries({ queryKey: ["event", eventId] });
        onRegistered?.(email);
        toast.success("Successfully registered for the event!");
      } else {
        if (typeof res?.message === "string" && /already registered/i.test(res.message)) {
          onRegistered?.(email);
        }
        toast.error(res?.message || "Registration failed.");
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error registering for event.");
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
          Register
        </p>
        <h3 className="mt-2 text-xl font-semibold text-black">
          Register for event
        </h3>
        <p className="mt-2 text-sm text-black/60">
          Enter your details to secure your spot.
        </p>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
          <label className="mt-5 grid gap-2 text-sm font-semibold text-black">
            Email address
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register("email")}
              className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
            />
            {errors.email && (
              <p className="text-xs text-rose-600">{errors.email.message}</p>
            )}
          </label>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="grid min-w-0 gap-2 text-sm font-semibold text-black">
              First name
              <input
                type="text"
                placeholder="John"
                {...register("firstName")}
                className="h-11 w-full min-w-0 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
              />
              {errors.firstName && (
                <p className="text-xs text-rose-600">{errors.firstName.message}</p>
              )}
            </label>

            <label className="grid min-w-0 gap-2 text-sm font-semibold text-black">
              Last name
              <input
                type="text"
                placeholder="Doe"
                {...register("lastName")}
                className="h-11 w-full min-w-0 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
              />
              {errors.lastName && (
                <p className="text-xs text-rose-600">{errors.lastName.message}</p>
              )}
            </label>
          </div>

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
              disabled={mutation.isPending}
              className="inline-flex h-10 items-center justify-center rounded-full bg-black px-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/90 disabled:opacity-50"
            >
              {mutation.isPending ? "Registering..." : "Register Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}