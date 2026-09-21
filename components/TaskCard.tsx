import { ITask } from "@/types";
import EventTaskUpdateDialog from "./dialogs/EventTaskUpdate";
import { useState } from "react";
import { TeamMember } from "@/types/team";
import { FiLock } from "react-icons/fi";
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

    const statusPct = isDone ? 100 : isInProgress ? 50 : 25;
    const statusLabel = isDone ? "Completed" : isInProgress ? "In Progress" : "To Do";

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

            {/* Task status progress line */}
            <div className="mt-3 flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-500">
                    <span className={cn(
                        isDone ? "text-emerald-700" :
                        isInProgress ? "text-amber-700" : "text-sky-700"
                    )}>
                        {statusLabel}
                    </span>
                    <span className="tabular-nums text-zinc-400">{statusPct}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                    <div
                        className={cn(
                            "h-full rounded-full transition-all duration-500",
                            isDone
                                ? "w-full bg-emerald-500"
                                : isInProgress
                                ? "w-1/2 bg-amber-500"
                                : "w-1/4 bg-sky-400"
                        )}
                    />
                </div>
            </div>

            <div className="mt-3.5 flex items-center justify-between border-t border-zinc-100 pt-3">
                <span className="inline-flex items-center gap-2 text-xs text-zinc-600">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft text-[10px] font-semibold uppercase text-primary">
                        {assignedUser ? assignedUser.name.charAt(0) : "?"}
                    </span>

                    <span className="max-w-[100px] truncate">{assignedUser ? assignedUser.name : task.assignedTo}</span>
                </span>

                <span className="text-[11px] font-semibold text-zinc-500">
                    {formatDueDate(task.dueDate)}
                </span>
            </div>
        </article>
        <EventTaskUpdateDialog task={task} open={open} onClose={() => setOpen(false)} users={users} eventId={eventId} canEdit={canEdit} />
        </>
    )
}