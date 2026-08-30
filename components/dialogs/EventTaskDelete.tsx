"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteTaskRequest } from "@/service/taskService";
import { ITask } from "@/types";
import Dialog from "@/components/widgets/Dialog";


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

  if (deleteSuccessOpen) {
    return (
      <Dialog
        open={open}
        eyebrow="Task deleted"
        title="Task deleted successfully"
        description="The task has been removed from your current list and will no longer appear in your dashboard."
      >
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary/90"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      eyebrow="Delete task"
      title="Confirm deletion"
      description={`Are you sure you want to delete ${taskTitle ? `"${taskTitle}"` : "this task"}? This action cannot be undone.`}
    >
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
              onClick={handleClose}
            >
              Cancel
            </button>

            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-full bg-danger px-4 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Deleting..." : "Delete task"}
            </button>
          </div>
    </Dialog>
  );
}
