"use client";

import { useState } from "react";
import EventTaskCreateDialog from "../dialogs/EventTaskCreateDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTeamMembers } from "@/service/teamService";
import { getTasksRequest, updateTaskStatusRequest } from "@/service/taskService";
import { ITask, TaskStatus } from "@/types";
import { TeamMember } from "@/types/team";
import TaskCard from "../TaskCard";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useParams } from "next/navigation";

interface StatusAttributes {
  label: string;
  color: string;
  icon: string;
}

const TaskStatusDetails: Record<TaskStatus, StatusAttributes> = {
  ["TODO"]: { 
    label: "To Do", 
    color: "border-sky-200 bg-sky-50 text-sky-800", 
    icon: "📋" 
  },
  ["IN_PROGRESS"]: { 
    label: "In Progress", 
    color: "border-amber-200 bg-amber-50 text-amber-800", 
    icon: "⏳" 
  },
  ["DONE"]: { 
    label: "Completed", 
    color: "border-emerald-200 bg-emerald-50 text-emerald-800", 
    icon: "✅" 
  }
};

export default function EventManageTasksPage() {
  const { id: eventId } = useParams() as { id: string };
  const queryClient = useQueryClient();
  
  const { data: users = [] } = useQuery({
    queryKey: ['team-members-event-' + eventId],
    queryFn: async () => {
      const response = await getTeamMembers({ eventId });
      return response.data as TeamMember[];
    },
    retry: false,
  })

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks-event-' + eventId],
    queryFn: async () => (await getTasksRequest({ eventId: eventId })).data as ITask[],
    retry: false,
  })

  const groupedTasks = tasks.reduce((groups, task) => {
    if (!groups[task.status]) {
      groups[task.status] = [];
    }
    groups[task.status].push(task);

    return groups;
  }, {
    TODO: [],
    IN_PROGRESS: [],
    DONE: [],
  } as Record<string, ITask[]>);

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: TaskStatus }) => {
      return updateTaskStatusRequest(taskId, status); 
    },
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks-event-' + eventId] });
      const previousTasks = queryClient.getQueryData<ITask[]>(['tasks-event-' + eventId]);

      if (previousTasks) {
        queryClient.setQueryData<ITask[]>(['tasks-event-' + eventId], old => 
          old?.map(task => 
            task.id.toString() === taskId ? { ...task, status: status } : task
          )
        );
      }
      return { previousTasks };
    },
    onSuccess: () => {
      toast.success("Task status updated successfully.");
    },
    onError: (err, newTodo, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks-event-' + eventId], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks-event-' + eventId] });
    },
  });


  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [taskCreatedOpen, setTaskCreatedOpen] = useState(false);

  const total = tasks.length;
  const done = groupedTasks.DONE?.length ?? 0;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;


  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData("taskId", taskId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    console.log("Dropping task to status:", targetStatus);
    e.preventDefault();
    const draggedTaskId = e.dataTransfer.getData("taskId");

    const task = tasks.find(t => t.id.toString() === draggedTaskId);
    if (task && task.status !== targetStatus) {
      updateTaskMutation.mutate({ taskId: draggedTaskId, status: targetStatus });
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-5 rounded-3xl border border-black/10 bg-white/85 p-7 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.35)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
              Team tasks
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-black">
              {done} of {total} complete
            </h2>

            <div className="mt-4 h-2 w-64 max-w-full overflow-hidden rounded-full bg-black/10">
              <div
                className="h-full rounded-full bg-black"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
            onClick={() => {
              setAddTaskOpen(true);
            }}
          >
            Add task
          </button>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {Object.entries(groupedTasks).map(([key, value]) => (
            <div
              key={key}
              className="flex flex-col gap-4 rounded-3xl border border-black/10 bg-white/80 p-6"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, key as TaskStatus)}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold`, TaskStatusDetails[key as TaskStatus].color)}
                >
                  {TaskStatusDetails[key as TaskStatus].label}
                </span>

                <span className="text-xs text-black/40">
                  {value.length}
                </span>
              </div>

              <div className="grid gap-3">
                {value.map((task) => (
                  <div key={task.id} onDragStart={(e) => handleDragStart(e, parseInt(task.id))} draggable>
                    <TaskCard task={task} users={users} eventId={eventId} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div >

      <EventTaskCreateDialog
        open={addTaskOpen}
        onClose={() => setAddTaskOpen(false)}
        users={users ?? []}
        eventId={eventId}
      />

      {
        taskCreatedOpen ? (
          <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4">
            <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                Task created
              </p>

              <h3 className="mt-2 text-xl font-semibold text-black">
                Task added successfully
              </h3>

              <p className="mt-2 text-sm text-black/60">
                The task has been assigned and saved.
              </p>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-black px-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
                  onClick={() => setTaskCreatedOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null
      }
    </>
  );
}
