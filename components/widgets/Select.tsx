'use client'
import { useState } from "react";
import { cn } from "@/lib/utils";
import { FiChevronDown, FiCheck } from "react-icons/fi";

export type SelectOption = { value: string; label: string };

export default function Select({
  name,
  value,
  onChange,
  options,
  className,
  menuClassName,
  align = "left",
  ariaLabel,
}: {
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
  menuClassName?: string;
  align?: "left" | "right";
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      {name && <input type="hidden" name={name} value={value} />}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className={cn(
          "flex items-center justify-between gap-2 rounded-xl border border-black/10 bg-white text-sm font-medium text-black outline-none transition hover:border-black/30 focus:border-black/40 focus:ring-2 focus:ring-black/5",
          className
        )}
      >
        <span className="truncate">{selected?.label ?? ""}</span>
        <FiChevronDown
          className={cn("h-4 w-4 shrink-0 text-black/50 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div
            role="listbox"
            className={cn(
              "absolute top-full z-20 mt-2 min-w-full overflow-hidden rounded-2xl border border-black/10 bg-white p-1 shadow-[0_25px_70px_-35px_rgba(0,0,0,0.45)]",
              align === "right" ? "right-0" : "left-0",
              menuClassName
            )}
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-left text-sm font-medium transition hover:bg-black/5",
                    isSelected ? "text-black" : "text-black/70"
                  )}
                >
                  {option.label}
                  {isSelected && <FiCheck className="h-4 w-4 shrink-0" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
