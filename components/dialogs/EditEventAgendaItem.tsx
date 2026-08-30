import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
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

const parse12HourTo24Hour = (time12: string) => {
  if (!time12) return "";
  const trimTime = time12.trim();
  const match = trimTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return "";
  let [_, hoursStr, minutes, ampm] = match;
  let hours = parseInt(hoursStr, 10);
  if (ampm.toUpperCase() === "PM" && hours < 12) {
    hours += 12;
  }
  if (ampm.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  return `${formattedHours}:${minutes}`;
};

export default function EditEventAgendaItem({
  setOpen,
  item,
  onEdit
}: {
  setOpen: (open: boolean) => void;
  item: any;
  onEdit: (data: any) => void;
}) {
  const [startPart, endPart] = (item.time || "").split("-");
  const defaultStartTime = startPart ? parse12HourTo24Hour(startPart) : "";
  const defaultEndTime = endPart ? parse12HourTo24Hour(endPart) : "";

  const { register, handleSubmit } = useForm<AgendaFormValues>({
    resolver: zodResolver(agendaSchema),
    defaultValues: {
      task: item.task,
      startTime: defaultStartTime,
      endTime: defaultEndTime,
      location: item.location
    },
  });

  const onSubmit = (data: AgendaFormValues) => {
    const timeRange = `${formatTimeTo12Hour(data.startTime)} - ${formatTimeTo12Hour(data.endTime)}`;
    onEdit({
      ...item,
      task: data.task,
      time: timeRange,
      location: data.location
    });
  };

  return (
    <Dialog
      open
      eyebrow="Update Schedule"
      title="Edit Agenda Item"
      description="Modify the details of this agenda item."
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-5 space-y-4">
          <label className="grid gap-2 text-sm font-semibold text-zinc-900">
            Task / Title
            <input type="text" required className="h-11 rounded-xl border border-zinc-200 px-4 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-primary/60 focus:ring-primary/20" {...register("task")} />
          </label>

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

          <label className="grid gap-2 text-sm font-semibold text-zinc-900">
            Location
            <input type="text" required className="h-11 rounded-xl border border-zinc-200 px-4 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-primary/60 focus:ring-primary/20" {...register("location")} />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900" onClick={() => setOpen(false)}>Cancel</button>
          <button type="submit" className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary/90">Save Changes</button>
        </div>
      </form>
    </Dialog>
  );
}
