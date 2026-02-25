import { api } from "@/api//client";
import type { Task } from "@/types/tasks";

export type FetchTasksParams = {
  projectId?: string | null;
  sectionId?: string | null;
  parentId?: string | null;
  isDone?: boolean;
  deadline?: string;
  userId?: string;
};

export const tasksApi = {
  fetchTasks: (params?: FetchTasksParams, signal?: AbortSignal) => {
    const query = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          query.append(key, value === null ? "null" : String(value));
        }
      });
    }

    return api.get<Task[]>(`/tasks?${query.toString()}`, { signal });
  },

  createTask: (data: Partial<Task>) => api.post<Task>("/tasks", data),

  updateInfo: (id: string, data: Partial<Task>) =>
    api.patch<Task>(`/tasks/${id}`, data),

  updateStatus: (id: string, isDone: boolean) =>
    api.patch<Task>(`/tasks/${id}`, { isDone }),

  deleteTask: (id: string) => api.delete(`/tasks/${id}`),
};
