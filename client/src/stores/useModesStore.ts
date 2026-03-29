import { create } from "zustand";
import { useTaskListStore } from "./useTaskListStore";
import type { TaskMode } from "@/types/navigation";
import { useSelectionStore } from "./useSelectionStore";
import { getModeFromPath } from "@/utils/navigation";

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

    set({ showDone: val });
  },
}));
