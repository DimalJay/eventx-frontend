'use client'
import EventHeader from "@/components/widgets/events/EventHeader";
import TabView, { TabItem } from "@/components/widgets/TabView";
import { useParams, useRouter } from "next/navigation";

export default function ManageLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    const { id } = useParams();
    const eventId = id as string;
    const router = useRouter();
    if(!eventId) {
        // fall 404 page
        router.push("/404");
    }

    return (
        <main className="relative flex flex-1 justify-center overflow-hidden bg-[#f5f1ea]">
            <div className="pointer-events-none absolute -left-24 top-10 h-52 w-52 rounded-full bg-[#ffc9a7] opacity-35 blur-3xl" />
            <div className="pointer-events-none absolute right-8 top-16 h-64 w-64 rounded-full bg-[#9fd3ff] opacity-35 blur-3xl" />
            <div className="pointer-events-none absolute bottom-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#ffe8a3] opacity-40 blur-3xl" />
            <div className="relative flex w-full max-w-6xl flex-col gap-10 px-8 py-16 sm:px-12 text-black">
                <EventHeader id={eventId} />
                <TabView defaultPage="overview">
                    <TabItem url={`/event/manage/${eventId}/overview`} name="overview" >Overview</TabItem>
                    <TabItem url={`/event/manage/${eventId}/registration`} name="registration" >Registration</TabItem>
                    <TabItem url={`/event/manage/${eventId}/agenda`} name="agenda" >Agenda</TabItem>
                    <TabItem url={`/event/manage/${eventId}/team`} name="team" >Team</TabItem>
                    <TabItem url={`/event/manage/${eventId}/tasks`} name="tasks" >Tasks</TabItem>
                    <TabItem url={`/event/manage/${eventId}/insights`} name="insights" >Insights</TabItem>
                </TabView>
                {children}
            </div>
        </main>
    );
}
