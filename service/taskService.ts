import { request } from "@/lib/request";
import { Response } from "./types";

// create task request
export const createTaskRequest = async (data: any) => {
  const res: Response = await request("/task", {
    method: "POST",
    data: {
      eventId: data.eventId,
      title: data.title,
      description: data.description,
      assignedTo: data.assignedTo,
      assignedBy: data.assignedBy,
      dueDate: data.dueDate,
    },
  });
  return res;
};

// get tasks request
export const getTasksRequest = async (data: { eventId: string }) => {
  const res: Response = await request("/tasks", {
    method: "GET",
    params: {
      eventId: data.eventId,
    },
  });
  return res;
};

// update task request
export const updateTaskRequest = async (id: string, data: any) => {
  const res: Response = await request('/task', {
    method: "PUT",
    data: {
      id: id,
      title: data.title,
      description: data.description,
      assignedTo: data.assignedTo,
      assignedBy: data.assignedBy,
      dueDate: data.dueDate,
    },
  });
  return res;
};

export const updateTaskStatusRequest = async (id: string, status: string) => {
  const res: Response = await request('/task/status', {
    method: "PUT",
    data: {
      id: id,
      status: status,
    },
  });
  return res;
};

// delete task request
export const deleteTaskRequest = async (id: string) => {
  const res: Response = await request(`/tasks/${id}`, {
    method: "DELETE",
  });
  return res;
};  