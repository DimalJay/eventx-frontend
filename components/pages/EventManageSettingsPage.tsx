"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { toast } from "sonner";
import Select from "@/components/widgets/Select";
import DateTimeSection from "@/components/pages/create-event/DateTimeSection";
import EventOptionsSection from "@/components/pages/create-event/EventOptionsSection";
import CoverImageUpload from "@/components/pages/create-event/CoverImageUpload";
import CloseEventDialog from "@/components/dialogs/CloseEventDialog";
import DeleteEventDialog from "@/components/dialogs/DeleteEventDialog";
import {
  getEventById,
  updateEventRequest,
  uploadEventCoverRequest,
} from "@/service/eventService";
import { HTTPError } from "@/lib/request";
import { EventSettingsLoadingSkeleton } from "@/components/skeleton/EventSettingsLoadingSkeleton";

const inputBase =
  "w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-primary/60 focus:ring-2 focus:ring-primary/20";

const cardClass =
  "rounded-2xl border border-zinc-200 bg-white p-7";

const labelClass =
  "text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500";

function parseCategoryAndDesc(rawDesc: string = "") {
  const match = rawDesc.match(/^\[Category:\s*([^\]]+)\]\n\n?/);
  if (match) {
    const category = match[1].trim();
    const description = rawDesc.slice(match[0].length);
    return { category, description };
  }
  return { category: "General", description: rawDesc };
}

const detailsSchema = z.object({
  title: z.string().min(1, "Event name is required").max(100, "Event name must be 100 characters or less"),
  category: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  isPublic: z.enum(["true", "false"]),
});

type DetailsValues = z.infer<typeof detailsSchema>;

const scheduleSchema = z
  .object({
    startDate: z.date(),
    endDate: z.date(),
    regDeadline: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startDate && data.endDate && data.endDate <= data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be after start date",
        path: ["endDate"],
      });
    }

    if (data.regDeadline && data.startDate && data.regDeadline > data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Registration deadline must be before or equal to the start date",
        path: ["regDeadline"],
      });
    }
  });

type ScheduleValues = z.infer<typeof scheduleSchema>;

const optionsSchema = z
  .object({
    eventType: z.enum(["online", "physical"]),
    coverImage: z.union([z.instanceof(File), z.string()]).optional(),
    isPaid: z.enum(["free", "paid"]),
    ticketPrice: z.number().int().optional(),
    capacity: z.number().int().optional(),
    whiteList: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.isPaid === "paid" &&
      (data.ticketPrice === undefined ||
        Number.isNaN(data.ticketPrice) ||
        data.ticketPrice <= 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ticket price must be greater than 0",
        path: ["ticketPrice"],
      });
    }
  });

type OptionsValues = z.infer<typeof optionsSchema>;

