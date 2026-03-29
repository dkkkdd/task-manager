import { memo } from "react";
import type { Task } from "@/types/tasks";
import type { Project } from "@/types/project";

import { SubtaskToggle } from "@/components/Tasks/Subtasktoggle";
import { TaskCheckbox } from "@/components/Tasks/TaskCheckbox";
import { TaskMetadata } from "@/components/Tasks/TaskMetadata";
import { TaskActions } from "@/components/Tasks/Taskactions";

interface TaskCardProps {
  task: Task;
  ui: {
    mode: string;
    projectOfTask: Project | null;
    isMobile: boolean;
    selectionMode: boolean;
    selected: boolean;
    showSubTasks: boolean;
    priorityStyle: { bg?: string; color?: string };
    visibleSubCount: number;
  };
  handlers: {
    onCardClick: (e: React.MouseEvent) => void;
    onToggle: (e: React.MouseEvent) => void;
    onSelect: () => void;
    onMenuClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    setShowSubTasks?: () => void;
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
    priorityStyle,
    visibleSubCount,
  } = ui;

  const { onCardClick, onToggle, onSelect, onMenuClick, setShowSubTasks } =
    handlers;

  return (
    <div
      onClick={onCardClick}
      className={`
        group flex items-center w-full transition-all relative cursor-pointer px-2
        ${selected ? "dark:bg-white/5 bg-black/5 rounded-xl" : ""}
        ${task.isDone ? "opacity-60" : ""}
      `}
    >
      <SubtaskToggle
        subCount={visibleSubCount}
        showSubTasks={showSubTasks}
        mode={mode}
        onToggle={setShowSubTasks}
      />

      <div className="flex items-center gap-3 flex-1 min-w-0">
        <TaskCheckbox
          isDone={task.isDone}
          isSelectionMode={selectionMode}
          isSelected={selected}
          priorityColor={priorityStyle.color}
          priorityBg={priorityStyle.bg}
          onToggle={onToggle}
          onSelect={onSelect}
        />

        <div className="flex items-center justify-between flex-1 border-b border-black/5 dark:border-white/5 py-3 md:py-2 min-w-0">
          <div className="flex flex-col min-w-0 flex-1 pr-2">
            <div
              className={`text-[15px] leading-snug truncate ${
                task.isDone
                  ? "line-through text-gray-400 dark:text-gray-500"
                  : "text-black dark:text-white"
              }`}
            >
              {task.title}
            </div>

            {task.comment && (
              <div className="text-[12px] opacity-60 truncate mt-0.5 text-black dark:text-white">
                {task.comment}
              </div>
            )}

            <TaskMetadata
              projectOfTask={projectOfTask}
              mode={mode}
              task={task}
              isSelectionMode={selectionMode}
            />
          </div>

          <TaskActions
            isSelectionMode={selectionMode}
            isMobile={isMobile}
            task={task}
            onMenuClick={onMenuClick}
          />
        </div>
      </div>
    </div>
  );
});

TaskCard.displayName = "TaskCard";
export default TaskCard;
