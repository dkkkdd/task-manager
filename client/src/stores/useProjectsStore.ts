import { create } from "zustand";
import type { Project } from "@/types/project";
import { projectsApi } from "@/api/projects";

interface ProjectsStore {
  projects: Project[];
  loading: boolean;

  fetchProjects: () => Promise<void>;
  createProject: (
    title: string,
    color: string,
    favorites: boolean,
  ) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  toggleFavorite: (id: string, favorites: boolean) => Promise<void>;
}

export const useProjectsStore = create<ProjectsStore>((set, get) => ({
  projects: [],
  loading: false,

  fetchProjects: async () => {
    if (get().projects.length) return;

    set({ loading: true });

    try {
      const projects = await projectsApi.fetchProjects();
      set({ projects });
    } finally {
      set({ loading: false });
    }
  },

  createProject: async (title, color, favorites) => {
    const temp: Project = {
      id: "temp-" + Date.now(),
      title,
      color,
      favorites,
      order: get().projects.length + 1,
    };

    set((s) => ({ projects: [...s.projects, temp] }));

    try {
      const real = await projectsApi.createProject({ title, color, favorites });

      set((s) => ({
        projects: s.projects.map((p) => (p.id === temp.id ? real : p)),
      }));

      return real;
    } catch {
      set((s) => ({
        projects: s.projects.filter((p) => p.id !== temp.id),
      }));
      return null;
    }
  },

  deleteProject: async (id) => {
    const snapshot = get().projects;

    set((s) => ({
      projects: s.projects.filter((p) => p.id !== id),
    }));

    try {
      await projectsApi.deleteProject(id);
    } catch {
      set({ projects: snapshot });
    }
  },

  toggleFavorite: async (id, favorites) => {
    const snapshot = get().projects;

    set((s) => ({
      projects: s.projects.map((p) => (p.id === id ? { ...p, favorites } : p)),
    }));

    try {
      await projectsApi.updateProject(id, { favorites });
    } catch {
      set({ projects: snapshot });
    }
  },

  updateProject: async (id, data) => {
    const snapshot = get().projects;

    set((s) => ({
      projects: s.projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
    }));

    try {
      await projectsApi.updateProject(id, data);
    } catch {
      set({ projects: snapshot });
    }
  },
}));
