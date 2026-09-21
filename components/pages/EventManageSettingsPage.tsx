"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { toast } from "sonner";
import Select from "@/components/widgets/Select";
import DateTimeSection from "@/components/pages/create-event/DateTimeSection";
import EventOptionsSection from "@/components/pages/create-event/EventOptionsSection";
import CustomFieldsSection from "@/components/pages/create-event/CustomFieldsSection";
import CoverImageUpload from "@/components/pages/create-event/CoverImageUpload";
import CloseEventDialog from "@/components/dialogs/CloseEventDialog";
import DeleteEventDialog from "@/components/dialogs/DeleteEventDialog";
import {
  getEventById,
  updateEventRequest,
  uploadEventCoverRequest,
} from "@/service/eventService";
import { HTTPError } from "@/lib/request";
import { decodeEventId } from "@/lib/utils";
import { EventSettingsLoadingSkeleton } from "@/components/skeleton/EventSettingsLoadingSkeleton";

const inputBase =
  "h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-500 focus:border-primary/60 focus:ring-2 focus:ring-primary/20";

const cardClass =
  "card p-7";

const labelClass =
  "eyebrow";

const fieldLabelClass =
  "mb-1.5 block text-xs font-medium text-zinc-700";

function parseCategoryAndDesc(rawDesc: string = "", eventCategory?: string) {
  if (eventCategory) return { category: eventCategory, description: rawDesc };
  const match = rawDesc.match(/^\[Category:\s*([^\]]+)\]\n\n?/);
  if (match) {
    const category = match[1].trim();
    const description = rawDesc.slice(match[0].length);
    return { category, description };
  }
  return { category: "General", description: rawDesc };
}

const SETTINGS_SECTIONS: Array<[string, string]> = [
  ["profile", "Profile"],
  ["schedule", "Schedule & venue"],
  ["access", "Access & ticketing"],
  ["registration", "Registration form"],
  ["danger", "Danger zone"],
];

const settingsSchema = z.object({
  title: z.string().min(1, "Event name is required").max(100, "Event name must be 100 characters or less"),
  category: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  isPublic: z.enum(["true", "false"]),
  startDate: z.date(),
  endDate: z.date(),
  regDeadline: z.date().optional(),
  eventType: z.enum(["online", "physical"]),
  coverImage: z.union([z.instanceof(File), z.string()]).optional(),
  isPaid: z.enum(["free", "paid"]),
  ticketPrice: z.number().int().optional(),
  capacity: z.number().int().optional(),
  whiteList: z.boolean().optional(),
  customFields: z
    .array(
      z.object({
        name: z.string(),
        key: z.string(),
        type: z.string(),
        options: z.array(z.string()).optional(),
      })
    )
    .optional(),
});

type SettingsValues = z.infer<typeof settingsSchema>;

