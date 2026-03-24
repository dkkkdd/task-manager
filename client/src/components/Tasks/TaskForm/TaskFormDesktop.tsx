import { useState, useEffect, useRef } from "react";
import type { Task } from "@/types/tasks";
import { useModeStore } from "@/stores/useModesStore";
import { useTasksStore } from "@/stores/useTasksStore";

import TaskFormFields from "./TaskFormFields";
interface TaskFormDesktopProps {
  formMode: "create" | "edit";
  initiaTask?: Task | null;
  openForm: boolean;
  parentId?: string | null;
  onClose: () => void;
}
export const TaskFormDesktop = ({
  formMode,
  initiaTask,
  openForm,
  parentId = null,
  onClose,
}: TaskFormDesktopProps) => {
  const mode = useModeStore((s) => s.mode);
  const selectedProjectId = useModeStore((s) => s.selectedProjectId);

  const createTask = useTasksStore((s) => s.createTask);
  const updateTask = useTasksStore((s) => s.updateTask);

  const [formData, setFormData] = useState<Partial<Task>>({
    title: initiaTask?.title ?? "",
    comment: initiaTask?.comment ?? "",
    priority: initiaTask?.priority ?? 1,
    projectId: selectedProjectId,
    deadline: initiaTask?.deadline ?? null,
    reminderAt: initiaTask?.reminderAt ?? null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (openForm && titleRef.current) titleRef.current.focus();
  }, [openForm]);

  useEffect(() => {
    if (formMode === "create" && mode === "today") {
      setFormData((prev) => ({ ...prev, deadline: new Date() }));
    }
  }, [formMode, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!formData.title?.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        parentId: initiaTask?.parentId || parentId,
      };

      if (formMode === "edit" && initiaTask?.id) {
        await updateTask(initiaTask.id, payload);
        onClose();
      } else {
        await createTask(payload);
        setFormData({
          title: "",
          comment: "",
          priority: 1,
          projectId: selectedProjectId,
          deadline: mode === "today" ? new Date() : null,
          reminderAt: null,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubTask = Boolean(initiaTask?.parentId || parentId);

  return openForm ? (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-[#1f1f1f] mt-1 relative p-5 border-[0.5px] border-black/10 dark:border-[#d0d0d05a]/60 rounded-lg shadow-xl max-h-[90vh] !max-w-[58rem] mx-auto overflow-y-auto"
      id="task-form"
    >
      <TaskFormFields
        formData={formData}
        setFormData={setFormData}
        formMode={formMode}
        isSubTask={isSubTask}
        titleRef={titleRef}
        isSubmitting={isSubmitting}
        onClose={onClose}
      />
    </form>
  ) : null;
};

export default TaskFormDesktop;
