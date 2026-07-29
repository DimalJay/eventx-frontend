"use client";

import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Select from "../../widgets/Select";
import { OptionRow, TicketIcon, UsersIcon } from "./Icons";

const inputBase =
  "w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black outline-none transition focus:border-black/40 focus:ring-2 focus:ring-black/5";

interface EventOptionsSectionProps {
  hasLimit: boolean;
  setHasLimit: (val: boolean) => void;
}

export default function EventOptionsSection({
  hasLimit,
  setHasLimit,
}: EventOptionsSectionProps) {
  const { register, control, watch, formState: { errors } } = useFormContext();
  const [waitlistEnabled, setWaitlistEnabled] = useState(false);

  return (
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
                    { value: "free", label: "Free" },
                    { value: "paid", label: "Paid" },
                  ]}
                />
              )}
            />
          </OptionRow>
          <div
            className={`grid transition-all duration-300 ease-in-out ${watch("isPaid") === "paid" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
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
          {errors.ticketPrice && (
            <div className="px-4 pb-3 border-t border-black/5 pt-2">
              <span className="text-red-500 text-xs">
                {errors.ticketPrice.message as string}
              </span>
            </div>
          )}
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
          {errors.capacity && (
            <div className="px-4 pb-3 border-t border-black/5 pt-2">
              <span className="text-red-500 text-xs">
                {errors.capacity.message as string}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
