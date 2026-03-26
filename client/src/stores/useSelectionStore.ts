import { create } from "zustand";
import { useTasksStore } from "./useTasksStore";

interface SelectionStore {
  selectionMode: boolean;
  selectedIds: Set<string>;
  total: number;

  startSelection: () => void;
  toggleSelect: (id: string) => void;
  toggleSelectAll: (allIds: string[]) => void;
  clearSelection: () => void;

  bulkComplete: () => Promise<void>;
  bulkDelete: () => Promise<void>;
  bulkProjectChange: (projectId: string | null) => Promise<void>;
  bulkUpdateDeadline: (
    date: string | null,
    time: string | null,
  ) => Promise<void>;
  bulkSetPriority: (priority: number) => Promise<void>;
}

export const useSelectionStore = create<SelectionStore>((set, get) => ({
  selectionMode: false,
  selectedIds: new Set<string>(),
  total: 0,

  startSelection: () =>
    set((state) => {
      if (state.selectionMode) {
        return { selectionMode: false, selectedIds: new Set() };
      }
      return { selectionMode: true };
    }),

  toggleSelect: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { selectedIds: next, total: next.size };
    }),

  toggleSelectAll: (allIds) =>
    set((state) => {
      const isAllSelected = state.selectedIds.size === allIds.length;
      return {
        selectedIds: isAllSelected ? new Set() : new Set(allIds),
      };
    }),

  clearSelection: () => set({ selectedIds: new Set(), selectionMode: false }),

  bulkComplete: async () => {
    const { selectedIds, clearSelection } = get();
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    const updateTask = useTasksStore.getState().updateTask;
    clearSelection();
    await Promise.all(ids.map((id) => updateTask(id, { isDone: true })));
  },

  bulkDelete: async () => {
    const { selectedIds, clearSelection } = get();
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    const deleteTask = useTasksStore.getState().deleteTask;
    clearSelection();
    await Promise.all(ids.map((id) => deleteTask(id)));
  },

  bulkUpdateDeadline: async (
    dateStr: string | null,
    timeStr: string | null,
  ) => {
    const { selectedIds, clearSelection } = get();
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    const updateTask = useTasksStore.getState().updateTask;

    let finalDeadline: string | null = null;

    if (dateStr) {
      const dateObj = new Date(dateStr);
      if (timeStr) {
        const [hours, minutes] = timeStr.split(":").map(Number);
        dateObj.setHours(hours, minutes, 0, 0);
      } else {
        dateObj.setHours(23, 59, 59, 999);
      }
      finalDeadline = dateObj.toISOString();
    }
    clearSelection();
    await Promise.all(
      ids.map((id) => updateTask(id, { deadline: finalDeadline })),
    );
  },

  bulkSetPriority: async (priority: number) => {
    const { selectedIds, clearSelection } = get();
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    const updateTask = useTasksStore.getState().updateTask;
    clearSelection();
    await Promise.all(ids.map((id) => updateTask(id, { priority })));
  },

  bulkProjectChange: async (projectId: string | null) => {
    const { selectedIds, clearSelection } = get();
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    const updateTask = useTasksStore.getState().updateTask;
    clearSelection();
    await Promise.all(
      ids.map((id) =>
        updateTask(id, {
          projectId,
          parentId: null,
          sectionId: null,
        }),
      ),
    );
  },
}));
