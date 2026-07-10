"use client";

import { useEffect, useState } from "react";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateTaskRequest } from "@/service/taskService";
import Select from "../widgets/Select";
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

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4">
   
      {updateSuccessOpen ? (
        <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
            Task updated
          </p>
          

          <h3 className="mt-2 text-xl font-semibold text-black">
            Task updated successfully
          </h3>

          <p className="mt-2 text-sm text-black/60">
            The task details have been saved and are now visible in your task list.
          </p>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-full bg-black px-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
              onClick={handleCancel}
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">Update task</p>

          <h3 className="mt-2 text-xl font-semibold text-black">Edit task details</h3>

          <p className="mt-2 text-sm text-black/60">Update the task title, assignee, due date, and description.</p>

          <form className="mt-5 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <label className="grid gap-2 text-sm font-semibold text-black">
              Task title
              <input
                type="text"
                {...register("title")}
                className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
              />
              {errors.title && <span className="text-red-500 text-xs font-normal">{errors.title.message}</span>}
            </label>

            <label className="grid gap-2 text-sm font-semibold text-black">
              Description
              <textarea
                rows={4}
                {...register("description")}
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-base text-black outline-none transition focus:border-black/40"
              />
              {errors.description && <span className="text-red-500 text-xs font-normal">{errors.description.message}</span>}
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-black">
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
                      options={users.map((user) => ({ value: user.id.toString(), label: `${user.firstName} ${user.lastName}` }))}
                    />
                  )}
                />
                {errors.assignedBy && <span className="text-red-500 text-xs font-normal">{errors.assignedBy.message}</span>}
              </label>

              <label className="grid gap-2 text-sm font-semibold text-black">
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
                      options={users.map((user) => ({ value: user.id.toString(), label: `${user.firstName} ${user.lastName}` }))}
                    />
                  )}
                />
                {errors.assignedTo && <span className="text-red-500 text-xs font-normal">{errors.assignedTo.message}</span>}
              </label>
            </div>

            <label className="grid gap-2 text-sm font-semibold text-black">
              Due Date
              <input
                type="date"
                {...register("dueDate")}
                className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
              />
              {errors.dueDate && <span className="text-red-500 text-xs font-normal">{errors.dueDate.message}</span>}
            </label>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
                onClick={handleCancel}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-full bg-black px-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-black/60"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Updating..." : "Update task"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
