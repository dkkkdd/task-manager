import { create } from "zustand";

interface TaskListStore {
  editingTaskId: string | null;
  taskToDeleteId: string | null;
  activeParentId: string | null;
  expandedTasks: Record<string, boolean>;

  infoTaskId: string | null;
  menuTaskId: string | null;
  menuAnchorEl: HTMLButtonElement | null;

  setMenu: (id: string | null, anchor: HTMLButtonElement | null) => void;
  closeMenu: () => void;
  setInfoTaskId: (id: string | null) => void;
  handleOpenInfo: (id: string) => void;
  setEditingTaskId: (id: string | null) => void;
  setTaskToDeleteId: (id: string | null) => void;
  setActiveParentId: (id: string | null) => void;

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
  infoTaskId: null,
  menuTaskId: null,
  menuAnchorEl: null,

  setEditingTaskId: (id) => set({ editingTaskId: id }),
  setTaskToDeleteId: (id) => set({ taskToDeleteId: id }),
  setActiveParentId: (id) => set({ activeParentId: id }),
  setInfoTaskId: (id) => set({ infoTaskId: id }),
  setMenu: (id, anchor) => set({ menuTaskId: id, menuAnchorEl: anchor }),
  closeMenu: () => set({ menuTaskId: null, menuAnchorEl: null }),

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

      editingTaskId: null,
      activeParentId: null,
    }),

  handleStartEditing: (id) =>
    set({
      editingTaskId: id,
      activeParentId: null,
      taskToDeleteId: null,
    }),

  handleStartAddSubtask: (parentId) =>
    set({
      activeParentId: parentId,
      editingTaskId: null,
      taskToDeleteId: null,
    }),

  handleOpenInfo: (id) =>
    set({
      infoTaskId: id,
      editingTaskId: null,
      activeParentId: null,
    }),

  resetForms: () =>
    set({
      editingTaskId: null,
      taskToDeleteId: null,
      activeParentId: null,

      infoTaskId: null,
      menuTaskId: null,
      menuAnchorEl: null,
    }),
}));
