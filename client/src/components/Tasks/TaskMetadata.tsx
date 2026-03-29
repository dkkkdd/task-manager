import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Task } from "@/types/tasks";
import type { Project } from "@/types/project";

import Calendar from "@/components/Calendar/Calendar";
import {
  formatDateLabel,
  dateColor,
  formatFullDate,
} from "@/utils/dateFormatters";
import { dateLocales } from "@/i18n";
import { enUS } from "react-day-picker/locale/en-US";

import { useTasksStore } from "@/stores/useTasksStore";
import { useModeStore } from "@/stores/useModesStore";

interface TaskMetadataProps {
  task: Task;
  projectOfTask: Project | null;
  mode: string;
  isSelectionMode?: boolean;

  onDateUpdate?: (date: string | null) => void;
  onProjectClick?: (projectId: string | null) => void;
}

export const TaskMetadata = memo(function TaskMetadata({
  task,
  projectOfTask,
  mode,
  isSelectionMode,
  onDateUpdate: externalOnDateUpdate,
  onProjectClick: externalOnProjectClick,
}: TaskMetadataProps) {
  const { t, i18n } = useTranslation();

  const updateTask = useTasksStore((s) => s.updateTask);
  const { setMode, openProject } = useModeStore();

  const handleDateUpdate = (date: string | null) => {
    if (externalOnDateUpdate) {
      externalOnDateUpdate(date);
    } else {
      updateTask(task.id, { deadline: date });
    }
  };

  const handleProjectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (externalOnProjectClick) {
      externalOnProjectClick(projectOfTask?.id || null);
    } else {
      if (!projectOfTask) {
        setMode("inbox");
      } else {
        openProject(projectOfTask.id);
      }
    }
  };

  const subtasksStats = useMemo(() => {
    const subs = task.subtasks || [];
    return {
      subCount: subs.length,
      subDone: subs.filter((s) => s.isDone).length,
    };
  }, [task.subtasks]);

  const deadlineDate = task.deadline ? new Date(task.deadline) : null;

  const shouldShowTime =
    deadlineDate &&
    (deadlineDate.getHours() !== 23 || deadlineDate.getMinutes() !== 59);

  const dateLabel = formatDateLabel(
    deadlineDate,
    dateLocales[i18n.language] || enUS,
  );
  const meta = dateColor(deadlineDate);

  const isCompletedMode = mode === "completed";

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
          <Calendar date={task.deadline} setDate={handleDateUpdate}>
            <span className="flex items-center gap-1 cursor-pointer">
              <span className={meta.icon} />
              {t(dateLabel)}
              {shouldShowTime && (
                <span className="ml-1 opacity-80">
                  {deadlineDate.toTimeString().slice(0, 5)}
                </span>
              )}
            </span>
          </Calendar>
        </button>
      )}

      {isCompletedMode && task.completedAt && (
        <span className="text-[10px] opacity-60 text-gray-500 dark:text-gray-400">
          {t("completed")}:{" "}
          {
            formatFullDate(task.completedAt, dateLocales[i18n.language] || enUS)
              .label
          }
        </span>
      )}

      {(mode === "today" || isCompletedMode || mode === "overdue") && (
        <span
          onClick={handleProjectClick}
          className="px-1.5 py-0.5 text-[8px] md:text-[10px] flex items-center gap-1 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer rounded-md transition-colors"
        >
          <span
            style={{ color: projectOfTask?.color || "#888" }}
            className={`icon-${projectOfTask ? "heart-svgrepo-com" : "price-tag"}`}
          />
          <span className="opacity-60 text-gray-600 dark:text-gray-300">
            {projectOfTask?.title || t("inbox")}
          </span>
        </span>
      )}
    </div>
  );
});
