import { Trans, useTranslation } from "react-i18next";
import { ConfirmModal } from "./ConfirmModal";
import { useMemo } from "react";
import { useTasksStore } from "@/stores/useTasksStore";
import { useTaskListStore } from "@/stores/useTaskListStore";

const DeleteConfirmWrapper = () => {
  const { t } = useTranslation();
  const tasks = useTasksStore((s) => s.tasks);
  const taskToDeleteId = useTaskListStore((s) => s.taskToDeleteId);
  const task = tasks.find((task) => task.id === taskToDeleteId);

  const deleteTask = useTasksStore((s) => s.deleteTask);
  const setTaskToDeleteId = useTaskListStore((s) => s.setTaskToDeleteId);

  const transComponents = useMemo(
    () => ({
      b: <b className="font-bold text-black dark:text-white" />,
    }),
    [],
  );
  if (!task || !taskToDeleteId) return;
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
      onConfirm={() => deleteTask(task.id)}
      onClose={() => setTaskToDeleteId(null)}
    />
  );
};
export default DeleteConfirmWrapper;
