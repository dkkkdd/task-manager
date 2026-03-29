import { useModeStore } from "@/stores/useModesStore";
import { useProjectsStore } from "@/stores/useProjectsStore";
import { useTaskListStore } from "@/stores/useTaskListStore";
import { useTasksStore } from "@/stores/useTasksStore";
import { useMemo, useCallback } from "react";
import ModalPortal from "@/features/ModalPortal";
import TaskInfo from "../components/Tasks/TaskInfo";
import DeleteConfirmWrapper from "../components/ConfirmModal/DeleteConfirmWrapper";
import GlobalDropdown from "../components/Tasks/Menus/TaskMenu";
import { findTaskRecursive } from "@/utils/findTaskRecursive";
import type { Task } from "@/types/tasks";

const EMPTY_ARRAY: Task[] = [];

export const TaskListModals = () => {
  const infoTaskId = useTaskListStore((s) => s.infoTaskId);
  const menuTaskId = useTaskListStore((s) => s.menuTaskId);
  const menuAnchorEl = useTaskListStore((s) => s.menuAnchorEl);

  const setInfoTaskId = useTaskListStore((s) => s.setInfoTaskId);
  const closeMenu = useTaskListStore((s) => s.closeMenu);
  const handleDeleteRequest = useTaskListStore((s) => s.handleDeleteRequest);
  const handleStartEditing = useTaskListStore((s) => s.handleStartEditing);
  const handleStartAddSubtask = useTaskListStore(
    (s) => s.handleStartAddSubtask,
  );

  const mode = useModeStore((s) => s.mode);
  const selectedProjectId = useModeStore((s) => s.selectedProjectId);
  const updateTask = useTasksStore((s) => s.updateTask);

  const tasks = useTasksStore((s) => {
    const key = mode === "project" ? `project-${selectedProjectId}` : mode;
    return s.tasksCache[key] || EMPTY_ARRAY;
  });

  const projects = useProjectsStore((s) => s.projects);

  const menuTask = useMemo(
    () => findTaskRecursive(tasks, menuTaskId),
    [tasks, menuTaskId],
  );

  const infoTask = useMemo(
    () => findTaskRecursive(tasks, infoTaskId),
    [tasks, infoTaskId],
  );

  const infoProject = useMemo(
    () => projects.find((p) => p.id === infoTask?.projectId) || null,
    [infoTask?.projectId, projects],
  );

  const handleEdit = useCallback(() => {
    if (menuTask) handleStartEditing(menuTask.id);
    closeMenu();
  }, [menuTask, handleStartEditing, closeMenu]);

  const handleDelete = useCallback(() => {
    if (menuTask) handleDeleteRequest(menuTask.id);
    closeMenu();
  }, [menuTask, handleDeleteRequest, closeMenu]);

  const handleUpdateDate = useCallback(
    (date: string | null) => {
      if (menuTask) updateTask(menuTask.id, { deadline: date });
    },
    [menuTask, updateTask],
  );

  const handleAddSub = useCallback(() => {
    if (menuTask) handleStartAddSubtask(menuTask.id);
    closeMenu();
  }, [menuTask, handleStartAddSubtask, closeMenu]);

  return (
    <>
      {infoTask && (
        <ModalPortal>
          <TaskInfo
            project={infoProject}
            isOpen={!!infoTaskId}
            task={infoTask}
            onClose={() => setInfoTaskId(null)}
          />
        </ModalPortal>
      )}

      {menuTask && menuAnchorEl && (
        <GlobalDropdown
          task={menuTask}
          isOpen={!!menuTaskId}
          anchorEl={menuAnchorEl}
          onClose={closeMenu}
          onEdit={handleEdit}
          onDelete={handleDelete}
          updateDate={handleUpdateDate}
          onAddSubtask={handleAddSub}
        />
      )}
      <DeleteConfirmWrapper />
    </>
  );
};