function toLocalISOString(date: Date) {
  const pad = (num: number) => String(num).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export default function EventManageSettingsPage() {
  const params = useParams();
  const eventId = decodeEventId(params.id as string);
  const queryClient = useQueryClient();
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(SETTINGS_SECTIONS[0][0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.1, 0.25, 0.5] },
    );

    SETTINGS_SECTIONS.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

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
    const coverPath = event.coverImage || "";
    if (!coverPath) return null;
    if (coverPath.startsWith("http")) return coverPath;
    const backendBase = (process.env.NEXT_PUBLIC_EVENTX_BACKEND_URL || "").replace("/api/v1", "");
    return `${backendBase}${coverPath}`;
  }, [event]);

  const parsedDesc = useMemo(
    () => parseCategoryAndDesc(event?.description || "", event?.category),
    [event?.description, event?.category],
  );

  const eventSchema = settingsSchema.superRefine((data, ctx) => {
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

  const settingsForm = useForm<SettingsValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      category: "General",
      description: "",
      location: "",
      isPublic: "true",
      startDate: new Date(),
      endDate: new Date(),
      eventType: "online",
      coverImage: "",
      isPaid: "free",
      ticketPrice: 0,
      capacity: 0,
      whiteList: false,
      customFields: [],
    },
    values: event
      ? {
          title: event.title || "",
          category: parsedDesc.category,
          description: parsedDesc.description,
          location: event.location || "",
          isPublic: event.isPublic ? "true" : "false",
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          regDeadline: event.regDeadline ? new Date(event.regDeadline) : undefined,
          eventType: event.eventType || "online",
          coverImage: event.coverImage || "",
          isPaid: (event.ticketPrice ?? 0) > 0 ? "paid" : "free",
          ticketPrice: event.ticketPrice || 0,
          capacity: event.capacity || 0,
          whiteList: (event.waitlistEnabled ?? false) === true || event.waitlistEnabled === 1,
          customFields: event.customFields ?? [],
        }
      : undefined,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: SettingsValues) => {
      let finalCoverImage = typeof data.coverImage === "string" ? data.coverImage : "";

      if (data.coverImage instanceof File) {
        const uploadRes = await uploadEventCoverRequest(data.coverImage);
        finalCoverImage = uploadRes.data?.path || uploadRes.data?.url || uploadRes.data || "";
      }

      const customFields = (data.customFields ?? [])
        .filter((field) => field.name.trim() !== "")
        .map((field) => ({
          name: field.name.trim(),
          key: field.key.trim(),
          type: field.type,
          ...(field.type === "select" ? { options: field.options ?? [] } : {}),
        }));

      return updateEventRequest(eventId, {
        title: data.title,
        category: data.category || "",
        description: data.description || "",
        location: data.location || "",
        isPublic: data.isPublic === "true",
        startDate: data.startDate ? toLocalISOString(data.startDate) : undefined,
        endDate: data.endDate ? toLocalISOString(data.endDate) : undefined,
        regDeadline: data.regDeadline ? toLocalISOString(data.regDeadline) : undefined,
        eventType: data.eventType,
        ticketPrice: data.ticketPrice,
        capacity: hasLimit ? data.capacity : 0,
        waitlistEnabled: data.whiteList,
        coverImage: finalCoverImage || undefined,
        customFields,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      toast.success("Event settings saved.");
    },
    onError: (error: HTTPError) => {
      const message = error?.response?.data?.message || error?.message || "Failed to save event settings.";
      toast.error(message);
    },
  });

  const isSaving = saveMutation.isPending;

  const onSubmit = (data: SettingsValues) => {
    if (hasLimit && (data.capacity === undefined || Number.isNaN(data.capacity) || data.capacity < 1)) {
      settingsForm.setError("capacity", {
        type: "manual",
        message: "Capacity must be at least 1",
      });
      document.getElementById("capacity")?.focus();
      return;
    }
    saveMutation.mutate(data);
  };

  if (isLoading) {
    return <EventSettingsLoadingSkeleton />;
  }

  if (!event) {
    return <div className="p-8 text-center text-danger">Failed to load event settings.</div>;
  }

  return (
    <FormProvider {...settingsForm}>
      <div className="grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)]">
        {/* Section sidebar */}
        <aside className="hidden self-start lg:sticky lg:top-24 lg:block">
          <p className="eyebrow">On this page</p>
          <nav className="mt-3 flex flex-col gap-1">
            {SETTINGS_SECTIONS.map(([id, label]) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() =>
                    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  aria-current={isActive ? "true" : undefined}
                  className={`rounded-lg px-2.5 py-1.5 text-left text-sm transition ${
                    isActive
                      ? "bg-primary-soft font-semibold text-primary"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </nav>
        </aside>

        <form
          className="flex min-w-0 flex-col gap-8"
          onSubmit={settingsForm.handleSubmit(onSubmit)}
        >
          {/* Profile: identity & branding */}
          <section id="profile" className="scroll-mt-24 card overflow-hidden">
            <div className="border-b border-zinc-200 px-6 py-4">
              <p className={labelClass}>Profile</p>
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                The name, cover, and description that identify your event to attendees.
              </p>
            </div>
            <div className="grid gap-6 px-6 py-5 lg:grid-cols-[240px_minmax(0,1fr)]">
              <CoverImageUpload initialPreview={initialCoverPreview} hideHeader />
              <div className="flex min-w-0 flex-col gap-5">
                <div>
                  <label htmlFor="settings-title" className={fieldLabelClass}>
                    Event name
                  </label>
                  <input
                    id="settings-title"
                    type="text"
                    autoComplete="off"
                    {...settingsForm.register("title")}
                    className={inputBase}
                  />
                  {settingsForm.formState.errors.title && (
                    <p className="mt-1 text-xs text-red-600">
                      {settingsForm.formState.errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <span className={fieldLabelClass}>
                    Category
                  </span>
                  <Controller
                    name="category"
                    control={settingsForm.control}
                    render={({ field }) => (
                      <Select
                        name={field.name}
                        ariaLabel="Event category"
                        value={field.value ?? "General"}
                        onChange={field.onChange}
                        className="h-11 w-full px-3"
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
                  <label htmlFor="settings-description" className={fieldLabelClass}>
                    Description
                  </label>
                  <textarea
                    id="settings-description"
                    rows={4}
                    {...settingsForm.register("description")}
                    placeholder="Describe the audience, goals, and main outcomes."
                    className={`resize-none py-2 ${inputBase}`}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Schedule & venue */}
          <section id="schedule" className="scroll-mt-24 card overflow-hidden">
            <div className="border-b border-zinc-200 px-6 py-4">
              <p className={labelClass}>Schedule & venue</p>
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                When the event happens and where attendees join it.
              </p>
            </div>
            <div className="flex flex-col gap-5 px-6 py-5">
              <DateTimeSection />

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <span className={fieldLabelClass}>
                    Format
                  </span>
                  <Controller
                    name="eventType"
                    control={settingsForm.control}
                    render={({ field }) => (
                      <Select
                        name={field.name}
                        ariaLabel="Event format"
                        value={field.value}
                        onChange={field.onChange}
                        className="h-11 w-full px-3"
                        options={[
                          { value: "online", label: "Online" },
                          { value: "physical", label: "In person" },
                        ]}
                      />
                    )}
                  />
                </div>
                <div>
                  <label htmlFor="settings-location" className={fieldLabelClass}>
                    Location / link
                  </label>
                  <input
                    id="settings-location"
                    type="text"
                    autoComplete="off"
                    {...settingsForm.register("location")}
                    placeholder="Offline location or virtual link"
                    className={inputBase}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Access & ticketing */}
          <section id="access" className="scroll-mt-24 card overflow-hidden">
            <div className="border-b border-zinc-200 px-6 py-4">
              <p className={labelClass}>Access &amp; ticketing</p>
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                Who can see the event, ticket pricing, capacity, and waitlist.
              </p>
            </div>
            <div className="flex flex-col gap-5 px-6 py-5">
              <div>
                <span className={fieldLabelClass}>
                  Visibility
                </span>
                <Controller
                  name="isPublic"
                  control={settingsForm.control}
                  render={({ field }) => (
                    <Select
                      name={field.name}
                      ariaLabel="Event visibility"
                      value={field.value}
                      onChange={field.onChange}
                      className="h-11 w-full px-3"
                      options={[
                        { value: "true", label: "Public - anyone can find it" },
                        { value: "false", label: "Private - invite only" },
                      ]}
                    />
                  )}
                />
              </div>
              <EventOptionsSection
                hasLimit={hasLimit}
                setHasLimit={setLimitOverride}
                hideHeader
                disablePricing
              />
            </div>
          </section>

          {/* Registration form */}
          <section id="registration" className="scroll-mt-24 card overflow-hidden">
            <div className="border-b border-zinc-200 px-6 py-4">
              <p className={labelClass}>Registration form</p>
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                Extra details attendees fill in when they register, including the built-in
                phone, gender, and NIC templates.
              </p>
            </div>
            <div className="px-6 py-5">
              <CustomFieldsSection hideHeader />
            </div>
          </section>

          {/* Sticky save bar */}
          <div className="sticky bottom-0 z-10 -mx-4 border-t border-zinc-200 bg-white/85 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
            <div className="flex items-center justify-end gap-3">
              {settingsForm.formState.isDirty && (
                <span className="text-xs text-zinc-500">
                  You have unsaved changes
                </span>
              )}
              <button
                type="submit"
                disabled={isSaving || !settingsForm.formState.isDirty}
                className="btn px-6 disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>

          {/* Close event */}
          {/* <section id="status" className={`scroll-mt-24 ${cardClass} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}>
            <div>
              <p className={labelClass}>Status</p>
              <h2 className="mt-2 flex items-center gap-3 text-xl font-semibold tracking-tight text-zinc-900">
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
              className="btn-ghost shrink-0"
            >
              {isClosed ? "Reopen event" : "Close event"}
            </button>
          </section> */}

          {/* Danger zone */}
          <section id="danger" className="scroll-mt-24 card border-danger-soft bg-danger-soft/40 p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-danger">
              Danger zone
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-danger">Delete event</h2>
            <p className="mt-1 max-w-xl text-sm text-zinc-600">
              Permanently delete &quot;{event.title}&quot; along with its registrations, agenda, and tasks.
              This cannot be undone.
            </p>
            <button
              type="button"
              onClick={() => setDeleteDialogOpen(true)}
              className="btn mt-4 bg-danger hover:bg-red-700"
            >
              Delete event
            </button>
          </section>
        </form>
      </div>

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
    </FormProvider>
  );
}