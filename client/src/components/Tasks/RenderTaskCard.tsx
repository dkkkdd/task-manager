import { Fragment, useCallback, useMemo, useState, lazy, memo } from "react";
import type { Task } from "@/types/tasks";

import TaskCard from "./TaskCard";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTaskListStore } from "@/stores/useTaskListStore";
import { useTasksStore } from "@/stores/useTasksStore";
import { useModeStore } from "@/stores/useModesStore";
import { useSelectionStore } from "@/stores/useSelectionStore";
import { PRIORITY_OPTIONS } from "@/utils/priorities";
import { useProjectsStore } from "@/stores/useProjectsStore";

const TaskForm = lazy(() => import("../Tasks/TaskForm/TaskForm"));
const GlobalDropdown = lazy(() => import("@/components/Tasks/Menus/TaskMenu"));

const RenderTaskItem = memo(({ task }: { task: Task }) => {
  const isMobile = useIsMobile();

  const {
    expandedTasks,
    activeParentId,
    toggleTask,
    handleStartEditing,
    setInfoTaskId,
    setActiveParentId,
    handleDeleteRequest,
    handleStartAddSubtask,
  } = useTaskListStore();

  const selectionMode = useSelectionStore((s) => s.selectionMode);
  const isSelected = useSelectionStore((s) => s.selectedIds.has(task.id));
  const toggleSelect = useSelectionStore((s) => s.toggleSelect);
  const updateTask = useTasksStore((s) => s.updateTask);
  const mode = useModeStore((s) => s.mode);
  const projects = useProjectsStore((s) => s.projects);
  const updateDone = useTasksStore((s) => s.updateDone);
  const showDone = useModeStore((s) => s.showDone);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { editingTaskId, setEditingTaskId } = useTaskListStore();
  const isExpanded = expandedTasks[task.id] !== false;

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (task.subtasks?.length && !task.isDone) {
        task.subtasks.forEach((s) => updateDone(s.id, true));
      }
      updateDone(task.id, !task.isDone);
    },
    [task, updateDone],
  );

  const handleUpdateDate = useCallback(
    (date: string | null) => {
      updateTask(task.id, { deadline: date });
    },
    [task.id, updateTask],
  );

  const handleCardClick = useCallback(
    (e: React.MouseEvent) => {
      if (selectionMode) {
        e.stopPropagation();
        toggleSelect(task.id);
        return;
      }
      if (isMobile) {
        handleStartEditing(task.id);
        return;
      }
      setInfoTaskId(task.id);
    },
    [
      isMobile,
      handleStartEditing,
      task.id,
      selectionMode,
      toggleSelect,
      setInfoTaskId,
    ],
  );

  const onAddSubtask = useCallback(() => {
    if (task.parentId) return;
    handleStartAddSubtask(task.id);
  }, [task.id, task.parentId, handleStartAddSubtask]);

  const ui = useMemo(() => {
    const option = PRIORITY_OPTIONS.find((opt) => opt.value === task.priority);
    const fullSubtasks = task.subtasks || [];
    const projectOfTask = projects.find((p) => p.id === task.projectId) || null;

    return {
      mode,
      projectOfTask,
      isMobile,
      selectionMode,
      selected: isSelected,
      showSubTasks: isExpanded,
      priorityStyle: { bg: option?.bg, color: option?.color },
      visibleSubCount: showDone
        ? fullSubtasks.length
        : fullSubtasks.filter((s) => !s.isDone).length,
    };
  }, [
    task,
    isSelected,
    selectionMode,
    isExpanded,
    isMobile,
    showDone,
    mode,
    projects,
  ]);

  const handlers = useMemo(
    () => ({
      onCardClick: handleCardClick,
      onToggle: handleToggle,
      onSelect: () => toggleSelect(task.id),
      onMenuClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
        setIsMenuOpen(true);
      },
      setShowSubTasks: () => toggleTask(task.id),
    }),
    [handleCardClick, handleToggle, toggleSelect, toggleTask, task.id],
  );

  if (editingTaskId === task.id && !isMobile) {
    return (
      <TaskForm
        openForm
        initiaTask={task}
        formMode="edit"
        onClose={() => setEditingTaskId(null)}
        onStartAddSubtask={handleStartAddSubtask}
      />
    );
  }

  return (
    <Fragment>
      <TaskCard task={task} ui={ui} handlers={handlers} />
      {editingTaskId === task.id && (
        <TaskForm
          openForm
          initiaTask={task}
          formMode="edit"
          onClose={() => setEditingTaskId(null)}
          onStartAddSubtask={handleStartAddSubtask}
        />
      )}
      {isExpanded && (
        <div className="subtasks-container pl-9 flex flex-col">
          {task.subtasks
            ?.filter((sub) => showDone || !sub.isDone)
            .map((sub: Task) => (
              <RenderTaskItem key={sub.id} task={sub} />
            ))}

          {activeParentId === task.id && (
            <TaskForm
              openForm
              formMode="create"
              parentId={task.id}
              onClose={() => setActiveParentId(null)}
              onStartAddSubtask={handleStartAddSubtask}
            />
          )}
        </div>
      )}

      {isMenuOpen && anchorEl && (
        <GlobalDropdown
          task={task}
          isOpen={isMenuOpen}
          anchorEl={anchorEl}
          onClose={() => setIsMenuOpen(false)}
          onEdit={() => {
            handleStartEditing(task.id);
            setIsMenuOpen(false);
          }}
          onDelete={() => {
            handleDeleteRequest(task.id);
            setIsMenuOpen(false);
          }}
          onAddSubtask={onAddSubtask}
          updateDate={handleUpdateDate}
        />
      )}
    </Fragment>
  );
});

export default RenderTaskItem;
