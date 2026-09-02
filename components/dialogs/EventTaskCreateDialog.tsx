"use client";

import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTaskRequest } from "@/service/taskService";
import Select from "../widgets/Select";
import DateTimePicker from "../widgets/DateTimePicker";
import HelpTooltip from "../widgets/HelpTooltip";
import Dialog from "../widgets/Dialog";
import { TeamMember } from "@/types/team";


type Props = {
    open: boolean;
    onClose: () => void;
    users: TeamMember[];
    eventId: string;
};

const isNotInPast = (val: string) => {
    if (!val) return true;
    const datePart = val.split("T")[0];
    const parts = datePart.split("-").map(Number);
    if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) return true;
    const selectedDate = new Date(parts[0], parts[1] - 1, parts[2]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
};

const eventTaskSchema = z.object({
    eventId: z.string().optional(),
    title: z.string().min(1, "Task title is required"),
    description: z.string().optional(),
    assignedTo: z.string().min(1, "Assignee is required"),
    assignedBy: z.string().min(1, "Assigner is required"),
    dueDate: z.string()
        .min(1, "Due date is required")
        .refine(isNotInPast, { message: "Due date cannot be in the past" }),
});

type EventTaskFormValues = z.infer<typeof eventTaskSchema>;

export default function EventTaskCreateDialog({ open, onClose, users, eventId }: Props) {
     const queryClient = useQueryClient();
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<EventTaskFormValues>({
        resolver: zodResolver(eventTaskSchema),
        defaultValues: { eventId: eventId, assignedBy: "", assignedTo: "", title: "", description: "", dueDate: "" },
    });

    const mutation = useMutation({
        mutationFn: async (data: EventTaskFormValues) => {
            return createTaskRequest(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks-event-' + eventId] });
            toast.success("Task created successfully.");
            reset();
            onClose();
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || error?.message || "Failed to create task. Please try again.";
            toast.error(message);
        },
    });

    const onSubmit = (data: EventTaskFormValues) => {
        mutation.mutate(data);
    };

    const handleClose = () => {
        reset();
        onClose();
    }

if (!open) return null;

  return (
    <Dialog
      open={open}
      eyebrow="Add task"
      title="Create a new task"
      description="Assign a task to a team member."
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

                    <div className="grid gap-2 text-sm font-semibold text-zinc-900">
                        <label htmlFor="task-description" className="flex items-center gap-1.5">
                          Description
                          <HelpTooltip text="Add context so the assignee knows what's expected - scope, links, or acceptance criteria." side="bottom" />
                        </label>
                        <textarea
                            id="task-description"
                            rows={4}
                            {...register("description")}
                            className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-primary/60 focus:ring-primary/20"
                        />
                        {errors.description && <span className="text-red-600 text-xs font-normal">{errors.description.message}</span>}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="grid gap-2 text-sm font-semibold text-zinc-900">
                            Assigned By
                            <Controller
                                name="assignedBy"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        name={field.name}
                                        ariaLabel="Event visibility"
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
                                        ariaLabel="Event visibility"
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
                    <div className="grid gap-2 text-sm font-semibold text-zinc-900">
                        <div className="flex items-center gap-1.5">
                          Due Date
                          <HelpTooltip text="The date the task should be completed. Team members see the due date on their task list." side="bottom" />
                        </div>
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
                                    minDate={new Date()}
                                />
                            )}
                        />
                        {errors.dueDate && <span className="text-red-600 text-xs font-normal">{errors.dueDate.message}</span>}
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
                            onClick={handleClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? "Creating..." : "Create task"}
                        </button>
                    </div>
</form>
    </Dialog>
  );
}
