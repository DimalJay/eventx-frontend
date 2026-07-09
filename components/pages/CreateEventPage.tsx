"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Select from "../widgets/Select";
import DateTimePicker from "../widgets/DateTimePicker";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createEventRequest } from "@/service/eventService";
import { useMutation } from "@tanstack/react-query";

const inputBase =
  "w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black outline-none transition focus:border-black/40 focus:ring-2 focus:ring-black/5";

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
      <rect x="3" y="4.5" width="18" height="16" rx="2.5" strokeLinejoin="round" />
      <path d="M3 9h18M8 3v3M16 3v3" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
      <path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function TextIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
      <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
      <path d="M4 8.5A1.5 1.5 0 015.5 7h13A1.5 1.5 0 0120 8.5V10a2 2 0 000 4v1.5a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 15.5V14a2 2 0 000-4V8.5z" strokeLinejoin="round" />
      <path d="M14 7v10" strokeDasharray="2 2" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0111 0M16 6.5a3 3 0 010 5.8M20.5 19a5.5 5.5 0 00-4-5.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function OptionRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <div className="flex items-center gap-3 text-black/70">
        {icon}
        <span className="text-sm font-medium text-black">{label}</span>
      </div>
      {children}
    </div>
  );
}

function padDateTime(value: number) {
  return String(value).padStart(2, "0");
}

function dateToPickerValue(date?: Date) {
  if (!date) return "";

  return `${date.getFullYear()}-${padDateTime(date.getMonth() + 1)}-${padDateTime(
    date.getDate()
  )}T${padDateTime(date.getHours())}:${padDateTime(date.getMinutes())}`;
}

function pickerValueToDate(value: string) {
  return value ? new Date(value) : undefined;
}

