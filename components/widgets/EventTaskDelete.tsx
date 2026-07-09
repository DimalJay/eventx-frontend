"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteTaskRequest } from "@/service/taskService";
import { ITask } from "@/service/types";


type Props = {
  open: boolean;
  onClose: () => void;
  taskId: string | null;
  taskTitle?: string;
  eventId: string;
};

export default function EventTaskDelete({ open, onClose, taskId, taskTitle, eventId }: Props) {
  const queryClient = useQueryClient();
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!taskId) {
        throw new Error("No task selected for deletion.");
      }
      return deleteTaskRequest(taskId);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["tasks-event-" + eventId] });
      const previousTasks = queryClient.getQueryData<ITask[]>(["tasks-event-" + eventId]);

      if (previousTasks && taskId) {
        queryClient.setQueryData<ITask[]>(["tasks-event-" + eventId],
          previousTasks.filter((task) => task.id !== taskId)
        );
      }

      return { previousTasks };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks-event-" + eventId] });
      toast.success("Task deleted successfully.");
      setDeleteSuccessOpen(true);
    },
    onError: (error: any, _, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks-event-" + eventId], context.previousTasks);
      }
      const message = error?.response?.data?.message || error?.message || "Failed to delete task. Please try again.";
      toast.error(message);
    },
  });

  const handleClose = () => {
    setDeleteSuccessOpen(false);
    onClose();
  };

  if (!open || !taskId) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4">
      {deleteSuccessOpen ? (
        <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
            Task deleted
          </p>

          <h3 className="mt-2 text-xl font-semibold text-black">
            Task deleted successfully
          </h3>

          <p className="mt-2 text-sm text-black/60">
            The task has been removed from your current list and will no longer appear in your dashboard.
          </p>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-full bg-black px-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
            Delete task
          </p>

          <h3 className="mt-2 text-xl font-semibold text-black">
            Confirm deletion
          </h3>

          <p className="mt-2 text-sm text-black/60">
            Are you sure you want to delete {taskTitle ? `"${taskTitle}"` : "this task"}? This action cannot be undone.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
              onClick={handleClose}
            >
              Cancel
            </button>

            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-full bg-black px-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-black/60"
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Deleting..." : "Delete task"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
