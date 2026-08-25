"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { toast } from "sonner";
import Select from "@/components/widgets/Select";
import DateTimeSection from "@/components/pages/create-event/DateTimeSection";
import CloseEventDialog from "@/components/dialogs/CloseEventDialog";
import DeleteEventDialog from "@/components/dialogs/DeleteEventDialog";
import {
  getEventById,
  updateEventRequest,
} from "@/service/eventService";
import { HTTPError } from "@/lib/request";

const inputBase =
  "w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black outline-none transition focus:border-black/40 focus:ring-2 focus:ring-black/5";

const cardClass =
  "rounded-3xl border border-black/10 bg-white/85 p-7 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.35)] backdrop-blur";

const labelClass =
  "text-xs font-semibold uppercase tracking-[0.2em] text-black/50";

const detailsSchema = z.object({
  title: z.string().min(1, "Event name is required").max(100, "Event name must be 100 characters or less"),
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
    defaultValues: { isPublic: "true" },
    values: event
      ? {
          title: event.title || "",
          description: event.description || "",
          location: event.location || "",
          isPublic: event.isPublic ? "true" : "false",
        }
      : undefined,
  });

  const detailsMutation = useMutation({
    mutationFn: async (data: DetailsValues) => {
      return updateEventRequest(eventId, {
        title: data.title,
        description: data.description || "",
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
    return <div className="p-8 text-center text-black/50">Loading event settings...</div>;
  }

  if (!event) {
    return <div className="p-8 text-center text-red-500">Failed to load event settings.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Update details */}
      <section className={cardClass}>
        <p className={labelClass}>General</p>
        <h2 className="mt-2 text-2xl font-semibold text-black">Update event</h2>
        <p className="mt-1 text-sm text-black/60">
          Change the core details of your event. For the cover image, ticket options, and capacity, use
          the full editor.
        </p>

        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={detailsForm.handleSubmit((data) => detailsMutation.mutate(data))}
        >
          <div>
            <label htmlFor="settings-title" className="block text-xs font-medium uppercase tracking-[0.18em] text-black/40">
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
              <span className="mt-1 block text-xs text-red-500">
                {detailsForm.formState.errors.title.message}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="settings-description" className="block text-xs font-medium uppercase tracking-[0.18em] text-black/40">
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="settings-location" className="block text-xs font-medium uppercase tracking-[0.18em] text-black/40">
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
              <span className="block text-xs font-medium uppercase tracking-[0.18em] text-black/40">
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
                      { value: "true", label: "Public — anyone can find it" },
                      { value: "false", label: "Private — invite only" },
                    ]}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-black/5 pt-4">
            <button
              type="submit"
              disabled={detailsMutation.isPending}
              className="inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-black/50"
            >
              {detailsMutation.isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </section>

      {/* Reschedule */}
      <section className={cardClass}>
        <p className={labelClass}>Schedule</p>
        <h2 className="mt-2 text-2xl font-semibold text-black">Reschedule event</h2>
        <p className="mt-1 text-sm text-black/60">
          Move the start, end, or registration deadline. Attendees see the updated times immediately.
        </p>

        <FormProvider {...scheduleForm}>
          <form
            className="mt-6 flex flex-col gap-4"
            onSubmit={scheduleForm.handleSubmit((data: ScheduleValues) => scheduleMutation.mutate(data))}
          >
            <DateTimeSection />

            <div className="flex justify-end border-t border-black/5 pt-4">
              <button
                type="submit"
                disabled={scheduleMutation.isPending}
                className="inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-black/50"
              >
                {scheduleMutation.isPending ? "Saving..." : "Save new schedule"}
              </button>
            </div>
          </form>
        </FormProvider>
      </section>

      {/* Close event */}
      <section className={`${cardClass} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}>
        <div>
          <p className={labelClass}>Status</p>
          <h2 className="mt-2 flex items-center gap-3 text-2xl font-semibold text-black">
            {isClosed ? "Closed" : "Active"}
            <span
              className={`inline-flex h-6 items-center rounded-full px-3 text-[10px] font-semibold uppercase tracking-widest ${
                isClosed ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {isClosed ? "Closed" : "Live"}
            </span>
          </h2>
          <p className="mt-1 max-w-xl text-sm text-black/60">
            {isClosed
              ? "This event is closed. Reopen it if things are back on."
              : "Closing an event marks it as closed for attendees. You can reopen it at any time."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCloseDialogOpen(true)}
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-black/15 px-6 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
        >
          {isClosed ? "Reopen event" : "Close event"}
        </button>
      </section>

      {/* Danger zone */}
      <section className="rounded-3xl border border-red-200 bg-red-50/70 p-7 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.35)] backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
          Danger zone
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-red-600">Delete event</h2>
        <p className="mt-1 max-w-xl text-sm text-black/60">
          Permanently delete &quot;{event.title}&quot; along with its registrations, agenda, and tasks.
          This cannot be undone.
        </p>
        <button
          type="button"
          onClick={() => setDeleteDialogOpen(true)}
          className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-red-500 px-6 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-600"
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
