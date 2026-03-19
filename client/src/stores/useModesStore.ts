import { create } from "zustand";
import { useTasksStore } from "./useTasksStore";

function getModeFromPath(): {
  mode: TaskMode;
  selectedProjectId: string | null;
} {
  const path = window.location.pathname;

  if (path.startsWith("/project/")) {
    return { mode: "project", selectedProjectId: path.split("/project/")[1] };
  }
  if (path === "/today") return { mode: "today", selectedProjectId: null };
  if (path === "/completed")
    return { mode: "completed", selectedProjectId: null };
  if (path === "/overdue") return { mode: "overdue", selectedProjectId: null };
  if (path === "/projects")
    return { mode: "projects", selectedProjectId: null };
  return { mode: "inbox", selectedProjectId: null };
}

export type TaskMode =
  | "project"
  | "inbox"
  | "today"
  | "completed"
  | "overdue"
  | "projects";

interface ModeStore {
  mode: TaskMode;
  selectedProjectId: string | null;

  showAll: boolean;
  openProject: (id: string) => void;
  setMode: (mode: TaskMode, projectId?: string) => void;
  setSelectedProjectId: (id: string | null) => void;
  setShowAll: (val: boolean) => void;
}

export const useModeStore = create<ModeStore>((set) => ({
  ...getModeFromPath(),

  showAll: localStorage.getItem("showAll") === "true",

  setMode: (mode) => {
    set({ mode, selectedProjectId: null });
    useTasksStore.getState().fetchTasks();
  },
  setSelectedProjectId: (id) =>
    set({
      selectedProjectId: id,
    }),

  openProject: (id) => {
    set({ mode: "project", selectedProjectId: id });
    useTasksStore.getState().fetchTasks();
  },
  setShowAll: (val) => {
    localStorage.setItem("showAll", String(val));
    set({ showAll: val });
  },
}));
