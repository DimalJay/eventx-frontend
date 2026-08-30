"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthContext";
import { updateProfile } from "@/service/userService";
import HelpTooltip from "@/components/widgets/HelpTooltip";

const inputBase =
  "h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-500 focus:border-primary/60 focus:ring-2 focus:ring-primary/20";

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      phoneNumber: user?.phoneNumber ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Profile updated.");
      reset({
        firstName: data?.firstName ?? user?.firstName ?? "",
        lastName: data?.lastName ?? user?.lastName ?? "",
        phoneNumber: data?.phoneNumber ?? user?.phoneNumber ?? "",
      });
    },
    onError: (err: Error) => {
      toast.error(err?.message || "Could not update your profile.");
    },
  });

  if (!user) {
    return (
      <section className="card p-7">
        <div className="h-6 w-40 animate-pulse rounded-full bg-zinc-200" />
        <div className="mt-4 space-y-4">
          <div className="h-11 animate-pulse rounded-xl bg-zinc-100" />
          <div className="h-11 animate-pulse rounded-xl bg-zinc-100" />
        </div>
      </section>
    );
  }

  const onSubmit = (values: ProfileFormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className="flex flex-col gap-8">
      <section className="card p-7">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-lg font-semibold text-primary">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt=""
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              `${user.firstName?.charAt(0) ?? "U"}${
                user.lastName?.charAt(0) ?? ""
              }`
            )}
          </div>
          <div>
            <p className="text-lg font-semibold text-zinc-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="mt-0.5 text-sm text-zinc-600">{user.email}</p>
          </div>
        </div>

        <p className="eyebrow mt-5">
          Personal information
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 grid gap-4 sm:grid-cols-2"
        >
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-700">
              First name
            </label>
            <input
              type="text"
              className={inputBase}
              placeholder="First name"
              {...register("firstName", {
                required: "First name is required",
              })}
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-600">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-700">
              Last name
            </label>
            <input
              type="text"
              className={inputBase}
              placeholder="Last name"
              {...register("lastName", {
                required: "Last name is required",
              })}
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-600">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-700">
              Phone number
              <HelpTooltip text="Use an international format, e.g. +94 77 123 4567. Organizers may use this to contact you about the event." side="bottom" />
            </label>
            <input
              type="tel"
              className={inputBase}
              placeholder="Phone number"
              {...register("phoneNumber")}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-zinc-700">Email</label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-100 px-3 text-sm text-zinc-500 outline-none"
            />
            <p className="mt-1.5 text-xs text-zinc-500">
              You cannot change your email address.
            </p>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn disabled:opacity-50"
            >
              {mutation.isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}