import { ITask } from "@/types";
import EventTaskUpdateDialog from "./dialogs/EventTaskUpdate";
import { useState } from "react";
import { TeamMember } from "@/types/team";
import { FiLock } from "react-icons/fi";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TaskCard({ task , users, eventId, canEdit = true, disabled = false }: { task: ITask , users: TeamMember[], eventId: string, canEdit?: boolean, disabled?: boolean }) {
    const [open, setOpen] = useState(false);

    const assignedUser = users.find((user) => String(user.id) == task.assignedTo);

    const formatDueDate = (dateString: string) => {
        const date = new Date(dateString);

        return `Due ${date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
        })}`;
    };

    const rawStatus = String(task.status || "").toUpperCase();
    const isDone = rawStatus === "DONE" || rawStatus === "COMPLETED";
    const isInProgress = rawStatus === "IN_PROGRESS" || rawStatus === "INPROGRESS";

    const statusLabel = isDone ? "Completed" : isInProgress ? "In Progress" : "To Do";

    const isOverdue =
        !isDone &&
        task.dueDate &&
        new Date(task.dueDate).getTime() < Date.now(); // eslint-disable-line react-hooks/purity

    return (
        <>
        <article
            key={`${task.id}`}
            className={`rounded-2xl border bg-white px-4 py-4 transition ${
                disabled
                    ? "cursor-not-allowed border-zinc-200 opacity-60"
                    : "cursor-pointer border-zinc-200 hover:border-primary/30 hover:shadow-card"
            }`}
            onClick={() => {
                if (!disabled) setOpen(true);
            }}
        >
            <h3 className="flex items-center gap-1.5 text-sm font-semibold text-zinc-900">
                {disabled && <FiLock className="h-3.5 w-3.5 shrink-0 text-zinc-400" />}
                <span className="min-w-0 flex-1 truncate">{task.title}</span>
            </h3>

            {task.description && (
                <p className="mt-1 text-xs text-zinc-500 line-clamp-2">
                    {task.description}
                </p>
            )}

            {/* Task status */}
            <div className="mt-3 text-[11px] font-semibold text-zinc-500">
                <span className={cn(
                    isDone ? "text-emerald-700" :
                    isInProgress ? "text-amber-700" : "text-sky-700"
                )}>
                    {statusLabel}
                </span>
                {isOverdue && (
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-600">
                        <AlertTriangle className="h-3 w-3" />
                        Overdue
                    </span>
                )}
            </div>

            <div className="mt-3.5 flex items-center justify-between border-t border-zinc-100 pt-3">
                <span className="inline-flex items-center gap-2 text-xs text-zinc-600">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft text-[10px] font-semibold uppercase text-primary">
                        {assignedUser ? assignedUser.name.charAt(0) : "?"}
                    </span>

                    <span className="max-w-[100px] truncate">{assignedUser ? assignedUser.name : task.assignedTo}</span>
                </span>

                <span className={cn("text-[11px] font-semibold", isOverdue ? "text-red-600" : "text-zinc-500")}>
                    {formatDueDate(task.dueDate)}
                </span>
            </div>
        </article>
        <EventTaskUpdateDialog task={task} open={open} onClose={() => setOpen(false)} users={users} eventId={eventId} canEdit={canEdit} />
        </>
    )
}