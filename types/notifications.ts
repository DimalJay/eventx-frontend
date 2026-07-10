export interface INotification {
  id: number;
  title: string;
  message: string;
  userId: number;
  status: "unread" | "read";
  type: string;
  createdAt: string;
  readAt: string | null;
  isRead: boolean;
  extras: Record<string, unknown> | null;
}

export interface NotificationsResponse {
  success: boolean;
  message: string;
  data: INotification[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MarkReadRequest {
  id: number;
}

export interface MarkReadResponse {
  success: boolean;
  message: string;
}
