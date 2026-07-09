import { request } from "@/lib/request";
import { Response } from "./types";

export const getTeamMembers = async (data: { eventId: string }) => {
  const res: Response = await request("/team-access", {
    method: "GET",
    params: {
      eventId: data.eventId,
    },
  });
  return res;
};