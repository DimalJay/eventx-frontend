import { IAgendaItem } from "@/service/types";

export default function DeleteEventAgendaItem({
  setOpen,
  item,
  onDelete,
  isPending = false,
}: {
  setOpen: (open: boolean) => void;
  item: IAgendaItem;
  onDelete: () => void;
  isPending?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
          Remove Item
        </p>
        <h3 className="mt-2 text-xl font-semibold text-black">
          Delete Agenda Item?
        </h3>
        <p className="mt-2 text-sm text-black/60">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-black">
            "{item.task}"
          </span>
          ? This action cannot be undone.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={onDelete}
            className="inline-flex h-10 items-center justify-center rounded-full border border-rose-200 px-4 text-xs font-semibold uppercase tracking-widest text-rose-700 transition hover:border-rose-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}