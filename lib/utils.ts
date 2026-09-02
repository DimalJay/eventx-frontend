import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { IRegistration } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function encodeEventId(id: string | number | null | undefined): string {
  if (id === null || id === undefined || id === "") return "";
  return btoa(String(id)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeEventId(param: string | null | undefined): string {
  if (!param) return "";
  if (/^\d+$/.test(param)) return param;
  try {
    const base64 =
      param.replace(/-/g, "+").replace(/_/g, "/") +
      "=".repeat((4 - (param.length % 4)) % 4);
    const decoded = atob(base64);
    return /^\d+$/.test(decoded) ? decoded : param;
  } catch {
    return param;
  }
}

export function formatPrice(value?: number | string | null, keepZero = false): string {
  const amount = Number(value);
  if (Number.isFinite(amount) && amount > 0) {
    return `LKR ${amount.toLocaleString("en-US")}`;
  }
  if (keepZero && amount === 0) return "LKR 0";
  return "Free";
}

export function formatDateTime(value?: string | Date | null): string {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function registrationCSVRows(registrations: IRegistration[]) {
  const statusLabel = (s: string) =>
    s === "GOING"
      ? "Going"
      : s === "WAITLIST"
        ? "Waitlist"
        : s === "NOT_GOING"
          ? "Not going"
          : "Pending";

  const category = (r: IRegistration) =>
    r.ticketCode?.startsWith("INVITE-GUEST_SPEAKER-")
      ? "Speaker"
      : r.ticketCode?.startsWith("INVITE-VVIP_VIP-")
        ? "VIP"
        : "General";

  return registrations.map((r) => ({
    Name:
      `${r.firstName ?? ""} ${r.lastName ?? ""}`.trim() ||
      String(r.userId ?? "") ||
      "Unknown",
    Email: r.email ?? "",
    Status: statusLabel(r.status || ""),
    Category: category(r),
    "Ticket code": r.ticketCode ?? "",
    Registered: formatDateTime(r.registeredAt),
    "Checked in": formatDateTime(r.chekingTime ?? r.checkingTime),
  }));
}

export function downloadCSV(filename: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);

  const escape = (value: unknown) => {
    let s = value == null ? "" : String(value);
    if (/^[=+\-@]/.test(s)) s = `'${s}`;
    if (/[",\n]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
  ];

  const blob = new Blob([`\uFEFF${lines.join("\r\n")}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}