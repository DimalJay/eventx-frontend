'use client'
import EventHeader from "@/components/widgets/events/EventHeader";
import TabView, { TabItem } from "@/components/widgets/TabView";
import ShaderBackground from "@/components/landing/ShaderBackground";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { canManageEventRequest, getEventById } from "@/service/eventService";
import { getTeamMembers } from "@/service/teamService";
import { decodeEventId, encodeEventId } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthContext";
import { EventManageProvider, type EventRole } from "@/components/auth/EventManageContext";
import type { TeamMember } from "@/types/team";

export default function ManageLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    const { id } = useParams();
    const eventId = decodeEventId(id as string);
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuth();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['can-manage', eventId],
        queryFn: () => canManageEventRequest(eventId),
        enabled: !!eventId,
        retry: false,
    });

    const canManageBackend = data?.data?.canManage === true;

    const { data: backendEvent } = useQuery({
        queryKey: ['event', eventId],
        queryFn: async () => {
            const res = await getEventById(eventId);
            return res.data;
        },
        enabled: !!eventId,
    });

    const { data: teamMembers = [] } = useQuery({
        queryKey: ['team-members', eventId],
        queryFn: async () => {
            const response = await getTeamMembers({ eventId });
            return response.data as TeamMember[];
        },
        enabled: !!eventId,
        retry: false,
    });

    const role: EventRole = useMemo(() => {
        if (!user) return "MEMBER";
        if (backendEvent && String(backendEvent.organizerId) === String(user.id)) {
            return "ORGANIZER";
        }
        const member = teamMembers.find((m) => String(m.id) === String(user.id) || m.email === user.email);
        if (member && member.role === "COORDINATOR") return "COORDINATOR";
        if (member) return "MEMBER";
        return "MEMBER";
    }, [user, backendEvent, teamMembers]);

    const isOrganizer = role === "ORGANIZER";
    const isCoordinator = role === "COORDINATOR";
    const isOrganizerOrCoordinator = isOrganizer || isCoordinator;
    // The backend `can-manage` check can return false for ended events, but the
    // frontend is designed to keep ended events manageable by the organizer and
    // coordinators (view registrations, feedback, insights, etc.). Fall back to
    // the locally-derived role so ended events stay open to their owner/team.
    const canManage = canManageBackend || isOrganizer || isCoordinator;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [eventId]);

    useEffect(() => {
        if (eventId && !isLoading && (isError || !canManage)) {
            router.replace("/404");
        }
    }, [eventId, isLoading, isError, canManage, router]);

    const currentPage = pathname.split("/").filter(Boolean).pop() || "overview";

    useEffect(() => {
        if (!eventId || isLoading || !canManage) return;
        const isCoordinatorOnlyPage = ["agenda", "team", "feedbacks"].includes(currentPage);
        if (isCoordinatorOnlyPage && !isOrganizerOrCoordinator) {
            router.replace(`/event/manage/${encodeEventId(eventId)}/overview`);
        } else if (currentPage === "settings" && role !== "ORGANIZER") {
            router.replace(`/event/manage/${encodeEventId(eventId)}/overview`);
        }
    }, [eventId, isLoading, canManage, currentPage, isOrganizerOrCoordinator, role, router]);

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
        <EventManageProvider value={{ role, eventId }}>
            <main className="relative flex flex-1 justify-center overflow-hidden bg-white">
                <ShaderBackground />
                <div className="relative z-10 flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:py-20">
                    <EventHeader id={eventId} />
                    <TabView defaultPage="overview">
                        <TabItem url={`/event/manage/${encodeEventId(eventId)}/overview`} name="overview" >Overview</TabItem>
                        <TabItem url={`/event/manage/${encodeEventId(eventId)}/registration`} name="registration" >Registration</TabItem>
                        {isOrganizerOrCoordinator && (
                            <TabItem url={`/event/manage/${encodeEventId(eventId)}/agenda`} name="agenda" >Agenda</TabItem>
                        )}
                        {isOrganizerOrCoordinator && (
                            <TabItem url={`/event/manage/${encodeEventId(eventId)}/team`} name="team" >Team</TabItem>
                        )}
                        <TabItem url={`/event/manage/${encodeEventId(eventId)}/tasks`} name="tasks" >Tasks</TabItem>
                        {isOrganizerOrCoordinator && (
                            <TabItem url={`/event/manage/${encodeEventId(eventId)}/feedbacks`} name="feedbacks" >Feedbacks</TabItem>
                        )}
                        <TabItem url={`/event/manage/${encodeEventId(eventId)}/insights`} name="insights" >Insights</TabItem>
                        {role === "ORGANIZER" && (
                            <TabItem url={`/event/manage/${encodeEventId(eventId)}/settings`} name="settings" >Settings</TabItem>
                        )}
                    </TabView>
                    {children}
                </div>
            </main>
        </EventManageProvider>
    );
}
