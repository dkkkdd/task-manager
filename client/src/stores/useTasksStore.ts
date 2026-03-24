import { create } from "zustand";
import type { Task } from "@/types/tasks";
import { tasksApi } from "@/api/tasks";
import type { FetchTasksParams } from "@/api/tasks";
import { useModeStore } from "./useModesStore";

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
}

export const useTasksStore = create<TasksStore>((set, get) => ({
  tasks: [],
  loading: false,

  filters: {},

  setFilters: (mode, selectedProjectId) =>
    set({ filters: { mode, selectedProjectId } }),

  fetchTasks: async () => {
    set({ loading: true });

    try {
      const { mode, selectedProjectId } = useModeStore.getState();

      const params: FetchTasksParams = { mode };

      if (mode === "project" && selectedProjectId) {
        params.projectId = selectedProjectId;
      }

      const data = await tasksApi.fetchTasks(params);
      set({ tasks: data });
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      set({ loading: false });
    }
  },

  createTask: async (data) => {
    const tempId = `temp-${Date.now()}`;
    const tempTask: Task = {
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
        ? state.tasks.map((task) =>
            task.id === data.parentId
              ? { ...task, subtasks: [...(task.subtasks || []), tempTask] }
              : task,
          )
        : [...state.tasks, tempTask],
    }));

    try {
      const realTask = await tasksApi.createTask(data);

      set((state) => ({
        tasks: data.parentId
          ? state.tasks.map((task) =>
              task.id === data.parentId
                ? {
                    ...task,
                    subtasks: task.subtasks?.map((s) =>
                      s.id === tempId ? realTask : s,
                    ),
                  }
                : task,
            )
          : state.tasks.map((task) =>
              task.id === tempId
                ? { ...realTask, subtasks: task.subtasks }
                : task,
            ),
      }));
    } catch {
      set((state) => ({
        tasks: data.parentId
          ? state.tasks.map((task) =>
              task.id === data.parentId
                ? {
                    ...task,
                    subtasks: task.subtasks?.filter((s) => s.id !== tempId),
                  }
                : task,
            )
          : state.tasks.filter((task) => task.id !== tempId),
      }));
    }
  },

  updateTask: async (id, data) => {
    const snapshot = get().tasks;
    const { mode } = useModeStore.getState();

    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id === id) return { ...task, ...data };
        if (task.subtasks?.some((s) => s.id === id)) {
          return {
            ...task,
            subtasks: task.subtasks.map((s) =>
              s.id === id ? { ...s, ...data } : s,
            ),
          };
        }
        return task;
      }),
    }));

    try {
      const real = await tasksApi.updateInfo(id, data);

      if (
        data.deadline !== undefined &&
        (mode === "today" || mode === "overdue")
      ) {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
        return;
      }

      set((state) => ({
        tasks: state.tasks.map((task) => {
          if (task.id === id) return { ...task, ...real };
          if (task.subtasks?.some((s) => s.id === id)) {
            return {
              ...task,
              subtasks: task.subtasks.map((s) =>
                s.id === id ? { ...s, ...real } : s,
              ),
            };
          }
          return task;
        }),
      }));
    } catch {
      set({ tasks: snapshot });
    }
  },

  updateDone: async (id, done) => {
    const snapshot = get().tasks;
    const { mode } = useModeStore.getState();
    const patch = { isDone: done, completedAt: done ? new Date() : null };

    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id === id) return { ...task, ...patch };
        if (task.subtasks?.some((s) => s.id === id)) {
          return {
            ...task,
            subtasks: task.subtasks.map((s) =>
              s.id === id ? { ...s, ...patch } : s,
            ),
          };
        }
        return task;
      }),
    }));

    try {
      await tasksApi.updateStatus(id, done);

      if (mode === "completed" && !done) {
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
      }
      if ((mode === "today" || mode === "overdue") && done) {
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
      }
    } catch {
      set({ tasks: snapshot });
    }
  },

  deleteTask: async (id: string) => {
    const snapshot = get().tasks;

    set((state) => ({
      tasks: state.tasks
        .filter((task) => task.id !== id)
        .map((task) => ({
          ...task,
          subtasks: task.subtasks?.filter((s) => s.id !== id) ?? [],
        })),
    }));

    try {
      await tasksApi.deleteTask(id);
    } catch {
      set({ tasks: snapshot });
    }
  },
}));
