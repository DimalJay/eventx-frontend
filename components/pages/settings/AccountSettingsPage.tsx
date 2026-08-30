"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthContext";
import { changePassword, deleteAccount } from "@/service/userService";
import DeleteAccountDialog from "@/components/dialogs/DeleteAccountDialog";
import HelpTooltip from "@/components/widgets/HelpTooltip";

const inputBase =
  "h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-500 focus:border-primary/60 focus:ring-2 focus:ring-primary/20";

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

function formatDate(value?: string): string {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function AccountSettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = watch("newPassword");

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password updated.");
      reset();
    },
    onError: (err: Error) => {
      toast.error(err?.message || "Could not change your password.");
    },
  });

  const onSubmit = (values: PasswordFormValues) => {
    mutation.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  };

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      toast.success("Account deleted.");
      logout();
      router.push("/");
    },
    onError: (err: Error) => {
      toast.error(err?.message || "Could not delete your account.");
    },
  });

  const handleDelete = () => {
    setDeleteOpen(false);
    deleteMutation.mutate();
  };

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

  const loginMethod =
    user.loginType === "google" ? "Google sign-in" : "Standard";

  const rows = [
    { label: "Email", value: user.email },
    { label: "Member since", value: formatDate(user.createdAt) },
    { label: "Sign-in method", value: loginMethod },
    { label: "Account status", value: user.accountStatus },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex flex-col gap-8">
      <section className="card p-7">
        <p className="eyebrow">
          Account details
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {rows.map((row) => (
            <div
              key={row.label}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4"
            >
              <p className="text-xs text-zinc-500">{row.label}</p>
              <p className="mt-1 truncate text-sm font-semibold capitalize text-zinc-900">
                {row.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-7">
        <p className="eyebrow">
          Change password
        </p>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Use a password with at least 8 characters.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 grid gap-4 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-zinc-700">
              Current password
            </label>
            <input
              type="password"
              className={inputBase}
              placeholder="Current password"
              {...register("currentPassword", {
                required: "Current password is required",
              })}
            />
            {errors.currentPassword && (
              <p className="mt-1 text-xs text-red-600">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-700">
              New password
              <HelpTooltip text="Use at least 8 characters. Avoid reusing a password from another site, and mix letters, numbers, and symbols." side="bottom" />
            </label>
            <input
              type="password"
              className={inputBase}
              placeholder="New password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "New password must be at least 8 characters",
                },
              })}
            />
            {errors.newPassword && (
              <p className="mt-1 text-xs text-red-600">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-700">
              Confirm new password
            </label>
            <input
              type="password"
              className={inputBase}
              placeholder="Confirm new password"
              {...register("confirmPassword", {
                required: "Confirm your new password",
                validate: (value) =>
                  value === newPasswordValue || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn disabled:opacity-50"
            >
              {mutation.isPending ? "Updating..." : "Update password"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-red-200 bg-white p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-red-600">
          Danger zone
        </p>
        <div className="mt-4 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-900">Log out</p>
              <p className="mt-0.5 text-sm text-zinc-600">
                Log out of EventX on this device.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-50 px-6 text-sm font-semibold text-red-600 transition hover:border-red-400"
            >
              Log out
            </button>
          </div>

          <div className="h-px w-full bg-red-100" />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                Delete account
              </p>
              <p className="mt-0.5 text-sm text-zinc-600">
                Permanently delete your account, your events, and all related
                data.
              </p>
            </div>
            <button
              type="button"
              disabled={deleteMutation.isPending}
              onClick={() => setDeleteOpen(true)}
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-danger px-6 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete account"}
            </button>
          </div>
        </div>
      </section>

      <DeleteAccountDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        email={user.email}
        pending={deleteMutation.isPending}
      />
    </div>
  );
}