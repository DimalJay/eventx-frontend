'use client';
import EventManageOverviewPage from "@/components/pages/EventManageOverviewPage";
import { useParams } from "next/navigation";

export default function OverviewBody() {
     const { id } = useParams();
    return <EventManageOverviewPage id={id as string} />
}
