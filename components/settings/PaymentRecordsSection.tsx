"use client";

import { useQuery } from "@tanstack/react-query";
import { FiCalendar, FiCreditCard, FiInbox } from "react-icons/fi";
import { getPaymentRecords } from "@/service/paymentService";
import { IEventPayments } from "@/types";

const formatMoney = (amount: number): string =>
  `${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} LKR`;

const formatDate = (value: string | null): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateTime = (value: string | null): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

function EventPaymentsCard({
  group,
  showBuyers,
}: {
  group: IEventPayments;
  showBuyers: boolean;
}) {
  const { event, paymentCount, revenue, commission, payout, payments } = group;

  const summary = [
    { label: "Payments", value: paymentCount.toLocaleString() },
    { label: "Revenue", value: formatMoney(revenue) },
    { label: "Commission (5%)", value: formatMoney(commission) },
    { label: "Payout", value: formatMoney(payout) },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-5">
        <div>
          <p className="font-display text-lg font-semibold tracking-tight text-zinc-900">
            {event.title}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
            <FiCalendar className="h-3.5 w-3.5" />
            {formatDate(event.startDate)}
          </p>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
          {paymentCount} payment{paymentCount !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="mt-4 grid gap-4 px-6 sm:grid-cols-4">
        {summary.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3"
          >
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">
              {stat.label}
            </p>
            <p className="mt-1 text-base font-semibold text-zinc-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-y border-zinc-100 bg-transparent text-[11px] uppercase tracking-[0.14em] text-zinc-500">
              {showBuyers && <th className="px-6 py-3 font-medium">Buyer</th>}
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {payments.map((payment) => (
              <tr key={payment.id}>
                {showBuyers && (
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-zinc-900">
                      {payment.buyer
                        ? `${payment.buyer.firstName ?? ""} ${payment.buyer.lastName ?? ""}`.trim() || "Unknown"
                        : "—"}
                    </p>
                    <p className="text-xs text-zinc-500">{payment.buyer?.email ?? ""}</p>
                  </td>
                )}
                <td className="px-6 py-4 text-sm font-semibold text-zinc-900">
                  {formatMoney(payment.amount)}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-600">
                  {formatDateTime(payment.paymentAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
      <FiInbox className="h-8 w-8 text-zinc-300" />
      <div>
        <p className="text-sm font-semibold text-zinc-700">{label}</p>
        <p className="mt-1 text-xs text-zinc-500">
          Payments will appear here once a ticket is bought.
        </p>
      </div>
    </div>
  );
}

export default function PaymentRecordsSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["payment-records"],
    queryFn: getPaymentRecords,
    retry: false,
  });

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-zinc-200 bg-white p-7">
        <div className="h-4 w-32 animate-pulse rounded bg-zinc-200" />
        <div className="mt-5 flex flex-col gap-4">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="h-40 animate-pulse rounded-2xl border border-zinc-100 bg-zinc-50"
            />
          ))}
        </div>
      </section>
    );
  }

  const sales = data?.sales ?? [];
  const purchases = data?.purchases ?? [];
  const hasRecords = sales.length > 0 || purchases.length > 0;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-7">
      <div className="flex items-center gap-2">
        <FiCreditCard className="h-4 w-4 text-primary" />
        <p className="eyebrow">Payment records</p>
      </div>
      <p className="mt-3 text-sm leading-6 text-zinc-600">
        Your ticket sales grouped by event, including the 5% platform
        commission deducted per sale.
      </p>

      {isError && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          Could not load payment records. Please try again.
        </div>
      )}

      {!isError && !hasRecords && (
        <div className="mt-5">
          <EmptyState label="No payment records yet" />
        </div>
      )}

      {sales.length > 0 && (
        <div className="mt-6 flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Sales · your events
          </p>
          {sales.map((group) => (
            <EventPaymentsCard key={group.event.id} group={group} showBuyers />
          ))}
        </div>
      )}

      {purchases.length > 0 && (
        <div className="mt-8 flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Purchases · your tickets
          </p>
          {purchases.map((group) => (
            <EventPaymentsCard key={group.event.id} group={group} showBuyers={false} />
          ))}
        </div>
      )}
    </section>
  );
}