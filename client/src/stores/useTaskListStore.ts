import { create } from "zustand";

interface TaskListStore {
  editingTaskId: string | null;
  taskToDeleteId: string | null;
  activeParentId: string | null;
  openForm: boolean;
  expandedTasks: Record<string, boolean>;

  setEditingTaskId: (id: string | null) => void;
  setTaskToDeleteId: (id: string | null) => void;
  setActiveParentId: (id: string | null) => void;
  setOpenForm: (value: boolean) => void;

  toggleTask: (taskId: string) => void;
  handleDeleteRequest: (id: string) => void;
  handleStartEditing: (id: string) => void;
  handleStartAddSubtask: (parentId: string | null) => void;

  resetForms: () => void;
}

export const useTaskListStore = create<TaskListStore>((set) => ({
  editingTaskId: null,
  taskToDeleteId: null,
  activeParentId: null,
  openForm: false,
  expandedTasks: {},

  setEditingTaskId: (id) => set({ editingTaskId: id }),
  setTaskToDeleteId: (id) => set({ taskToDeleteId: id }),
  setActiveParentId: (id) => set({ activeParentId: id }),

  setOpenForm: (value) =>
    set(() =>
      value
        ? {
            openForm: true,
            editingTaskId: null,
            taskToDeleteId: null,
            activeParentId: null,
          }
        : { openForm: false },
    ),

  toggleTask: (taskId) =>
    set((s) => ({
      expandedTasks: {
        ...s.expandedTasks,
        [taskId]: !(s.expandedTasks[taskId] ?? true),
      },
    })),

  handleDeleteRequest: (id) =>
    set({
      taskToDeleteId: id,
      openForm: false,
      editingTaskId: null,
      activeParentId: null,
    }),

  handleStartEditing: (id) =>
    set({
      editingTaskId: id,
      activeParentId: null,
      taskToDeleteId: null,
      openForm: false,
    }),

  handleStartAddSubtask: (parentId) =>
    set({
      activeParentId: parentId,
      editingTaskId: null,
      taskToDeleteId: null,
      openForm: false,
    }),

  resetForms: () =>
    set({
      editingTaskId: null,
      taskToDeleteId: null,
      activeParentId: null,
      openForm: false,
    }),
}));
