"use client";

import { Controller, useFormContext } from "react-hook-form";
import Select from "../../widgets/Select";
import { PinIcon } from "./Icons";

const inputBase =
  "w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black outline-none transition focus:border-black/40 focus:ring-2 focus:ring-black/5";

export default function LocationSection() {
  const { register, control, watch, formState: { errors } } = useFormContext();
  const eventType = watch("eventType");
  const isPhysical = eventType === "physical";

  return (
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
      {errors.location && (
        <div className="px-4 pb-3 border-t border-black/5 pt-2">
          <span className="text-red-500 text-xs">
            {errors.location.message as string}
          </span>
        </div>
      )}
    </div>
  );
}
