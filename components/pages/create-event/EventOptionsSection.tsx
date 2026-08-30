"use client";

import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Select from "../../widgets/Select";
import ConnectStripeDialog from "../../dialogs/ConnectStripeDialog";
import { getConnectStatus } from "../../../service/paymentService";
import { OptionRow, TicketIcon, UsersIcon } from "./Icons";
import HelpTooltip from "../../widgets/HelpTooltip";

const inputBase =
  "w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-primary/60 focus:ring-primary/20";

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
  const [connectStripeOpen, setConnectStripeOpen] = useState(false);

  const { data: connectStatus } = useQuery({
    queryKey: ["stripe-connect-status"],
    queryFn: () => getConnectStatus(),
    retry: false,
  });
  const isStripeConnected = connectStatus?.connected ?? false;

  return (
    <div>
      <span className="px-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
        Event Options
      </span>
      <div className="mt-2 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
        {/* Ticket price */}
        <div>
          <OptionRow icon={<TicketIcon />} label="Ticket Price" help="Leave Free for no-cost entry. Choosing Paid opens Stripe checkout so attendees can buy tickets online.">
            <Controller
              name="isPaid"
              control={control}
              render={({ field }) => (
                <Select
                  name={field.name}
                  ariaLabel="Ticket price type"
                  value={field.value}
                  onChange={(next) => {
                    field.onChange(next);
                    if (next === "paid" && !isStripeConnected) {
                      setConnectStripeOpen(true);
                    }
                  }}
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
              <div className="flex flex-col gap-3 px-4 pb-3.5 sm:flex-row sm:items-center">
                <input
                  type="number"
                  placeholder="Ticket price (LKR)"
                  className={`${inputBase} h-11 sm:flex-1`}
                  {...register("ticketPrice", { valueAsNumber: true })}
                />
                {!isStripeConnected && (
                  <button
                    type="button"
                    onClick={() => setConnectStripeOpen(true)}
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-[#635bff]/30 bg-[#635bff]/5 px-4 text-sm font-semibold text-[#635bff] transition hover:border-[#635bff]/60 hover:bg-[#635bff]/10"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.639 15.703 0 13.15 0 7.886 0 3.381 2.821 3.381 7.06c0 4.212 3.567 5.64 7.13 6.838 2.609.872 3.455 1.635 3.455 2.771 0 .927-.81 1.424-2.219 1.424-1.663 0-4.907-.965-7.05-2.041l-.955 5.96c1.972.995 4.975 1.643 6.174 1.643 5.318 0 9.372-2.858 9.372-7.311 0-4.448-3.393-5.81-7.312-6.783Z" />
                    </svg>
                    Connect Stripe
                  </button>
                )}
              </div>
              {!isStripeConnected && (
                <p className="px-4 pb-3.5 text-[11px] leading-5 text-zinc-500">
                  Paid events need a connected Stripe account to accept
                  payments.
                </p>
              )}
            </div>
          </div>
          {errors.ticketPrice && (
            <div className="px-4 pb-3 border-t border-zinc-200 pt-2">
              <span className="text-red-600 text-xs">
                {errors.ticketPrice.message as string}
              </span>
            </div>
          )}
        </div>

        {/* Capacity */}
        <div>
          <OptionRow icon={<UsersIcon />} label="Capacity" help="Set the maximum number of attendees. Choose Unlimited for no cap on registrations.">
            {hasLimit ? (
              <button
                type="button"
                onClick={() => {
                  setHasLimit(false);
                  setWaitlistEnabled(false);
                }}
                className="text-xs font-semibold uppercase text-zinc-500 underline underline-offset-4 transition hover:text-zinc-900"
              >
                Unlimited
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setHasLimit(true)}
                className="text-sm font-medium text-primary transition hover:text-primary/70"
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
                <div className="flex h-11 select-none items-center rounded-xl border border-zinc-200 bg-white transition hover:bg-zinc-50">
                  <label className="flex h-full cursor-pointer items-center gap-2.5 px-3">
                    <input
                      type="checkbox"
                      {...register("whiteList")}
                      className="h-4.5 w-4.5 cursor-pointer rounded border-zinc-300 accent-primary"
                    />
                    <span className="text-sm font-medium text-zinc-900">Enable waitlist</span>
                  </label>
                  <span className="pr-2">
                    <HelpTooltip text="If the event sells out, extra attendees join a waitlist and are offered tickets automatically when spots free up." side="bottom" />
                  </span>
                </div>
              </div>
            </div>
          </div>
          {errors.capacity && (
            <div className="px-4 pb-3 border-t border-zinc-200 pt-2">
              <span className="text-red-600 text-xs">
                {errors.capacity.message as string}
              </span>
            </div>
          )}
        </div>
      </div>

      <ConnectStripeDialog
        open={connectStripeOpen}
        onClose={() => setConnectStripeOpen(false)}
        connected={isStripeConnected}
      />
    </div>
  );
}
