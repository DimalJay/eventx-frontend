import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import HelpTooltip from "../widgets/HelpTooltip";
import Dialog from "../widgets/Dialog";

const agendaSchema = z.object({
  task: z.string().min(1, "Task title is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().min(1, "Task location is required"),
});

type AgendaFormValues = z.infer<typeof agendaSchema>;

const formatTimeTo12Hour = (time24: string) => {
  if (!time24) return "";
  const [hoursStr, minutesStr] = time24.split(":");
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr;
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  return `${formattedHours}:${minutes} ${ampm}`;
};

export default function AddEventAgendaItem({
  setOpen,
  onAdd
}: {
  setOpen: (open: boolean) => void;
  onAdd: (data: any) => void;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<AgendaFormValues>({
    resolver: zodResolver(agendaSchema)
  });

  const onSubmit = (data: AgendaFormValues) => {
    const timeRange = `${formatTimeTo12Hour(data.startTime)} - ${formatTimeTo12Hour(data.endTime)}`;
    onAdd({
      task: data.task,
      time: timeRange,
      location: data.location,
    });
  };

  return (
    <Dialog
      open
      eyebrow="Create Schedule"
      title="Add Agenda Item"
      description="Fill in the details below to add a new agenda item to the event."
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-5 space-y-4">
          <label className="grid gap-2 text-sm font-semibold text-zinc-900">
            Title
            <input type="text" required placeholder="e.g. Opening Keynote Speech" className="h-11 rounded-xl border border-zinc-200 px-4 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-primary/60 focus:ring-primary/20" {...register("task")} />
          </label>

          {/* Time Picker Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <label className="grid gap-2 text-sm font-semibold text-zinc-900">
              Start Time
              <input type="time" required className="h-11 rounded-xl border border-zinc-200 px-4 text-sm text-zinc-900 outline-none transition focus:border-primary/60 focus:ring-primary/20" {...register("startTime")} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-zinc-900">
              End Time
              <input type="time" required className="h-11 rounded-xl border border-zinc-200 px-4 text-sm text-zinc-900 outline-none transition focus:border-primary/60 focus:ring-primary/20" {...register("endTime")} />
            </label>
          </div>

          <div className="grid gap-2 text-sm font-semibold text-zinc-900">
            <label htmlFor="agenda-location" className="flex items-center gap-1.5">
              Location
              <HelpTooltip text="The room, hall, or venue for this agenda slot. Leave a note for attendees if it differs from the main event venue." side="bottom" />
            </label>
            <input id="agenda-location" type="text" required placeholder="e.g. Main Auditorium" className="h-11 rounded-xl border border-zinc-200 px-4 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-primary/60 focus:ring-primary/20" {...register("location")} />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900" onClick={() => setOpen(false)}>Cancel</button>
          <button type="submit" className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary/90">Add Item</button>
        </div>
      </form>
    </Dialog>
  );
}
