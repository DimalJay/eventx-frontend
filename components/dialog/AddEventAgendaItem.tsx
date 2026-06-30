import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const agendaSchema = z.object({
  task: z.string().min(1, "Task title is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().min(1, "Task location is required"),
});

type AgendaFormValues = z.infer<typeof agendaSchema>;

// 24-hour time format එක 12-hour AM/PM format එකට හැරවීම
const formatTimeTo12Hour = (time24: string) => {
  if (!time24) return "";
  const [hoursStr, minutesStr] = time24.split(":");
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr;
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 hour එක 12 කරන්න
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
    // Start Time සහ End Time එකතු කර "09:00 AM - 10:00 AM" ලෙස සකසා ගනී
    const timeRange = `${formatTimeTo12Hour(data.startTime)} - ${formatTimeTo12Hour(data.endTime)}`;
    onAdd({
      task: data.task,
      time: timeRange,
      location: data.location,
    });
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">Create Schedule</p>
        <h3 className="mt-2 text-xl font-semibold text-black">Add Agenda Item</h3>
        <p className="mt-2 text-sm text-black/60">Fill in the details below to add a new agenda item to the event.</p>

        <div className="mt-5 space-y-4">
          <label className="grid gap-2 text-sm font-semibold text-black">
            Task / Title
            <input type="text" required placeholder="e.g. Opening Keynote Speech" className="h-11 rounded-2xl border border-black/10 px-4 text-base outline-none transition focus:border-black/40" {...register("task")} />
          </label>

          {/* Time Picker Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <label className="grid gap-2 text-sm font-semibold text-black">
              Start Time
              <input type="time" required className="h-11 rounded-2xl border border-black/10 px-4 text-base outline-none transition focus:border-black/40" {...register("startTime")} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-black">
              End Time
              <input type="time" required className="h-11 rounded-2xl border border-black/10 px-4 text-base outline-none transition focus:border-black/40" {...register("endTime")} />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-black">
            Location
            <input type="text" required placeholder="e.g. Main Auditorium" className="h-11 rounded-2xl border border-black/10 px-4 text-base outline-none transition focus:border-black/40" {...register("location")} />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 px-4 text-xs font-semibold uppercase text-black" onClick={() => setOpen(false)}>Cancel</button>
          <button type="submit" className="inline-flex h-10 items-center justify-center rounded-full bg-black px-4 text-xs font-semibold uppercase text-white">Add Item</button>
        </div>
      </form>
    </div>
  );
}
