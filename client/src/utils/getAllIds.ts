import type { Task } from "@/types/tasks";

export const getAllIds = (tasks: Task[]): string[] => {
  let ids: string[] = [];
  tasks.forEach((task) => {
    ids.push(task.id);
    if (task.subtasks && task.subtasks.length > 0) {
      ids = [...ids, ...getAllIds(task.subtasks)];
    }
  });
  return ids;
};
