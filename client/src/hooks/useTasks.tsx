import { useEffect, useState } from "react";
import type { FetchTasksParams } from "@/api/tasks";
import type { Task } from "@/types/tasks";
import { tasksApi } from "@/api/tasks";

const sortTasks = (list: Task[]): Task[] => {
  return [...list].map((node) => ({
    ...node,
    subtasks: node.subtasks ? sortTasks(node.subtasks) : [],
  }));
};

const updateNode = (
  list: Task[],
  id: string,
  patch: Partial<Task> | null,
): Task[] => {
  return list
    .filter((node) => (patch === null ? node.id !== id : true))
    .map((node) => {
      if (node.id === id) return { ...node, ...patch };
      if (node.subtasks?.length) {
        return { ...node, subtasks: updateNode(node.subtasks, id, patch) };
      }
      return node;
    });
};

const addSubtaskNode = (
  list: Task[],
  parentId: string,
  newNode: Task,
): Task[] => {
  return list.map((node) => {
    if (node.id === parentId) {
      return { ...node, subtasks: [...(node.subtasks || []), newNode] };
    }
    if (node.subtasks?.length) {
      return {
        ...node,
        subtasks: addSubtaskNode(node.subtasks, parentId, newNode),
      };
    }
    return node;
  });
};

export function useTasks(userId: string, filters: FetchTasksParams = {}) {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    async function loadTasks() {
      try {
        const data = await tasksApi.fetchTasks(
          { userId, ...filters },
          controller.signal,
        );
        setTasks(sortTasks(data));
        console.log(data);
        setLoading(false);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Помилка завантаження задач:", err);
          setLoading(false);
        }
      }
    }

    loadTasks();

    return () => controller.abort();
  }, [userId, JSON.stringify(filters)]);

  const create = async (data: Partial<Task> & { parentId?: string | null }) => {
    const tempId = `temp-${Date.now()}`;

    const tempNode: Task = {
      id: tempId,
      title: data.title || "",
      isDone: false,

      order: (tasks?.length || 0) + 1,
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

    setTasks((prev) => {
      const newList = data.parentId
        ? addSubtaskNode(prev || [], data.parentId, tempNode)
        : [...(prev || []), tempNode];
      return sortTasks(newList);
    });

    try {
      const { order, ...restData } = data;
      const real = await tasksApi.createTask({
        ...restData,
      });

      setTasks((prev) => sortTasks(updateNode(prev || [], tempId, real)));
    } catch {
      setTasks((prev) => updateNode(prev || [], tempId, null));
    }
  };

  const update = async (id: string, data: Partial<Task>) => {
    const snapshot = tasks;
    setTasks((prev) => updateNode(prev || [], id, data));

    try {
      await tasksApi.updateInfo(id, data);
    } catch {
      setTasks(snapshot);
    }
  };

  const updateDone = async (id: string, isDone: boolean) => {
    const snapshot = tasks;
    const patch: Partial<Task> = {
      isDone,
      completedAt: isDone ? new Date() : null,
    };

    setTasks((prev) => sortTasks(updateNode(prev || [], id, patch)));

    try {
      await tasksApi.updateStatus(id, isDone);
    } catch {
      setTasks(snapshot);
    }
  };
  const remove = async (id: string) => {
    const snapshot = tasks;

    setTasks((prev) => updateNode(prev || [], id, null));

    try {
      await tasksApi.deleteTask(id);
    } catch {
      setTasks(snapshot);
    }
  };

  return {
    tasks,
    loading,
    createTask: create,
    updateTask: update,
    updateDone,
    deleteTask: remove,
  };
}
