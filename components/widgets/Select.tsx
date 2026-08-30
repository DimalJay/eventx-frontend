'use client'
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { FiChevronDown, FiCheck } from "react-icons/fi";
import { usePopoverPosition } from "@/lib/usePopoverPosition";

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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const geom = usePopoverPosition(open, wrapperRef, menuRef, "bottom", align);
  const selected = options.find((o) => o.value === value);

  return (
    <div ref={wrapperRef} className="relative">
      {name && <input type="hidden" name={name} value={value} />}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className={cn(
          "flex items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-900 outline-none transition hover:border-zinc-300 focus:border-primary/60 focus:ring-2 focus:ring-primary/20",
          className
        )}
      >
        <span className="truncate">{selected?.label ?? ""}</span>
        <FiChevronDown
          className={cn("h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <div
              ref={menuRef}
              role="listbox"
              style={{
                position: "fixed",
                top: geom ? geom.top : -9999,
                left: geom ? geom.left : -9999,
                minWidth: geom ? geom.triggerWidth : undefined,
              }}
              className={cn(
                "z-[95] overflow-y-auto max-h-60 rounded-2xl border border-zinc-200 bg-white p-1 shadow-pop",
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
                      "flex w-full items-center justify-between gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-left text-sm font-medium transition hover:bg-primary-faint",
                      isSelected ? "text-zinc-900" : "text-zinc-600"
                    )}
                  >
                    {option.label}
                    {isSelected && <FiCheck className="h-4 w-4 shrink-0" />}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[90] cursor-default bg-transparent"
            />
          </>,
          document.body
        )}
    </div>
  );
}
