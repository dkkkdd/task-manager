import React, { memo, useCallback, useState, useMemo } from "react";

import type { Task } from "@/types/tasks";
import { ModalPortal } from "@/features/ModalPortal";
import { formatDateLabel, dateColor } from "@/utils/dateFormatters";
import { PRIORITY_OPTIONS } from "@/utils/priorities";
import { GlobalDropdown } from "@/components/Tasks/TaskMenu";

import { TaskInfo } from "@/components/Tasks/TaskInfo";
import { TaskCheckbox } from "@/components/Tasks/TaskCheckbox";
import { TaskMetadata } from "@/components/Tasks/Taskmetadata";
import { TaskActions } from "@/components/Tasks/Taskactions";
import { SubtaskToggle } from "@/components/Tasks/Subtasktoggle";
import { useModeStore } from "@/stores/useModesStore";
import { useProjectsStore } from "@/stores/useProjectsStore";
import { useTaskListLogic } from "@/hooks/useTaskList";
import { TaskForm } from "./TaskForm";
import { useTasksStore } from "@/stores/useTasksStore";
import { RenderTaskItem } from "./RenderTaskCard";
import { useTaskListStore } from "@/stores/useTaskListStore";

interface TaskCardProps {
  task: Task;
  // onEdit: () => void;
  isEditing: boolean;
  onDeleteRequest: () => void;
  onAddSubtask?: () => void;
  selectionMode?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  isMobile?: boolean;
  setShowSubTasks?: () => void;
  showSubTasks?: boolean;
}

