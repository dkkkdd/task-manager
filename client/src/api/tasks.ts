import { api } from "@/api/client";
import type { Task } from "@/types/tasks";

export type FetchTasksParams = {
  projectId?: string | null;
  mode: string;
  showDone?: boolean;
};

export const tasksApi = {
  fetchTasks: (params?: FetchTasksParams, signal?: AbortSignal) => {
    const query = new URLSearchParams();

    if (params) {
      if (params.mode) query.append("mode", params.mode);
      if (params.projectId) query.append("projectId", params.projectId);
      if (params.showDone !== undefined) {
        query.append("showDone", String(params.showDone));
      }
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
