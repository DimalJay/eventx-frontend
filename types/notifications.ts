export type NotificationType =
  | "General"
  | "Registration"
  | "task_assignment"
  | "task_update"
  | "team_access"
  | "team_removed"
  | "team_role_changed"
  | "team_update";

export interface INotification {
  id: number;
  title: string;
  message: string;
  userId: number;
  status: "unread" | "read";
  type: NotificationType;
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
