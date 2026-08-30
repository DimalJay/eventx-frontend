import { ITask } from "@/types";
import EventTaskUpdateDialog from "./dialogs/EventTaskUpdate";
import { useState } from "react";
import { TeamMember } from "@/types/team";

export default function TaskCard({ task , users, eventId }: { task: ITask , users: TeamMember[], eventId: string }) {
    const [open, setOpen] = useState(false);

    const assignedUser = users.find((user) => String(user.id) == task.assignedTo);

    const formatDueDate = (dateString: string) => {
        const date = new Date(dateString);

        return `Due ${date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
        })}`;
    };


    return (
        <>
        <article
            key={`${task.id}`}
            className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 transition hover:border-primary/30 hover:shadow-card"
            onClick={() => setOpen(true)}
        >
            <h3 className="text-sm font-semibold text-zinc-900">
                {task.title}
            </h3>

            <p className="mt-1 text-xs text-zinc-500">
                {task.description}
            </p>

            <div className="mt-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-xs text-zinc-600">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft text-[10px] font-semibold uppercase text-primary">
                        {assignedUser ? assignedUser.name.charAt(0) : "?"}
                    </span>

                    {assignedUser ? assignedUser.name : task.assignedTo}
                </span>

                <span className="text-xs font-semibold text-zinc-600">
                    {formatDueDate(task.dueDate)}
                </span>
            </div>
        </article>
        <EventTaskUpdateDialog task={task} open={open} onClose={() => setOpen(false)} users={users} eventId={eventId} />
        </>
    )
}