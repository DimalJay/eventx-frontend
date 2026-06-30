import { ITask } from "@/service/types";
import EventTaskUpdateDialog from "./widgets/EventTaskUpdate";
import { useState } from "react";

export default function TaskCard({ task , users, eventId }: { task: ITask , users: any[], eventId: string }) {
    const [open, setOpen] = useState(false);

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
            className="rounded-2xl border border-black/10 bg-white px-4 py-4"
            onClick={() => setOpen(true)}
        >
            <h3 className="text-sm font-semibold text-black">
                {task.title}
            </h3>

            <p className="mt-1 text-xs text-black/40">
                {task.description}
            </p>

            <div className="mt-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-xs text-black/60">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-[10px] font-semibold uppercase text-white">
                        {task.assignedTo}
                    </span>

                    {task.assignedTo}
                </span>

                <span className="text-xs font-semibold text-black/60">
                    {formatDueDate(task.dueDate)}
                </span>
            </div>
        </article>
        <EventTaskUpdateDialog task={task} open={open} onClose={() => setOpen(false)} users={users} eventId={eventId} />
        </>
    )
}