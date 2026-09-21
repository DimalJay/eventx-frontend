"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerForEvent } from "@/service/registrationService";
import { toast } from "sonner";
import Dialog from "@/components/widgets/Dialog";
import Select from "@/components/widgets/Select";
import { ICustomFieldDef } from "@/types";

type Props = {
  eventId: string;
  customFields?: ICustomFieldDef[];
  open: boolean;
  onClose: () => void;
  onRegistered?: (email: string) => void;
  isSeatsFull?: boolean;
};

const baseSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  customFields: z.record(z.string(), z.string()),
});

type FormValues = z.infer<typeof baseSchema>;

export default function RegisterEventDialog({
  eventId,
  customFields = [],
  open,
  onClose,
  onRegistered,
  isSeatsFull = false,
}: Props) {
  const schema = baseSchema.superRefine((data, ctx) => {
    for (const field of customFields) {
      if (!field.key) continue;
      const value = data.customFields?.[field.key];
      if (value === undefined || value.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${field.name} is required`,
          path: ["customFields", field.key],
        });
      }
    }
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", firstName: "", lastName: "", customFields: {} },
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const customFieldAnswers: Record<string, string> = {};
      for (const field of customFields) {
        if (field.key) customFieldAnswers[field.key] = data.customFields?.[field.key] ?? "";
      }
      return registerForEvent({ eventId, ...data, customFields: customFieldAnswers });
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

  const fieldError = (key: string) => errors.customFields?.[key]?.message;

  return (
    <Dialog
      open={open}
      eyebrow="Register"
      title="Register for event"
      description="Enter your details to secure your spot."
    >
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
          <label className="mt-5 grid gap-2 text-sm font-semibold text-zinc-900">
            Email address
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register("email")}
              className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-primary/60 focus:ring-primary/20"
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            )}
          </label>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="grid min-w-0 gap-2 text-sm font-semibold text-zinc-900">
              First name
              <input
                type="text"
                placeholder="John"
                {...register("firstName")}
                className="h-11 w-full min-w-0 rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-primary/60 focus:ring-primary/20"
              />
              {errors.firstName && (
                <p className="text-xs text-red-600">{errors.firstName.message}</p>
              )}
            </label>

            <label className="grid min-w-0 gap-2 text-sm font-semibold text-zinc-900">
              Last name
              <input
                type="text"
                placeholder="Doe"
                {...register("lastName")}
                className="h-11 w-full min-w-0 rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-primary/60 focus:ring-primary/20"
              />
              {errors.lastName && (
                <p className="text-xs text-red-600">{errors.lastName.message}</p>
              )}
            </label>
          </div>

          {customFields.length > 0 && (
            <div className="mt-5">
              <div className="grid gap-4">
                {customFields.map((field) => (
                  <label key={field.key} className="grid gap-2 text-sm font-semibold text-zinc-900">
                    {field.name}
                    {field.type === "select" ? (
                      <Controller
                        control={control}
                        name={`customFields.${field.key}` as Path<FormValues>}
                        render={({ field: input }) => (
                          <Select
                            name={input.name}
                            ariaLabel={field.name}
                            value={typeof input.value === "string" ? input.value : ""}
                            onChange={input.onChange as (value: string) => void}
                            className="h-11 w-full px-4"
                            options={[
                              { value: "", label: `Select ${field.name}...` },
                              ...(field.options ?? []).map((option) => ({ value: option, label: option })),
                            ]}
                          />
                        )}
                      />
                    ) : (
                      <input
                        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                        placeholder={field.type === "date" ? "YYYY-MM-DD" : field.name}
                        {...register(`customFields.${field.key}`)}
                        className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-primary/60 focus:ring-primary/20"
                      />
                    )}
                    {fieldError(field.key) && (
                      <p className="text-xs text-red-600">{fieldError(field.key)}</p>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

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
              disabled={mutation.isPending || isSeatsFull}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSeatsFull ? (
                "Seats Full"
              ) : mutation.isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Registering...
                </>
              ) : (
                "Register Event"
              )}
            </button>
          </div>
        </form>
    </Dialog>
  );
}