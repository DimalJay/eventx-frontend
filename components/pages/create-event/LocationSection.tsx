"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";
import Select from "../../widgets/Select";
import HelpTooltip from "../../widgets/HelpTooltip";
import { PinIcon } from "./Icons";

const inputBase =
  "w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-primary/60 focus:ring-primary/20";

export default function LocationSection() {
  const { register, control, formState: { errors } } = useFormContext();
  const eventType = useWatch({ control, name: "eventType" });
  const isOnline = eventType === "online";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3 text-zinc-500">
          <PinIcon />
          <span className="text-sm font-medium text-zinc-900">
            {isOnline ? "Meeting Link / URL" : "Event location"}
          </span>
          <HelpTooltip
            text={
              isOnline
                ? "Paste your virtual event or meeting link (Zoom, Google Meet, Teams, or event URL)."
                : "For in-person events, add the street address or venue name."
            }
            side="bottom"
          />
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
      <div className="px-4 pb-3">
        <input
          type="text"
          {...register("location")}
          autoComplete="off"
          placeholder={
            isOnline
              ? "e.g. https://zoom.us/j/123456789 or Google Meet link"
              : "e.g. Lotus Tower, Colombo or venue address"
          }
          className={`${inputBase} h-11`}
        />
      </div>
      {errors.location && (
        <div className="px-4 pb-3 border-t border-zinc-200 pt-2">
          <span className="text-red-600 text-xs">
            {errors.location.message as string}
          </span>
        </div>
      )}
    </div>
  );
}

