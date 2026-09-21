"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEventRegistrations, updateRegistrationStatus } from "@/service/registrationService";
import { getEventById } from "@/service/eventService";
import { IRegistration, IEvent } from "@/types";
import { formatPrice } from "@/lib/utils";
import { registrationCSVRows, downloadCSV } from "@/lib/utils";
import { decodeEventId } from "@/lib/utils";
import { Download, SlidersHorizontal, X } from "lucide-react";
import { toast } from "sonner";
import Select from "@/components/widgets/Select";
import RegistrationStatusDialog from "../dialogs/RegistrationStatusDialog";
import CheckInDialog from "../dialogs/CheckInDialog";
import SendFeedbackDialog from "../dialogs/SendFeedbackDialog";
import { EventRegistrationsLoadingSkeleton } from "@/components/skeleton/EventRegistrationsLoadingSkeleton";
import { useEventRole } from "@/components/auth/EventManageContext";

const statusStyles: Record<string, string> = {
  GOING: "border-emerald-200 bg-emerald-50 text-emerald-800",
  WAITLIST: "border-amber-200 bg-amber-50 text-amber-800",
  NOT_GOING: "border-zinc-200 bg-zinc-100 text-zinc-600",
  PENDING: "border-blue-200 bg-blue-50 text-blue-800",
};

const statusLabels: Record<string, string> = {
  GOING: "Going",
  WAITLIST: "Waitlist",
  NOT_GOING: "Not going",
  PENDING: "Pending",
};

