const taskGroups = [
  {
    title: "In progress",
    tone: "border-amber-200 bg-amber-50 text-amber-800",
    tasks: [
      {
        title: "Confirm keynote speakers",
        owner: "Dana",
        due: "Due today",
        team: "Program",
      },
      {
        title: "Finalize registration email",
        owner: "Marcus",
        due: "Due Jun 14",
        team: "Comms",
      },
    ],
  },
  {
    title: "Up next",
    tone: "border-sky-200 bg-sky-50 text-sky-800",
    tasks: [
      {
        title: "Order onsite signage",
        owner: "Priya",
        due: "Due Jun 16",
        team: "Ops",
      },
      {
        title: "Brief volunteer team",
        owner: "Leo",
        due: "Due Jun 17",
        team: "Ops",
      },
    ],
  },
  {
    title: "Done",
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
  const total = taskGroups.reduce((sum, group) => sum + group.tasks.length, 0);
  const done =
    taskGroups.find((group) => group.title === "Done")?.tasks.length ?? 0;
  const progress = Math.round((done / total) * 100);

  return (
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
        >
          Add task
        </button>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {taskGroups.map((group) => (
          <div
            key={group.title}
            className="flex flex-col gap-4 rounded-3xl border border-black/10 bg-white/80 p-6"
          >
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${group.tone}`}
              >
                {group.title}
              </span>
              <span className="text-xs text-black/40">{group.tasks.length}</span>
            </div>

            <div className="grid gap-3">
              {group.tasks.map((task) => (
                <article
                  key={task.title}
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
  );
}
