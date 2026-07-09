"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IEvent } from "@/service/types";
import { getEventById, updateEventRequest } from "@/service/eventService";
import AddEventAgendaItem from "../dialog/AddEventAgendaItem";
import EditEventAgendaItem from "../dialog/EditEventAgendaItem";
import DeleteEventAgendaItem from "../dialog/DeleteEventAgendaItem";
import { EllipsisVertical } from "lucide-react";


export default function EventManageAgendaPage() {
    const params = useParams();
    const eventId = params.id as string;
    const queryClient = useQueryClient();

    // Get Event Data
    const { data: event = null, isLoading } = useQuery({
        queryKey: ['event', eventId],
        queryFn: async () => {
            try {
                const response = await getEventById(eventId);
                return response.data as IEvent;
            } catch (error) {
                return null;
            }
        },
        retry: false,
    });

    const [agendaItems, setAgendaItems] = useState<any[]>([]);

    useEffect(() => {
        if (event && event.agenda) {
            try {
                setAgendaItems(JSON.parse(event.agenda));
            } catch (e) {
                setAgendaItems([]);
            }
        }
    }, [event]);

    const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalItem, setEditModalItem] = useState<any | null>(null);
    const [deleteConfirmItem, setDeleteConfirmItem] = useState<any | null>(null);

    const updateEventMutation = useMutation({
        mutationFn: (updatedAgendaArray: any[]) => {
            const agendaString = JSON.stringify(updatedAgendaArray);
            return updateEventRequest(eventId, { agenda: agendaString });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['event', eventId] });
            setAddModalOpen(false);
            setEditModalItem(null);
            setDeleteConfirmItem(null);
        },
        onError: () => {
            toast.error("Failed to update agenda!");
        }
    });

    const handleAddOpen = () => setAddModalOpen(true);

    const handleAddAgenda = (newItem: any) => {
        newItem.id = Date.now().toString();
        const newAgenda = [...agendaItems, newItem];
        setAgendaItems(newAgenda);
        toast.promise(updateEventMutation.mutateAsync(newAgenda), {
            loading: "Adding agenda item...",
            success: "Agenda item added successfully!",
            error: "Failed to add item"
        });
    };

    const handleEditOpen = (item: any) => {
        setMenuOpenFor(null);
        setEditModalItem(item);
    };

    const handleEditAgenda = (updatedItem: any) => {
        const newAgenda = agendaItems.map(item => item.id === updatedItem.id ? updatedItem : item);
        setAgendaItems(newAgenda);
        toast.promise(updateEventMutation.mutateAsync(newAgenda), {
            loading: "Updating agenda item...",
            success: "Agenda item updated successfully!",
            error: "Failed to update item"
        });
    };

    const handleDelete = async () => {
        if (!deleteConfirmItem) return;
        const newAgenda = agendaItems.filter(item => item.id !== deleteConfirmItem.id);
        setAgendaItems(newAgenda);
        toast.promise(updateEventMutation.mutateAsync(newAgenda), {
            loading: "Deleting agenda item...",
            success: "Agenda item deleted successfully!",
            error: "Failed to delete item"
        });
    };

    return (
        <>
            <section className="rounded-3xl border border-black/10 bg-white/85 p-7 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.35)] backdrop-blur">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                            Event Schedule
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold text-black">
                            Manage Event Agenda
                        </h2>
                    </div>
                    <button
                        type="button"
                        className="inline-flex h-11 items-center justify-center rounded-full bg-black px-5 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/90"
                        onClick={handleAddOpen}
                    >
                        Add Agenda Item
                    </button>
                </div>

                <div className="mt-6 grid gap-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-black/10 border-t-black" />
                            <p className="text-sm text-black/50 font-medium">Loading agenda...</p>
                        </div>
                    ) : agendaItems.length === 0 ? (
                        <div className="text-center py-12 rounded-2xl border border-dashed border-black/10 bg-white/50">
                            <p className="text-sm text-black/50">No agenda items added yet. Click &quot;Add Agenda Item&quot; to get started.</p>
                        </div>
                    ) : (
                        agendaItems.map((item) => (
                            <div
                                key={item.id}
                                className="grid gap-4 rounded-2xl border border-black/10 bg-white px-5 py-4 sm:grid-cols-[1.4fr_auto] sm:items-center hover:shadow-md transition duration-200"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-black/5 text-black mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-black/70">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-black/40">
                                            {item.time}
                                        </p>
                                        <h3 className="text-base font-bold text-black leading-tight">
                                            {item.task}
                                        </h3>
                                        <p className="flex items-center gap-1.5 text-sm text-black/60">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-black/50 shrink-0">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                            </svg>
                                            {item.location}
                                        </p>
                                    </div>
                                </div>
                                <div className="relative flex flex-wrap gap-2 justify-end sm:justify-start">
                                    <button
                                        type="button"
                                        aria-haspopup="menu"
                                        aria-expanded={menuOpenFor === item.id}
                                        onClick={() => setMenuOpenFor((current) => current === item.id ? null : item.id)}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/15 text-lg font-semibold text-black transition hover:border-black/40"
                                    >
                                        <EllipsisVertical/>
                                    </button>
                                    {menuOpenFor === item.id ? (
                                        <div className="absolute right-0 top-11 z-10 w-40 rounded-2xl border border-black/10 bg-white p-2 shadow-[0_20px_40px_-30px_rgba(0,0,0,0.35)]">
                                            <button
                                                type="button"
                                                className="flex w-full items-center justify-start rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-black/5"
                                                onClick={() => handleEditOpen(item)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="flex w-full items-center justify-start rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-widest text-rose-700 transition hover:bg-rose-50"
                                                onClick={() => {
                                                    setMenuOpenFor(null);
                                                    setDeleteConfirmItem(item);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {addModalOpen ? (
                <AddEventAgendaItem setOpen={setAddModalOpen} onAdd={handleAddAgenda} />
            ) : null}

            {editModalItem ? (
                <EditEventAgendaItem setOpen={(open) => !open && setEditModalItem(null)} item={editModalItem} onEdit={handleEditAgenda} />
            ) : null}

            {deleteConfirmItem ? (
                <DeleteEventAgendaItem
                    setOpen={() => setDeleteConfirmItem(null)}
                    item={deleteConfirmItem}
                    onDelete={handleDelete}
                    isPending={updateEventMutation.isPending}
                />
            ) : null}
        </>
    );
}
