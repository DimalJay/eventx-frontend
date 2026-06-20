'use client';
import EventViewPage from "@/components/pages/EventViewPage";
import { useParams } from 'next/navigation';

export default function ViewEvent() {
    const { id: eventId } = useParams();
    return <EventViewPage id={eventId as string} />
}