const eventSchema = z.object({
  title: z.string().min(1, "Event name is required"),
  description: z.string().optional(),
  startDate: z.date().refine(date => date > new Date(), "Start date must be in the future"),
  endDate: z.date().refine(date => date > new Date(), "End date must be in the future"),
  regDeadline: z.date().optional(),
  location: z.string().optional(),
  isPublic: z.enum(["true", "false"]),
  eventType: z.enum(["online", "physical"]),
  capacity: z.number().int().optional(),
  ticketPrice: z.number().int().optional(),
  isPaid: z.enum(["free", "paid"]),
  whiteList: z.boolean().optional(),
  coverImage: z.instanceof(File)
    .refine(file => !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type), "Only PNG, JPG, or WEBP images are allowed")
    .optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function CreateEventPage() {
  const router = useRouter();
  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<EventFormValues>({
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

  const mutation = useMutation({
    mutationFn: async (data: EventFormValues) => {
      const { isPaid, coverImage, ...eventData } = data;
      const formData = new FormData();
      if (data.coverImage) {
        formData.append("coverImage", data.coverImage);
      }

      Object.entries(eventData).forEach(([key, value]) => {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else
          if (value !== undefined) {
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
        router.push(`/event/manage/${eventId}`);
      }
    },
    onError: (error: any) => {
      console.log("Validation Errors:", errors);
      const message = error?.response?.data?.message || error?.message || "Event creation failed. Please try again.";
      toast.error(message);
    },
  });

  const onSubmit = (data: EventFormValues) => {
    mutation.mutate(data);
  };


  const eventType = watch("eventType");
  const isPhysical = eventType === "physical";

  const [hasLimit, setHasLimit] = useState(false);
  const [waitlistEnabled, setWaitlistEnabled] = useState(false);

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const coverUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (coverUrlRef.current) URL.revokeObjectURL(coverUrlRef.current);
    };
  }, []);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (coverUrlRef.current) URL.revokeObjectURL(coverUrlRef.current);
    const url = file ? URL.createObjectURL(file) : null;
    coverUrlRef.current = url;
    setCoverPreview(url);
    setValue("coverImage", file);
  };

  const onErrors = (errors: any) => {
    console.log("Validation Errors:", errors);
  };


  return (
    <div className="flex flex-1 justify-center bg-linear-to-br from-[#f7efe2] via-white to-[#e5f4ff]">
      <main className="w-full max-w-4xl px-5 py-24 sm:px-8 sm:py-28">
        <form className="grid gap-6 lg:grid-cols-[300px_1fr] lg:items-start lg:gap-8" onSubmit={handleSubmit(onSubmit, onErrors)}>
          {/* Left: cover + visibility */}
          <section className="flex flex-col gap-4 lg:sticky lg:top-24">
            <div className="group relative flex aspect-4/5 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-black/10 bg-white/80 p-6 text-center shadow-[0_20px_60px_-40px_rgba(0,0,0,0.4)] backdrop-blur transition hover:border-black/30">
              <input
                type="file"
                name="cover"
                accept="image/*"
                onChange={handleCoverChange}
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
              />

              {coverPreview ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverPreview}
                    alt="Event cover preview"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-end justify-center bg-linear-to-t from-black/60 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                    <span className="text-sm font-medium text-white">Change cover</span>
                  </div>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-9 w-9 text-black/40"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5l4.5-4.5a2 2 0 012.8 0L15 16.5m-2-2l1.5-1.5a2 2 0 012.8 0L21 15M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="mt-4 text-sm font-medium text-black/70">Add event cover</span>
                  <span className="mt-1 text-xs text-black/40">PNG, JPG, or WEBP · 4:5 looks best</span>
                </>
              )}
            </div>

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
            <div className="rounded-2xl border border-black/10 bg-white">
              <div className="flex items-center gap-3 px-4 py-3 text-black/70">
                <CalendarIcon />
                <span className="w-12 text-sm font-medium text-black">Start</span>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      name={field.name}
                      ariaLabel="Event start date and time"
                      value={dateToPickerValue(field.value)}
                      onChange={(value) => field.onChange(pickerValueToDate(value))}
                      className="flex-1"
                    />

                  )}
                />
                {errors.startDate && <span className="text-red-500 text-xs mt-1">{errors.startDate.message}</span>}
              </div>
              <div className="h-px bg-black/10" />
              <div className="flex items-center gap-3 px-4 py-3 text-black/70">
                <CalendarIcon />
                <span className="w-12 text-sm font-medium text-black">End</span>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      name={field.name}
                      ariaLabel="Event end date and time"
                      value={dateToPickerValue(field.value)}
                      onChange={(value) => field.onChange(pickerValueToDate(value))}
                      className="flex-1"
                    />
                  )}
                />
                {errors.endDate && <span className="text-red-500 text-xs mt-1">{errors.endDate.message}</span>}
              </div>
              <div className="h-px bg-black/10" />
              <div className="flex items-center gap-3 px-4 py-3 text-black/70">
                <ClockIcon />
                <span className="text-sm font-medium text-black">Registration deadline</span>

                <Controller
                  name="regDeadline"
                  control={control}
                  render={({ field }) => (
                    <>
                      <DateTimePicker
                        name={field.name}
                        ariaLabel="Registration deadline date and time"
                        value={dateToPickerValue(field.value)}
                        onChange={(value) => field.onChange(pickerValueToDate(value))}
                        align="right"
                        className="ml-auto"
                      />
                    </>
                  )}
                />

              </div>
            </div>

            {/* Location */}
            <div className="rounded-2xl border border-black/10 bg-white">
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="flex items-center gap-3 text-black/70">
                  <PinIcon />
                  <span className="text-sm font-medium text-black">Event location</span>
                </div>
                <Controller
                  name="eventType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      name={field.name}
                      ariaLabel="Event type"
                      value={field.value}
                      onChange={field.onChange}
                      align="right"
                      className="px-3 py-1.5"
                      options={[
                        { value: "online", label: "Online" },
                        { value: "physical", label: "In person" },
                      ]}
                    />
                  )}
                />
              </div>
              <div
                className={`grid transition-all duration-300 ease-in-out ${isPhysical ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
              >
                <div className="overflow-hidden">
                  <div className="px-4 pb-3">
                    <input
                      type="text"
                      {...register("location")}
                      autoComplete="off"
                      placeholder="Offline location or virtual link"
                      className={`${inputBase} h-11`}
                    />
                  </div>
                </div>
              </div>
            </div>

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
            <div>
              <span className="px-1 text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                Event Options
              </span>
              <div className="mt-2 divide-y divide-black/10  rounded-2xl border border-black/10 bg-white">
                {/* Ticket price */}
                <div>
                  <OptionRow icon={<TicketIcon />} label="Ticket Price">
                    <Controller
                      name="isPaid"
                      control={control}
                      render={({ field }) => (
                        <Select
                          name={field.name}
                          ariaLabel="Ticket price type"
                          value={field.value}
                          onChange={field.onChange}
                          align="right"
                          className="px-3 py-1.5 z-10"
                          options={[
                            { value: 'free', label: "Free" },
                            { value: 'paid', label: "Paid" },
                          ]}
                        />
                      )}
                    />
                  </OptionRow>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${watch("isPaid") == "paid" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-4 pb-3.5">
                        <input
                          type="number"
                          placeholder="Ticket price ($)"
                          className={`${inputBase} h-11`}
                          {...register("ticketPrice", { valueAsNumber: true })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Capacity */}
                <div>
                  <OptionRow icon={<UsersIcon />} label="Capacity">
                    {hasLimit ? (
                      <button
                        type="button"
                        onClick={() => {
                          setHasLimit(false);

                          setWaitlistEnabled(false);
                        }}
                        className="text-xs font-semibold uppercase tracking-wider text-black/50 underline underline-offset-4 transition hover:text-black"
                      >
                        Unlimited
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setHasLimit(true)}
                        className="text-sm font-medium text-black/50 transition hover:text-black"
                      >
                        Unlimited
                      </button>
                    )}
                  </OptionRow>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${hasLimit ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                  >
                    <div className="overflow-hidden">
                      <div className="flex flex-col gap-2 px-4 pb-3.5 sm:flex-row">
                        <input
                          type="number"
                          placeholder="Max attendees, e.g. 350"
                          {...register("capacity", { valueAsNumber: true })}
                          className={`${inputBase} h-11 sm:flex-1`}
                        />
                        <label className="flex h-11 cursor-pointer select-none items-center gap-2.5 rounded-xl border border-black/10 bg-white px-3 transition hover:bg-black/5">
                          <input
                            type="checkbox"
                            {...register("whiteList")}
                            className="h-4.5 w-4.5 cursor-pointer rounded border-black/10 accent-black"
                          />
                          <span className="text-sm font-medium text-black">Enable waitlist</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="flex h-12 items-center justify-center rounded-2xl bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
            >
              Create Event
            </button>
            <p className="text-center text-xs text-black/50">
              You can finalize ticketing and publish when the details are ready.
            </p>
          </section>
        </form>
      </main>
    </div>
  );
}
