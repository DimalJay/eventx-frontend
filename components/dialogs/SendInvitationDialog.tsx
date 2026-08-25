"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendInvitationsRequest } from "@/service/registrationService";
import { toast } from "sonner";

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
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
          Invitations
        </p>
        <h3 className="mt-2 text-xl font-semibold text-black">
          Send Event Invitations
        </h3>
        <p className="mt-2 text-sm text-black/60">
          Invite speakers or VIP guests. They will receive a dynamic invitation email to confirm attendance.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="mt-5 space-y-4"
        >
          <div className="grid gap-2 text-sm font-semibold text-black">
            <label htmlFor="invitation-role">Recipient Role</label>
            <select
              id="invitation-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
            >
              <option value="GUEST_SPEAKER">Guest Speaker</option>
              <option value="VVIP_VIP">VVIP / VIP Participant</option>
            </select>
          </div>

          <div className="grid gap-2 text-sm font-semibold text-black">
            <div className="flex items-center justify-between">
              <label htmlFor="invitation-emails">Email Addresses</label>
              <label className="text-xs text-blue-600 hover:underline cursor-pointer">
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
              className="rounded-2xl border border-black/10 bg-white p-4 text-base text-black outline-none transition focus:border-black/40 resize-none"
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
              onClick={onClose}
              disabled={mutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-full bg-black px-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/90 disabled:opacity-50"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Sending..." : "Send Invitation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
