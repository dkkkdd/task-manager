import { Trans, useTranslation } from "react-i18next";
import { ConfirmModal } from "./ConfirmModal";
import { useMemo } from "react";
import { useTasksStore } from "@/stores/useTasksStore";
import { useTaskListStore } from "@/stores/useTaskListStore";
import { useModeStore } from "@/stores/useModesStore";
import type { Task } from "@/types/tasks";

const DeleteConfirmWrapper = () => {
  const { t } = useTranslation();
  const selectedProjectId = useModeStore((s) => s.selectedProjectId);
  const mode = useModeStore((s) => s.mode);
  const tasksCache = useTasksStore((s) => s.tasksCache);
  const taskToDeleteId = useTaskListStore((s) => s.taskToDeleteId);

  const cacheKey = mode === "project" ? `project-${selectedProjectId}` : mode;
  const tasks = tasksCache[cacheKey] || [];

  const findTaskRecursively = (
    taskList: Task[],
    id: string,
  ): Task | undefined => {
    for (const task of taskList) {
      if (task.id === id) return task;
      if (task.subtasks && task.subtasks.length > 0) {
        const found = findTaskRecursively(task.subtasks, id);
        if (found) return found;
      }
    }
    return undefined;
  };

  const task = useMemo(() => {
    if (!taskToDeleteId) return null;
    return findTaskRecursively(tasks, taskToDeleteId);
  }, [tasks, taskToDeleteId]);

  const deleteTask = useTasksStore((s) => s.deleteTask);
  const setTaskToDeleteId = useTaskListStore((s) => s.setTaskToDeleteId);

  const transComponents = useMemo(
    () => ({
      b: <b className="font-bold text-black dark:text-white" />,
    }),
    [],
  );

  if (!taskToDeleteId || !task) return null;

  return (
    <ConfirmModal
      title={t("delete_task_title")}
      message={
        <Trans
          i18nKey="delete_task_message"
          values={{ title: task.title }}
          components={transComponents}
        />
      }
      onConfirm={async () => {
        await deleteTask(task.id);
        setTaskToDeleteId(null);
      }}
      onClose={() => setTaskToDeleteId(null)}
    />
  );
};
export default DeleteConfirmWrapper;
