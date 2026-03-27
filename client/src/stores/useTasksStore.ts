import { create } from "zustand";
import type { Task } from "@/types/tasks";
import { tasksApi } from "@/api/tasks";
import type { FetchTasksParams } from "@/api/tasks";
import { useModeStore } from "./useModesStore";
import { isDateToday } from "@/utils/dateFormatters";

interface TasksStore {
  tasksCache: Record<string, Task[]>;
  loading: boolean;

  fetchTasks: () => Promise<void>;
  createTask: (
    data: Partial<Task> & { parentId?: string | null },
  ) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  updateDone: (id: string, done: boolean) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const getCacheKey = () => {
  const { mode, selectedProjectId } = useModeStore.getState();
  return mode === "project" ? `project-${selectedProjectId}` : mode;
};

export const useTasksStore = create<TasksStore>((set, get) => ({
  tasksCache: {},
  loading: false,

  fetchTasks: async () => {
    const key = getCacheKey();
    set({ loading: true });

    try {
      const { mode, selectedProjectId, showDone } = useModeStore.getState();
      const params: FetchTasksParams = {
        mode,
        showDone,
        projectId: mode === "project" ? selectedProjectId : undefined,
      };

      const data = await tasksApi.fetchTasks(params);

      set((state) => ({
        tasksCache: { ...state.tasksCache, [key]: data },
      }));
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      set({ loading: false });
    }
  },

  createTask: async (data) => {
    const key = getCacheKey();
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
      comment: data.comment ?? null,
    };

    set((state) => {
      const currentTasks = state.tasksCache[key] || [];
      const updated = data.parentId
        ? currentTasks.map((t) =>
            t.id === data.parentId
              ? { ...t, subtasks: [...(t.subtasks || []), tempTask] }
              : t,
          )
        : [...currentTasks, tempTask];

      return { tasksCache: { ...state.tasksCache, [key]: updated } };
    });

    try {
      const realTask = await tasksApi.createTask(data);

      set((state) => {
        const newCache = { ...state.tasksCache };
        Object.keys(newCache).forEach((k) => {
          newCache[k] = newCache[k].map((t) => {
            if (t.id === tempId) return { ...realTask, subtasks: t.subtasks };
            return {
              ...t,
              subtasks: t.subtasks?.map((s) =>
                s.id === tempId ? realTask : s,
              ),
            };
          });
        });
        return { tasksCache: newCache };
      });
    } catch {
      get().fetchTasks();
    }
  },

  updateTask: async (id, data) => {
    const snapshot = JSON.parse(JSON.stringify(get().tasksCache));

    set((state) => {
      const newCache = { ...state.tasksCache };

      Object.keys(newCache).forEach((k) => {
        let shouldRemoveFromView = false;

        if (data.deadline !== undefined) {
          if (k === "today") {
            shouldRemoveFromView =
              data.deadline !== null && !isDateToday(data.deadline);
          } else if (k === "overdue") {
            const d = new Date(data.deadline || 0);
            const todayStart = new Date().setHours(0, 0, 0, 0);
            shouldRemoveFromView = d >= new Date(todayStart);
          }
        }

        if (shouldRemoveFromView) {
          newCache[k] = newCache[k].filter((t) => t.id !== id);
        } else {
          newCache[k] = newCache[k].map((task) => {
            if (task.id === id) {
              return { ...task, ...data };
            }

            if (task.subtasks && task.subtasks.length > 0) {
              const hasSubtask = task.subtasks.some((s) => s.id === id);
              if (hasSubtask) {
                return {
                  ...task,
                  subtasks: task.subtasks.map((s) =>
                    s.id === id ? { ...s, ...data } : s,
                  ),
                };
              }
            }

            return task;
          });
        }
      });

      return { tasksCache: newCache };
    });

    try {
      await tasksApi.updateInfo(id, data);
    } catch (error) {
      console.error("Failed to update task:", error);

      set({ tasksCache: snapshot });
    }
  },

  updateDone: async (id: string, done: boolean) => {
    const snapshot = JSON.parse(JSON.stringify(get().tasksCache));
    const { showDone } = useModeStore.getState();

    const patch = {
      isDone: done,
      completedAt: done ? new Date() : null,
    };

    set((state) => {
      const newCache = { ...state.tasksCache };

      Object.keys(newCache).forEach((key) => {
        newCache[key] = newCache[key].map((task) => {
          if (task.id === id) {
            return { ...task, ...patch };
          }

          if (task.subtasks?.length) {
            const updatedSubtasks = task.subtasks.map((sub) =>
              sub.id === id ? { ...sub, ...patch } : sub,
            );

            return {
              ...task,
              subtasks: updatedSubtasks.sort(
                (a, b) => Number(a.isDone) - Number(b.isDone),
              ),
            };
          }

          return task;
        });

        if (!showDone && done) {
          const isFilterTarget =
            key === "today" ||
            key === "overdue" ||
            key.startsWith("project-") ||
            key === "inbox";

          if (isFilterTarget) {
            newCache[key] = newCache[key].filter((task) => task.id !== id);
          }
        }
      });

      return { tasksCache: newCache };
    });

    try {
      await tasksApi.updateStatus(id, done);
    } catch (error) {
      console.error("Failed to update task status:", error);
      set({ tasksCache: snapshot });
    }
  },

  deleteTask: async (id) => {
    const snapshot = JSON.parse(JSON.stringify(get().tasksCache));

    set((state) => {
      const newCache = { ...state.tasksCache };
      Object.keys(newCache).forEach((k) => {
        newCache[k] = newCache[k]
          .filter((t) => t.id !== id)
          .map((t) => ({
            ...t,
            subtasks: t.subtasks?.filter((s) => s.id !== id) || [],
          }));
      });
      return { tasksCache: newCache };
    });

    try {
      await tasksApi.deleteTask(id);
    } catch {
      set({ tasksCache: snapshot });
    }
  },
}));
