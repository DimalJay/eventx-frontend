"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Select from "../widgets/Select";
import z from "zod";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getEventById, updateEventRequest, uploadEventCoverRequest } from "@/service/eventService";
import { useMutation, useQuery } from "@tanstack/react-query";

import CoverImageUpload from "./create-event/CoverImageUpload";
import DateTimeSection from "./create-event/DateTimeSection";
import LocationSection from "./create-event/LocationSection";
import EventOptionsSection from "./create-event/EventOptionsSection";
import { TextIcon } from "./create-event/Icons";

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
  coverImage: z.union([z.instanceof(File), z.string()]).optional(),
});

type EventFormValues = z.infer<typeof baseEventSchema>;

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const [hasLimit, setHasLimit] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      if (!eventId) return null;
      const res = await getEventById(eventId);
      return res.data;
    },
    enabled: !!eventId,
  });

  const eventSchema = useMemo(() => {
    return baseEventSchema.superRefine((data, ctx) => {
      const now = new Date();
      // Only warn if dates are invalid, but since this is edit, we should be careful if they are in past and not changed.
      // But we can keep standard event creation date rules.
      if (data.startDate && data.startDate <= now && event && new Date(event.startDate).getTime() !== data.startDate.getTime()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Start date must be in the future",
          path: ["startDate"],
        });
      }

      if (data.endDate) {
        if (data.endDate <= now && event && new Date(event.endDate).getTime() !== data.endDate.getTime()) {
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
        if (data.regDeadline <= now && event && event.regDeadline && new Date(event.regDeadline).getTime() !== data.regDeadline.getTime()) {
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
  }, [hasLimit, event]);

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
    values: event
      ? {
          title: event.title || "",
          description: event.description || "",
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          regDeadline: event.regDeadline ? new Date(event.regDeadline) : undefined,
          location: event.location || "",
          isPublic: event.isPublic ? "true" : "false",
          eventType: event.eventType || "online",
          capacity: event.capacity || 0,
          ticketPrice: event.ticketPrice || 0,
          isPaid: event.ticketPrice > 0 ? "paid" : "free",
          whiteList: event.whiteList || false,
          coverImage: event.imageUrl || event.coverImage || "",
        }
      : undefined,
  });

  const { register, control, handleSubmit, formState: { errors } } = methods;

  useEffect(() => {
    if (event && event.capacity > 0) {
      setHasLimit(true);
    }
  }, [event]);

  const initialCoverPreview = useMemo(() => {
    if (!event) return null;
    const coverPath = event.imageUrl || event.coverImage || "";
    if (!coverPath) return null;
    if (coverPath.startsWith("http")) return coverPath;

    const backendBase = (process.env.NEXT_PUBLIC_EVENTX_BACKEND_URL || "").replace("/api/v1", "");
    return `${backendBase}${coverPath}`;
  }, [event]);

  const toLocalISOString = (date: Date) => {
    const pad = (num: number) => String(num).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const mutation = useMutation({
    mutationFn: async (data: EventFormValues) => {
      let finalCoverImage = typeof data.coverImage === "string" ? data.coverImage : "";

      if (data.coverImage instanceof File) {
        const uploadRes = await uploadEventCoverRequest(data.coverImage);
        finalCoverImage = uploadRes.data?.path || uploadRes.data?.url || uploadRes.data || "";
      }

      const { isPaid, coverImage, ...eventData } = data;

      const payload = {
        ...eventData,
        startDate: eventData.startDate ? toLocalISOString(eventData.startDate) : undefined,
        endDate: eventData.endDate ? toLocalISOString(eventData.endDate) : undefined,
        regDeadline: eventData.regDeadline ? toLocalISOString(eventData.regDeadline) : undefined,
        coverImage: finalCoverImage || undefined,
      };

      const res = await updateEventRequest(eventId, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Event updated successfully.");
      router.push(`/event/manage/${eventId}/overview`);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Event update failed. Please try again.";
      toast.error(message);
    },
  });

  const onSubmit = (data: EventFormValues) => {
    // Clean data based on fields
    const submissionData = { ...data };
    if (!hasLimit) {
      submissionData.capacity = 0;
    }
    mutation.mutate(submissionData);
  };

  const onErrors = (errors: any) => {
    console.log("Validation Errors:", errors);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-black/50">Loading event data...</div>;
  }

  if (!event) {
    return <div className="p-8 text-center text-red-500">Failed to load event data.</div>;
  }

  return (
    <FormProvider {...methods}>
      <div className="flex flex-1 justify-center bg-linear-to-br from-[#f7efe2] via-white to-[#e5f4ff]">
        <main className="w-full max-w-4xl px-5 py-12 sm:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-black">Edit Event</h1>
            <p className="text-sm text-black/60">Update details for "{event.title}"</p>
          </div>

          <form className="grid gap-6 lg:grid-cols-[300px_1fr] lg:items-start lg:gap-8" onSubmit={handleSubmit(onSubmit, onErrors)}>
            {/* Left: cover + visibility */}
            <section className="flex flex-col gap-4 lg:sticky lg:top-24">
              <CoverImageUpload initialPreview={initialCoverPreview} />

              <div className="rounded-2xl border border-black/10 bg-white/80 p-4 backdrop-blur">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
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
                        { value: "true", label: "Public — anyone can find it" },
                        { value: "false", label: "Private — invite only" },
                      ]}
                    />
                  )}
                />
              </div>
            </section>

            {/* Right: form */}
            <section className="flex flex-col gap-5 rounded-3xl border border-black/10 bg-white/80 p-5 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.3)] backdrop-blur sm:p-7">
              <input
                type="text"
                autoComplete="off"
                placeholder="Event Name"
                {...register("title")}
                className="w-full bg-transparent text-3xl font-semibold tracking-tight text-black outline-none placeholder:text-black/25 sm:text-4xl"
              />
              {errors.title && <span className="text-red-500 text-xs mt-1">{errors.title.message}</span>}

              {/* Date card */}
              <DateTimeSection />

              {/* Location */}
              <LocationSection />

              {/* Description */}
              <div className="rounded-2xl border border-black/10 bg-white px-4 py-3">
                <div className="flex items-center gap-3 text-black/70">
                  <TextIcon />
                  <span className="text-sm font-medium text-black">Description</span>
                </div>
                <textarea
                  {...register("description")}
                  rows={3}
                  placeholder="Describe the audience, goals, and main outcomes."
                  className="mt-2 w-full resize-none bg-transparent text-sm text-black outline-none placeholder:text-black/35"
                />
              </div>

              {/* Event Options */}
              <EventOptionsSection hasLimit={hasLimit} setHasLimit={setHasLimit} />

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="flex-1 flex h-12 items-center justify-center rounded-2xl bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90 disabled:bg-black/50"
                >
                  {mutation.isPending ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/event/manage/${eventId}/overview`)}
                  className="flex h-12 items-center justify-center rounded-2xl border border-black/10 px-6 text-sm font-semibold uppercase tracking-widest text-black transition hover:bg-black/5"
                >
                  Cancel
                </button>
              </div>
            </section>
          </form>
        </main>
      </div>
    </FormProvider>
  );
}
