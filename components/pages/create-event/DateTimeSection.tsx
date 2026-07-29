"use client";

import { Controller, useFormContext } from "react-hook-form";
import DateTimePicker from "../../widgets/DateTimePicker";
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
    <div className="rounded-2xl border border-black/10 bg-white">
      {/* Start Date */}
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
        {errors.startDate && (
          <span className="text-red-500 text-xs mt-1">
            {errors.startDate.message as string}
          </span>
        )}
      </div>

      <div className="h-px bg-black/10" />

      {/* End Date */}
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
        {errors.endDate && (
          <span className="text-red-500 text-xs mt-1">
            {errors.endDate.message as string}
          </span>
        )}
      </div>

      <div className="h-px bg-black/10" />

      {/* Registration Deadline */}
      <div className="flex items-center gap-3 px-4 py-3 text-black/70">
        <ClockIcon />
        <span className="text-sm font-medium text-black">Registration deadline</span>
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
        <div className="px-4 pb-3 border-t border-black/5 pt-2">
          <span className="text-red-500 text-xs">
            {errors.regDeadline.message as string}
          </span>
        </div>
      )}
    </div>
  );
}
