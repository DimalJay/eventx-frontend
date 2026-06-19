"use client";

import { useState } from "react";
import EventTaskCreateDialog from "../EventTaskCreateDialog";

const users = [
  { id: 1, name: "Dana" },
  { id: 2, name: "Marcus" },
  { id: 3, name: "Priya" },
  { id: 4, name: "Leo" },
];

const initialTaskGroups = [
  {
    title: "TODO",
    tone: "border-sky-200 bg-sky-50 text-sky-800",
    tasks: [
      {
        title: "Order onsite signage",
        owner: "Priya",
        due: "Due 16 June",
        team: "Ops",
      },
      {
        title: "Brief volunteer team",
        owner: "Leo",
        due: "Due 17 June",
        team: "Ops",
      },
    ],
  },
  {
    title: "IN_PROGRESS",
    tone: "border-amber-200 bg-amber-50 text-amber-800",
    tasks: [
      {
        title: "Confirm keynote speakers",
        owner: "Dana",
        due: "Due today",
        team: "Program",
      },
    ],
  },
  {
    title: "DONE",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-800",
    tasks: [
      {
        title: "Lock venue contract",
        owner: "Dana",
        due: "Completed",
        team: "Ops",
      },
    ],
  },
];



export default function EventManageTasksPage() {
  const [groups, setGroups] = useState(initialTaskGroups);

  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [taskCreatedOpen, setTaskCreatedOpen] = useState(false);

 

  const total = groups.reduce(
    (sum, group) => sum + group.tasks.length,
    0
  );

  const done =
    groups.find((group) => group.title === "DONE")?.tasks.length ?? 0;

  const progress =
    total > 0 ? Math.round((done / total) * 100) : 0;

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);

    return `Due ${date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
    })}`;
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
          {groups.map((group) => (
            <div
              key={group.title}
              className="flex flex-col gap-4 rounded-3xl border border-black/10 bg-white/80 p-6"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${group.tone}`}
                >
                  {group.title === "TODO"
                    ? "To Do"
                    : group.title === "IN_PROGRESS"
                    ? "In Progress"
                    : "Done"}
                </span>

                <span className="text-xs text-black/40">
                  {group.tasks.length}
                </span>
              </div>

              <div className="grid gap-3">
                {group.tasks.map((task) => (
                  <article
                    key={`${group.title}-${task.title}`}
                    className="rounded-2xl border border-black/10 bg-white px-4 py-4"
                  >
                    <h3 className="text-sm font-semibold text-black">
                      {task.title}
                    </h3>

                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-black/40">
                      {task.team}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-xs text-black/60">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-[10px] font-semibold uppercase text-white">
                          {task.owner.charAt(0)}
                        </span>

                        {task.owner}
                      </span>

                      <span className="text-xs font-semibold text-black/60">
                        {task.due}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>

      <EventTaskCreateDialog
        open={addTaskOpen}
        onClose={() => setAddTaskOpen(false)}
        users={users}
        onCreate={(newTask) => {
          setGroups((current) =>
            current.map((group) =>
              group.title === initialTaskGroups[0].title
                ? { ...group, tasks: [...group.tasks, newTask] }
                : group
            )
          );

          setAddTaskOpen(false);
          setTaskCreatedOpen(true);
        }}
      />

      {taskCreatedOpen ? (
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
      ) : null}
    </>
  );
}
