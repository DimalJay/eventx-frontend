"use client";

import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormIcon } from "./Icons";
import HelpTooltip from "../../widgets/HelpTooltip";
import Select from "../../widgets/Select";
import { FiX, FiPlus, FiCheck, FiEdit2 } from "react-icons/fi";

type CustomField = { name: string; key: string; type: string; options?: string[] };

const FIELD_TYPES = ["text", "number", "date", "select"] as const;

const TEMPLATES: CustomField[] = [
  { name: "Phone Number", key: "phoneNumber", type: "text" },
  { name: "Gender", key: "gender", type: "select", options: ["Male", "Female", "Other"] },
  { name: "NIC", key: "nic", type: "text" },
];

const slugifyKey = (name: string, fallback: string) => {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();
  return slug || fallback;
};

const typeLabel = (type: string) => type.charAt(0).toUpperCase() + type.slice(1);

function OptionsEditor({
  options,
  onChange,
}: {
  options: string[];
  onChange: (next: string[]) => void;
}) {
  const [input, setInput] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const addFromInput = () => {
    const incoming = input
      .split(",")
      .map((label) => label.trim())
      .filter(Boolean);
    if (incoming.length === 0) return;
    onChange([...options, ...incoming]);
    setInput("");
  };

  const removeOption = (index: number) => {
    onChange(options.filter((_, i) => i !== index));
  };

  const commitEdit = () => {
    if (editingIndex === null) return;
    const trimmed = editValue.trim();
    if (trimmed) {
      onChange(options.map((option, i) => (i === editingIndex ? trimmed : option)));
    }
    setEditingIndex(null);
    setEditValue("");
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
        Options
      </p>
      {options.length > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-2">
          {options.map((option, index) =>
            editingIndex === index ? (
              <li
                key={`${option}-${index}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-white py-1 pl-3 pr-1.5 text-sm font-medium text-zinc-800"
              >
                <input
                  type="text"
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      commitEdit();
                    }
                    if (e.key === "Escape") {
                      setEditingIndex(null);
                      setEditValue("");
                    }
                  }}
                  className="w-28 bg-transparent text-sm font-medium text-zinc-900 outline-none"
                />
                <button
                  type="button"
                  aria-label="Confirm option change"
                  onClick={commitEdit}
                  className="flex h-5 w-5 items-center justify-center rounded-full text-zinc-500 transition hover:bg-primary-soft hover:text-primary"
                >
                  <FiCheck className="h-3.5 w-3.5" />
                </button>
              </li>
            ) : (
              <li
                key={`${option}-${index}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white py-1 pl-3 pr-1.5 text-sm font-medium text-zinc-800"
              >
                {option}
                <button
                  type="button"
                  aria-label={`Edit ${option}`}
                  onClick={() => {
                    setEditingIndex(index);
                    setEditValue(option);
                  }}
                  className="flex h-5 w-5 items-center justify-center rounded-full text-zinc-500 transition hover:bg-primary-soft hover:text-primary"
                >
                  <FiEdit2 className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${option}`}
                  onClick={() => removeOption(index)}
                  className="flex h-5 w-5 items-center justify-center rounded-full text-zinc-500 transition hover:bg-rose-100 hover:text-rose-700"
                >
                  <FiX className="h-3.5 w-3.5" />
                </button>
              </li>
            ),
          )}
        </ul>
      ) : (
        <p className="mt-1 text-xs text-zinc-500">No options yet. Add options below, separated by commas.</p>
      )}

      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addFromInput();
            }
          }}
          placeholder="e.g. Male, Female, Other"
          className="h-9 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-primary/60 focus:ring-primary/20"
        />
        <button
          type="button"
          onClick={addFromInput}
          className="inline-flex h-9 items-center justify-center gap-1 rounded-xl bg-primary px-3 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          <FiPlus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>
    </div>
  );
}

export default function CustomFieldsSection() {
  const { setValue, control } = useFormContext();
  const [adding, setAdding] = useState(false);
  const customFields: CustomField[] = useWatch({ name: "customFields", control }) ?? [];

  const isTemplate = (field: CustomField) =>
    TEMPLATES.some((t) => t.key === field.key && t.name === field.name);

  const upsertField = (next: CustomField[]) => {
    setValue("customFields", next, { shouldDirty: true, shouldValidate: true });
    setAdding(false);
  };

  const updateRow = (index: number, patch: Partial<CustomField>) => {
    upsertField(customFields.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const removeRow = (index: number) => {
    upsertField(customFields.filter((_, i) => i !== index));
  };

  const addTemplate = (template?: CustomField) => {
    if (template && customFields.some((f) => f.key === template.key)) return;
    if (template) {
      upsertField([...customFields, { ...template }]);
    } else {
      upsertField([...customFields, { name: "", key: "", type: "text" }]);
    }
  };

  return (
    <div>
      <span className="px-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
        Registration fields
      </span>
      <div className="mt-2 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
        {customFields.map((field, index) => {
          const fixed = isTemplate(field);
          return (
            <div key={`${field.key}-${index}`} className="flex flex-col gap-3 px-4 py-3.5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-zinc-500">
                  <FormIcon />
                  <span className="text-sm font-medium text-zinc-900">
                    {fixed ? field.name : "Custom field"}
                  </span>
                  <HelpTooltip
                    text={
                      fixed
                        ? `${field.name} is a built-in template. It appears on the registration form whenever it is listed here.`
                        : "Give this field a label and pick its input type. It will appear on the registration form."
                    }
                    side="bottom"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  aria-label={`Remove ${field.name || "field"}`}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 text-zinc-400 transition hover:border-rose-300 hover:text-rose-500"
                >
                  <FiX className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  value={field.name}
                  disabled={fixed}
                  onChange={(e) =>
                    updateRow(index, { name: e.target.value, key: slugifyKey(e.target.value, `field${index + 1}`) })
                  }
                  placeholder="Field label, e.g. T-Shirt Size"
                  className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-primary/60 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500"
                />
                <Select
                  name=""
                  ariaLabel="Field type"
                  value={field.type}
                  onChange={(type) => updateRow(index, { type })}
                  className="h-10 w-full px-3"
                  options={FIELD_TYPES.map((type) => ({ value: type, label: typeLabel(type) }))}
                />
              </div>
              {field.type === "select" && (
                <OptionsEditor
                  options={field.options ?? []}
                  onChange={(next) => updateRow(index, { options: next })}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="px-1 text-xs text-zinc-400">
          {customFields.length === 0
            ? "No registration fields yet. Add phone, gender, NIC, or your own."
            : "Collect extra details from attendees at registration."}
        </p>

        <div className="relative">
          {adding && (
            <div className="absolute bottom-full right-0 z-20 mb-2 w-52 rounded-2xl border border-zinc-200 bg-white p-2 shadow-pop">
              {TEMPLATES.map((template) => {
                const alreadyAdded = customFields.some((f) => f.key === template.key);
                return (
                  <button
                    key={template.key}
                    type="button"
                    disabled={alreadyAdded}
                    onClick={() => addTemplate(template)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:text-zinc-400"
                  >
                    {template.name}
                    <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                      {typeLabel(template.type)}
                    </span>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => addTemplate()}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
              >
                Custom field
                <FiPlus className="h-3.5 w-3.5 text-zinc-400" />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setAdding((v) => !v)}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-semibold text-primary transition hover:bg-primary-soft"
          >
            <FiPlus className="h-3.5 w-3.5" /> Add field
          </button>
        </div>
      </div>
    </div>
  );
}