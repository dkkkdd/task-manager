import { lazy, Suspense } from "react";
const RenderTaskItem = lazy(() => import("../RenderTaskCard"));
import { TaskCardLoader } from "../TaskCardLoader";
import { useTranslation } from "react-i18next";
import type { Task } from "@/types/tasks";

interface Props {
  initiaTask?: Task;
  onStartAddSubtask?: (parentId: string | null) => void;
}

export const TaskFormSubtasks = ({ initiaTask, onStartAddSubtask }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      {initiaTask?.subtasks && initiaTask.subtasks.length > 0 ? (
        <div className="p-4 mt-1 bg-[#1a1a1a] dark:bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5">
          <ul className="flex flex-col">
            {initiaTask.subtasks.map((sub) => (
              <li key={sub.id} className="relative flex items-center">
                <Suspense fallback={<TaskCardLoader />}>
                  <RenderTaskItem task={sub} />
                </Suspense>
              </li>
            ))}
          </ul>

          <button
            onClick={() => onStartAddSubtask?.(initiaTask.id || null)}
            className="w-full flex items-center gap-3 p-4 text-white/70 hover:bg-white/5 transition-colors border-t border-white/5"
          >
            <span className="icon-plus-svgrepo-com-1 text-lg" />
            <span className="text-[15px] font-medium">{t("add_subtask")}</span>
          </button>
        </div>
      ) : (
        <button
          onClick={() => onStartAddSubtask?.(initiaTask?.id || null)}
          className="mx-3 mt-4 flex items-center gap-3 p-3 text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors"
        >
          <span className="icon-plus-svgrepo-com-1 text-lg" />
          <span className="text-[15px] font-medium">{t("add_subtask")}</span>
        </button>
      )}
    </>
  );
};

export default TaskFormSubtasks;
