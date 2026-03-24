import { memo } from "react";
import type { Task } from "@/types/tasks";

import { SubtaskToggle } from "@/components/Tasks/Subtasktoggle";
import { TaskCheckbox } from "@/components/Tasks/TaskCheckbox";
import { TaskMetadata } from "@/components/Tasks/Taskmetadata";
import { TaskActions } from "@/components/Tasks/Taskactions";

import { formatDateLabel, dateColor } from "@/utils/dateFormatters";
import type { Project } from "@/types/project";

interface TaskCardProps {
  task: Task;
  ui: {
    mode: string;
    projectOfTask: Project | null;
    isMobile: boolean;
    selectionMode: boolean;
    selected: boolean;
    showSubTasks: boolean;
    isMenuOpen: boolean;
    isCalOpen: boolean;
    currentDeadlineStr: Date | null;
    priorityStyle: { bg?: string; color?: string };
    subtasksStats: { subCount: number; subDone: number };
  };
  handlers: {
    onCardClick: (e: React.MouseEvent) => void;
    onToggle: (e: React.MouseEvent) => void;
    onSelect: () => void;
    onDateUpdate: (date: Date | null) => void;
    onTimeUpdate: (time: string | null) => void;
    onMenuClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onEdit: () => void;
    setIsCalOpen: (val: boolean) => void;
    setShowSubTasks?: () => void;
    onProjectClick: (projectId: string | null) => void;
  };
}

const TaskCard = memo(({ task, ui, handlers }: TaskCardProps) => {
  const {
    mode,
    projectOfTask,
    isMobile,
    selectionMode,
    selected,
    showSubTasks,
    isMenuOpen,
    isCalOpen,
    currentDeadlineStr,
    priorityStyle,
    subtasksStats,
  } = ui;

  const {
    onCardClick,
    onToggle,
    onSelect,
    onDateUpdate,
    onTimeUpdate,
    onMenuClick,
    onEdit,
    setIsCalOpen,
    setShowSubTasks,
    onProjectClick,
  } = handlers;

  return (
    <>
      <div
        onClick={onCardClick}
        className={`
          ${selected ? "!text-[#9d174d]" : "text-black dark:text-white"}
          group flex items-center w-full transition-colors relative cursor-pointer
          ${task.isDone ? "opacity-80 text-gray-400 dark:text-gray-500" : ""}
        `}
      >
        <SubtaskToggle
          subCount={subtasksStats.subCount}
          showSubTasks={showSubTasks}
          mode={mode}
          onToggle={setShowSubTasks}
        />

        <div className="flex items-center gap-2 text-[16px] md:text-[15px] flex-1 py-0.3">
          <TaskCheckbox
            isDone={task.isDone}
            isSelectionMode={!!selectionMode}
            isSelected={!!selected}
            priorityColor={priorityStyle.color}
            priorityBg={priorityStyle.bg}
            onToggle={onToggle}
            onSelect={onSelect}
          />

          <div className="flex items-center justify-between flex-1 border-b border-black/10 dark:border-[#88888846] py-[0.4rem] pl-1">
            <div className="flex flex-col flex-wrap min-w-0 flex-1">
              <div
                className={`text-[14px] ${
                  task.isDone ? "line-through text-gray-400" : ""
                } font-normal leading-tight`}
              >
                {task.title}
              </div>

              {task.comment && (
                <div className="text-[12px] opacity-90 leading-normal text-gray-600 dark:text-gray-300">
                  {task.comment}
                </div>
              )}

              <TaskMetadata
                deadline={task.deadline}
                reminderAt={task.reminderAt}
                completedAt={task.completedAt}
                subCount={subtasksStats.subCount}
                subDone={subtasksStats.subDone}
                projectOfTask={projectOfTask}
                mode={mode}
                isDone={task.isDone}
                isSelectionMode={selectionMode}
                dateColor={dateColor}
                formatDateLabel={formatDateLabel}
                onDateUpdate={onDateUpdate}
                onTimeUpdate={onTimeUpdate}
                onProjectClick={onProjectClick}
              />
            </div>

            <TaskActions
              isSelectionMode={selectionMode}
              isMobile={isMobile}
              isMenuOpen={isMenuOpen}
              isCalOpen={isCalOpen}
              currentDeadlineStr={currentDeadlineStr}
              reminderAt={task.reminderAt}
              onEdit={onEdit}
              onMenuClick={onMenuClick}
              onDateUpdate={onDateUpdate}
              onTimeUpdate={onTimeUpdate}
              setIsCalOpen={setIsCalOpen}
            />
          </div>
        </div>
      </div>
    </>
  );
});

TaskCard.displayName = "TaskCard";
export default TaskCard;
