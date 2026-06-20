import { request } from "@/lib/request";
import { IAgendaItem } from "./types";

// 1. Event එකට අදාල Agenda list එක ලබාගැනීම
export const getAgendaRequest = async (eventId: string) => {
  return await request<IAgendaItem[]>(`/events/${eventId}/agenda`, { method: "GET" });
};

// 2. අලුත් Agenda Item එකක් ඇතුලත් කිරීම
export const createAgendaRequest = async (eventId: string, data: Omit<IAgendaItem, "id" | "eventId">) => {
  return await request<IAgendaItem>(`/events/${eventId}/agenda`, { method: "POST", data });
};

// 3. Agenda Item එකක් Update කිරීම
export const updateAgendaRequest = async (eventId: string, itemId: string, data: Partial<IAgendaItem>) => {
  return await request<IAgendaItem>(`/events/${eventId}/agenda/${itemId}`, { method: "PUT", data });
};

// 4. Agenda Item එකක් Delete කිරීම
export const deleteAgendaRequest = async (eventId: string, itemId: string) => {
  return await request(`/events/${eventId}/agenda/${itemId}`, { method: "DELETE" });
};
