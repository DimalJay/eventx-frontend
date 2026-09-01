"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Select from "../widgets/Select";
import z from "zod";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createEventRequest } from "@/service/eventService";
import { useMutation } from "@tanstack/react-query";

import CoverImageUpload from "./create-event/CoverImageUpload";
import DateTimeSection from "./create-event/DateTimeSection";
import LocationSection from "./create-event/LocationSection";
import EventOptionsSection from "./create-event/EventOptionsSection";
import { TextIcon } from "./create-event/Icons";
import HelpTooltip from "../widgets/HelpTooltip";
import { encodeEventId } from "@/lib/utils";

const baseEventSchema = z.object({
  title: z.string().min(1, "Event name is required").max(100, "Event name must be 100 characters or less"),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  regDeadline: z.date().optional(),
  location: z.string().optional(),
  isPublic: z.enum(["true", "false"]),
  eventType: z.enum(["online", "physical"]),
  capacity: z.number().int().optional(),
  ticketPrice: z.number().int().optional(),
  isPaid: z.enum(["free", "paid"]),
  whiteList: z.boolean().optional(),
  coverImage: z.instanceof(File)
    .refine(file => !file || file.size <= 5 * 1024 * 1024, "Image must be 5MB or less")
    .refine(file => !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type), "Only PNG, JPG, or WEBP images are allowed")
    .optional(),
});

type EventFormValues = z.infer<typeof baseEventSchema>;

export default function CreateEventPage() {
  const router = useRouter();
  const [hasLimit, setHasLimit] = useState(false);

  const eventSchema = useMemo(() => {
    return baseEventSchema.superRefine((data, ctx) => {
      const now = new Date();
      if (data.startDate && data.startDate <= now) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Start date must be in the future",
          path: ["startDate"],
        });
      }

      if (data.endDate) {
        if (data.endDate <= now) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "End date must be in the future",
            path: ["endDate"],
          });
        }
        if (data.startDate && data.endDate <= data.startDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "End date must be after start date",
            path: ["endDate"],
          });
        }
      }

      if (data.regDeadline) {
        if (data.regDeadline <= now) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Registration deadline must be in the future",
            path: ["regDeadline"],
          });
        }
        if (data.startDate && data.regDeadline > data.startDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Registration deadline must be before or equal to start date",
            path: ["regDeadline"],
          });
        }
      }

      if (data.eventType === "physical" && (!data.location || !data.location.trim())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Location is required for physical events",
          path: ["location"],
        });
      }

      if (data.isPaid === "paid" && (data.ticketPrice === undefined || isNaN(data.ticketPrice) || data.ticketPrice <= 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ticket price must be greater than 0",
          path: ["ticketPrice"],
        });
      }

      if (hasLimit && (data.capacity === undefined || isNaN(data.capacity) || data.capacity < 1)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Capacity must be at least 1",
          path: ["capacity"],
        });
      }
    });
  }, [hasLimit]);

  const methods = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      isPublic: "true",
      eventType: "online",
      isPaid: "free",
      capacity: 0,
      ticketPrice: 0,
      whiteList: false,
    },
  });

  const { register, control, handleSubmit, formState: { errors } } = methods;

  const toLocalISOString = (date: Date) => {
    const pad = (num: number) => String(num).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const mutation = useMutation({
    mutationFn: async (data: EventFormValues) => {
      const formData = new FormData();
      if (data.coverImage) {
        formData.append("coverImage", data.coverImage);
      }

      Object.entries(data).forEach(([key, value]) => {
        if (key === "isPaid" || key === "coverImage") return;
        if (value instanceof Date) {
          formData.append(key, toLocalISOString(value));
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });
      const res = await createEventRequest(formData);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Event created successfully.");
      console.log("Event created:", data);
      const eventId = data?.id;
      if (eventId) {
        router.push(`/event/manage/${encodeEventId(eventId)}`);
      }
    },
    onError: (error: Error) => {
      const message = error?.message || "Event creation failed. Please try again.";
      toast.error(message);
    },
  });

  const onSubmit = (data: EventFormValues) => {
    const submissionData = { ...data };
    if (!hasLimit) {
      submissionData.capacity = 0;
    }
    mutation.mutate(submissionData);
  };


  return (
    <FormProvider {...methods}>
      <div className="flex flex-1 justify-center bg-white">
        <main className="w-full max-w-4xl px-5 py-24 sm:px-8 sm:py-28">
          <form className="grid gap-6 lg:grid-cols-[300px_1fr] lg:items-start lg:gap-8" onSubmit={handleSubmit(onSubmit)}>
            {/* Left: cover + visibility */}
            <section className="flex flex-col gap-4 lg:sticky lg:top-24">
              <CoverImageUpload />

              <div className="card p-4">
                <span className="eyebrow">
                  Visibility
                </span>
                <Controller
                  name="isPublic"
                  control={control}
                  render={({ field }) => (
                    <Select
                      name={field.name}
                      ariaLabel="Event visibility"
                      value={field.value}
                      onChange={field.onChange}
                      className="mt-2 w-full px-3 py-2.5"
                      options={[
                        { value: "true", label: "Public - anyone can find it" },
                        { value: "false", label: "Private - invite only" },
                      ]}
                    />
                  )}
                />
              </div>
            </section>

            {/* Right: form */}
            <section className="card flex flex-col gap-5 p-5 shadow-card sm:p-7">
              <input
                type="text"
                autoComplete="off"
                placeholder="Event Name"
                {...register("title")}
                className="w-full bg-transparent font-display text-3xl font-medium tracking-tight text-foreground outline-none placeholder:text-muted-subtle sm:text-4xl"
              />
              {errors.title && <span className="mt-1 text-xs text-danger">{errors.title.message}</span>}

              {/* Date card */}
              <DateTimeSection />

              {/* Location */}
              <LocationSection />

              {/* Description */}
              <div className="rounded-2xl border border-border bg-surface px-4 py-3">
                <div className="flex items-center gap-3 text-muted">
                  <TextIcon />
                  <span className="text-sm font-medium text-foreground">Description</span>
                  <HelpTooltip text="Write a short description of your event - who it's for, what attendees will get, and any key outcomes." />
                </div>
                <textarea
                  {...register("description")}
                  rows={3}
                  placeholder="Describe the audience, goals, and main outcomes."
                  className="mt-2 w-full resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-subtle"
                />
              </div>

              {/* Event Options */}
              <EventOptionsSection hasLimit={hasLimit} setHasLimit={setHasLimit} />

              <button
                type="submit"
                className="btn w-full"
              >
                Create Event
              </button>
              <p className="text-center text-xs text-muted-subtle">
                You can finalize ticketing and publish when the details are ready.
              </p>
            </section>
          </form>
        </main>
      </div>
    </FormProvider>
  );
}
