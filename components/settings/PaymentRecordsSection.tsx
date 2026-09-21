"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FiCalendar,
  FiCreditCard,
  FiDownload,
  FiInbox,
  FiSearch,
  FiX,
} from "react-icons/fi";
import { getPaymentRecords } from "@/service/paymentService";
import { downloadCSV } from "@/lib/utils";

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

const formatTimeOnly = (value: string | null): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

interface FlatPaymentRow {
  id: number;
  eventId: string | number;
  eventTitle: string;
  eventDate: string;
  buyerName: string;
  buyerEmail: string;
  grossAmount: number;
  commission: number;
  netPayout: number;
  paymentAt: string;
  type: "sale" | "purchase";
}

export default function PaymentRecordsSection() {
  const [activeTab, setActiveTab] = useState<"sales" | "purchases">("sales");
  const [viewMode, setViewMode] = useState<"all" | "by-event">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["payment-records"],
    queryFn: getPaymentRecords,
    retry: false,
  });

  const sales = useMemo(() => data?.sales ?? [], [data?.sales]);
  const purchases = useMemo(() => data?.purchases ?? [], [data?.purchases]);

  // Flattened sales records
  const flatSales: FlatPaymentRow[] = useMemo(() => {
    const list: FlatPaymentRow[] = [];
    sales.forEach((group) => {
      (group.payments ?? []).forEach((p) => {
        const buyerName = p.buyer
          ? `${p.buyer.firstName ?? ""} ${p.buyer.lastName ?? ""}`.trim() || "Unknown"
          : "—";
        const grossAmount = p.amount;
        const commission = grossAmount * 0.05;
        const netPayout = grossAmount - commission;

        list.push({
          id: p.id,
          eventId: group.event.id,
          eventTitle: group.event.title,
          eventDate: group.event.startDate,
          buyerName,
          buyerEmail: p.buyer?.email ?? "",
          grossAmount,
          commission,
          netPayout,
          paymentAt: p.paymentAt,
          type: "sale",
        });
      });
    });
    return list;
  }, [sales]);

  // Flattened purchases records
  const flatPurchases: FlatPaymentRow[] = useMemo(() => {
    const list: FlatPaymentRow[] = [];
    purchases.forEach((group) => {
      (group.payments ?? []).forEach((p) => {
        list.push({
          id: p.id,
          eventId: group.event.id,
          eventTitle: group.event.title,
          eventDate: group.event.startDate,
          buyerName: "You",
          buyerEmail: "",
          grossAmount: p.amount,
          commission: 0,
          netPayout: p.amount,
          paymentAt: p.paymentAt,
          type: "purchase",
        });
      });
    });
    return list;
  }, [purchases]);

  // Summary totals
  const salesSummary = useMemo(() => {
    const revenue = sales.reduce((sum, g) => sum + (g.revenue ?? 0), 0);
    const commission = sales.reduce((sum, g) => sum + (g.commission ?? 0), 0);
    const payout = sales.reduce((sum, g) => sum + (g.payout ?? 0), 0);
    return { revenue, commission, payout, count: flatSales.length };
  }, [sales, flatSales]);

  const purchasesSummary = useMemo(() => {
    const spent = purchases.reduce((sum, g) => sum + (g.revenue ?? 0), 0);
    return { spent, count: flatPurchases.length };
  }, [purchases, flatPurchases]);

  // Search filter
  const q = searchQuery.toLowerCase().trim();

  const filteredSales = useMemo(() => {
    if (!q) return flatSales;
    return flatSales.filter(
      (item) =>
        item.eventTitle.toLowerCase().includes(q) ||
        item.buyerName.toLowerCase().includes(q) ||
        item.buyerEmail.toLowerCase().includes(q)
    );
  }, [flatSales, q]);

  const filteredPurchases = useMemo(() => {
    if (!q) return flatPurchases;
    return flatPurchases.filter((item) =>
      item.eventTitle.toLowerCase().includes(q)
    );
  }, [flatPurchases, q]);

  const filteredEventGroups = useMemo(() => {
    if (!q) return sales;
    return sales.filter((group) =>
      group.event.title.toLowerCase().includes(q)
    );
  }, [sales, q]);

  const handleExportCSV = () => {
    if (activeTab === "sales") {
      if (filteredSales.length === 0) return;
      const rows = filteredSales.map((item) => ({
        Event: item.eventTitle,
        "Event Date": formatDate(item.eventDate),
        Buyer: item.buyerName,
        Email: item.buyerEmail,
        "Gross (LKR)": item.grossAmount.toFixed(2),
        "Fee 5% (LKR)": item.commission.toFixed(2),
        "Net (LKR)": item.netPayout.toFixed(2),
        Date: formatDate(item.paymentAt),
        Status: "Paid",
      }));
      downloadCSV(`ticket-sales-${new Date().toISOString().slice(0, 10)}.csv`, rows);
    } else {
      if (filteredPurchases.length === 0) return;
      const rows = filteredPurchases.map((item) => ({
        Event: item.eventTitle,
        "Event Date": formatDate(item.eventDate),
        "Amount (LKR)": item.grossAmount.toFixed(2),
        Date: formatDate(item.paymentAt),
        Status: "Paid",
      }));
      downloadCSV(`purchases-${new Date().toISOString().slice(0, 10)}.csv`, rows);
    }
  };

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-zinc-200 bg-white p-7">
        <div className="h-4 w-32 animate-pulse rounded bg-zinc-200" />
        <div className="mt-5 grid gap-4 sm:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-20 animate-pulse rounded-xl border border-zinc-100 bg-zinc-50"
            />
          ))}
        </div>
        <div className="mt-6 h-48 animate-pulse rounded-2xl border border-zinc-100 bg-zinc-50" />
      </section>
    );
  }

  const hasSales = flatSales.length > 0;
  const hasPurchases = flatPurchases.length > 0;
  const hasRecords = hasSales || hasPurchases;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-7">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FiCreditCard className="h-4 w-4 text-primary" />
            <p className="eyebrow">Payment records</p>
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Your ticket sales and purchases, including the 5% platform commission.
          </p>
        </div>

        {hasRecords && (
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 text-xs font-semibold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900"
          >
            <FiDownload className="h-3.5 w-3.5" />
            Export CSV
          </button>
        )}
      </div>

      {isError && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          Could not load payment records. Please try again.
        </div>
      )}

      {!isError && !hasRecords && (
        <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
          <FiInbox className="h-8 w-8 text-zinc-300" />
          <div>
            <p className="text-sm font-semibold text-zinc-700">No payment records yet</p>
            <p className="mt-1 text-xs text-zinc-500">
              Payments will appear here once tickets are sold or bought.
            </p>
          </div>
        </div>
      )}

      {!isError && hasRecords && (
        <>
          {/* Summary Stat Cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {activeTab === "sales" ? (
              <>
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                    Gross Revenue
                  </p>
                  <p className="mt-1 text-base font-semibold text-zinc-900">
                    {formatMoney(salesSummary.revenue)}
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                    Commission (5%)
                  </p>
                  <p className="mt-1 text-base font-semibold text-zinc-900">
                    {formatMoney(salesSummary.commission)}
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                    Net Payout
                  </p>
                  <p className="mt-1 text-base font-semibold text-emerald-600">
                    {formatMoney(salesSummary.payout)}
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                    Total Payments
                  </p>
                  <p className="mt-1 text-base font-semibold text-zinc-900">
                    {salesSummary.count}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                    Total Spent
                  </p>
                  <p className="mt-1 text-base font-semibold text-zinc-900">
                    {formatMoney(purchasesSummary.spent)}
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                    Tickets Bought
                  </p>
                  <p className="mt-1 text-base font-semibold text-zinc-900">
                    {purchasesSummary.count}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Tab and Search Bar */}
          <div className="mt-6 flex flex-col gap-4 border-t border-zinc-100 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Tabs */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("sales")}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                    activeTab === "sales"
                      ? "border-primary bg-primary text-white"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                  }`}
                >
                  Ticket Sales ({flatSales.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("purchases")}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                    activeTab === "purchases"
                      ? "border-primary bg-primary text-white"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                  }`}
                >
                  My Purchases ({flatPurchases.length})
                </button>
              </div>

              {/* View Toggle for Sales */}
              {activeTab === "sales" && (
                <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("all")}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      viewMode === "all"
                        ? "bg-white text-zinc-900 shadow-xs"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    All Records
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("by-event")}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      viewMode === "by-event"
                        ? "bg-white text-zinc-900 shadow-xs"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    By Event
                  </button>
                </div>
              )}
            </div>

            {/* Search Input */}
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder={
                  activeTab === "sales"
                    ? "Search by event, buyer name, or email..."
                    : "Search by event..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-full border border-zinc-200 bg-white pl-9 pr-10 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 hover:text-zinc-700"
                >
                  <FiX className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* SALES TABLE: ALL RECORDS (SIMPLE, CLEAN, 3-LINE AMOUNT)   */}
          {/* ========================================================= */}
          {activeTab === "sales" && viewMode === "all" && (
            <div className="mt-4">
              {filteredSales.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">
                  {searchQuery ? `No records match "${searchQuery}".` : "No sales records yet."}
                </p>
              ) : (
                <div className="w-full overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-zinc-100 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                        <th className="pb-3 pr-4 font-medium">Event</th>
                        <th className="pb-3 px-4 font-medium">Buyer</th>
                        <th className="pb-3 px-4 font-medium">Date</th>
                        <th className="pb-3 px-4 text-right font-medium">Amount</th>
                        <th className="pb-3 pl-4 text-right font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {filteredSales.map((row) => (
                        <tr
                          key={`${row.eventId}-${row.id}`}
                          className="transition hover:bg-zinc-50/60"
                        >
                          {/* Event */}
                          <td className="py-4 pr-4 align-top">
                            <p className="text-sm font-semibold text-zinc-900">
                              {row.eventTitle}
                            </p>
                            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500">
                              <FiCalendar className="h-3.5 w-3.5" />
                              {formatDate(row.eventDate)}
                            </p>
                          </td>

                          {/* Buyer */}
                          <td className="py-4 px-4 align-top">
                            <p className="text-sm font-medium text-zinc-900">
                              {row.buyerName}
                            </p>
                            {row.buyerEmail && (
                              <p className="text-xs text-zinc-500">{row.buyerEmail}</p>
                            )}
                          </td>

                          {/* Date */}
                          <td className="py-4 px-4 align-top whitespace-nowrap">
                            <p className="text-sm text-zinc-700">{formatDate(row.paymentAt)}</p>
                            <p className="text-xs text-zinc-400">{formatTimeOnly(row.paymentAt)}</p>
                          </td>

                          {/* Amount (3 Clean Lines) */}
                          <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                            <p className="text-sm font-semibold text-emerald-600">
                              {formatMoney(row.netPayout)}
                            </p>
                            <p className="text-xs text-zinc-500">
                              Gross: {formatMoney(row.grossAmount)}
                            </p>
                            <p className="text-xs text-zinc-400">
                              Fee (5%): -{formatMoney(row.commission)}
                            </p>
                          </td>

                          {/* Status */}
                          <td className="py-4 pl-4 align-top text-right whitespace-nowrap">
                            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                              Paid
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* SALES TABLE: BY EVENT                                     */}
          {/* ========================================================= */}
          {activeTab === "sales" && viewMode === "by-event" && (
            <div className="mt-4">
              {filteredEventGroups.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">
                  {searchQuery ? `No events match "${searchQuery}".` : "No events available."}
                </p>
              ) : (
                <div className="w-full overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-zinc-100 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                        <th className="pb-3 pr-4 font-medium">Event</th>
                        <th className="pb-3 px-4 text-center font-medium">Payments</th>
                        <th className="pb-3 px-4 text-right font-medium">Revenue</th>
                        <th className="pb-3 px-4 text-right font-medium">Commission (5%)</th>
                        <th className="pb-3 pl-4 text-right font-medium">Net Payout</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {filteredEventGroups.map((group) => (
                        <tr
                          key={group.event.id}
                          className="transition hover:bg-zinc-50/60"
                        >
                          <td className="py-4 pr-4">
                            <p className="text-sm font-semibold text-zinc-900">
                              {group.event.title}
                            </p>
                            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500">
                              <FiCalendar className="h-3.5 w-3.5" />
                              {formatDate(group.event.startDate)}
                            </p>
                          </td>
                          <td className="py-4 px-4 text-center text-sm font-medium text-zinc-700">
                            {group.paymentCount}
                          </td>
                          <td className="py-4 px-4 text-right text-sm font-medium text-zinc-900 whitespace-nowrap">
                            {formatMoney(group.revenue)}
                          </td>
                          <td className="py-4 px-4 text-right text-xs text-zinc-500 whitespace-nowrap">
                            -{formatMoney(group.commission)}
                          </td>
                          <td className="py-4 pl-4 text-right text-sm font-semibold text-emerald-600 whitespace-nowrap">
                            {formatMoney(group.payout)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* PURCHASES TABLE                                           */}
          {/* ========================================================= */}
          {activeTab === "purchases" && (
            <div className="mt-4">
              {filteredPurchases.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">
                  {searchQuery ? `No purchases match "${searchQuery}".` : "No purchases yet."}
                </p>
              ) : (
                <div className="w-full overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-zinc-100 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                        <th className="pb-3 pr-4 font-medium">Event</th>
                        <th className="pb-3 px-4 font-medium">Date</th>
                        <th className="pb-3 px-4 text-right font-medium">Amount Paid</th>
                        <th className="pb-3 pl-4 text-right font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {filteredPurchases.map((row) => (
                        <tr
                          key={`${row.eventId}-${row.id}`}
                          className="transition hover:bg-zinc-50/60"
                        >
                          <td className="py-4 pr-4">
                            <p className="text-sm font-semibold text-zinc-900">
                              {row.eventTitle}
                            </p>
                            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500">
                              <FiCalendar className="h-3.5 w-3.5" />
                              {formatDate(row.eventDate)}
                            </p>
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap">
                            <p className="text-sm text-zinc-700">{formatDate(row.paymentAt)}</p>
                            <p className="text-xs text-zinc-400">{formatTimeOnly(row.paymentAt)}</p>
                          </td>
                          <td className="py-4 px-4 text-right text-sm font-semibold text-zinc-900 whitespace-nowrap">
                            {formatMoney(row.grossAmount)}
                          </td>
                          <td className="py-4 pl-4 text-right whitespace-nowrap">
                            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                              Paid
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}