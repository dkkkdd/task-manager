import { Trans, useTranslation } from "react-i18next";
import type { TaskFormProps } from "./TaskForm";
import { useTaskFormLogic } from "@/hooks/useTaskFormLogic";
import { useEffect } from "react";
import { MobileDrawer } from "@/features/MobileDrawer";
import TaskFormFields from "./TaskFormFields";
import TaskFormSubtasks from "./TaskFormSubtasks";
import { ConfirmModal } from "@/components/ConfirmModal";
import ModalPortal from "@/features/ModalPortal";

export const TaskFormMobile = (props: TaskFormProps) => {
  const { t } = useTranslation();
  const {
    formData,
    setFormData,
    handleSubmit,
    titleRef,
    focusTitle,
    openConfirm,
    setOpenConfirm,
    deleteTask,
    isSubTask,
  } = useTaskFormLogic(props);

  useEffect(() => focusTitle(props.openForm), [props.openForm]);

  return (
    <MobileDrawer
      isNested={false}
      open={props.openForm}
      onClose={props.onClose}
      drawerDescription="Create or edit tasks"
      drawerTitle="Task form"
    >
      <form onSubmit={handleSubmit} className="...">
        <TaskFormFields
          formData={formData}
          setFormData={setFormData}
          formMode={props.formMode}
          isSubTask={isSubTask}
          titleRef={titleRef}
          onClose={props.onClose}
        />
      </form>
      {props.formMode === "edit" && (
        <button className="text-red-500" onClick={() => setOpenConfirm(true)}>
          <span className="icon-bin" /> {t("delete")}
        </button>
      )}
      {props.formMode === "edit" && props.initiaTask?.subtasks && (
        <TaskFormSubtasks
          initiaTask={props.initiaTask}
          onStartAddSubtask={props.onStartAddSubtask}
        />
      )}
      {openConfirm && (
        <ModalPortal>
          <ConfirmModal
            title={t("delete_task_title")}
            message={
              <Trans
                i18nKey="delete_task_message"
                values={{ title: props.initiaTask?.title }}
              />
            }
            onConfirm={async () => {
              if (props.initiaTask?.id) await deleteTask(props.initiaTask.id);
              setOpenConfirm(false);
              props.onClose();
            }}
            onClose={() => setOpenConfirm(false)}
            confirmText={t("delete_now")}
            cancelText={t("cancel")}
          />
        </ModalPortal>
      )}
    </MobileDrawer>
  );
};

export default TaskFormMobile;
