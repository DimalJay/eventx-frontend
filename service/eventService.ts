import { request } from "@/lib/request";
import { Response } from "./types";


// POST request to create an event
export const createEventRequest = async (form: FormData) => {
  const res: Response = await request("/event", {
    method: "POST",
    data: form,
  });
  return res;
};

// GET request to fetch events (for HomePage)
export const getEvents = async () => {
  const res: Response = await request("/events", {
    method: "GET",
  });
  return res;
};

// GET request to fetch public events (for DiscoverEvents page)
export const getPublicEvents = async () => {
  const res: Response = await request("/discover-events", {
    method: "GET",
  });
  return res;
};

export const getEventById = async (eventId: string) => {
  const res: Response = await request('/event', {
    method: 'GET',
    params: { id: eventId },
  });
  return res;
}

export const updateEventRequest = async (eventId: string, data: any ) => { 
  const res: Response = await request('/event', {
    method: 'PUT',
    data: { id: eventId, ...data },
  });
  return res;
}