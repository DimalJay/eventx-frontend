"use client";

import { createContext, useContext } from "react";

export type EventRole = "ORGANIZER" | "COORDINATOR" | "MEMBER";

type EventManageContextValue = {
  role: EventRole;
  eventId: string;
};

const EventManageContext = createContext<EventManageContextValue | undefined>(undefined);

export const EventManageProvider = EventManageContext.Provider;

export function useEventRole(): EventManageContextValue {
  const context = useContext(EventManageContext);
  if (!context) {
    throw new Error("useEventRole must be used within an EventManageProvider.");
  }
  return context;
}

export function useIsOrganizer(): boolean {
  return useEventRole().role === "ORGANIZER";
}

export function useCanManageEvent(): boolean {
  const { role } = useEventRole();
  return role === "ORGANIZER" || role === "COORDINATOR";
}
