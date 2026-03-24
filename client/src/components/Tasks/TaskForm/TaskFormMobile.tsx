import { useState, useEffect, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import type { Task } from "@/types/tasks";
import { MobileDrawer } from "@/features/MobileDrawer";
import { ConfirmModal } from "@/components/ConfirmModal";
import TaskFormFields from "./TaskFormFields";
import TaskFormSubtasks from "./TaskFormSubtasks";
import { useModeStore } from "@/stores/useModesStore";
import { useTasksStore } from "@/stores/useTasksStore";

interface TaskFormMobileProps {
  formMode: "create" | "edit";
  initiaTask?: Task | null;
  openForm: boolean;
  parentId?: string | null;
  onClose: () => void;
  onStartAddSubtask?: ((parentId: string | null) => void) | undefined;
}
const TaskFormMobile = ({
  formMode,
  initiaTask,
  openForm,
  parentId = null,
  onClose,
  onStartAddSubtask,
}: TaskFormMobileProps) => {
  const { t } = useTranslation();
  const mode = useModeStore((s) => s.mode);
  const selectedProjectId = useModeStore((s) => s.selectedProjectId);

  const deleteTask = useTasksStore((s) => s.deleteTask);
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
  const [openConfirm, setOpenConfirm] = useState(false);

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

  return (
    <MobileDrawer
      open={openForm}
      onClose={onClose}
      drawerDescription="Create or edit task"
      drawerTitle="Task editor"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#1f1f1f] mt-1 relative p-5 border-[0.5px] border-black/10 dark:border-[#d0d0d05a]/60 rounded-lg shadow-xl max-h-[90vh] !max-w-[58rem] mx-auto overflow-y-auto"
        id="task-form"
      >
        <TaskFormFields
          formData={formData}
          setFormData={setFormData}
          formMode={formMode}
          isSubTask={Boolean(initiaTask?.parentId || parentId)}
          titleRef={titleRef}
          isSubmitting={isSubmitting}
          onClose={onClose}
        />
      </form>
      =
      <button
        onClick={() => setOpenConfirm(true)}
        className="w-full text-left p-2 hover:bg-red-50 dark:hover:bg-[#333] cursor-pointer text-red-500 dark:text-red-400 rounded"
      >
        <span className="icon-bin" /> {t("delete")}
      </button>
      {formMode === "edit" && initiaTask?.subtasks && (
        <TaskFormSubtasks
          initiaTask={initiaTask}
          onStartAddSubtask={onStartAddSubtask}
        />
      )}
      {openConfirm && (
        <ConfirmModal
          title={t("delete_task_title")}
          message={
            <Trans
              i18nKey="delete_task_message"
              values={{ title: initiaTask?.title }}
            />
          }
          onConfirm={async () => {
            if (initiaTask?.id) await deleteTask(initiaTask.id);
            setOpenConfirm(false);
            onClose();
          }}
          onClose={() => setOpenConfirm(false)}
          confirmText={t("delete_now")}
          cancelText={t("cancel")}
        />
      )}
    </MobileDrawer>
  );
};

export default TaskFormMobile;
