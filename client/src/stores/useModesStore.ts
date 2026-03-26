import { create } from "zustand";
import { useTaskListStore } from "./useTaskListStore";
import type { TaskMode } from "@/types/navigation";
import { useSelectionStore } from "./useSelectionStore";

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

interface ModeStore {
  mode: TaskMode;
  selectedProjectId: string | null;

  showDone: boolean;
  openProject: (id: string) => void;
  setMode: (mode: TaskMode, projectId?: string) => void;
  setSelectedProjectId: (id: string | null) => void;
  setShowDone: (val: boolean) => void;
}

export const useModeStore = create<ModeStore>((set, get) => ({
  ...getModeFromPath(),
  showDone: localStorage.getItem("showDone") === "true",

  setMode: (newMode, projectId) => {
    const current = get();
    const nextProjectId = projectId ?? null;

    if (
      current.mode === newMode &&
      current.selectedProjectId === nextProjectId
    ) {
      return;
    }

    useTaskListStore.getState().resetForms();
    useSelectionStore.getState().clearSelection();

    set({ mode: newMode, selectedProjectId: nextProjectId });
  },

  openProject: (id) => {
    const current = get();

    if (current.mode === "project" && current.selectedProjectId === id) {
      return;
    }

    useTaskListStore.getState().resetForms();
    set({ mode: "project", selectedProjectId: id });
  },

  setSelectedProjectId: (id) => {
    if (get().selectedProjectId === id) return;
    useTaskListStore.getState().resetForms();
    set({ selectedProjectId: id });
  },

  setShowDone: (val) => {
    localStorage.setItem("showDone", String(val));
    //   if (!val) {

    //   useTaskListStore.setState((state) => {
    //     const newCache = { ...state.tasksCache };
    //     Object.keys(newCache).forEach(key => {
    //       newCache[key] = newCache[key].filter(t => !t.completed);
    //     });
    //     return { tasksCache: newCache };
    //   });
    // }
    set({ showDone: val });
  },
}));
