"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiCreditCard, FiShield, FiUser } from "react-icons/fi";
import { cn } from "@/lib/utils";

const items = [
  { href: "/settings/profile", label: "Profile", icon: FiUser },
  { href: "/settings/payment", label: "Payment", icon: FiCreditCard },
  { href: "/settings/account", label: "Account", icon: FiShield },
];

export default function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex w-full flex-col gap-1">
      {items.map((item) => {
        const active = pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
              active
                ? "bg-primary text-white shadow-card"
                : "text-zinc-600 hover:bg-primary-faint hover:text-primary",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}