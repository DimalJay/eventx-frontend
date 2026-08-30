import { request } from "@/lib/request";
import { Response } from "@/types";

export const getFeedbacks = async (eventId: string) => {
  const res: Response = await request("/feedbacks", {
    method: "GET",
    params: { eventId },
  });
  return res;
};

export const completeFeedback = async (data: {
  eventId: string;
  participantId: string;
  organizationRating: number;
  contentRating: number;
  experienceRating?: number;
  comment: string;
  token: string;
}) => {
  const res: Response = await request("/feedback/complete", {
    method: "PUT",
    data,
  });
  return res;
};

export const sendFeedbackEmails = async (eventId: string) => {
  const res: Response = await request("/feedback/send", {
    method: "POST",
    data: { eventId },
  });
  return res;
};
