import type { Task } from "@/types/tasks";

export const findTaskRecursive = (
  tasks: Task[],
  id: string | null,
): Task | null => {
  if (!id) return null;
  for (const task of tasks) {
    if (task.id === id) return task;
    if (task.subtasks && task.subtasks.length > 0) {
      const found = findTaskRecursive(task.subtasks, id);
      if (found) return found;
    }
  }
  return null;
};
