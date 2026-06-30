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

// Cover image upload request (Issue #58)
export const uploadEventCoverRequest = async (file: File) => {
  const formData = new FormData();
  formData.append("cover", file);

  const res: Response = await request("/events/upload-cover", {
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
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

// Get Event details
export const getEventById = async (eventId: String) => {
  const res: Response = await request("/event", {
    method: "GET",
    params: {
      id: eventId
    }
  });
  return res;
};

// Update Event details
export const updateEventRequest = async (data: any) => {
  const res: Response = await request("/event", {
    method: "PUT",
    data: data,
  });
  return res;
};
