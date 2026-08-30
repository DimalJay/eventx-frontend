import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import type { ReactNode } from "react";

type DialogProps = {
  open: boolean;
  eyebrow?: string;
  eyebrowTone?: "default" | "danger";
  title: string;
  description?: ReactNode;
  children: ReactNode;
  maxWidth?: "sm" | "md";
  className?: string;
  onClose?: () => void;
};

const MAX_WIDTH: Record<NonNullable<DialogProps["maxWidth"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
};

export default function Dialog({
  open,
  eyebrow,
  eyebrowTone = "default",
  title,
  description,
  children,
  maxWidth = "md",
  className,
  onClose,
}: DialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-zinc-900/40 px-4"
      onClick={onClose}
    >
      <div
        className={cn(
          "w-full relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-pop",
          MAX_WIDTH[maxWidth],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {eyebrow && (
          <p
            className={cn(
              "text-sm font-semibold uppercase tracking-[0.16em]",
              eyebrowTone === "danger" ? "text-danger" : "text-primary"
            )}
          >
            {eyebrow}
          </p>
        )}
        <h3 className="mt-2 text-xl font-semibold text-zinc-900">{title}</h3>
        {description && <p className="mt-2 text-sm text-zinc-500">{description}</p>}
        {children}
      </div>
    </div>
  );
}