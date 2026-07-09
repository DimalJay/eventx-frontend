'use client'
import EventHeader from "@/components/widgets/events/EventHeader";
import TabView, { TabItem } from "@/components/widgets/TabView";
import { useParams } from "next/navigation";

export default function ManageLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    const { id } = useParams();

    return (
        <main className="relative flex flex-1 justify-center overflow-hidden bg-[#f5f1ea]">
            <div className="pointer-events-none absolute -left-24 top-10 h-52 w-52 rounded-full bg-[#ffc9a7] opacity-35 blur-3xl" />
            <div className="pointer-events-none absolute right-8 top-16 h-64 w-64 rounded-full bg-[#9fd3ff] opacity-35 blur-3xl" />
            <div className="pointer-events-none absolute bottom-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#ffe8a3] opacity-40 blur-3xl" />
            <div className="relative flex w-full max-w-6xl flex-col gap-10 px-8 py-16 sm:px-12 text-black">
                <EventHeader id={id} />
                <TabView defaultPage="overview">
                    <TabItem url={`/event/manage/${id}/overview`} name="overview" >Overview</TabItem>
                    <TabItem url={`/event/manage/${id}/registration`} name="registration" >Registration</TabItem>
                    <TabItem url={`/event/manage/${id}/team`} name="team" >Team</TabItem>
                    <TabItem url={`/event/manage/${id}/tasks`} name="tasks" >Tasks</TabItem>
                    <TabItem url={`/event/manage/${id}/insights`} name="insights" >Insights</TabItem>
                    <TabItem url={`/event/manage/${id}/agenda`} name="agenda" >Agenda</TabItem>
                </TabView>
                {children}
            </div>
        </main>
    );
}
