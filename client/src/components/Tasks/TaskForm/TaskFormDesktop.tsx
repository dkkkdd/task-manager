import { useEffect } from "react";
import TaskFormFields from "./TaskFormFields";
import { useTaskFormLogic } from "@/hooks/useTaskFormLogic";
import type { TaskFormProps } from "./TaskForm";

export const TaskFormDesktop = (props: TaskFormProps) => {
  const {
    formData,
    setFormData,
    handleSubmit,
    titleRef,
    focusTitle,
    isSubTask,
  } = useTaskFormLogic(props);

  useEffect(() => focusTitle(props.openForm), [props.openForm]);

  if (!props.openForm) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="!max-w-[50rem] mt-1 mx-auto bg-white dark:bg-[#1f1f1f] p-4 border border-[#88888846] rounded-lg"
    >
      <TaskFormFields
        formData={formData}
        setFormData={setFormData}
        formMode={props.formMode}
        isSubTask={isSubTask}
        titleRef={titleRef}
        onClose={props.onClose}
      />
    </form>
  );
};