export default function EventManageRegistraionPage() {
  const { id } = useParams() as { id: string };
  const eventId = decodeEventId(id);
  const queryClient = useQueryClient();
  const [selectedReg, setSelectedReg] = useState<IRegistration | null>(null);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [sendFeedbackOpen, setSendFeedbackOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [customFilterKey, setCustomFilterKey] = useState("");
  const [customFilterValue, setCustomFilterValue] = useState("");
  const { role } = useEventRole();
  const canManageGuests = role === "ORGANIZER" || role === "COORDINATOR";

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
    refetchInterval: 5000,
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
    onError: (err: Error) => {
      toast.error(err?.message || "Error updating status.");
    },
  });

  const total = registrations.length;
  const checkedIn = registrations.filter((r) => !!r.chekingTime).length;
  const goingCount = registrations.filter((r) => r.status === "GOING").length;
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
      value: formatPrice(revenue, true),
      delta: event?.ticketPrice ? `${total} × ${formatPrice(event.ticketPrice)}` : "Free event",
    },
    {
      label: "Seats left",
      value: event ? (event.capacity === 0 ? "Unlimited" : seatsLeft.toLocaleString()) : "-",
      delta: event ? (event.capacity === 0 ? "No capacity limit" : `of ${event.capacity} capacity`) : "-",
    },
  ];

  const customFields = event?.customFields ?? [];
  const selectedCustomField = customFields.find((f) => f.key === customFilterKey) ?? null;
  const customFieldOptions = [
    { value: "", label: "All custom fields" },
    ...customFields.map((f) => ({ value: f.key, label: f.name })),
  ];
  const customFieldValueOptions = [
    { value: "", label: "Any value" },
    ...(selectedCustomField?.options ?? []).map((option) => ({ value: option, label: option })),
  ];

  const filteredRegistrations = registrations.filter((reg) => {
    const name = `${reg.firstName ?? ""} ${reg.lastName ?? ""}`.trim().toLowerCase();
    const email = (reg.email ?? "").toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || name.includes(q) || email.includes(q);
    const matchesStatus = !statusFilter || reg.status === statusFilter;

    let matchesCustom = true;
    if (selectedCustomField && customFilterValue) {
      const answer = reg.customFields?.[selectedCustomField.key] ?? "";
      if (selectedCustomField.type === "select") {
        matchesCustom = answer.toLowerCase() === customFilterValue.toLowerCase();
      } else {
        matchesCustom = answer.toLowerCase().includes(customFilterValue.toLowerCase());
      }
    }
    return matchesSearch && matchesStatus && matchesCustom;
  });

  const hasCustomFilter = !!selectedCustomField || !!customFilterValue;
  const clearCustomFilters = () => {
    setCustomFilterKey("");
    setCustomFilterValue("");
  };

  const handleExport = () => {
    if (filteredRegistrations.length === 0) return;
    const rows = registrationCSVRows(filteredRegistrations);
    const filename = `registrations-${eventId}-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCSV(filename, rows);
    toast.success(`Exported ${rows.length} registration${rows.length === 1 ? "" : "s"}.`);
  };

  if (isLoading) {
    return <EventRegistrationsLoadingSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-danger">Failed to load registrations.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-zinc-200 bg-white p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              {item.label}
            </p>
            <p className="mt-4 text-3xl font-semibold text-zinc-900">{item.value}</p>
            <p className="mt-2 text-sm text-zinc-600">{item.delta}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Registrations
            </p>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-zinc-900">
              Who&apos;s coming
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {canManageGuests && (
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:border-primary/50 hover:text-primary disabled:opacity-50"
                onClick={() => setSendFeedbackOpen(true)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                  <path d="M21.5 12H16c-.7 2-2 3-4 3s-3.3-1-4-3H2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.5 5.1L2 12v6c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-6l-3.5-6.9C18.1 4.4 17.1 4 16 4H8c-1.1 0-2.1.4-2.5 1.1z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Send feedback
              </button>
            )}
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:border-primary/50 hover:text-primary"
              onClick={() => setCheckInOpen(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                <rect x="3" y="3" width="18" height="18" rx="3" strokeLinejoin="round" />
                <rect x="7" y="7" width="10" height="10" rx="1.5" strokeLinejoin="round" />
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Check in
            </button>
            {canManageGuests && (
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:border-primary/50 hover:text-primary disabled:opacity-50 disabled:pointer-events-none"
                onClick={handleExport}
                disabled={filteredRegistrations.length === 0}
              >
                <Download className="h-4 w-4" strokeWidth={1.8} />
                Export
              </button>
            )}
          </div>
        </div>


        {registrations.length === 0 ? (
          <p className="mt-6 px-5 py-8 text-center text-sm text-zinc-500">
            No registrations yet.
          </p>
        ) : (
          <div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-full border border-zinc-200 bg-white pl-4 pr-11 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                aria-label="Advanced filters"
                aria-expanded={advancedOpen}
                onClick={() => setAdvancedOpen((v) => !v)}
                className={`absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full transition ${
                  advancedOpen
                    ? "bg-primary text-white"
                    : "text-zinc-400 hover:bg-zinc-100 hover:text-primary"
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setStatusFilter(null)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                    statusFilter === null
                      ? "border-primary bg-primary text-white"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-primary/50 hover:text-primary"
                  }`}
                >
                  All
                </button>
                {["GOING", "WAITLIST", "NOT_GOING", "PENDING"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatusFilter(statusFilter === s ? null : s)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                      statusFilter === s
                        ? "border-primary bg-primary text-white"
                        : "border-zinc-200 bg-white text-zinc-600 hover:border-primary/50 hover:text-primary"
                    }`}
                  >
                    {statusLabels[s as keyof typeof statusLabels]}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-2 text-xs font-medium text-zinc-500">
              Showing {filteredRegistrations.length} of {registrations.length}{" "}
              registration{registrations.length !== 1 ? "s" : ""}
            </p>

            <div className="mt-3 flex flex-col gap-3 border-t border-zinc-100 pt-3">
              {advancedOpen && (
                <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-3 sm:flex-row sm:items-center">
                  <div className="grid gap-1.5 sm:w-56">
                    <span className="text-xs font-semibold text-zinc-500">Custom field</span>
                    <Select
                      name="custom-filter-field"
                      ariaLabel="Custom field"
                      value={customFilterKey}
                      onChange={(value) => {
                        setCustomFilterKey(value);
                        setCustomFilterValue("");
                      }}
                      className="h-10 w-full px-3.5 text-sm"
                      options={customFieldOptions}
                    />
                  </div>

                  {selectedCustomField && (
                    <div className="grid gap-1.5 sm:w-56">
                      <span className="text-xs font-semibold text-zinc-500">
                        {selectedCustomField.name}
                      </span>
                      {selectedCustomField.type === "select" ? (
                        <Select
                          name="custom-filter-value"
                          ariaLabel={selectedCustomField.name}
                          value={customFilterValue}
                          onChange={setCustomFilterValue}
                          className="h-10 w-full px-3.5 text-sm"
                          options={customFieldValueOptions}
                        />
                      ) : (
                        <input
                          type="text"
                          placeholder="Value contains..."
                          value={customFilterValue}
                          onChange={(e) => setCustomFilterValue(e.target.value)}
                          className="h-10 rounded-xl border border-zinc-200 bg-white px-3.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                        />
                      )}
                    </div>
                  )}

                  {hasCustomFilter && (
                    <button
                      type="button"
                      onClick={clearCustomFilters}
                      className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 sm:ml-auto"
                    >
                      <X className="h-3 w-3" />
                      Clear
                    </button>
                  )}
                </div>
              )}
            </div>

            {filteredRegistrations.length === 0 ? (
              <p className="mt-6 px-5 py-8 text-center text-sm text-zinc-500">
                No registrations match your filters.
              </p>
            ) : (
              <div className="mt-4 w-full overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                      <th className="px-5 py-3 font-medium">Attendee</th>
                      <th className="px-5 py-3 font-medium">Registered</th>
                      <th className="px-5 py-3 font-medium">Amount</th>
                      {selectedCustomField && (
                        <th className="px-5 py-3 font-medium">{selectedCustomField.name}</th>
                      )}
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
                        ? formatPrice(event.ticketPrice)
                        : "Free";

                      const isSpeaker = reg.ticketCode?.startsWith("INVITE-GUEST_SPEAKER-");
                      const isVip = reg.ticketCode?.startsWith("INVITE-VVIP_VIP-");

                      return (
                        <tr
                          key={reg.id}
                          className="cursor-pointer rounded-2xl border border-zinc-100 bg-white transition hover:bg-zinc-50 [&:not(:last-child)>td]:border-b [&>td]:border-zinc-100"
                          onClick={() => setSelectedReg(reg)}
                        >
                          <td className="flex items-center gap-3 px-5 py-4">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold uppercase text-primary">
                              {name.charAt(0)}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-zinc-900 truncate">{name}</p>
                                {isSpeaker && (
                                  <span className="rounded-md bg-primary-soft px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                                    Speaker
                                  </span>
                                )}
                                {isVip && (
                                  <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-700">
                                    VIP
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-zinc-600 truncate">{reg.email}</p>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-zinc-700 align-middle whitespace-nowrap">{date}</td>
                          <td className="px-5 py-4 text-sm font-semibold text-zinc-900 align-middle whitespace-nowrap">{amount}</td>
                          {selectedCustomField && (
                            <td className="px-5 py-4 text-sm text-zinc-700 align-middle whitespace-nowrap">
                              {reg.customFields?.[selectedCustomField.key] || "—"}
                            </td>
                          )}
                          <td className="px-5 py-4 align-middle">
                            <span
                              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap ${statusStyles[reg.status] || "border-zinc-200 bg-zinc-100 text-zinc-600"}`}
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
        pendingStatus={
          updateMutation.isPending ? (updateMutation.variables?.status ?? null) : null
        }
      />

      <CheckInDialog
        key={checkInOpen ? "open" : "closed"}
        open={checkInOpen}
        onClose={() => setCheckInOpen(false)}
        registrations={registrations}
        onCheckIn={(id) =>
          updateMutation.mutate(
            { id, status: "GOING" },
            { onSuccess: () => setCheckInOpen(false) }
          )
        }
        isPending={updateMutation.isPending}
      />

      <SendFeedbackDialog
        eventId={eventId}
        eventTitle={event?.title}
        goingCount={goingCount}
        open={sendFeedbackOpen}
        onClose={() => setSendFeedbackOpen(false)}
      />
    </div>
  );
}

