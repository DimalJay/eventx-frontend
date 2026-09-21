"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendInvitationsRequest } from "@/service/registrationService";
import { toast } from "sonner";
import HelpTooltip from "@/components/widgets/HelpTooltip";
import Select from "@/components/widgets/Select";
import Dialog from "@/components/widgets/Dialog";

type Props = {
  eventId: string;
  open: boolean;
  onClose: () => void;
};

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function SendInvitationDialog({ eventId, open, onClose }: Props) {
  const [role, setRole] = useState("GUEST_SPEAKER");
  const [emailsInput, setEmailsInput] = useState("");
  const queryClient = useQueryClient();

  // Validate entered emails in real-time
  const rawTokens = emailsInput
    .split(/[\n,]+/)
    .map((e) => e.trim())
    .filter((e) => e.length > 0);

  const invalidEmails = rawTokens.filter((email) => !EMAIL_REGEX.test(email));
  const validEmails = rawTokens.filter((email) => EMAIL_REGEX.test(email));

  const mutation = useMutation({
    mutationFn: async () => {
      if (rawTokens.length === 0) {
        throw new Error("Please enter at least one email address.");
      }

      if (invalidEmails.length > 0) {
        throw new Error(
          `Invalid email format found: ${invalidEmails.join(", ")}`
        );
      }

      return sendInvitationsRequest({ eventId, role, emails: validEmails });
    },
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(`Successfully sent ${res.data?.sentCount || 0} invitations!`);
        setEmailsInput("");
        queryClient.invalidateQueries({ queryKey: ["event-guests", Number(eventId)] });
        queryClient.invalidateQueries({ queryKey: ["manage-registrations", eventId] });
        onClose();
      } else {
        toast.error(res?.message || "Failed to send invitations.");
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error sending invitations.");
    },
  });

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const foundEmails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
      const uniqueEmails = Array.from(new Set(foundEmails));

      if (uniqueEmails.length > 0) {
        setEmailsInput((prev) => {
          const current = prev.trim();
          return current ? current + "\n" + uniqueEmails.join("\n") : uniqueEmails.join("\n");
        });
        toast.success(`Found ${uniqueEmails.length} valid email addresses in CSV.`);
      } else {
        toast.error("No valid email addresses found in the CSV file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      eyebrow="Invitations"
      title="Send Event Invitations"
      description="Invite speakers or VIP guests. They will receive a dynamic invitation email to confirm attendance."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
        className="mt-5 space-y-4"
      >
        <div className="grid gap-2 text-sm font-semibold text-zinc-900">
          <div className="flex items-center gap-1.5">
            <label htmlFor="invitation-role">Recipient Role</label>
            <HelpTooltip text="Guest Speaker events carry the speaker role on the agenda; VVIP / VIP participants are honored guests without a speaking slot." side="bottom" />
          </div>
          <Select
            ariaLabel="Recipient Role"
            value={role}
            onChange={setRole}
            className="h-11 w-full px-4"
            options={[
              { value: "GUEST_SPEAKER", label: "Guest Speaker" },
              { value: "VVIP_VIP", label: "VVIP / VIP Participant" },
            ]}
          />
        </div>

        <div className="grid gap-2 text-sm font-semibold text-zinc-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <label htmlFor="invitation-emails">Email Addresses</label>
              <HelpTooltip text="Separate multiple addresses with commas or new lines. You can also upload a CSV file and valid email addresses will be extracted automatically." side="bottom" />
            </div>
            <label className="text-xs text-primary hover:underline cursor-pointer font-medium">
              Upload CSV
              <input
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={handleCsvUpload}
              />
            </label>
          </div>
          <textarea
            id="invitation-emails"
            rows={4}
            placeholder="Enter emails separated by commas or lines (e.g. john@example.com, sara@example.com)..."
            value={emailsInput}
            onChange={(e) => setEmailsInput(e.target.value)}
            className={`rounded-xl border bg-white p-4 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition resize-none ${
              invalidEmails.length > 0
                ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                : "border-zinc-200 focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            }`}
          />

          {invalidEmails.length > 0 && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
              <p className="font-semibold mb-1">
                ⚠️ Invalid email address{invalidEmails.length > 1 ? "es" : ""} detected:
              </p>
              <ul className="list-disc list-inside space-y-0.5">
                {invalidEmails.map((badEmail, idx) => (
                  <li key={idx} className="font-mono text-[11px] break-all">
                    {badEmail}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 shadow-xs"
            disabled={mutation.isPending || invalidEmails.length > 0 || rawTokens.length === 0}
          >
            {mutation.isPending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Sending...
              </>
            ) : (
              "Send Invitation"
            )}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
