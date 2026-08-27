import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value?: number | string | null): string {
  const amount = Number(value);
  if (!amount || amount <= 0) return "Free";
  return `LKR ${amount.toLocaleString("en-US")}`;
}