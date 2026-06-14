import { request } from "@/lib/request";
import { Response } from "./types";

// create task request
export const createTaskRequest = async (data: any) => {
  const res: Response = await request("/tasks", {
    method: "POST",
    data: {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
    },
  });
  return res;
};

// get tasks request
export const getTasksRequest = async () => {
  const res: Response = await request("/tasks", {
    method: "GET",
  });
  return res;
};

// update task request
export const updateTaskRequest = async (id: string, data: any) => {
  const res: Response = await request(`/tasks/${id}`, {
    method: "PUT",
    data: {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
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