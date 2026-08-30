"use client";

import { Controller, useFormContext } from "react-hook-form";
import DateTimePicker from "../../widgets/DateTimePicker";
import HelpTooltip from "../../widgets/HelpTooltip";
import { CalendarIcon, ClockIcon } from "./Icons";

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

export default function DateTimeSection() {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white">
      {/* Start Date */}
      <div className="flex items-center gap-3 px-4 py-3 text-zinc-700">
        <CalendarIcon />
        <span className="w-12 text-sm font-medium text-zinc-900">Start</span>
        <HelpTooltip text="The date and time your event begins." />
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
        {errors.startDate && (
          <span className="text-red-600 text-xs mt-1">
            {errors.startDate.message as string}
          </span>
        )}
      </div>

      <div className="h-px bg-zinc-200" />

      {/* End Date */}
      <div className="flex items-center gap-3 px-4 py-3 text-zinc-700">
        <CalendarIcon />
        <span className="w-12 text-sm font-medium text-zinc-900">End</span>
        <HelpTooltip text="The date and time your event ends. Must be after the start time." />
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
        {errors.endDate && (
          <span className="text-red-600 text-xs mt-1">
            {errors.endDate.message as string}
          </span>
        )}
      </div>

      <div className="h-px bg-zinc-200" />

      {/* Registration Deadline */}
      <div className="flex items-center gap-3 px-4 py-3 text-zinc-700">
        <ClockIcon />
        <span className="text-sm font-medium text-zinc-900">Registration deadline</span>
        <HelpTooltip text="Attendees can no longer register after this time. Leave empty to allow registration until the event begins." />
        <Controller
          name="regDeadline"
          control={control}
          render={({ field }) => (
            <DateTimePicker
              name={field.name}
              ariaLabel="Registration deadline date and time"
              value={dateToPickerValue(field.value)}
              onChange={(value) => field.onChange(pickerValueToDate(value))}
              align="right"
              className="ml-auto"
            />
          )}
        />
      </div>
      {errors.regDeadline && (
        <div className="px-4 pb-3 border-t border-zinc-200 pt-2">
          <span className="text-red-600 text-xs">
            {errors.regDeadline.message as string}
          </span>
        </div>
      )}
    </div>
  );
}
