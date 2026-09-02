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

export default function SendInvitationDialog({ eventId, open, onClose }: Props) {
  const [role, setRole] = useState("GUEST_SPEAKER");
  const [emailsInput, setEmailsInput] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      // Split emails by commas or newlines and clean them
      const emailList = emailsInput
        .split(/[\n,]+/)
        .map((e) => e.trim())
        .filter((e) => e.length > 0 && e.includes("@"));

      if (emailList.length === 0) {
        throw new Error("Please enter at least one valid email address.");
      }

      return sendInvitationsRequest({ eventId, role, emails: emailList });
    },
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(`Successfully sent ${res.data?.sentCount || 0} invitations!`);
        setEmailsInput("");
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
      // Extract emails using regex
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const foundEmails = text.match(emailRegex) || [];
      const uniqueEmails = Array.from(new Set(foundEmails));

      if (uniqueEmails.length > 0) {
        setEmailsInput((prev) => {
          const current = prev.trim();
          return current ? current + "\n" + uniqueEmails.join("\n") : uniqueEmails.join("\n");
        });
        toast.success(`Found ${uniqueEmails.length} email addresses in CSV.`);
      } else {
        toast.error("No valid email addresses found in the CSV file.");
      }
    };
    reader.readAsText(file);
    // Reset file input
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
              <label className="text-xs text-primary hover:underline cursor-pointer">
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
              placeholder="Enter emails separated by commas or lines..."
              value={emailsInput}
              onChange={(e) => setEmailsInput(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-primary/60 focus:ring-primary/20 resize-none"
            />
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
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={mutation.isPending}
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
