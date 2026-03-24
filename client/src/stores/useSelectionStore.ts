import { create } from "zustand";
import { useTasksStore } from "./useTasksStore";

interface SelectionStore {
  selectionMode: boolean;
  selectedIds: Set<string>;

  startSelection: () => void;
  toggleSelect: (id: string) => void;
  toggleSelectAll: (allIds: string[]) => void;
  clearSelection: () => void;

  bulkComplete: () => Promise<void>;
  bulkDelete: () => Promise<void>;
}

export const useSelectionStore = create<SelectionStore>((set, get) => ({
  selectionMode: false,
  selectedIds: new Set(),

  startSelection: () => set({ selectionMode: true }),

  toggleSelect: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { selectedIds: next };
    }),

  toggleSelectAll: (allIds) =>
    set((state) => ({
      selectedIds:
        state.selectedIds.size === allIds.length ? new Set() : new Set(allIds),
    })),

  clearSelection: () => set({ selectedIds: new Set(), selectionMode: false }),

  bulkComplete: async () => {
    const { selectedIds, clearSelection } = get();
    const updateTask = useTasksStore.getState().updateTask;
    await Promise.all(
      Array.from(selectedIds).map((id) => updateTask(id, { isDone: true })),
    );
    clearSelection();
  },

  bulkDelete: async () => {
    const { selectedIds, clearSelection } = get();
    const deleteTask = useTasksStore.getState().deleteTask;
    await Promise.all(Array.from(selectedIds).map((id) => deleteTask(id)));
    clearSelection();
  },

  bulkUpdateDeadline: async (date: Date | null, time: string | null) => {
    const { selectedIds, clearSelection } = get();
    const updateTask = useTasksStore.getState().updateTask;

    let finalDeadline: Date | null = null;
    if (date) {
      finalDeadline = new Date(date);
      if (time) {
        const [h, m] = time.split(":").map(Number);
        finalDeadline.setHours(h, m, 0, 0);
      } else {
        finalDeadline.setHours(23, 59, 59, 999);
      }
    }

    await Promise.all(
      Array.from(selectedIds).map((id) =>
        updateTask(id, { deadline: finalDeadline, reminderAt: time }),
      ),
    );
    clearSelection();
  },

  bulkSetPriority: async (priority: number) => {
    const { selectedIds, clearSelection } = get();
    const updateTask = useTasksStore.getState().updateTask;
    await Promise.all(
      Array.from(selectedIds).map((id) => updateTask(id, { priority })),
    );
    clearSelection();
  },
}));
