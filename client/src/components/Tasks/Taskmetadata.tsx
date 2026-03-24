import { memo } from "react";
import { useTranslation } from "react-i18next";

import type { Project } from "@/types/project";
import { formatFullDate } from "@/utils/dateFormatters";
import { Calendar } from "@/components/Calendar/Calendar";
import type { Locale } from "react-day-picker";
import { dateLocales } from "@/i18n";
import { enUS } from "date-fns/locale";

interface TaskMetadataProps {
  deadline?: Date | null;
  reminderAt?: string | null;
  completedAt?: Date | null;
  subCount: number | null;
  subDone: number | null;
  projectOfTask: Project | null;
  mode: string;
  isDone: boolean;
  isSelectionMode?: boolean;
  dateColor: (
    dateInput: Date | null,
    reminderAt?: string | null,
  ) => { color: string; icon: string };

  formatDateLabel: (
    dateInput: Date | null,
    locale: Pick<Locale, "options" | "localize" | "formatLong">,
  ) => string;
  onDateUpdate: (date: Date | null) => void;
  onTimeUpdate: (time: string | null) => void;
  onProjectClick: (projectId: string | null) => void;
}

export const TaskMetadata = memo(function TaskMetadata({
  deadline,
  reminderAt,
  completedAt,
  subCount,
  subDone,
  projectOfTask,
  mode,
  isDone,
  isSelectionMode,
  dateColor,
  formatDateLabel,
  onDateUpdate,
  onTimeUpdate,
  onProjectClick,
}: TaskMetadataProps) {
  const { t, i18n } = useTranslation();

  const locale = dateLocales[i18n.language] || enUS;

  const isCompletedMode = mode === "completed";
  const currentDeadlineStr = deadline ? new Date(deadline) : null;

  const dateLabel = formatDateLabel(currentDeadlineStr, locale);

  const meta = dateColor(currentDeadlineStr, reminderAt);
  const isDefaultColor = meta.color === "currentColor";
  const { label, time } = formatFullDate(completedAt || null, locale);

  const title = ["today", "tomorrow", "yesterday"].includes(label)
    ? t(label)
    : label;

  const shouldShowMetadata =
    subCount !== 0 ||
    currentDeadlineStr ||
    (isCompletedMode && completedAt) ||
    mode === "today" ||
    mode === "overdue";

  if (!shouldShowMetadata) return null;

  return (
    <div className="flex items-center text-[12px] md:text-[15px] gap-2 w-full flex-wrap">
      {subCount !== 0 && (
        <div className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
          <span className="icon-pie-chart" />
          {subDone}/{subCount}
        </div>
      )}

      {currentDeadlineStr && !isCompletedMode && (
        <button
          style={{
            color: isDone || isDefaultColor ? undefined : meta.color,
            pointerEvents: isDone ? "none" : "all",
          }}
          className={`flex items-center gap-1 ${
            isDone
              ? "text-gray-400 dark:text-gray-500"
              : isDefaultColor
                ? "text-gray-600 dark:text-gray-400"
                : ""
          }`}
          onClick={(e) => e.stopPropagation()}
          disabled={isSelectionMode}
        >
          <Calendar
            date={currentDeadlineStr}
            setDate={onDateUpdate}
            time={reminderAt || null}
            setTime={onTimeUpdate}
          >
            <span className="flex items-center gap-1 cursor-pointer">
              <span className={meta.icon} />
              {t(dateLabel)}
              {reminderAt && (
                <span className="ml-1 opacity-80">{reminderAt}</span>
              )}
            </span>
          </Calendar>
        </button>
      )}

      {isCompletedMode && completedAt && (
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
          className="px-1.5 py-0.5 text-[8px] md:text-[10px] flex items-center gap-1 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer rounded-md transition-colors"
        >
          <span
            style={{ color: projectOfTask?.color || "#888" }}
            className={`icon-${
              projectOfTask?.title ? "heart-svgrepo-com" : "price-tag"
            }`}
          />
          <span className="opacity-60 text-gray-600 dark:text-gray-300">
            {projectOfTask?.title || "Inbox"}
          </span>
        </span>
      )}
    </div>
  );
});
