import { request } from "@/lib/request";
import { Response } from "./types";

export interface CreateEventInput {
  title: string;
  eventCategory: string;
  description?: string;
  startDate: string; // YYYY-MM-DD HH:MM:SS
  endDate: string;   // YYYY-MM-DD HH:MM:SS
  location?: string;
  organizerId?: number;
  imageUrl?: string;
  isPublic: boolean;
  capacity: number;
  ticketPrice: number;
  registrationDeadline?: string; // YYYY-MM-DD HH:MM:SS
  agenda?: string;
  waitlistEnabled?: boolean;
  isPaid?: boolean;
}

// POST request to create an event
export const createEventRequest = async (data: CreateEventInput) => {
  const res: Response = await request("/events", {
    method: "POST",
    data,
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
