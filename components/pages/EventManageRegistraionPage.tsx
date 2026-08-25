"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEventRegistrations, updateRegistrationStatus } from "@/service/registrationService";
import { getEventById } from "@/service/eventService";
import { sendFeedbackEmails } from "@/service/feedbackService";
import { IRegistration, IEvent } from "@/types";
import { toast } from "sonner";
import RegistrationStatusDialog from "../dialogs/RegistrationStatusDialog";
import CheckInDialog from "../dialogs/CheckInDialog";
import SendInvitationDialog from "../dialogs/SendInvitationDialog";

const statusStyles: Record<string, string> = {
  GOING: "border-emerald-200 bg-emerald-50 text-emerald-800",
  WAITLIST: "border-amber-200 bg-amber-50 text-amber-800",
  NOT_GOING: "border-black/15 bg-black/5 text-black/60",
  PENDING: "border-blue-200 bg-blue-50 text-blue-800",
};

const statusLabels: Record<string, string> = {
  GOING: "Going",
  WAITLIST: "Waitlist",
  NOT_GOING: "Not going",
  PENDING: "Pending",
};

export default function EventManageRegistraionPage() {
  const { id: eventId } = useParams() as { id: string };
  const queryClient = useQueryClient();
  const [selectedReg, setSelectedReg] = useState<IRegistration | null>(null);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const { data: event } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const res = await getEventById(eventId);
      return res.data as IEvent;
    },
    enabled: !!eventId,
    retry: false,
  });

  const { data: registrations = [], isLoading, isError } = useQuery({
    queryKey: ["manage-registrations", eventId],
    queryFn: async () => {
      const res = await getEventRegistrations({ data: { eventId } });
      return (res.data || []) as IRegistration[];
    },
    enabled: !!eventId,
    retry: false,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return updateRegistrationStatus(id, status);
    },
    onSuccess: (res) => {
      if (res?.success) {
        setSelectedReg(null);
        queryClient.invalidateQueries({ queryKey: ["manage-registrations", eventId] });
        queryClient.invalidateQueries({ queryKey: ["registrations", eventId] });
        toast.success("Registration status updated.");
      } else {
        toast.error(res?.message || "Failed to update status.");
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error updating status.");
    },
  });

  const sendFeedbackMutation = useMutation({
    mutationFn: async () => {
      return sendFeedbackEmails(eventId);
    },
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(`Sent ${res.data?.emailsSent || 0} feedback request emails.`);
      } else {
        toast.error(res?.message || "Failed to send feedback emails.");
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error sending feedback emails.");
    },
  });

  const total = registrations.length;
  const checkedIn = registrations.filter((r) => !!r.chekingTime).length;
  const seatsLeft = event ? event.capacity - total : 0;
  const revenue = event && event.ticketPrice > 0 ? total * event.ticketPrice : 0;

  const stats = [
    {
      label: "Total registered",
      value: total.toLocaleString(),
      delta: `${total} registration${total !== 1 ? "s" : ""}`,
    },
    {
      label: "Checked in",
      value: checkedIn.toLocaleString(),
      delta: checkedIn === 0 ? "Opens on event day" : `${checkedIn} checked in`,
    },
    {
      label: "Revenue",
      value: event?.ticketPrice ? `$${revenue.toLocaleString()}` : "Free",
      delta: event?.ticketPrice ? `${total} × $${event.ticketPrice}` : "Free event",
    },
    {
      label: "Seats left",
      value: event ? seatsLeft.toLocaleString() : "—",
      delta: event ? `of ${event.capacity} capacity` : "—",
    },
  ];

  const filteredRegistrations = registrations.filter((reg) => {
    const name = `${reg.firstName ?? ""} ${reg.lastName ?? ""}`.trim().toLowerCase();
    const email = (reg.email ?? "").toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || name.includes(q) || email.includes(q);
    const matchesStatus = !statusFilter || reg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-black/10 border-t-black" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-red-500">Failed to load registrations.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.35)] backdrop-blur"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
              {item.label}
            </p>
            <p className="mt-4 text-3xl font-semibold text-black">{item.value}</p>
            <p className="mt-2 text-sm text-black/60">{item.delta}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-black/10 bg-white/85 p-7 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.35)] backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
              Registrations
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-black">
              Who&apos;s coming
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40 disabled:opacity-50"
              onClick={() => sendFeedbackMutation.mutate()}
              disabled={sendFeedbackMutation.isPending}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                <path d="M21.5 12H16c-.7 2-2 3-4 3s-3.3-1-4-3H2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.5 5.1L2 12v6c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-6l-3.5-6.9C18.1 4.4 17.1 4 16 4H8c-1.1 0-2.1.4-2.5 1.1z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {sendFeedbackMutation.isPending ? "Sending..." : "Send Feedback"}
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
              onClick={() => setInviteOpen(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="19" y1="8" x2="19" y2="14" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="22" y1="11" x2="16" y2="11" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Invite Guests
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
              onClick={() => setCheckInOpen(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                <rect x="3" y="3" width="18" height="18" rx="3" strokeLinejoin="round" />
                <rect x="7" y="7" width="10" height="10" rx="1.5" strokeLinejoin="round" />
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Check in
            </button>
          </div>
        </div>


        {registrations.length === 0 ? (
          <p className="mt-6 px-5 py-8 text-center text-sm text-black/50">
            No registrations yet.
          </p>
        ) : (
          <div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full max-w-xs rounded-full border border-black/15 bg-white px-4 text-sm text-black outline-none transition placeholder:text-black/40 focus:border-black/40"
              />
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setStatusFilter(null)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                    statusFilter === null
                      ? "border-black bg-black text-white"
                      : "border-black/15 text-black/60 hover:border-black/40"
                  }`}
                >
                  All
                </button>
                {["GOING", "WAITLIST", "NOT_GOING", "PENDING"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatusFilter(statusFilter === s ? null : s)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                      statusFilter === s
                        ? "border-black bg-black text-white"
                        : "border-black/15 text-black/60 hover:border-black/40"
                    }`}
                  >
                    {statusLabels[s as keyof typeof statusLabels]}
                  </button>
                ))}
              </div>
            </div>

            {filteredRegistrations.length === 0 ? (
              <p className="mt-6 px-5 py-8 text-center text-sm text-black/50">
                No registrations match your filters.
              </p>
            ) : (
              <div className="mt-4 w-full overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-black/40">
                      <th className="px-5 py-3 font-medium">Attendee</th>
                      <th className="px-5 py-3 font-medium">Registered</th>
                      <th className="px-5 py-3 font-medium">Amount</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegistrations.map((reg) => {
                      const name = `${reg.firstName ?? ""} ${reg.lastName ?? ""}`.trim() || String(reg.userId) || "Unknown";
                      const date = reg.registeredAt
                        ? new Date(reg.registeredAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "\u2014";
                      const statusLabel = statusLabels[reg.status] || reg.status;
                      const amount = event?.ticketPrice && event.ticketPrice > 0
                        ? `$${event.ticketPrice}`
                        : "Free";

                      const isSpeaker = reg.ticketCode?.startsWith("INVITE-GUEST_SPEAKER-");
                      const isVip = reg.ticketCode?.startsWith("INVITE-VVIP_VIP-");

                      return (
                        <tr
                          key={reg.id}
                          className="cursor-pointer rounded-2xl border border-black/5 bg-white transition hover:bg-gray-100 [&:not(:last-child)>td]:border-b [&>td]:border-black/5"
                          onClick={() => setSelectedReg(reg)}
                        >
                          <td className="flex items-center gap-3 px-5 py-4">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-xs font-semibold uppercase text-white">
                              {name.charAt(0)}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-black truncate">{name}</p>
                                {isSpeaker && (
                                  <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-700">
                                    Speaker
                                  </span>
                                )}
                                {isVip && (
                                  <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                                    VIP
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-black/60 truncate">{reg.email}</p>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-black/70 align-middle whitespace-nowrap">{date}</td>
                          <td className="px-5 py-4 text-sm font-semibold text-black align-middle whitespace-nowrap">{amount}</td>
                          <td className="px-5 py-4 align-middle">
                            <span
                              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap ${statusStyles[reg.status] || "border-black/15 bg-black/5 text-black/60"}`}
                            >
                              {statusLabel}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </section>

      <RegistrationStatusDialog
        reg={selectedReg!}
        open={!!selectedReg}
        onClose={() => setSelectedReg(null)}
        onUpdateStatus={(id, status) => updateMutation.mutate({ id, status })}
        isPending={updateMutation.isPending}
      />

      <CheckInDialog
        open={checkInOpen}
        onClose={() => setCheckInOpen(false)}
        registrations={registrations}
        onCheckIn={(id) =>
          updateMutation.mutate(
            { id, status: "GOING" },
            { onSuccess: () => setCheckInOpen(false) }
          )
        }
        onNotGoing={(id) =>
          updateMutation.mutate(
            { id, status: "NOT_GOING" },
            { onSuccess: () => setCheckInOpen(false) }
          )
        }
        isPending={updateMutation.isPending}
      />

      <SendInvitationDialog
        eventId={eventId}
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
      />
    </div>
  );
}

