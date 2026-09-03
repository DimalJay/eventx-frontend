import { IAgendaItem } from "@/types";
import Dialog from "../widgets/Dialog";

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
    <Dialog
      open
      eyebrow="Remove Item"
      title="Delete Agenda Item?"
      description={
        <>
          Are you sure you want to delete{" "}
          <span className="font-semibold text-zinc-900">
            "{item.task}"
          </span>
          ? This action cannot be undone.
        </>
      }
    >
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={onDelete}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-danger px-4 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </>
            ) : (
              "Yes, Delete"
            )}
          </button>
        </div>
    </Dialog>
  );
}