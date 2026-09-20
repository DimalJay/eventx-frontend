"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTeamLabels, updateTeamLabels } from "@/service/teamService";
import { toast } from "sonner";
import Dialog from "@/components/widgets/Dialog";
import { X, Plus, Pencil, Check } from "lucide-react";

type Props = {
  eventId: string;
  open: boolean;
  onClose: () => void;
};

function parseLabels(labels: string | undefined | null): string[] {
  if (!labels || !labels.trim()) return [];
  return labels
    .split(",")
    .map((label) => label.trim())
    .filter(Boolean);
}

type EditorProps = {
  eventId: string;
  initialLabels: string[];
  isLoading: boolean;
  onSaved: () => void;
  onCancel: () => void;
};

function LabelsEditor({
  eventId,
  initialLabels,
  isLoading,
  onSaved,
  onCancel,
}: EditorProps) {
  const queryClient = useQueryClient();
  const [labels, setLabels] = useState<string[]>(initialLabels);
  const [input, setInput] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const mutation = useMutation({
    mutationFn: async (nextLabels: string[]) => {
      return updateTeamLabels({ eventId, labels: nextLabels.join(", ") });
    },
    onSuccess: (res) => {
      if (res?.success) {
        queryClient.invalidateQueries({ queryKey: ["team-labels", eventId] });
        toast.success("Team labels updated successfully.");
        onSaved();
      } else {
        toast.error(res?.message || "Failed to update labels.");
      }
    },
    onError: (err: Error) => {
      toast.error(err?.message || "Error updating labels.");
    },
  });

  const addFromInput = () => {
    const incoming = parseLabels(input);
    if (incoming.length === 0) return;
    setLabels((prev) => {
      const next = [...prev, ...incoming];
      return next.filter((label, index) => next.indexOf(label) === index);
    });
    setInput("");
  };

  const removeLabel = (label: string) => {
    setLabels((prev) => prev.filter((l) => l.toLowerCase() !== label.toLowerCase()));
  };

  const startEditing = (index: number, label: string) => {
    setEditingIndex(index);
    setEditValue(label);
  };

  const commitEdit = () => {
    if (editingIndex === null) return;
    const trimmed = editValue.trim();
    if (trimmed) {
      setLabels((prev) => {
        const next = [...prev];
        next[editingIndex] = trimmed;
        return next.filter((label, index) => {
          const firstOccurrence = next.findIndex(
            (l) => l.toLowerCase() === label.toLowerCase(),
          );
          return firstOccurrence === index;
        });
      });
    }
    setEditingIndex(null);
    setEditValue("");
  };

  return (
    <div className="mt-5">
      {isLoading ? (
        <div className="flex animate-pulse flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-10 rounded-xl bg-zinc-100" />
          ))}
        </div>
      ) : (
        <>
          {labels.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {labels.map((label, index) =>
                editingIndex === index ? (
                  <li
                    key={label}
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
                      aria-label="Confirm label change"
                      onClick={commitEdit}
                      className="flex h-5 w-5 items-center justify-center rounded-full text-zinc-500 transition hover:bg-primary-soft hover:text-primary"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ) : (
                  <li
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 py-1 pl-3 pr-1.5 text-sm font-medium text-zinc-800"
                  >
                    {label}
                    <button
                      type="button"
                      aria-label={`Change ${label}`}
                      onClick={() => startEditing(index, label)}
                      className="flex h-5 w-5 items-center justify-center rounded-full text-zinc-500 transition hover:bg-primary-soft hover:text-primary"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${label}`}
                      onClick={() => removeLabel(label)}
                      className="flex h-5 w-5 items-center justify-center rounded-full text-zinc-500 transition hover:bg-rose-100 hover:text-rose-700"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ),
              )}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500">No labels yet. Add labels below, separated by commas.</p>
          )}

          <div className="mt-4 flex gap-2">
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
              placeholder="e.g. VIP, Speaker, Press"
              className="h-11 flex-1 rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-primary/60 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={addFromInput}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            Type one or more labels separated by commas, then press Enter or Add.
          </p>
        </>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={mutation.isPending}
          className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900 disabled:opacity-50"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={mutation.isPending || isLoading}
          className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={() => mutation.mutate(labels)}
        >
          {mutation.isPending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Saving...
            </>
          ) : (
            "Save labels"
          )}
        </button>
      </div>
    </div>
  );
}

export default function TeamLabelsDialog({ eventId, open, onClose }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["team-labels", eventId],
    queryFn: async () => {
      const res = await getTeamLabels({ eventId });
      return res.data?.labels ?? "";
    },
    enabled: open && !!eventId,
    retry: false,
  });

  if (!open) return null;

  return (
    <Dialog
      open={open}
      eyebrow="Team labels"
      title="Manage team labels"
      description="Add or remove labels to organize your team. Labels are stored as a comma-separated list."
    >
      {data !== undefined ? (
        <LabelsEditor
          key={`${eventId}-${String(data)}`}
          eventId={eventId}
          initialLabels={parseLabels(data)}
          isLoading={isLoading}
          onSaved={onClose}
          onCancel={onClose}
        />
      ) : (
        <div className="mt-5 flex animate-pulse flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-10 rounded-xl bg-zinc-100" />
          ))}
        </div>
      )}
    </Dialog>
  );
}