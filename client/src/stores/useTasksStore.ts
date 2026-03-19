import { create } from "zustand";
import type { Task } from "@/types/tasks";
import { tasksApi } from "@/api/tasks";
import { useModeStore } from "./useModesStore";

const sortTasks = (list: Task[]): Task[] =>
  [...list].map((node) => ({
    ...node,
    subtasks: node.subtasks ? sortTasks(node.subtasks) : [],
  }));

const updateNode = (
  list: Task[],
  id: string,
  patch: Partial<Task> | null,
): Task[] =>
  list
    .filter((node) => (patch === null ? node.id !== id : true))
    .map((node) => {
      if (node.id === id) return { ...node, ...patch };
      if (node.subtasks?.length)
        return { ...node, subtasks: updateNode(node.subtasks, id, patch) };
      return node;
    });

const addSubtaskNode = (
  list: Task[],
  parentId: string,
  newNode: Task,
): Task[] =>
  list.map((node) => {
    if (node.id === parentId)
      return { ...node, subtasks: [...(node.subtasks || []), newNode] };
    if (node.subtasks?.length)
      return {
        ...node,
        subtasks: addSubtaskNode(node.subtasks, parentId, newNode),
      };
    return node;
  });

interface TasksStore {
  tasks: Task[];
  loading: boolean;
  filters: { mode?: string; selectedProjectId?: string | null };
  fetchTasks: () => Promise<void>;
  createTask: (
    data: Partial<Task> & { parentId?: string | null },
  ) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  updateDone: (id: string, done: boolean) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setFilters: (mode: string, projectId?: string | null) => void;
  // getFilteredTasks: () => Task[];
}

export const useTasksStore = create<TasksStore>((set, get) => ({
  tasks: [],
  loading: false,
  filters: {},

  setFilters: (mode, selectedProjectId) =>
    set({ filters: { mode, selectedProjectId } }),

  fetchTasks: async () => {
    const { mode, selectedProjectId } = useModeStore.getState();

    set({ tasks: [], loading: true });

    try {
      const data = await tasksApi.fetchTasks({
        mode,
        projectId: selectedProjectId,
      });
      set({ tasks: sortTasks(data) });
    } finally {
      set({ loading: false });
    }
  },

  createTask: async (data) => {
    const tempId = `temp-${Date.now()}`;
    const tempNode: Task = {
      id: tempId,
      title: data.title || "",
      isDone: false,
      subtasks: [],
      completedAt: null,
      priority: data.priority ?? 1,
      projectId: data.projectId ?? null,
      sectionId: data.sectionId ?? null,
      parentId: data.parentId ?? null,
      deadline: data.deadline ?? null,
      reminderAt: data.reminderAt ?? null,
      comment: data.comment ?? null,
    };

    set((state) => ({
      tasks: data.parentId
        ? addSubtaskNode(state.tasks, data.parentId, tempNode)
        : [...state.tasks, tempNode],
    }));

    try {
      const real = await tasksApi.createTask({ ...data });
      set((state) => ({
        tasks: sortTasks(updateNode(state.tasks, tempId, real)),
      }));
    } catch {
      set((state) => ({ tasks: updateNode(state.tasks, tempId, null) }));
    }
  },

  updateTask: async (id, data) => {
    const snapshot = get().tasks;
    // Оптимістично оновлюємо
    set((state) => ({ tasks: updateNode(state.tasks, id, data) }));

    try {
      const response = await tasksApi.updateInfo(id, data);
      const updatedRealTask = response; // Отримуємо реальні дані від сервера

      set((state) => ({
        tasks: sortTasks(updateNode(state.tasks, id, updatedRealTask)),
      }));
    } catch {
      // Якщо сервер видав помилку — відкочуємо до знімку (snapshot)
      set({ tasks: snapshot });
    }
  },

  updateDone: async (id, done) => {
    const snapshot = get().tasks;
    const patch: Partial<Task> = {
      isDone: done,
      completedAt: done ? new Date() : null,
    };
    set((state) => ({ tasks: sortTasks(updateNode(state.tasks, id, patch)) }));
    try {
      await tasksApi.updateStatus(id, done);
    } catch {
      set({ tasks: snapshot });
    }
  },

  deleteTask: async (id) => {
    const snapshot = get().tasks;
    set((state) => ({ tasks: updateNode(state.tasks, id, null) }));
    try {
      await tasksApi.deleteTask(id);
    } catch {
      set({ tasks: snapshot });
    }
  },
}));
