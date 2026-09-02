'use client'
import EventHeader from "@/components/widgets/events/EventHeader";
import TabView, { TabItem } from "@/components/widgets/TabView";
import ShaderBackground from "@/components/landing/ShaderBackground";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { canManageEventRequest } from "@/service/eventService";
import { decodeEventId, encodeEventId } from "@/lib/utils";

export default function ManageLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    const { id } = useParams();
    const eventId = decodeEventId(id as string);
    const router = useRouter();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['can-manage', eventId],
        queryFn: () => canManageEventRequest(eventId),
        enabled: !!eventId,
        retry: false,
    });

    const canManage = data?.data?.canManage === true;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [eventId]);

    useEffect(() => {
        if (eventId && !isLoading && (isError || !canManage)) {
            router.replace("/404");
        }
    }, [eventId, isLoading, isError, canManage, router]);

    if (!eventId) {
        router.push("/404");
        return null;
    }

    if (isLoading) {
        return (
            <main className="relative flex flex-1 justify-center overflow-hidden bg-white">
                <ShaderBackground />
                <div className="relative z-10 flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:py-20">
                    <EventHeader id={eventId} />
                    <div className="flex animate-pulse flex-col gap-6">
                        {[0, 1, 2, 3].map((i) => (
                            <div key={i} className="h-24 rounded-2xl bg-zinc-100" />
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    if (isError || !canManage) {
        return null;
    }

    return (
        <main className="relative flex flex-1 justify-center overflow-hidden bg-white">
            <ShaderBackground />
            <div className="relative z-10 flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:py-20">
                <EventHeader id={eventId} />
                <TabView defaultPage="overview">
                    <TabItem url={`/event/manage/${encodeEventId(eventId)}/overview`} name="overview" >Overview</TabItem>
                    <TabItem url={`/event/manage/${encodeEventId(eventId)}/registration`} name="registration" >Registration</TabItem>
                    <TabItem url={`/event/manage/${encodeEventId(eventId)}/agenda`} name="agenda" >Agenda</TabItem>
                    <TabItem url={`/event/manage/${encodeEventId(eventId)}/team`} name="team" >Team</TabItem>
                    <TabItem url={`/event/manage/${encodeEventId(eventId)}/tasks`} name="tasks" >Tasks</TabItem>
                    <TabItem url={`/event/manage/${encodeEventId(eventId)}/feedbacks`} name="feedbacks" >Feedbacks</TabItem>
                    <TabItem url={`/event/manage/${encodeEventId(eventId)}/insights`} name="insights" >Insights</TabItem>
                    <TabItem url={`/event/manage/${encodeEventId(eventId)}/settings`} name="settings" >Settings</TabItem>
                </TabView>
                {children}
            </div>
        </main>
    );
}