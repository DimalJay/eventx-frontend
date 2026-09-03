'use client';
import Link from "next/link";
import Logo from "../Logo";
import { useQuery } from "@tanstack/react-query";
import { getEventById } from "@/service/eventService";
import { decodeEventId, encodeEventId } from "@/lib/utils";

interface EventHeaderProps {
    id: string | string[] | undefined;
}

export default function EventHeader({ id }: EventHeaderProps) {
    const eventId = decodeEventId(id as string);

    const { data: event } = useQuery({
        queryKey: ['event', eventId],
        queryFn: async () => {
            if (!eventId) return null;
            const res = await getEventById(eventId);
            return res.data;
        },
        enabled: !!eventId,
    });

    return (
        <header className="">
            <div className="flex flex-row justify-between">
                <div className="flex items-center gap-3">
                    <Logo />
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                            EventX live dashboard
                        </p>
                        <p className="mt-1 font-display text-2xl font-medium tracking-tight text-zinc-900">
                            {event ? event.title : "Loading..."}
                        </p>
                    </div>
                </div>
                <Link href={`/event/${encodeEventId(eventId)}`} className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 transition hover:border-primary/50 hover:text-primary">
                    View Event
                </Link>
            </div>
        </header>
    )
}
