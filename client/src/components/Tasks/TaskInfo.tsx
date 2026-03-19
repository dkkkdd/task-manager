import type { Project } from "@/types/project";
import type { Task } from "@/types/tasks";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { enUS, uk, ru, es, fr, pl, de } from "date-fns/locale";
import type { Locale } from "react-day-picker";
import { useTasksStore } from "@/stores/useTasksStore";
const localeMap: Record<string, Locale> = {
  en: enUS,
  uk: uk,
  ru: ru,
  es: es,
  fr: fr,
  pl: pl,
  de: de,
};

export const TaskInfo = ({
  task,
  projects,
  onClose,
  isOpen,
}: {
  task: Task;
  projects: Project[] | null;
  onClose: () => void;
  isOpen: boolean;
}) => {
  const tasks = useTasksStore((s) => s.tasks);
  const project = projects?.find((p) => p.id === task.projectId);
  const { t, i18n } = useTranslation();
  const safeTasks = tasks === null ? [] : tasks;
  const parentTask = task.parentId
    ? safeTasks.find((t: Task) => t.id === task.parentId)
    : null;
  const formattedDeadline = task.deadline
    ? format(new Date(task.deadline), "d MMMM yyyy", {
        locale: localeMap[i18n.language] ?? enUS,
      })
    : null;
  const subtasks = task.subtasks;
  const safeSubTasks = subtasks === null ? [] : subtasks;
  const subtasksCount = safeSubTasks?.length;
  const subtasksDone = safeSubTasks?.filter((s: Task) => s.isDone).length;

  return (
    <div
      className={`fixed inset-0 z-[1000] flex items-center justify-center transition-all duration-300 ease-in-out ${
        isOpen
          ? "opacity-100 visible backdrop-blur-sm bg-black/20"
          : "opacity-0 invisible backdrop-blur-0 bg-black/0"
      }`}
      onClick={onClose}
    >
      <div
        className={`relative z-[100] bg-white dark:bg-[#242424] w-full max-w-[450px] rounded-lg border border-black/10 dark:border-white/5 
        transform transition-all duration-300 ease-out p-2 shadow-2xl
        ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <span
          onClick={onClose}
          className="icon-icons8-close absolute top-2 right-2 flex items-center justify-center leading-none bg-transparent p-[0.3em] rounded-[8px] cursor-pointer hover:bg-black/5 dark:hover:bg-[#82828241] text-black dark:text-white transition-all opacity-50 hover:opacity-100"
        />

        <div className="px-6 pb-6 pt-8">
          {parentTask && (
            <div className="mb-2 flex items-center gap-2 text-gray-500 dark:text-[#777] text-[11px] uppercase tracking-wider font-bold">
              <span className="icon-flow-branch rotate-180" />
              <span>{t("parent_task")}:</span>
              <span className="text-[#4270d1] truncate max-w-[200px]">
                {parentTask.title}
              </span>
            </div>
          )}

          <div className="flex items-start mb-6">
            <div
              className={`w-14 h-14 rounded-lg flex items-center justify-center text-2xl border border-black/5 dark:border-white/5 shadow-xl transition-colors
                ${
                  task.isDone
                    ? "bg-green-500/10 text-green-500"
                    : "bg-gray-100 dark:bg-[#333] text-gray-400 dark:text-gray-400"
                }`}
            >
              <span
                className={task.isDone ? "icon-checkmark" : "icon-pushpin"}
              />
            </div>
            <div className="ml-4 flex-1">
              <h3
                className={`text-xl font-bold leading-tight ${
                  task.isDone
                    ? "text-gray-400 line-through"
                    : "text-black dark:text-white"
                }`}
              >
                {task.title}
              </h3>
              <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mt-1">
                {task.isDone ? t("completed") : t("active_task")}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {task.comment && (
              <div className="bg-gray-50 dark:bg-[#2a2a2a]/50 p-4 rounded-lg border border-black/5 dark:border-white/5">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block mb-1">
                  {t("description")}
                </span>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {task.comment}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-[#2a2a2a] p-4 rounded-lg border border-black/5 dark:border-white/5 flex flex-col items-start">
                <span
                  className="icon-heart-svgrepo-com text-lg mb-2"
                  style={{ color: project?.color || "#777" }}
                />
                <span className="text-lg font-bold text-black dark:text-white truncate w-full">
                  {project?.title || t("inbox")}
                </span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                  {t("project")}
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-[#2a2a2a] p-4 rounded-lg border border-black/5 dark:border-white/5 flex flex-col items-start">
                <span className="icon-pie-chart text-[#9d174d] text-lg mb-2" />
                <span className="text-lg font-bold text-black dark:text-white">
                  {subtasksDone} / {subtasksCount}
                </span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                  {t("subtasks")}
                </span>
              </div>
            </div>

            {subtasksCount ||
              (0 > 0 && (
                <div className="bg-gray-50/50 dark:bg-[#2a2a2a]/30 rounded-lg border border-black/5 dark:border-white/5 p-3 space-y-2">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block px-1">
                    {t("subtasks_list")}
                  </span>
                  <div className="max-h-[120px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {safeSubTasks?.map((sub: Task) => (
                      <div
                        key={sub.id}
                        className="flex items-center gap-3 p-2 bg-white dark:bg-white/5 rounded-md border border-black/5 dark:border-white/5"
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            sub.isDone
                              ? "bg-green-500"
                              : "bg-gray-300 dark:bg-[#555]"
                          }`}
                        />
                        <span
                          className={`text-sm flex-1 truncate ${
                            sub.isDone
                              ? "text-gray-400 line-through"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {sub.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            {task.deadline && (
              <div className="bg-gray-50 dark:bg-[#2a2a2a]/50 p-4 rounded-lg border border-black/5 dark:border-white/5 flex items-center space-x-4">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <span className="icon-calendar text-[#4270d1]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-500 uppercase font-bold tracking-tight">
                    {t("due_date")}
                  </span>
                  <span className="text-sm text-gray-800 dark:text-gray-300 font-medium">
                    {formattedDeadline}
                  </span>
                  {task.reminderAt && (
                    <span className="text-[10px] text-gray-400 dark:text-gray-600">
                      {t("reminder_at", { time: task.reminderAt })}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
