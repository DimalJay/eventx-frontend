'use client'
import EventHeader from "@/components/widgets/events/EventHeader";
import TabView, { TabItem } from "@/components/widgets/TabView";
import ShaderBackground from "@/components/landing/ShaderBackground";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ManageLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    const { id } = useParams();
    const eventId = id as string;
    const router = useRouter();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [eventId]);

    if(!eventId) {
        // fall 404 page
        router.push("/404");
    }

    return (
        <main className="relative flex flex-1 justify-center overflow-hidden bg-white">
            <ShaderBackground />
            <div className="relative z-10 flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:py-20">
                <EventHeader id={eventId} />
                <TabView defaultPage="overview">
                    <TabItem url={`/event/manage/${eventId}/overview`} name="overview" >Overview</TabItem>
                    <TabItem url={`/event/manage/${eventId}/registration`} name="registration" >Registration</TabItem>
                    <TabItem url={`/event/manage/${eventId}/agenda`} name="agenda" >Agenda</TabItem>
                    <TabItem url={`/event/manage/${eventId}/team`} name="team" >Team</TabItem>
                    <TabItem url={`/event/manage/${eventId}/tasks`} name="tasks" >Tasks</TabItem>
                    <TabItem url={`/event/manage/${eventId}/feedbacks`} name="feedbacks" >Feedbacks</TabItem>
                    <TabItem url={`/event/manage/${eventId}/insights`} name="insights" >Insights</TabItem>
                    <TabItem url={`/event/manage/${eventId}/settings`} name="settings" >Settings</TabItem>
                </TabView>
                {children}
            </div>
        </main>
    );
}
