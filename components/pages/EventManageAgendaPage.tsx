"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    getAgendaRequest,
    createAgendaRequest,
    updateAgendaRequest,
    deleteAgendaRequest
} from "@/service/agendaService";
import { IAgendaItem } from "@/service/types";

export default function EventManageAgendaPage() {
    const { id: eventId } = useParams();
    const queryClient = useQueryClient();
    const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalItem, setEditModalItem] = useState<IAgendaItem | null>(null);
    const [deleteConfirmItem, setDeleteConfirmItem] = useState<IAgendaItem | null>(null);

    // Form states for Add/Edit
    const [taskInput, setTaskInput] = useState("");
    const [timeInput, setTimeInput] = useState("");
    const [locationInput, setLocationInput] = useState("");

    // 1. Fetching Agenda Items
    const { data: agendaItems = [], isLoading, isError } = useQuery<IAgendaItem[]>({
        queryKey: ["agenda", eventId],
        queryFn: () => getAgendaRequest(eventId as string),
        enabled: !!eventId,
    });

    // 2. Add Mutation
    const addMutation = useMutation({
        mutationFn: (newItem: Omit<IAgendaItem, "id" | "eventId">) =>
            createAgendaRequest(eventId as string, newItem),
        onSuccess: () => {
            toast.success("Agenda item added successfully.");
            queryClient.invalidateQueries({ queryKey: ["agenda", eventId] });
            setAddModalOpen(false);
        },
        onError: (error: any) => {
            const msg = error?.message || "Failed to add agenda item.";
            toast.error(msg);
        }
    });

    // 3. Edit Mutation
    const editMutation = useMutation({
        mutationFn: ({ itemId, updatedData }: { itemId: string; updatedData: Partial<IAgendaItem> }) =>
            updateAgendaRequest(eventId as string, itemId, updatedData),
        onSuccess: () => {
            toast.success("Agenda item updated successfully.");
            queryClient.invalidateQueries({ queryKey: ["agenda", eventId] });
            setEditModalItem(null);
        },
        onError: (error: any) => {
            const msg = error?.message || "Failed to update agenda item.";
            toast.error(msg);
        }
    });

    // 4. Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: (itemId: string) => deleteAgendaRequest(eventId as string, itemId),
        onSuccess: () => {
            toast.success("Agenda item deleted successfully.");
            queryClient.invalidateQueries({ queryKey: ["agenda", eventId] });
            setDeleteConfirmItem(null);
        },
        onError: (error: any) => {
            const msg = error?.message || "Failed to delete agenda item.";
            toast.error(msg);
        }
    });

    const handleAddOpen = () => {
        setTaskInput("");
        setTimeInput("");
        setLocationInput("");
        setAddModalOpen(true);
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskInput || !timeInput || !locationInput) return;

        addMutation.mutate({
            task: taskInput,
            time: timeInput,
            location: locationInput,
        });
    };

    const handleEditOpen = (item: IAgendaItem) => {
        setMenuOpenFor(null);
        setEditModalItem(item);
        setTaskInput(item.task);
        setTimeInput(item.time);
        setLocationInput(item.location);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editModalItem || !taskInput || !timeInput || !locationInput) return;

        editMutation.mutate({
            itemId: editModalItem.id,
            updatedData: {
                task: taskInput,
                time: timeInput,
                location: locationInput,
            }
        });
    };

    const handleDeleteConfirm = () => {
        if (!deleteConfirmItem) return;
        deleteMutation.mutate(deleteConfirmItem.id);
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
                    ) : isError ? (
                        <div className="text-center py-12 rounded-2xl border border-dashed border-rose-200 bg-rose-50/50">
                            <p className="text-sm text-rose-600 font-medium">Failed to load agenda items. Please try again.</p>
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
                                    {/* Clock Icon */}
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
                                            {/* Location Pin Icon */}
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
                                        onClick={() =>
                                            setMenuOpenFor((current) =>
                                                current === item.id ? null : item.id
                                            )
                                        }
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/15 text-lg font-semibold text-black transition hover:border-black/40"
                                    >
                                        ...
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

            {/* Add Agenda Item Modal */}
            {addModalOpen ? (
                <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4">
                    <form onSubmit={handleAddSubmit} className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                            Create Schedule
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-black">
                            Add Agenda Item
                        </h3>
                        <p className="mt-2 text-sm text-black/60">
                            Fill in the details below to add a new agenda item to the event.
                        </p>

                        <div className="mt-5 space-y-4">
                            <label className="grid gap-2 text-sm font-semibold text-black">
                                Task / Title
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Opening Keynote Speech"
                                    value={taskInput}
                                    onChange={(e) => setTaskInput(e.target.value)}
                                    className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
                                />
                            </label>

                            <label className="grid gap-2 text-sm font-semibold text-black">
                                Time
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. 09:00 AM - 10:00 AM"
                                    value={timeInput}
                                    onChange={(e) => setTimeInput(e.target.value)}
                                    className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
                                />
                            </label>

                            <label className="grid gap-2 text-sm font-semibold text-black">
                                Location
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Main Auditorium"
                                    value={locationInput}
                                    onChange={(e) => setLocationInput(e.target.value)}
                                    className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
                                />
                            </label>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
                                onClick={() => setAddModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={addMutation.isPending}
                                className="inline-flex h-10 items-center justify-center rounded-full bg-black px-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {addMutation.isPending ? "Adding..." : "Add Item"}
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}

            {/* Edit Agenda Item Modal */}
            {editModalItem ? (
                <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4">
                    <form onSubmit={handleEditSubmit} className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                            Update Schedule
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-black">
                            Edit Agenda Item
                        </h3>
                        <p className="mt-2 text-sm text-black/60">
                            Modify the details of this agenda item.
                        </p>

                        <div className="mt-5 space-y-4">
                            <label className="grid gap-2 text-sm font-semibold text-black">
                                Task / Title
                                <input
                                    type="text"
                                    required
                                    value={taskInput}
                                    onChange={(e) => setTaskInput(e.target.value)}
                                    className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
                                />
                            </label>

                            <label className="grid gap-2 text-sm font-semibold text-black">
                                Time
                                <input
                                    type="text"
                                    required
                                    value={timeInput}
                                    onChange={(e) => setTimeInput(e.target.value)}
                                    className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
                                />
                            </label>

                            <label className="grid gap-2 text-sm font-semibold text-black">
                                Location
                                <input
                                    type="text"
                                    required
                                    value={locationInput}
                                    onChange={(e) => setLocationInput(e.target.value)}
                                    className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-base text-black outline-none transition focus:border-black/40"
                                />
                            </label>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
                                onClick={() => setEditModalItem(null)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={editMutation.isPending}
                                className="inline-flex h-10 items-center justify-center rounded-full bg-black px-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {editMutation.isPending ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}

            {/* Delete Confirmation Modal */}
            {deleteConfirmItem ? (
                <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4">
                    <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                            Remove Item
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-black">
                            Delete Agenda Item?
                        </h3>
                        <p className="mt-2 text-sm text-black/60">
                            Are you sure you want to delete &quot;{deleteConfirmItem.task}&quot;? This action cannot be undone.
                        </p>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
                                onClick={() => setDeleteConfirmItem(null)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={deleteMutation.isPending}
                                className="inline-flex h-10 items-center justify-center rounded-full border border-rose-200 px-4 text-xs font-semibold uppercase tracking-widest text-rose-700 transition hover:border-rose-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleDeleteConfirm}
                            >
                                {deleteMutation.isPending ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
