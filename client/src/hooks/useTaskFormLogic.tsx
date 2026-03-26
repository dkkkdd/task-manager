import { useState, useEffect, useRef, useCallback } from "react";
import { useModeStore } from "@/stores/useModesStore";
import { useTasksStore } from "@/stores/useTasksStore";
import { combineDateAndTime } from "@/utils/dateFormatters";
import { format } from "date-fns";
import type { Task, TaskFormData } from "@/types/tasks";

interface UseTaskFormProps {
  formMode: "create" | "edit";
  initiaTask?: Task;
  parentId?: string | null;
  onClose: () => void;
  openForm: boolean;
}

export const useTaskFormLogic = ({
  formMode,
  initiaTask,
  parentId,
  onClose,
  openForm,
}: UseTaskFormProps) => {
  const mode = useModeStore((s) => s.mode);
  const selectedProjectId = useModeStore((s) => s.selectedProjectId);
  const createTask = useTasksStore((s) => s.createTask);
  const updateTask = useTasksStore((s) => s.updateTask);
  const deleteTask = useTasksStore((s) => s.deleteTask);

  const titleRef = useRef<HTMLInputElement>(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const getEmptyState = useCallback((): TaskFormData => {
    let finalDeadline = null;

    if (mode === "today") {
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      finalDeadline = todayEnd.toISOString();
    }

    return {
      title: "",
      comment: "",
      priority: 1,
      projectId: selectedProjectId ?? null,
      deadline: finalDeadline,
      reminderAt: null,
    };
  }, [mode, selectedProjectId]);

  const [formData, setFormData] = useState<TaskFormData>(getEmptyState);

  useEffect(() => {
    if (openForm) {
      if (formMode === "edit" && initiaTask) {
        const initialTime = initiaTask.deadline
          ? format(new Date(initiaTask.deadline), "HH:mm")
          : null;

        setFormData({
          title: initiaTask.title,
          comment: initiaTask.comment ?? "",
          priority: initiaTask.priority,
          projectId: initiaTask.projectId || null,
          deadline: initiaTask.deadline,
          reminderAt: initialTime,
        });
      } else {
        setFormData(getEmptyState());
      }

      setTimeout(() => titleRef.current?.focus(), 50);
    }
  }, [openForm, formMode, initiaTask, getEmptyState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!formData.title?.trim()) return;

    try {
      const finalDeadline = combineDateAndTime(
        formData.deadline,
        formData.reminderAt || null,
      );

      const payload = {
        ...formData,
        deadline: finalDeadline,
        parentId: initiaTask?.parentId || parentId || null,
      };

      if (formMode === "edit" && initiaTask?.id) {
        await updateTask(initiaTask.id, payload);
        onClose();
      } else {
        await createTask(payload);
        setFormData(getEmptyState());

        titleRef.current?.focus();
      }
    } catch (error) {
      console.error("Failed to submit task:", error);
    }
  };

  const focusTitle = (isOpen: boolean) => {
    if (isOpen && titleRef.current) titleRef.current.focus();
  };

  return {
    formData,
    setFormData,
    handleSubmit,
    titleRef,
    focusTitle,
    openConfirm,
    setOpenConfirm,
    deleteTask,
    isSubTask: Boolean(initiaTask?.parentId || parentId),
  };
};
