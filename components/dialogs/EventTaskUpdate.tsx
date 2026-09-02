"use client";

import { useEffect, useState } from "react";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateTaskRequest } from "@/service/taskService";
import Select from "../widgets/Select";
import DateTimePicker from "../widgets/DateTimePicker";
import Dialog from "../widgets/Dialog";
import { TeamMember } from "@/types/team";
import { ITask } from "@/types";

const eventTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  assignedTo: z.string().min(1, "Assignee is required"),
  assignedBy: z.string().min(1, "Assigner is required"),
  dueDate: z.string().min(1, "Due date is required"),
});

type EventTaskFormValues = z.infer<typeof eventTaskSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
  users: TeamMember[];
  task: ITask | null;
  eventId: string;
};

export default function EventTaskUpdateDialog({
  open,
  onClose,
  users,
  task,
  eventId,
}: Props) {
  const queryClient = useQueryClient();
  const [updateSuccessOpen, setUpdateSuccessOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EventTaskFormValues>({
    resolver: zodResolver(eventTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      assignedTo: "",
      assignedBy: task?.assignedBy ?? "",
      dueDate: "",
    },
  });

  useEffect(() => {
    if (open && task) {
      reset({
        title: task.title ?? "",
        description: task.description ?? "",
        assignedTo: task.assignedTo ?? "",
        assignedBy: task.assignedBy ?? "",
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      });
    }

    if (!open) {
      setUpdateSuccessOpen(false);
    }
  }, [open, task, reset]);

  const mutation = useMutation({
    mutationFn: async (data: EventTaskFormValues) => {
      if (!task) {
        throw new Error("No task selected for update.");
      }
      return updateTaskRequest(task.id, data);
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["tasks-event-" + eventId] });
      const previousTasks = queryClient.getQueryData<ITask[]>(["tasks-event-" + eventId]);

      if (previousTasks && task) {
        queryClient.setQueryData<ITask[]>(["tasks-event-" + eventId],
          previousTasks.map((currentTask) =>
            currentTask.id === task.id
              ? {
                  ...currentTask,
                  title: newData.title,
                  description: newData.description,
                  assignedTo: newData.assignedTo,
                  assignedBy: newData.assignedBy,
                  dueDate: newData.dueDate,
                }
              : currentTask
          )
        );
      }

      return { previousTasks };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks-event-" + eventId] });
      toast.success("Task updated successfully.");
      setUpdateSuccessOpen(true);
    },
    onError: (error: any, _, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks-event-" + eventId], context.previousTasks);
      }
      const message = error?.response?.data?.message || error?.message || "Failed to update task. Please try again.";
      toast.error(message);
    },
  });

  const onSubmit = (data: EventTaskFormValues) => {
    mutation.mutate(data);
  };

  const handleCancel = () => {
    reset();
    setUpdateSuccessOpen(false);
    onClose();
  };

  if (!open || !task) return null;

  if (updateSuccessOpen) {
    return (
      <Dialog
        open={open}
        eyebrow="Task updated"
        title="Task updated successfully"
        description="The task details have been saved and are now visible in your task list."
      >
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary/90"
            onClick={handleCancel}
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
      eyebrow="Update task"
      title="Edit task details"
      description="Update the task title, assignee, due date, and description."
    >
      <form className="mt-5 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <label className="grid gap-2 text-sm font-semibold text-zinc-900">
              Task title
              <input
                type="text"
                {...register("title")}
                className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-primary/60 focus:ring-primary/20"
              />
              {errors.title && <span className="text-red-600 text-xs font-normal">{errors.title.message}</span>}
            </label>

            <label className="grid gap-2 text-sm font-semibold text-zinc-900">
              Description
              <textarea
                rows={4}
                {...register("description")}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-primary/60 focus:ring-primary/20"
              />
              {errors.description && <span className="text-red-600 text-xs font-normal">{errors.description.message}</span>}
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-zinc-900">
                Assigned By
                <Controller
                  name="assignedBy"
                  control={control}
                  render={({ field }) => (
                    <Select
                      name={field.name}
                      ariaLabel="Assigned by"
                      value={field.value}
                      onChange={field.onChange}
                      className="mt-2 w-full px-3 py-2.5"
                      options={users.map((user) => ({ value: user.id.toString(), label: `${user.name}` }))}
                    />
                  )}
                />
                {errors.assignedBy && <span className="text-red-600 text-xs font-normal">{errors.assignedBy.message}</span>}
              </label>

              <label className="grid gap-2 text-sm font-semibold text-zinc-900">
                Assigned To
                <Controller
                  name="assignedTo"
                  control={control}
                  render={({ field }) => (
                    <Select
                      name={field.name}
                      ariaLabel="Assigned to"
                      value={field.value}
                      onChange={field.onChange}
                      className="mt-2 w-full px-3 py-2.5"
                      options={users.map((user) => ({ value: user.id.toString(), label: `${user.name}` }))}
                    />
                  )}
                />
                {errors.assignedTo && <span className="text-red-600 text-xs font-normal">{errors.assignedTo.message}</span>}
              </label>
            </div>

            <label className="grid gap-2 text-sm font-semibold text-zinc-900">
              Due Date
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <DateTimePicker
                    mode="date"
                    name={field.name}
                    ariaLabel="Task due date"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.dueDate && <span className="text-red-600 text-xs font-normal">{errors.dueDate.message}</span>}
            </label>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
                onClick={handleCancel}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Updating...
                  </>
                ) : (
                  "Update task"
                )}
              </button>
</div>
      </form>
    </Dialog>
  );
}
