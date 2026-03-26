import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Project } from "@/types/project";
import { formatFullDate } from "@/utils/dateFormatters";
import { Calendar } from "@/components/Calendar/Calendar";
import { dateLocales } from "@/i18n";
import { formatDateLabel, dateColor } from "@/utils/dateFormatters";
import { enUS } from "react-day-picker/locale/en-US";
import type { Task } from "@/types/tasks";

interface TaskMetadataProps {
  projectOfTask: Project | null;
  mode: string;
  task: Task;
  isSelectionMode: boolean;

  onDateUpdate: (date: string | null) => void;
  onProjectClick: (projectId: string | null) => void;
}

export const TaskMetadata = memo(function TaskMetadata({
  projectOfTask,
  mode,
  task,
  isSelectionMode,

  onDateUpdate,
  onProjectClick,
}: TaskMetadataProps) {
  const { t, i18n } = useTranslation();

  const locale = dateLocales[i18n.language] || enUS;
  const subtasksStats = useMemo(
    () => ({
      subCount: task.subtasks?.length || 0,
      subDone: task.subtasks?.filter((t) => t.isDone).length || 0,
    }),
    [task.subtasks],
  );
  const deadlineDate = task.deadline ? new Date(task.deadline) : null;

  const shouldShowTime =
    deadlineDate &&
    (deadlineDate.getHours() !== 23 || deadlineDate.getMinutes() !== 59);

  const dateLabel = formatDateLabel(deadlineDate, locale);
  const meta = dateColor(deadlineDate);

  const isCompletedMode = mode === "completed";
  const { label, time } = formatFullDate(task.completedAt || null, locale);

  const title = ["today", "tomorrow", "yesterday"].includes(label)
    ? t(label)
    : label;

  const shouldShowMetadata =
    subtasksStats.subCount !== 0 ||
    task.deadline ||
    (isCompletedMode && task.completedAt) ||
    mode === "today" ||
    mode === "overdue";

  if (!shouldShowMetadata) return null;

  return (
    <div className="flex items-center text-[12px] md:text-[15px] gap-2 w-full flex-wrap">
      {subtasksStats.subCount !== 0 && (
        <div className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
          <span className="icon-pie-chart" />
          {subtasksStats.subDone}/{subtasksStats.subCount}
        </div>
      )}

      {task.deadline && !isCompletedMode && (
        <button
          style={{
            color:
              task.isDone || meta.color === "currentColor"
                ? undefined
                : meta.color,
            pointerEvents: task.isDone ? "none" : "all",
          }}
          className={`flex items-center gap-1 ${
            task.isDone
              ? "text-gray-400 dark:text-gray-500"
              : meta.color === "currentColor"
                ? "text-gray-600 dark:text-gray-400"
                : ""
          }`}
          onClick={(e) => e.stopPropagation()}
          disabled={isSelectionMode}
        >
          <Calendar date={task.deadline} setDate={onDateUpdate}>
            <span className="flex items-center gap-1 cursor-pointer !md:text-[0.8em]">
              <span className={meta.icon} />
              {t(dateLabel.toLowerCase())}
              {shouldShowTime && (
                <span className="opacity-80">
                  {deadlineDate.toTimeString().slice(0, 5)}
                </span>
              )}
            </span>
          </Calendar>
        </button>
      )}

      {isCompletedMode && task.completedAt && (
        <span className="text-[10px] opacity-60 text-gray-500 dark:text-gray-400">
          {t("completed")}: {title} - {time}
        </span>
      )}

      {(mode === "today" || isCompletedMode || mode === "overdue") && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onProjectClick(projectOfTask?.id || null);
          }}
          className="px-1.5 py-0.5 text-[8px] md:text-[10px] flex items-center gap-1 hover:bg-black/5 
            dark:hover:bg-white/10 cursor-pointer rounded-md transition-colors"
        >
          <span
            style={{ color: projectOfTask?.color || "#888" }}
            className={`${projectOfTask ? "icon-heart-svgrepo-com" : "icon-inbox"}`}
          />
          <span className="opacity-60 text-gray-600 dark:text-gray-300">
            {projectOfTask?.title || t("inbox")}
          </span>
        </span>
      )}
    </div>
  );
});
