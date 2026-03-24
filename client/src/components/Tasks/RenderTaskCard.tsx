import type { Task } from "@/types/tasks";
import { Fragment, useCallback, useMemo, useState, lazy } from "react";

import TaskCard from "./TaskCard";
const TaskForm = lazy(() => import("../Tasks/TaskForm/TaskForm"));
import { useTaskListLogic } from "@/hooks/useTaskList";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTaskListStore } from "@/stores/useTaskListStore";
import { useTasksStore } from "@/stores/useTasksStore";
import { useModeStore } from "@/stores/useModesStore";
import { useProjectsStore } from "@/stores/useProjectsStore";
const ModalPortal = lazy(() => import("@/features/ModalPortal"));
const TaskInfo = lazy(() => import("@/components/Tasks/TaskInfo"));
const GlobalDropdown = lazy(() => import("@/components/Tasks/TaskMenu"));
import { PRIORITY_OPTIONS } from "@/utils/priorities";

const RenderTaskItem = ({ task }: { task: Task }) => {
  const isMobile = useIsMobile();
  const mode = useModeStore((s) => s.mode);
  const tasks = useTasksStore((s) => s.tasks);
  const projects = useProjectsStore((s) => s.projects);
  const setMode = useModeStore((s) => s.setMode);
  const openProject = useModeStore((s) => s.openProject);

  const updateTask = useTasksStore((s) => s.updateTask);
  const updateDone = useTasksStore((s) => s.updateDone);

  const handleStartAddSubtask = useTaskListStore(
    (s) => s.handleStartAddSubtask,
  );
  const handleDeleteRequest = useTaskListStore((s) => s.handleDeleteRequest);
  const toggleTask = useTaskListStore((s) => s.toggleTask);
  const editingTaskId = useTaskListStore((s) => s.editingTaskId);
  const expandedTasks = useTaskListStore((s) => s.expandedTasks);
  const activeParentId = useTaskListStore((s) => s.activeParentId);
  const setActiveParentId = useTaskListStore((s) => s.setActiveParentId);
  const handleStartEditing = useTaskListStore((s) => s.handleStartEditing);
  const setEditingTaskId = useTaskListStore((s) => s.setEditingTaskId);

  const { state } = useTaskListLogic();

  const [openTaskInfo, setOpenTaskInfo] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCalOpen, setIsCalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

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

  const handleDate = useCallback(
    (newDate: Date | null) => {
      updateTask(task.id, { deadline: newDate });
    },
    [task.id, updateTask],
  );

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

  const handleCardClick = useCallback(
    (e: React.MouseEvent) => {
      if (state.selection.selectionMode) {
        e.stopPropagation();
        state.selection.toggleSelect(task.id);
        return;
      }
      if (isMobile) {
        handleStartEditing(task.id);
        return;
      }
      setOpenTaskInfo(true);
    },
    [state.selection, isMobile, handleStartEditing, task.id],
  );

  const handleProjectChange = (prodId: string | null) => {
    if (prodId === null) setMode("inbox");
    else openProject(prodId);
  };

  const currentDeadlineStr = task.deadline ? new Date(task.deadline) : null;
  const projectOfTask = projects.find((p) => p.id === task.projectId) || null;
  const parentTask = tasks.find((t: Task) => t.id === task.parentId);

  const priorityStyle = useMemo(() => {
    const option = PRIORITY_OPTIONS.find((opt) => opt.value === task.priority);
    return { bg: option?.bg, color: option?.color };
  }, [task.priority]);

  const subtasksStats = useMemo(
    () => ({
      subCount: task.subtasks?.length || 0,
      subDone: task.subtasks?.filter((t) => t.isDone).length || 0,
    }),
    [task.subtasks],
  );

  const ui = {
    mode,
    projectOfTask,
    isMobile,
    selectionMode: state.selection.selectionMode,
    selected: state.selection.selectedIds.has(task.id),
    showSubTasks: isExpanded,
    isMenuOpen,
    isCalOpen,
    currentDeadlineStr,
    priorityStyle,
    subtasksStats,
  };

  const handlers = {
    onCardClick: handleCardClick,
    onToggle: handleToggle,
    onSelect: () => state.selection.toggleSelect(task.id),
    onDateUpdate: handleDate,
    onTimeUpdate: handleTime,
    onMenuClick: handleMenuClick,
    onEdit: () => handleStartEditing(task.id),
    setIsCalOpen,
    setShowSubTasks: () => toggleTask(task.id),
    onProjectClick: handleProjectChange,

    onDeleteRequest: () => handleDeleteRequest(task.id),
    onAddSubtask: task.parentId
      ? undefined
      : () => handleStartAddSubtask(task.id),
  };

  if (editingTaskId === task.id) {
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
    <Fragment key={task.id}>
      <TaskCard task={task} ui={ui} handlers={handlers} />

      {isExpanded && (
        <div className="subtasks-container pl-9 flex flex-col">
          {task.subtasks?.map((sub: Task) => (
            <RenderTaskItem key={sub.id} task={sub} />
          ))}

          <TaskForm
            openForm={activeParentId === task.id}
            formMode="create"
            parentId={task.id}
            onClose={() => setActiveParentId(null)}
            onStartAddSubtask={handleStartAddSubtask}
          />
        </div>
      )}

      {openTaskInfo && (
        <ModalPortal>
          <TaskInfo
            isOpen={openTaskInfo}
            parentTask={parentTask || undefined}
            task={task}
            project={projectOfTask}
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
            handleStartEditing(task.id);
            setIsMenuOpen(false);
          }}
          onDelete={() => {
            handleDeleteRequest(task.id);
            setIsMenuOpen(false);
          }}
          onAddSubtask={handlers.onAddSubtask}
        />
      )}
    </Fragment>
  );
};

export default RenderTaskItem;
