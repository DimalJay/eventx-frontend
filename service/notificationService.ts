import { request } from "@/lib/request";
import type { NotificationsResponse, MarkReadRequest, MarkReadResponse } from "@/types/notifications";

export const getNotifications = async (page = 1, limit = 10) => {
  return request<NotificationsResponse>("/notifications", {
    method: "GET",
    params: { page, limit },
  });
};

export const markNotificationAsRead = async (data: MarkReadRequest) => {
  return request<MarkReadResponse>("/notification/read", {
    method: "PUT",
    data,
  });
};

export const markAllNotificationsAsRead = async () => {
  return request<MarkReadResponse>("/notifications/read-all", {
    method: "PUT",
  });
};
