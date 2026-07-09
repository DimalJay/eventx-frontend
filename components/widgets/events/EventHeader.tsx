'use client';
import Link from "next/link";
import Logo from "../Logo";
import { useQuery } from "@tanstack/react-query";
import { getEventById } from "@/service/eventService";

interface EventHeaderProps {
    id: string | string[] | undefined;
}

export default function EventHeader({ id }: EventHeaderProps) {
    const eventId = id as string;

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
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/50">
                            EventX live dashboard
                        </p>
                        <p className="text-2xl font-semibold tracking-tight text-black">
                            {event ? event.title : "Loading..."}
                        </p>
                    </div>
                </div>
                <Link href={`/event/${eventId}`} className="btn">
                    View Event
                </Link>
            </div>
        </header>
    )
}
