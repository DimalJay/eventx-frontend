'use client'
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/AuthContext";
import { cn } from "@/lib/utils";
import { FiUser, FiSettings, FiLogOut } from "react-icons/fi";

const itemClass =
  "flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-black transition hover:bg-black/5";

export default function UserMenu({ className, variant = "default" }: { className?: string; variant?: "default" | "onDark" }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const initial = user?.firstName?.charAt(0).toUpperCase() ?? "U";

  const handleLogout = () => {
    setOpen(false);
    logout();
    router.push("/login");
  };

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold uppercase tracking-widest transition",
          variant === "onDark"
            ? "bg-white text-[#17130e] hover:bg-white/90"
            : "bg-black text-white hover:bg-black/90"
        )}
      >
        {initial}
      </button>

      {open && (
        <>
          {/* Click-away backdrop */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div
            role="menu"
            className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_25px_70px_-35px_rgba(0,0,0,0.45)]"
          >
            {user && (
              <div className="border-b border-black/10 px-4 py-3">
                <p className="text-sm font-semibold text-black">
                  {user.firstName} {user.lastName}
                </p>
                <p className="truncate text-xs text-black/50">{user.email}</p>
              </div>
            )}
            <Link
              role="menuitem"
              href="/home"
              onClick={() => setOpen(false)}
              className={itemClass}
            >
              <FiUser className="h-4 w-4" />
              Dashboard
            </Link>
            <span
              role="menuitem"
              aria-disabled="true"
              className={cn(itemClass, "pointer-events-none opacity-50")}
            >
              <FiSettings className="h-4 w-4" />
              Settings
            </span>
            <button
              role="menuitem"
              type="button"
              onClick={handleLogout}
              className={cn(itemClass, "border-t border-black/10 text-red-600 hover:bg-red-50")}
            >
              <FiLogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