const TaskCard = memo(
  ({
    task,
    // onEdit,
    isEditing,
    isMobile = false,
    onDeleteRequest,
    onAddSubtask,
    selected,
    selectionMode,
    onSelect,
    setShowSubTasks,
    showSubTasks,
  }: TaskCardProps) => {
    const updateTask = useTasksStore((s) => s.updateTask);
    const updateDone = useTasksStore((s) => s.updateDone);
    // const { mode, projects, changeMode } = useProjectsContext();
    const mode = useModeStore((s) => s.mode);
    const setMode = useModeStore((s) => s.setMode);
    const projects = useProjectsStore((s) => s.projects);
    console.log("task card render");
    const [openTaskInfo, setOpenTaskInfo] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCalOpen, setIsCalOpen] = useState(false);
    const activeParentId = useTaskListStore((s) => s.activeParentId);
    const setActiveParentId = useTaskListStore((s) => s.setActiveParentId);

    const expandedTasks = useTaskListStore((s) => s.expandedTasks);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const { state, actions } = useTaskListLogic();
    const handleToggle = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();

        if (task.subtasks && task.subtasks.length > 0 && !task.isDone) {
          task.subtasks.forEach((s) => {
            updateDone(s.id, true);
          });
        }

        updateDone(task.id, !task.isDone);
      },
      [task.id, task.isDone, task.subtasks, updateDone],
    );

    const handleDate = useCallback(
      (newDate: Date | null) => {
        updateTask(task.id, { deadline: newDate });
      },
      [task.id, updateTask],
    );

    const currentDeadlineStr = task.deadline ? new Date(task.deadline) : null;

    const handleCardClick = (e: React.MouseEvent) => {
      if (selectionMode) {
        handleSelectClick?.(e);
        return;
      }

      if (isMobile) {
        actions.handleStartEditing(task.id);
        return;
      }

      setOpenTaskInfo(true);
    };

    const handleTime = useCallback(
      (newTime: string | null) => {
        updateTask(task.id, { reminderAt: newTime });
      },
      [task.id, updateTask],
    );

    const handleMenuClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
        setIsMenuOpen(true);
      },
      [],
    );

    const handleSelectClick = useCallback(
      (e: React.MouseEvent) => {
        if (!selectionMode) return;
        e.stopPropagation();
        onSelect?.();
      },
      [selectionMode, onSelect],
    );

    const handleProjectChange = useCallback(
      (prodId: string | null) => {
        setMode(
          prodId === null ? "inbox" : "project",
          prodId === null ? undefined : prodId,
        );
      },
      [setMode],
    );

    const priorityStyle = useMemo(() => {
      const option = PRIORITY_OPTIONS.find(
        (opt) => opt.value === task.priority,
      );
      return {
        bg: option?.bg,
        color: option?.color,
      };
    }, [task.priority]);

    const subtasksStats = useMemo(() => {
      const subCount = task.subtasks?.length || 0;
      const subDone = task.subtasks?.filter((t) => t.isDone).length || 0;
      return { subCount, subDone };
    }, [task.subtasks]);

    if (isEditing) return null;
    if (!isMobile && state.editingTaskId === task.id) {
      return (
        <TaskForm
          key={task.id}
          openForm
          initiaTask={task}
          formMode="edit"
          onClose={() => actions.setEditingTaskId(null)}
        />
      );
    }

    return (
      <>
        <div
          onClick={handleCardClick}
          className={`
                ${selected ? "!text-[#9d174d]" : "text-black dark:text-white"}
                group flex items-center 
                w-full transition-colors relative cursor-pointer
                ${
                  task.isDone
                    ? "opacity-80 text-gray-400 dark:text-gray-500"
                    : "text-black dark:text-white"
                }
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
              onToggle={handleToggle}
              onSelect={onSelect}
            />

            <div className="flex items-center justify-between flex-1 border-b border-black/10 dark:border-[#88888846] py-3 md:py-2 pl-1">
              <div className="flex flex-col flex-wrap min-w-0 flex-1">
                <div
                  className={`${
                    task.isDone ? "line-through text-gray-400" : ""
                  } font-normal leading-tight `}
                >
                  {task.title}
                </div>

                {task.comment && (
                  <div className="text-[13px] md:text-[15px] opacity-90 leading-normal text-gray-600 dark:text-gray-300 ">
                    {task.comment}
                  </div>
                )}

                <TaskMetadata
                  deadline={task.deadline}
                  reminderAt={task.reminderAt}
                  completedAt={task.completedAt}
                  subCount={subtasksStats.subCount}
                  subDone={subtasksStats.subDone}
                  projectId={task.projectId}
                  projects={projects}
                  mode={mode}
                  isDone={task.isDone}
                  isSelectionMode={selectionMode}
                  dateColor={dateColor}
                  formatDateLabel={formatDateLabel}
                  onDateUpdate={handleDate}
                  onTimeUpdate={handleTime}
                  onProjectClick={handleProjectChange}
                />
              </div>

              <TaskActions
                isSelectionMode={selectionMode}
                isMobile={isMobile}
                isMenuOpen={!!isMenuOpen}
                isCalOpen={isCalOpen}
                currentDeadlineStr={currentDeadlineStr}
                reminderAt={task.reminderAt}
                onEdit={() => actions.handleStartEditing(task.id)}
                onMenuClick={handleMenuClick}
                onDateUpdate={handleDate}
                onTimeUpdate={handleTime}
                setIsCalOpen={setIsCalOpen}
              />
            </div>
          </div>
        </div>

        {openTaskInfo && (
          <ModalPortal>
            <TaskInfo
              isOpen={openTaskInfo}
              task={task}
              projects={projects}
              onClose={() => setOpenTaskInfo(false)}
            />
          </ModalPortal>
        )}

        {isMenuOpen && anchorEl && (
          <GlobalDropdown
            isCalOpen={isCalOpen}
            setIsCalOpen={setIsCalOpen}
            updateDate={handleDate}
            updateTime={handleTime}
            task={task}
            isOpen={isMenuOpen}
            anchorEl={anchorEl}
            onClose={() => setIsMenuOpen(false)}
            onEdit={() => {
              actions.handleStartEditing(task.id);
              setIsMenuOpen(false);
            }}
            onDelete={() => {
              onDeleteRequest();
              setIsMenuOpen(false);
            }}
            onAddSubtask={onAddSubtask}
          />
        )}
        {mode !== "today" && expandedTasks[task.id] !== false && (
          <div
            key={`subtasks-container-${task.id}`}
            className="subtasks-container pl-9 flex flex-col"
          >
            {task.subtasks?.map((sub: Task) => (
              <RenderTaskItem key={sub.id} task={sub} />
            ))}

            <TaskForm
              openForm={activeParentId === task.id}
              formMode="create"
              parentId={task.id}
              onClose={() => setActiveParentId(null)}
            />
          </div>
        )}
      </>
    );
  },
);

TaskCard.displayName = "TaskCard";
export default TaskCard;