function toLocalISOString(date: Date) {
  const pad = (num: number) => String(num).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export default function EventManageSettingsPage() {
  const params = useParams();
  const eventId = params.id as string;
  const queryClient = useQueryClient();
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      if (!eventId) return null;
      const res = await getEventById(eventId);
      return res.data;
    },
    enabled: !!eventId,
  });

  const isClosed = String(event?.status ?? "").toUpperCase() === "CLOSED";

  const [limitOverride, setLimitOverride] = useState<boolean | null>(null);
  const hasLimit =
    limitOverride ?? (event?.capacity != null ? event.capacity > 0 : false);

  const initialCoverPreview = useMemo(() => {
    if (!event) return null;
    const coverPath = event.coverImage || event.imageUrl || "";
    if (!coverPath) return null;
    if (coverPath.startsWith("http")) return coverPath;
    const backendBase = (process.env.NEXT_PUBLIC_EVENTX_BACKEND_URL || "").replace("/api/v1", "");
    return `${backendBase}${coverPath}`;
  }, [event]);

  const parsedDesc = useMemo(() => parseCategoryAndDesc(event?.description || ""), [event?.description]);

  const optionsForm = useForm<OptionsValues>({
    resolver: zodResolver(optionsSchema),
    defaultValues: {
      eventType: "online",
      isPaid: "free",
      capacity: 0,
      ticketPrice: 0,
      whiteList: false,
    },
    values: event
      ? {
          eventType: event.eventType || "online",
          coverImage: event.coverImage || event.imageUrl || "",
          isPaid: (event.ticketPrice ?? 0) > 0 ? "paid" : "free",
          ticketPrice: event.ticketPrice || 0,
          capacity: event.capacity || 0,
          whiteList: event.whiteList || false,
        }
      : undefined,
  });

  const optionsMutation = useMutation({
    mutationFn: async (data: OptionsValues) => {
      let finalCoverImage = typeof data.coverImage === "string" ? data.coverImage : "";

      if (data.coverImage instanceof File) {
        const uploadRes = await uploadEventCoverRequest(data.coverImage);
        finalCoverImage = uploadRes.data?.path || uploadRes.data?.url || uploadRes.data || "";
      }

      return updateEventRequest(eventId, {
        eventType: data.eventType,
        ticketPrice: data.ticketPrice,
        capacity: data.capacity,
        whiteList: data.whiteList,
        coverImage: finalCoverImage || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      toast.success("Event options updated successfully.");
    },
    onError: (error: HTTPError) => onError(error, "Failed to update event options."),
  });

  const onUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    toast.success("Event updated successfully.");
  };

  const onError = (error: HTTPError, fallback: string) => {
    const message = error?.response?.data?.message || error?.message || fallback;
    toast.error(message);
  };

  const detailsForm = useForm<DetailsValues>({
    resolver: zodResolver(detailsSchema),
    defaultValues: { isPublic: "true", category: "General" },
    values: event
      ? {
          title: event.title || "",
          category: parsedDesc.category,
          description: parsedDesc.description,
          location: event.location || "",
          isPublic: event.isPublic ? "true" : "false",
        }
      : undefined,
  });

  const detailsMutation = useMutation({
    mutationFn: async (data: DetailsValues) => {
      const catPrefix = data.category ? `[Category: ${data.category}]\n\n` : "";
      const finalDesc = `${catPrefix}${data.description || ""}`;
      return updateEventRequest(eventId, {
        title: data.title,
        description: finalDesc,
        location: data.location || "",
        isPublic: data.isPublic === "true",
      });
    },
    onSuccess: onUpdated,
    onError: (error: HTTPError) => onError(error, "Event update failed. Please try again."),
  });

  const deadlineRaw = event?.regDeadline ?? event?.registrationDeadline;

  const scheduleForm = useForm<ScheduleValues>({
    resolver: zodResolver(scheduleSchema),
    values: event?.startDate && event.endDate
      ? {
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          regDeadline: deadlineRaw ? new Date(deadlineRaw) : undefined,
        }
      : undefined,
  });

  const scheduleMutation = useMutation({
    mutationFn: async (data: ScheduleValues) => {
      return updateEventRequest(eventId, {
        startDate: data.startDate ? toLocalISOString(data.startDate) : undefined,
        endDate: data.endDate ? toLocalISOString(data.endDate) : undefined,
        regDeadline: data.regDeadline ? toLocalISOString(data.regDeadline) : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      toast.success("Event rescheduled successfully.");
    },
    onError: (error: HTTPError) => onError(error, "Rescheduling failed. Please try again."),
  });

  if (isLoading) {
    return <EventSettingsLoadingSkeleton />;
  }


  if (!event) {
    return <div className="p-8 text-center text-danger">Failed to load event settings.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Update details */}
      <section className={cardClass}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={labelClass}>General</p>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-zinc-900">Update event</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Change the core details of your event. The cover image, event type,
              ticketing, and capacity live in the options below.
            </p>
          </div>
        </div>

        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={detailsForm.handleSubmit((data) => detailsMutation.mutate(data))}
        >
          <div>
            <label htmlFor="settings-title" className="block text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
              Event name
            </label>
            <input
              id="settings-title"
              type="text"
              autoComplete="off"
              {...detailsForm.register("title")}
              className={`mt-2 h-11 ${inputBase}`}
            />
            {detailsForm.formState.errors.title && (
              <span className="mt-1 block text-xs text-red-600">
                {detailsForm.formState.errors.title.message}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="settings-description" className="block text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
              Description
            </label>
            <textarea
              id="settings-description"
              rows={3}
              {...detailsForm.register("description")}
              placeholder="Describe the audience, goals, and main outcomes."
              className={`mt-2 resize-none py-2 ${inputBase}`}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="settings-location" className="block text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                Location / link
              </label>
              <input
                id="settings-location"
                type="text"
                autoComplete="off"
                {...detailsForm.register("location")}
                placeholder="Offline location or virtual link"
                className={`mt-2 h-11 ${inputBase}`}
              />
            </div>
            <div>
              <span className="block text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                Category
              </span>
              <Controller
                name="category"
                control={detailsForm.control}
                render={({ field }) => (
                  <Select
                    name={field.name}
                    ariaLabel="Event category"
                    value={field.value}
                    onChange={field.onChange}
                    className="mt-2 h-11 w-full px-3"
                    options={[
                      { value: "General", label: "General" },
                      { value: "Technology", label: "Technology" },
                      { value: "Business", label: "Business" },
                      { value: "Design", label: "Design" },
                      { value: "Marketing", label: "Marketing" },
                      { value: "Entertainment", label: "Entertainment & Music" },
                      { value: "Workshop", label: "Workshop & Training" },
                      { value: "Networking", label: "Networking" },
                      { value: "Sports", label: "Sports & Fitness" },
                      { value: "Other", label: "Other" },
                    ]}
                  />
                )}
              />
            </div>
            <div>
              <span className="block text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                Visibility
              </span>
              <Controller
                name="isPublic"
                control={detailsForm.control}
                render={({ field }) => (
                  <Select
                    name={field.name}
                    ariaLabel="Event visibility"
                    value={field.value}
                    onChange={field.onChange}
                    className="mt-2 h-11 w-full px-3"
                    options={[
                      { value: "true", label: "Public - anyone can find it" },
                      { value: "false", label: "Private - invite only" },
                    ]}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-zinc-200 pt-4">
            <button
              type="submit"
              disabled={detailsMutation.isPending}
              className="btn disabled:cursor-not-allowed disabled:opacity-60"
            >
              {detailsMutation.isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </section>

      {/* Reschedule */}
      <section className={cardClass}>
        <p className={labelClass}>Schedule</p>
        <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-zinc-900">Reschedule event</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Move the start, end, or registration deadline. Attendees see the updated times immediately.
        </p>

        <FormProvider {...scheduleForm}>
          <form
            className="mt-6 flex flex-col gap-4"
            onSubmit={scheduleForm.handleSubmit((data: ScheduleValues) => scheduleMutation.mutate(data))}
          >
            <DateTimeSection />

            <div className="flex justify-end border-t border-zinc-200 pt-4">
              <button
                type="submit"
                disabled={scheduleMutation.isPending}
                className="btn disabled:cursor-not-allowed disabled:opacity-60"
              >
                {scheduleMutation.isPending ? "Saving..." : "Save new schedule"}
              </button>
            </div>
          </form>
        </FormProvider>
      </section>

      {/* Cover & event options */}
      <section className={cardClass}>
        <p className={labelClass}>Options</p>
        <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-zinc-900">Cover & event options</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Set the cover image, event type, ticket price, and capacity for this event.
        </p>

        <FormProvider {...optionsForm}>
          <form
            className="mt-6 flex flex-col gap-4"
            onSubmit={optionsForm.handleSubmit((data: OptionsValues) => optionsMutation.mutate(data))}
          >
            <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
              <CoverImageUpload initialPreview={initialCoverPreview} />
              <div className="flex min-w-0 flex-col gap-4">
                <div className="rounded-xl border border-zinc-200 bg-white p-4">
                  <span className="block text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                    Event type
                  </span>
                  <Controller
                    name="eventType"
                    control={optionsForm.control}
                    render={({ field }) => (
                      <Select
                        name={field.name}
                        ariaLabel="Event type"
                        value={field.value}
                        onChange={field.onChange}
                        className="mt-2 h-11 w-full px-3"
                        options={[
                          { value: "online", label: "Online" },
                          { value: "physical", label: "In person" },
                        ]}
                      />
                    )}
                  />
                </div>
                <EventOptionsSection hasLimit={hasLimit} setHasLimit={setLimitOverride} />
              </div>
            </div>

            <div className="flex justify-end border-t border-zinc-200 pt-4">
              <button
                type="submit"
                disabled={optionsMutation.isPending}
                className="btn disabled:cursor-not-allowed disabled:opacity-60"
              >
                {optionsMutation.isPending ? "Saving..." : "Save options"}
              </button>
            </div>
          </form>
        </FormProvider>
      </section>

      {/* Close event */}
      <section className={`${cardClass} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}>
        <div>
          <p className={labelClass}>Status</p>
          <h2 className="mt-2 flex items-center gap-3 font-display text-2xl font-medium tracking-tight text-zinc-900">
            {isClosed ? "Closed" : "Active"}
            <span
              className={`inline-flex h-6 items-center rounded-full px-3 text-[10px] font-semibold uppercase tracking-widest ${
                isClosed ? "bg-danger-soft text-danger" : "bg-success-soft text-success"
              }`}
            >
              {isClosed ? "Closed" : "Live"}
            </span>
          </h2>
          <p className="mt-1 max-w-xl text-sm text-zinc-600">
            {isClosed
              ? "This event is closed. Reopen it if things are back on."
              : "Closing an event marks it as closed for attendees. You can reopen it at any time."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCloseDialogOpen(true)}
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 transition hover:border-primary/50 hover:text-primary"
        >
          {isClosed ? "Reopen event" : "Close event"}
        </button>
      </section>

      {/* Danger zone */}
      <section className="rounded-2xl border border-danger-soft bg-danger-soft/40 p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-danger">
          Danger zone
        </p>
        <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-danger">Delete event</h2>
        <p className="mt-1 max-w-xl text-sm text-zinc-600">
          Permanently delete &quot;{event.title}&quot; along with its registrations, agenda, and tasks.
          This cannot be undone.
        </p>
        <button
          type="button"
          onClick={() => setDeleteDialogOpen(true)}
          className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-danger px-5 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Delete event
        </button>
      </section>

      <CloseEventDialog
        open={closeDialogOpen}
        onClose={() => setCloseDialogOpen(false)}
        eventId={eventId}
        eventTitle={event.title}
        targetStatus={isClosed ? "ACTIVE" : "CLOSED"}
      />

      <DeleteEventDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        eventId={eventId}
        eventTitle={event.title}
      />
    </div>
  );
}
