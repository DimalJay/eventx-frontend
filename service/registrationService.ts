import { request } from "@/lib/request";
import { Response, ITicketDetails } from "@/types";

export const getTicketDetails = async (code: string) => {
  const res: Response<ITicketDetails> = await request("/ticket", {
    method: "GET",
    params: { code },
  });
  return res;
};

export const getEventRegistrations = async ({ data: { eventId } }: { data: { eventId: string } }) => {
  const res: Response = await request("/registrations", {
    method: "GET",
    params: { eventId },
  });
  return res;
};

export const updateRegistrationStatus = async (id: string, status: string) => {
  const res: Response = await request("/registration/status", {
    method: "PUT",
    data: { id, status },
  });
  return res;
};

export const registerForEvent = async (data: { eventId: string; email: string; firstName: string; lastName: string }) => {
  const res: Response = await request("/join-event", {
    method: "POST",
    data,
  });
  return res;
};

export const checkInRegistration = async (id: string) => {
  const res: Response = await request("/registration/scan", {
    method: "POST",
    data: { ticketCode: id },
  });
  return res;
};

export const sendInvitationsRequest = async (data: { eventId: string; role: string; emails: string[] }) => {
  const res: Response = await request("/invitation/send", {
    method: "POST",
    data,
  });
  return res;
};