import { memo } from "react";
import type { Task } from "@/types/tasks";

import { SubtaskToggle } from "@/components/Tasks/Subtasktoggle";
import { TaskCheckbox } from "@/components/Tasks/TaskCheckbox";
import { TaskMetadata } from "@/components/Tasks/Taskmetadata";
import { TaskActions } from "@/components/Tasks/Taskactions";

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
    deadline: string | null;
    priorityStyle: { bg?: string; color?: string };
  };
  handlers: {
    onCardClick: (e: React.MouseEvent) => void;
    onToggle: (e: React.MouseEvent) => void;
    onSelect: () => void;
    onDateUpdate: (date: string | null) => void;
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
    deadline,
    priorityStyle,
  } = ui;

  const {
    onCardClick,
    onToggle,
    onSelect,
    onDateUpdate,
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
          ${selected ? "dark:bg-[#262626] bg-black/10 rounded-lg" : ""}
          group flex items-center w-full transition-colors relative cursor-pointer
          ${task.isDone ? "opacity-80 text-gray-400 dark:text-gray-500" : ""}
        `}
      >
        <SubtaskToggle
          subCount={task.subtasks?.length || null}
          showSubTasks={showSubTasks}
          mode={mode}
          onToggle={setShowSubTasks}
        />

        <div className="flex items-center gap-2 text-[16px] md:text-[15px] flex-1">
          <TaskCheckbox
            isDone={task.isDone}
            isSelectionMode={!!selectionMode}
            isSelected={!!selected}
            priorityColor={priorityStyle.color}
            priorityBg={priorityStyle.bg}
            onToggle={onToggle}
            onSelect={onSelect}
          />

          <div className="flex items-center justify-between flex-1 border-b border-black/10 dark:border-[#88888846] py-3 md:py-[0.4rem] pl-1">
            <div className="flex sm:gap-[0.1em] flex-col flex-wrap min-w-0 flex-1">
              <div
                className={`md:text-[14px] ${
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
                projectOfTask={projectOfTask}
                mode={mode}
                task={task}
                isSelectionMode={selectionMode}
                onDateUpdate={onDateUpdate}
                onProjectClick={onProjectClick}
              />
            </div>

            <TaskActions
              isSelectionMode={selectionMode}
              isMobile={isMobile}
              isMenuOpen={isMenuOpen}
              isCalOpen={isCalOpen}
              currentDeadlineStr={deadline}
              onEdit={onEdit}
              onMenuClick={onMenuClick}
              onDateUpdate={onDateUpdate}
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
