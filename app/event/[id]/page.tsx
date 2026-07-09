import EventViewPage from "@/components/pages/EventViewPage";

export default async function ViewEvent({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <EventViewPage id={id} />;
}
