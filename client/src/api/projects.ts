import { api } from "@/api/client";
import type { Project } from "@/types/project";

export const projectsApi = {
  fetchProjects: (signal?: AbortSignal) =>
    api.get<Project[]>("/projects", { signal }),

  createProject: (data: { title: string; color: string; favorites: boolean }) =>
    api.post<Project>("/projects", data),

  updateProject: (id: string, data: Partial<Project>) =>
    api.patch<Project>(`/projects/${id}`, data),

  deleteProject: (id: string) => api.delete(`/projects/${id}`),
};
