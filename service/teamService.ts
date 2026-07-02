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

export const addTeamMember = async (data: { eventId: string; email: string; role: string }) => {
  const res: Response = await request("/team-access", {
    method: "POST",
    data: {
      eventId: data.eventId,
      email: data.email,
      role: data.role,
    },
  });
  return res;
};

export const updateTeamMemberRole = async (data: { id: number; role: string }) => {
  const res: Response = await request("/team-access", {
    method: "PUT",
    data: {
      id: data.id,
      role: data.role,
    },
  });
  return res;
};

export const removeTeamMember = async (data: { id: number }) => {
  const res: Response = await request("/team-access", {
    method: "DELETE",
    data: {
      id: data.id,
    },
  });
  return res;
};

