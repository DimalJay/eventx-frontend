"use client";

import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthContext";
import { updateProfile } from "@/service/userService";

const inputBase =
  "h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black outline-none transition focus:border-black/40 focus:ring-2 focus:ring-black/5";

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
      <section className="rounded-3xl border border-black/10 bg-white/85 p-7 backdrop-blur">
        <div className="h-6 w-40 animate-pulse rounded-full bg-black/10" />
        <div className="mt-4 space-y-4">
          <div className="h-11 animate-pulse rounded-xl bg-black/5" />
          <div className="h-11 animate-pulse rounded-xl bg-black/5" />
        </div>
      </section>
    );
  }

  const onSubmit = (values: ProfileFormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-3xl border border-black/10 bg-white/85 p-7 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.35)] backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-lg font-semibold uppercase tracking-widest text-white">
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
            <p className="text-lg font-semibold text-black">
              {user.firstName} {user.lastName}
            </p>
            <p className="mt-0.5 text-sm text-black/60">{user.email}</p>
          </div>
        </div>

        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
          Personal information
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 grid gap-4 sm:grid-cols-2"
        >
          <div>
            <label className="mb-1.5 block text-xs text-black/60">
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
            <label className="mb-1.5 block text-xs text-black/60">
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
            <label className="mb-1.5 block text-xs text-black/60">
              Phone number
            </label>
            <input
              type="tel"
              className={inputBase}
              placeholder="Phone number"
              {...register("phoneNumber")}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs text-black/60">Email</label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="h-11 w-full rounded-xl border border-black/10 bg-black/5 px-3 text-sm text-black/50 outline-none"
            />
            <p className="mt-1.5 text-xs text-black/50">
              You cannot change your email address.
            </p>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-black px-6 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/85 disabled:opacity-50"
            >
              {mutation.isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}