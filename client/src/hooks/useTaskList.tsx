import type { Task } from "@/types/tasks";
import { useCallback, useMemo, useState } from "react";
import { useTaskSelection } from "@/hooks/useTaskSelection";
import { useFilteredTasks } from "./useFilteredTasks";
import { useModeStore } from "@/stores/useModesStore";
import { useIsMobile } from "./useIsMobile";

export const useTaskListLogic = () => {
  const isMobile = useIsMobile();
  const mode = useModeStore((s) => s.mode);
  const filteredTasks = useFilteredTasks();
  // if (tasks === null) return;
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [activeParentId, setActiveParentId] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>(
    {},
  );

  const toggleTask = useCallback((taskId: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !(prev[taskId] ?? true),
    }));
  }, []);

  const handleStartEditing = useCallback((id: string) => {
    setEditingTaskId(id);
    setActiveParentId(null);
    setOpenForm(false);
  }, []);

  const handleStartAddSubtask = useCallback((parentId: string | null) => {
    setActiveParentId(parentId);
    setEditingTaskId(null);
    setOpenForm(false);
  }, []);

  const handleDeleteRequest = useCallback((task: Task) => {
    setTaskToDelete(task);
  }, []);

  const selection = useTaskSelection(filteredTasks || [], () => {
    setOpenForm(false);
    setActiveParentId(null);
    setEditingTaskId(null);
  });
  const handleStartSelection = () => {
    selection.startSelection();
  };
  const shouldShowAddButton = useMemo(
    () =>
      !openForm &&
      mode !== "completed" &&
      mode !== "overdue" &&
      (isMobile || (filteredTasks?.length ?? 0) > 0),
    [openForm, mode, isMobile, filteredTasks?.length],
  );
  return {
    state: {
      selection,
      editingTaskId,
      taskToDelete,
      activeParentId,
      openForm,
      expandedTasks,
    },
    actions: {
      toggleTask,
      handleStartEditing,
      setOpenForm,
      setTaskToDelete,
      setActiveParentId,
      setEditingTaskId,
      handleStartAddSubtask,
      handleStartSelection,
      handleDeleteRequest,
    },
    shouldShowAddButton,
  };
};
