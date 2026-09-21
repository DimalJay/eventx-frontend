"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getEventGuestsRequest } from "@/service/eventService";
import { decodeEventId } from "@/lib/utils";
import { UserCheck, UserX, Mail, UserPlus, Search } from "lucide-react";
import SendInvitationDialog from "../dialogs/SendInvitationDialog";
import { useEventRole } from "@/components/auth/EventManageContext";

interface IGuest {
  id: number;
  eventId: number;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

const statusStyles: Record<string, string> = {
  accepted: "border-emerald-200 bg-emerald-50 text-emerald-800",
  declined: "border-rose-200 bg-rose-50 text-rose-800",
  invited: "border-amber-200 bg-amber-50 text-amber-800",
};

const statusLabels: Record<string, string> = {
  accepted: "Accepted",
  declined: "Declined",
  invited: "Pending (Invited)",
};

export default function EventManageGuestsPage() {
  const { id } = useParams() as { id: string };
  const eventId = decodeEventId(id);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { role } = useEventRole();
  const canManageGuests = role === "ORGANIZER" || role === "COORDINATOR";

  const { data: guests = [], isLoading, isError } = useQuery({
    queryKey: ["event-guests", eventId],
    queryFn: async () => {
      const res = await getEventGuestsRequest(eventId);
      return (res.data || []) as IGuest[];
    },
    enabled: !!eventId,
    retry: false,
    refetchInterval: 5000,
  });

  const total = guests.length;
  const acceptedCount = guests.filter((g) => g.status === "accepted").length;
  const invitedCount = guests.filter((g) => g.status === "invited").length;

  const stats = [
    {
      label: "Total Guests Invited",
      value: total.toLocaleString(),
      delta: `${total} guest${total !== 1 ? "s" : ""}`,
    },
    {
      label: "Accepted",
      value: acceptedCount.toLocaleString(),
      delta: `${acceptedCount} confirmed`,
    },
    {
      label: "Pending / Invited",
      value: invitedCount.toLocaleString(),
      delta: `${invitedCount} awaiting`,
    },
  ];

  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || guest.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-zinc-200 bg-white p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              {stat.label}
            </p>
            <p className="mt-4 text-3xl font-semibold text-zinc-900">
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-zinc-600">{stat.delta}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Guest List
            </p>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-zinc-900">
              Invited Guests & VIPs
            </h2>
          </div>

          {canManageGuests && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setInviteOpen(true)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-strong shadow-xs"
              >
                <UserPlus className="h-4 w-4" />
                <span>Invite Guest</span>
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search guest by email or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-full border border-zinc-200 bg-white pl-10 pr-4 text-sm text-zinc-900 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 placeholder:text-zinc-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: "All Statuses", value: null },
              { label: "Pending (Invited)", value: "invited" },
              { label: "Accepted", value: "accepted" },
              { label: "Declined", value: "declined" },
            ].map((f) => (
              <button
                key={f.label}
                type="button"
                onClick={() => setStatusFilter(f.value)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  statusFilter === f.value
                    ? "bg-primary text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xs">
          {isLoading ? (
            <div className="p-12 text-center text-sm text-zinc-500">
              Loading guest list...
            </div>
          ) : isError ? (
            <div className="p-12 text-center text-sm text-rose-500">
              Failed to load guests.
            </div>
          ) : filteredGuests.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Mail className="h-10 w-10 text-zinc-300" />
              <p className="mt-3 font-medium text-zinc-900">No guests found</p>
              <p className="mt-1 text-sm text-zinc-500">
                {searchQuery || statusFilter
                  ? "Try clearing your filters or search query."
                  : "No guests have been invited yet. Click 'Invite Guest' to send invitations."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-600">
                <thead className="border-b border-zinc-100 bg-zinc-50/50 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-semibold">
                      Guest Email
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold">
                      Recipient Role
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold">
                      Invited Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredGuests.map((guest) => {
                    const statusKey = guest.status.toLowerCase();
                    return (
                      <tr
                        key={guest.id}
                        className="transition hover:bg-zinc-50/50"
                      >
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-zinc-900">
                          {guest.email}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="inline-flex items-center rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                            {guest.role}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                              statusStyles[statusKey] || statusStyles["invited"]
                            }`}
                          >
                            {statusKey === "accepted" && <UserCheck className="h-3.5 w-3.5" />}
                            {statusKey === "declined" && <UserX className="h-3.5 w-3.5" />}
                            {statusKey === "invited" && <Mail className="h-3.5 w-3.5" />}
                            {statusLabels[statusKey] || guest.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-xs text-zinc-500">
                          {guest.createdAt
                            ? new Date(guest.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "N/A"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <SendInvitationDialog
        eventId={eventId}
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
      />
    </div>
  );
}
