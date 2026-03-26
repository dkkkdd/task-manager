import { useIsMobile } from "@/hooks/useIsMobile";
import TaskFormMobile from "./TaskFormMobile";
import type { Task } from "@/types/tasks";

import { TaskFormDesktop } from "./TaskFormDesktop";

export interface TaskFormProps {
  formMode: "create" | "edit";
  initiaTask?: Task;
  parentId?: string | null;
  openForm: boolean;
  onClose: () => void;
  onStartAddSubtask?: (parentId: string | null) => void;
}

const TaskForm = (props: TaskFormProps) => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <TaskFormMobile {...props} />
  ) : (
    <TaskFormDesktop {...props} />
  );
};

export default TaskForm;
