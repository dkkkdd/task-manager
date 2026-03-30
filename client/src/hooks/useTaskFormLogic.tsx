import { useState, useEffect, useRef, useCallback } from "react";
import { useModeStore } from "@/stores/useModesStore";
import { useTasksStore } from "@/stores/useTasksStore";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    };
  }, [mode, selectedProjectId]);

  const [formData, setFormData] = useState<TaskFormData>(getEmptyState);

  useEffect(() => {
    if (openForm) {
      if (formMode === "edit" && initiaTask) {
        setFormData({
          title: initiaTask.title,
          comment: initiaTask.comment ?? "",
          priority: initiaTask.priority,
          projectId: initiaTask.projectId || null,
          deadline: initiaTask.deadline,
        });
      } else {
        setFormData(getEmptyState());
      }

      setTimeout(() => titleRef.current?.focus(), 120);
    }
  }, [openForm, formMode, initiaTask, getEmptyState]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!formData.title?.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        parentId: formMode === "edit" ? initiaTask?.parentId : parentId || null,
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
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    handleSubmit,
    titleRef,
    openConfirm,
    setOpenConfirm,
    deleteTask,
    isSubmitting,
    isSubTask: Boolean(initiaTask?.parentId || parentId),
  };
};
